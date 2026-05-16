import { NextRequest, NextResponse, after } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { trackingLinks, trackingLinkClicks } from "@/db/schema";
import { buildDestinationUrl, extractClickMetadata } from "@/lib/tracking";

/**
 * Public tracking-link redirect.
 *
 *   GET /t/<slug>
 *
 * - Looks up the slug, returns 410 Gone if disabled or 404 if unknown.
 * - Logs a row in `tracking_link_clicks` with all the request metadata
 *   we can extract, plus bumps the `click_count` denormalized counter.
 *   The logging runs in `after(...)` so the 302 redirect ships first and
 *   the user sees no extra latency from analytics writes.
 * - Appends source/medium/campaign as utm_* params to the destination
 *   URL (without overwriting), so analytics on the destination also see
 *   the attribution.
 *
 * Not under /crm/* and not under /api/crm/*, so the auth middleware
 * doesn't gate it.
 */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return new NextResponse("Not found", { status: 404 });

  const [link] = await db
    .select()
    .from(trackingLinks)
    .where(eq(trackingLinks.slug, slug))
    .limit(1);

  if (!link) return new NextResponse("Not found", { status: 404 });
  // Both "disabled" and "trashed" make the slug return 410 Gone. The slug
  // stays reserved (unique constraint) so the historical click row is
  // never orphaned by a slug being reused for a different destination.
  if (!link.active || link.deletedAt) {
    return new NextResponse("Link is no longer active", { status: 410 });
  }

  const metadata = extractClickMetadata(req);
  const finalUrl = buildDestinationUrl(
    link.destinationUrl,
    { source: link.source, medium: link.medium, campaign: link.campaign },
    {
      utmSource: metadata.utmSource,
      utmMedium: metadata.utmMedium,
      utmCampaign: metadata.utmCampaign,
      utmTerm: metadata.utmTerm,
      utmContent: metadata.utmContent,
    },
  );

  // Log + counter bump after the response is sent.
  after(async () => {
    try {
      await Promise.all([
        db.insert(trackingLinkClicks).values({
          linkId: link.id,
          ...metadata,
        }),
        db
          .update(trackingLinks)
          .set({ clickCount: sql`${trackingLinks.clickCount} + 1` })
          .where(eq(trackingLinks.id, link.id)),
      ]);
    } catch (err) {
      console.error("Failed to log tracking click:", err);
    }
  });

  // 302 (Found) so caching layers don't memoize the redirect target; we
  // need every visit to come back through here.
  return NextResponse.redirect(finalUrl, 302);
}
