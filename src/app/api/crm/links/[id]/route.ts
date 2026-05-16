import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { trackingLinks } from "@/db/schema";
import { revalidateTrackingLinks } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

/**
 * Soft-delete model:
 *   PATCH  { restore: true }   → clears deleted_at (un-trash)
 *   PATCH  { other fields }    → normal update
 *   DELETE                     → sets deleted_at = now() (move to trash)
 *   DELETE ?permanent=true     → hard-delete (cascades click history)
 *
 * /t/[slug] treats any link with a non-NULL deleted_at as gone (410),
 * so trashed links are immediately inaccessible to the public even
 * before they're permanently removed.
 */

const patchSchema = z.object({
  destinationUrl: z.string().url().max(2000).optional(),
  label: z.string().max(200).nullable().optional(),
  source: z.string().max(64).nullable().optional(),
  medium: z.string().max(64).nullable().optional(),
  campaign: z.string().max(128).nullable().optional(),
  active: z.boolean().optional(),
  /** Set to `true` to restore a soft-deleted link (clears deleted_at). */
  restore: z.literal(true).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body;
  try {
    body = patchSchema.parse(await req.json());
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", fields: err.flatten().fieldErrors },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }

  const { restore, ...rest } = body;

  // Build the patch object carefully — only include fields the client
  // actually sent, plus the deleted_at clear when restoring.
  const patch: Record<string, unknown> = { ...rest };
  if (restore) patch.deletedAt = null;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const [updated] = await db
    .update(trackingLinks)
    .set(patch)
    .where(eq(trackingLinks.id, id))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidateTrackingLinks();
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const permanent = new URL(req.url).searchParams.get("permanent") === "true";

  if (permanent) {
    // Real delete — click rows cascade via the ON DELETE CASCADE FK.
    await db.delete(trackingLinks).where(eq(trackingLinks.id, id));
  } else {
    // Soft delete — mark and keep, click history untouched.
    const [updated] = await db
      .update(trackingLinks)
      .set({ deletedAt: new Date() })
      .where(eq(trackingLinks.id, id))
      .returning({ id: trackingLinks.id });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  revalidateTrackingLinks();
  return new NextResponse(null, { status: 204 });
}
