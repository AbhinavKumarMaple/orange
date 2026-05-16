import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, gte, sql, isNotNull, type SQL } from "drizzle-orm";
import { type PgColumn } from "drizzle-orm/pg-core";
import { db } from "@/db";
import { trackingLinks, trackingLinkClicks } from "@/db/schema";

export const dynamic = "force-dynamic";

/**
 * Analytics for a single tracking link.
 *
 *   GET /api/crm/links/[id]/analytics?days=30&includeBots=false
 *
 * Returns:
 *   - link: the metadata row
 *   - totals: total clicks, unique IPs, first/last click, bot count
 *   - daily: per-day series for the requested window (sparkline data)
 *   - breakdowns: country, deviceType, browser, os, referrerHost, source
 *   - recent: most recent 50 clicks
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const url = new URL(req.url);
  const days = clamp(parseInt(url.searchParams.get("days") || "30", 10) || 30, 1, 365);
  const includeBots = url.searchParams.get("includeBots") === "true";

  const [link] = await db.select().from(trackingLinks).where(eq(trackingLinks.id, id)).limit(1);
  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const baseWindow = and(
    eq(trackingLinkClicks.linkId, id),
    gte(trackingLinkClicks.ts, since),
  );
  const windowPred: SQL | undefined = includeBots
    ? baseWindow
    : and(baseWindow, eq(trackingLinkClicks.isBot, false));

  /**
   * Helper: select the top 20 `(value, count)` rows for a given column,
   * coalescing NULLs and empty strings into "unknown" so the UI shows a
   * single bucket instead of multiple invisible ones.
   */
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

  // ---- Totals ----
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
      .where(
        and(
          eq(trackingLinkClicks.linkId, id),
          gte(trackingLinkClicks.ts, since),
          eq(trackingLinkClicks.isBot, true),
        )!,
      ),
    db
      .select({
        firstClick: sql<string | null>`min(${trackingLinkClicks.ts})`,
        lastClick: sql<string | null>`max(${trackingLinkClicks.ts})`,
      })
      .from(trackingLinkClicks)
      .where(windowPred),
  ]);

  // ---- Daily series ----
  const dailyRows = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${trackingLinkClicks.ts}), 'YYYY-MM-DD')`,
      count: sql<number>`count(*)::int`,
    })
    .from(trackingLinkClicks)
    .where(windowPred)
    .groupBy(sql`date_trunc('day', ${trackingLinkClicks.ts})`)
    .orderBy(sql`date_trunc('day', ${trackingLinkClicks.ts})`);

  const daily = fillDailySeries(dailyRows, days);

  // ---- Breakdowns ----
  const [country, deviceType, browser, os, referrerHost, sourceCol] = await Promise.all([
    topBreakdown(trackingLinkClicks.country),
    topBreakdown(trackingLinkClicks.deviceType),
    topBreakdown(trackingLinkClicks.browser),
    topBreakdown(trackingLinkClicks.os),
    topBreakdown(trackingLinkClicks.referrerHost),
    topBreakdown(trackingLinkClicks.utmSource),
  ]);

  // ---- Recent clicks ----
  const recent = await db
    .select()
    .from(trackingLinkClicks)
    .where(windowPred)
    .orderBy(desc(trackingLinkClicks.ts))
    .limit(50);

  return NextResponse.json({
    link,
    window: { days, since: since.toISOString() },
    totals: {
      total: totals.count,
      uniqueIps: uniqueRow.uniqueIps,
      bots: botRow.botCount,
      firstClick: toIso(extents.firstClick),
      lastClick: toIso(extents.lastClick),
    },
    daily,
    breakdowns: { country, deviceType, browser, os, referrerHost, source: sourceCol },
    recent,
  });
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function toIso(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  // Postgres min/max returns a string when projected through sql<string>.
  return value;
}

function fillDailySeries(rows: Array<{ day: string; count: number }>, days: number) {
  const byDay = new Map(rows.map((r) => [r.day, r.count]));
  const out: Array<{ day: string; count: number }> = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({ day: key, count: byDay.get(key) ?? 0 });
  }
  return out;
}
