import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { mediaAssets } from "@/db/schema";
import { revalidateMedia } from "@/lib/revalidate";

/**
 * Attach (or detach) a poster image URL to a media asset.
 *
 *   PATCH /api/crm/media/[id]/thumbnail
 *   Body: { thumbnailUrl: string | null }
 *
 * Auth is enforced by the proxy middleware at /api/crm/* — this handler
 * runs only for authenticated CRM users. Used by:
 *   - the upload flow (after generating a poster in the browser)
 *   - the backfill admin tool (per existing video, on demand)
 */

export const dynamic = "force-dynamic";

const schema = z.object({
  thumbnailUrl: z.union([z.string().url(), z.null()]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body;
  try {
    body = schema.parse(await req.json());
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", fields: err.flatten().fieldErrors },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }

  const [updated] = await db
    .update(mediaAssets)
    .set({ thumbnailUrl: body.thumbnailUrl })
    .where(eq(mediaAssets.id, id))
    .returning({ id: mediaAssets.id, thumbnailUrl: mediaAssets.thumbnailUrl });

  if (!updated) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  revalidateMedia();
  return NextResponse.json(updated);
}
