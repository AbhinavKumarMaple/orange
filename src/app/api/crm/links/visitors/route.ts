import { NextRequest, NextResponse } from "next/server";
import { and, eq, gte, isNotNull, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { trackingLinkClicks } from "@/db/schema";

/**
 * Paginated unique-visitor list — one row per IP that clicked any
 * tracking link in the requested time window.
 *
 *   GET /api/crm/links/visitors
 *     ?days=30        (default 30, 1..365)
 *     &limit=24       (1..100)
 *     &offset=0
 *     &q=             (substring match on country/city/browser/os/ip)
 *     &sort=          (recent | first | most | least)
 *     &includeBots=   (default false)
 *
 * Each row aggregates a visitor's metadata across all their clicks:
 *   - visits, firstSeen, lastSeen
 *   - representative country/city/device/browser/os/language taken from
 *     the most-recent click (so a visitor who roamed from mobile to
 *     desktop shows up as the latter)
 *   - everBot — true if any visit looked like a bot, useful for spotting
 *     mixed bot/human IP behavior
 *
 * Returns: { items, total, nextOffset }
 */

export const dynamic = "force-dynamic";

interface VisitorRow {
  ip: string;
  visits: number;
  firstSeen: string;
  lastSeen: string;
  country: string | null;
  region: string | null;
  city: string | null;
  deviceType: string | null;
  browser: string | null;
  os: string | null;
  language: string | null;
  topReferrer: string | null;
  everBot: boolean;
}

const SORTS = {
  recent: `MAX(ts) DESC`,
  first: `MIN(ts) DESC`,
  most: `COUNT(*) DESC`,
  least: `COUNT(*) ASC`,
} as const;
type SortKey = keyof typeof SORTS;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const days = clamp(parseInt(url.searchParams.get("days") || "30", 10) || 30, 1, 365);
  const limit = clamp(parseInt(url.searchParams.get("limit") || "24", 10) || 24, 1, 100);
  const offset = Math.max(0, parseInt(url.searchParams.get("offset") || "0", 10) || 0);
  const q = (url.searchParams.get("q") || "").trim();
  const sortParam = (url.searchParams.get("sort") || "recent") as SortKey;
  const sort = sortParam in SORTS ? sortParam : "recent";
  const includeBots = url.searchParams.get("includeBots") === "true";
  // Optional scope to a single tracking link.
  const linkIdFilter = url.searchParams.get("linkId") || null;

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const baseParts: SQL[] = [
    gte(trackingLinkClicks.ts, since)!,
    isNotNull(trackingLinkClicks.ip),
  ];
  if (linkIdFilter) baseParts.push(eq(trackingLinkClicks.linkId, linkIdFilter));
  const baseWindow: SQL = baseParts.length === 1 ? baseParts[0] : and(...baseParts)!;
  const wherePred: SQL = includeBots
    ? baseWindow
    : and(baseWindow, eq(trackingLinkClicks.isBot, false))!;

  // Build the post-aggregation HAVING-style filter for `q` — we can't
  // ILIKE inside the GROUP BY easily, so we run search as a pre-filter
  // on the rows that flow into the aggregate. Slight semantic difference
  // (matches against any click's metadata, not the aggregated metadata)
  // but the result is what the user expects.
  const finalWhere: SQL = q
    ? and(
        wherePred,
        sql`(
          ${trackingLinkClicks.ip} ILIKE ${"%" + q + "%"} OR
          COALESCE(${trackingLinkClicks.country}, '') ILIKE ${"%" + q + "%"} OR
          COALESCE(${trackingLinkClicks.city}, '') ILIKE ${"%" + q + "%"} OR
          COALESCE(${trackingLinkClicks.browser}, '') ILIKE ${"%" + q + "%"} OR
          COALESCE(${trackingLinkClicks.os}, '') ILIKE ${"%" + q + "%"} OR
          COALESCE(${trackingLinkClicks.deviceType}, '') ILIKE ${"%" + q + "%"}
        )`,
      )!
    : wherePred;

  // The Neon HTTP driver returns `{ rows, ... }` for db.execute, but the
  // typed query-builder pipeline (db.select + groupBy) returns a plain
  // array — that's what we use here.
  const aggregateColumns = {
    ip: trackingLinkClicks.ip,
    visits: sql<number>`count(*)::int`,
    firstSeen: sql<string>`min(${trackingLinkClicks.ts})::text`,
    lastSeen: sql<string>`max(${trackingLinkClicks.ts})::text`,
    // The (array_agg ORDER BY ts DESC)[1] trick gives the most-recent
    // non-null value for each column.
    country: sql<string | null>`(array_agg(${trackingLinkClicks.country} ORDER BY ${trackingLinkClicks.ts} DESC) FILTER (WHERE ${trackingLinkClicks.country} IS NOT NULL))[1]`,
    region: sql<string | null>`(array_agg(${trackingLinkClicks.region} ORDER BY ${trackingLinkClicks.ts} DESC) FILTER (WHERE ${trackingLinkClicks.region} IS NOT NULL))[1]`,
    city: sql<string | null>`(array_agg(${trackingLinkClicks.city} ORDER BY ${trackingLinkClicks.ts} DESC) FILTER (WHERE ${trackingLinkClicks.city} IS NOT NULL))[1]`,
    deviceType: sql<string | null>`(array_agg(${trackingLinkClicks.deviceType} ORDER BY ${trackingLinkClicks.ts} DESC) FILTER (WHERE ${trackingLinkClicks.deviceType} IS NOT NULL))[1]`,
    browser: sql<string | null>`(array_agg(${trackingLinkClicks.browser} ORDER BY ${trackingLinkClicks.ts} DESC) FILTER (WHERE ${trackingLinkClicks.browser} IS NOT NULL))[1]`,
    os: sql<string | null>`(array_agg(${trackingLinkClicks.os} ORDER BY ${trackingLinkClicks.ts} DESC) FILTER (WHERE ${trackingLinkClicks.os} IS NOT NULL))[1]`,
    language: sql<string | null>`(array_agg(${trackingLinkClicks.language} ORDER BY ${trackingLinkClicks.ts} DESC) FILTER (WHERE ${trackingLinkClicks.language} IS NOT NULL))[1]`,
    topReferrer: sql<string | null>`(array_agg(${trackingLinkClicks.referrerHost} ORDER BY ${trackingLinkClicks.ts} DESC) FILTER (WHERE ${trackingLinkClicks.referrerHost} IS NOT NULL))[1]`,
    everBot: sql<boolean>`bool_or(${trackingLinkClicks.isBot})`,
  };

  const orderClause = sql.raw(SORTS[sort]);

  const [items, [{ count }]] = await Promise.all([
    db
      .select(aggregateColumns)
      .from(trackingLinkClicks)
      .where(finalWhere)
      .groupBy(trackingLinkClicks.ip)
      .orderBy(orderClause)
      .limit(limit)
      .offset(offset),
    db
      .select({
        count: sql<number>`count(DISTINCT ${trackingLinkClicks.ip})::int`,
      })
      .from(trackingLinkClicks)
      .where(finalWhere),
  ]);

  const total = count;
  const nextOffset = offset + items.length < total ? offset + items.length : null;

  return NextResponse.json({
    items: items as unknown as VisitorRow[],
    total,
    nextOffset,
    window: { days, since: since.toISOString() },
  });
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}
