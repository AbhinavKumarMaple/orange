import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, desc, eq, ilike, isNotNull, isNull, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { trackingLinks } from "@/db/schema";
import { generateSlug } from "@/lib/tracking";
import { getCurrentUser } from "@/lib/auth";
import { revalidateTrackingLinks } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

/**
 * Tracking-link list + create.
 *
 *   GET  /api/crm/links?q=&active=&sort=
 *   POST /api/crm/links   body: { destinationUrl, label?, source?, medium?, campaign?, slug? }
 *
 * Auth is enforced by the proxy middleware (route under /api/crm/*).
 */

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const activeOnly = url.searchParams.get("active") === "true";
  const sortParam = url.searchParams.get("sort") || "newest";
  // `trashed=true` flips the view to show only soft-deleted links.
  // `trashed=all` shows everything regardless of state (rarely needed
  // but useful for admin debugging). Anything else defaults to "live".
  const trashedParam = url.searchParams.get("trashed");
  const view: "live" | "trashed" | "all" =
    trashedParam === "true" ? "trashed" : trashedParam === "all" ? "all" : "live";

  const parts = [];
  if (view === "live") parts.push(isNull(trackingLinks.deletedAt));
  else if (view === "trashed") parts.push(isNotNull(trackingLinks.deletedAt));
  if (q) {
    parts.push(
      or(
        ilike(trackingLinks.label, `%${q}%`),
        ilike(trackingLinks.source, `%${q}%`),
        ilike(trackingLinks.campaign, `%${q}%`),
        ilike(trackingLinks.slug, `%${q}%`),
        ilike(trackingLinks.destinationUrl, `%${q}%`),
      )!,
    );
  }
  if (activeOnly) parts.push(eq(trackingLinks.active, true));
  const where = parts.length === 0 ? undefined : parts.length === 1 ? parts[0] : and(...parts);

  const orderBy = (() => {
    switch (sortParam) {
      case "clicks": return desc(trackingLinks.clickCount);
      case "alpha": return trackingLinks.label;
      case "newest":
      default: return desc(trackingLinks.createdAt);
    }
  })();

  const rows = await db.select().from(trackingLinks).where(where).orderBy(orderBy);
  return NextResponse.json(rows);
}

const createSchema = z.object({
  destinationUrl: z.string().url().max(2000),
  label: z.string().max(200).optional(),
  source: z.string().max(64).optional(),
  medium: z.string().max(64).optional(),
  campaign: z.string().max(128).optional(),
  slug: z.string().regex(/^[A-Za-z0-9_-]{3,32}$/, "Slug must be 3–32 chars, alphanumeric + _-").optional(),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = createSchema.parse(await req.json());
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", fields: err.flatten().fieldErrors },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }

  // Generate a unique slug, retrying on the rare collision.
  let slug = body.slug ?? generateSlug();
  let attempts = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const exists = await db
      .select({ id: trackingLinks.id })
      .from(trackingLinks)
      .where(eq(trackingLinks.slug, slug))
      .limit(1);
    if (exists.length === 0) break;
    if (body.slug) {
      return NextResponse.json({ error: "Slug is already in use" }, { status: 409 });
    }
    if (++attempts > 5) {
      return NextResponse.json({ error: "Could not allocate a unique slug" }, { status: 500 });
    }
    slug = generateSlug();
  }

  const [created] = await db
    .insert(trackingLinks)
    .values({
      slug,
      destinationUrl: body.destinationUrl,
      label: body.label || null,
      source: body.source || null,
      medium: body.medium || null,
      campaign: body.campaign || null,
      createdBy: user.id,
    })
    .returning();

  revalidateTrackingLinks();
  return NextResponse.json(created, { status: 201 });
}

// Suppress unused import — referenced via the schema typing of sql template.
void sql;
