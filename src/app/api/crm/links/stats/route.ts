import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, gte, isNotNull, lt, notInArray, sql, type SQL } from "drizzle-orm";
import { type PgColumn } from "drizzle-orm/pg-core";
import { db } from "@/db";
import { trackingLinks, trackingLinkClicks } from "@/db/schema";

/**
 * Global tracking-link analytics (across every link).
 *
 *   GET /api/crm/links/stats?days=30&includeBots=false
 *
 * Returns the full overview the visitors dashboard needs in a single
 * round-trip: KPIs, daily click + unique-visitor series, top links,
 * and audience breakdowns across the most-used dimensions. The heavy
 * per-visitor list is served separately (paginated) by /visitors.
 */

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const days = clamp(parseInt(url.searchParams.get("days") || "30", 10) || 30, 1, 365);
  const includeBots = url.searchParams.get("includeBots") === "true";
  // Optional scope to a single tracking link. When set, every aggregate
  // below filters by `link_id = ?` so the dashboard becomes a per-link
  // view without changing the route or the response shape.
  const linkIdFilter = url.searchParams.get("linkId") || null;

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const baseWindowParts: SQL[] = [gte(trackingLinkClicks.ts, since)!];
  if (linkIdFilter) baseWindowParts.push(eq(trackingLinkClicks.linkId, linkIdFilter));
  const baseWindow: SQL = baseWindowParts.length === 1 ? baseWindowParts[0] : and(...baseWindowParts)!;
  const windowPred: SQL = includeBots
    ? baseWindow
    : and(baseWindow, eq(trackingLinkClicks.isBot, false))!;

  async function topBreakdown(column: PgColumn) {
    const keyExpr = sql<string>`COALESCE(NULLIF(${column}, ''), 'unknown')`;
    return db
      .select({
        key: keyExpr,
        count: sql<number>`count(*)::int`,
      })
      .from(trackingLinkClicks)
      .where(windowPred)
      .groupBy(keyExpr)
      .orderBy(desc(sql`count(*)`))
      .limit(20);
  }

  // --- Totals ---
  const [
    [totals],
    [uniqueRow],
    [botRow],
    [extents],
  ] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(trackingLinkClicks)
      .where(windowPred),
    db
      .select({ uniqueIps: sql<number>`count(DISTINCT ${trackingLinkClicks.ip})::int` })
      .from(trackingLinkClicks)
      .where(and(windowPred, isNotNull(trackingLinkClicks.ip))!),
    db
      .select({ botCount: sql<number>`count(*)::int` })
      .from(trackingLinkClicks)
      // `baseWindow` already includes the linkId filter when active, so
      // bot counts also stay scoped to the filtered link.
      .where(and(baseWindow, eq(trackingLinkClicks.isBot, true))!),
    db
      .select({
        firstClick: sql<string | null>`min(${trackingLinkClicks.ts})`,
        lastClick: sql<string | null>`max(${trackingLinkClicks.ts})`,
      })
      .from(trackingLinkClicks)
      .where(windowPred),
  ]);

  // --- New visitors: IPs that appear in the window AND have never appeared
  // before it. When a link filter is active, "new" means new for THIS link
  // specifically — an IP that clicked some other link a year ago but never
  // this one is still counted as new for this view.
  const priorParts: SQL[] = [lt(trackingLinkClicks.ts, since)!, isNotNull(trackingLinkClicks.ip)];
  if (linkIdFilter) priorParts.push(eq(trackingLinkClicks.linkId, linkIdFilter));
  const priorVisitors = db
    .select({ ip: trackingLinkClicks.ip })
    .from(trackingLinkClicks)
    .where(and(...priorParts)!);

  const [newRow] = await db
    .select({
      newVisitors: sql<number>`count(DISTINCT ${trackingLinkClicks.ip})::int`,
    })
    .from(trackingLinkClicks)
    .where(
      and(
        windowPred,
        isNotNull(trackingLinkClicks.ip),
        notInArray(trackingLinkClicks.ip, priorVisitors),
      )!,
    );

  // --- Daily series: clicks + unique visitors per day ---
  const dailyRaw = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${trackingLinkClicks.ts}), 'YYYY-MM-DD')`,
      clicks: sql<number>`count(*)::int`,
      uniqueVisitors: sql<number>`count(DISTINCT ${trackingLinkClicks.ip})::int`,
    })
    .from(trackingLinkClicks)
    .where(windowPred)
    .groupBy(sql`date_trunc('day', ${trackingLinkClicks.ts})`)
    .orderBy(sql`date_trunc('day', ${trackingLinkClicks.ts})`);

  const daily = fillDailySeries(dailyRaw, days);

  // --- Per-link performance ---
  const topLinks = await db
    .select({
      id: trackingLinks.id,
      slug: trackingLinks.slug,
      label: trackingLinks.label,
      source: trackingLinks.source,
      medium: trackingLinks.medium,
      campaign: trackingLinks.campaign,
      active: trackingLinks.active,
      clicks: sql<number>`count(${trackingLinkClicks.id})::int`,
      uniqueIps: sql<number>`count(DISTINCT ${trackingLinkClicks.ip})::int`,
      lastClick: sql<string | null>`max(${trackingLinkClicks.ts})`,
    })
    .from(trackingLinks)
    .leftJoin(
      trackingLinkClicks,
      and(eq(trackingLinkClicks.linkId, trackingLinks.id), windowPred)!,
    )
    .groupBy(trackingLinks.id)
    .orderBy(desc(sql`count(${trackingLinkClicks.id})`));

  // --- Audience breakdowns ---
  const [country, deviceType, browser, os, referrerHost, source, medium, campaign, language] =
    await Promise.all([
      topBreakdown(trackingLinkClicks.country),
      topBreakdown(trackingLinkClicks.deviceType),
      topBreakdown(trackingLinkClicks.browser),
      topBreakdown(trackingLinkClicks.os),
      topBreakdown(trackingLinkClicks.referrerHost),
      topBreakdown(trackingLinkClicks.utmSource),
      topBreakdown(trackingLinkClicks.utmMedium),
      topBreakdown(trackingLinkClicks.utmCampaign),
      topBreakdown(trackingLinkClicks.language),
    ]);

  const uniqueVisitors = uniqueRow.uniqueIps;
  const newVisitors = newRow?.newVisitors ?? 0;
  const returningVisitors = Math.max(0, uniqueVisitors - newVisitors);
  const avgClicksPerVisitor = uniqueVisitors > 0 ? totals.count / uniqueVisitors : 0;

  return NextResponse.json({
    window: { days, since: since.toISOString() },
    totals: {
      total: totals.count,
      uniqueVisitors,
      newVisitors,
      returningVisitors,
      avgClicksPerVisitor: Number(avgClicksPerVisitor.toFixed(2)),
      bots: botRow.botCount,
      firstClick: toIso(extents.firstClick),
      lastClick: toIso(extents.lastClick),
    },
    daily,
    topLinks,
    breakdowns: {
      country,
      deviceType,
      browser,
      os,
      referrerHost,
      source,
      medium,
      campaign,
      language,
    },
  });
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function toIso(v: string | Date | null | undefined): string | null {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString();
  return v;
}

function fillDailySeries(
  rows: Array<{ day: string; clicks: number; uniqueVisitors: number }>,
  days: number,
) {
  const byDay = new Map(rows.map((r) => [r.day, r]));
  const out: Array<{ day: string; clicks: number; uniqueVisitors: number }> = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    const row = byDay.get(key);
    out.push({ day: key, clicks: row?.clicks ?? 0, uniqueVisitors: row?.uniqueVisitors ?? 0 });
  }
  return out;
}
