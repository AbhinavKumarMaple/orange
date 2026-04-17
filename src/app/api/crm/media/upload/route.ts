import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { mediaAssets } from "@/db/schema";

export const dynamic = "force-dynamic";

/**
 * Client-side upload handler for Vercel Blob.
 * The browser uploads directly to Vercel Blob (no 4.5MB limit),
 * and this route handles token generation + post-upload DB tracking.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as HandleUploadBody;

  try {
    const response = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (_, clientPayload) => ({
        addRandomSuffix: true,
        tokenPayload: clientPayload ?? undefined,
        allowedContentTypes: [
          "image/jpeg", "image/png", "image/webp", "image/gif",
          "image/svg+xml", "image/avif",
          "video/mp4", "video/webm", "video/quicktime", "video/ogg",
        ],
      }),
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const size = tokenPayload ? parseInt(tokenPayload, 10) || 0 : 0;
        await db.insert(mediaAssets).values({
          url: blob.url,
          pathname: blob.pathname,
          size,
        }).onConflictDoNothing();
      },
    });

    return NextResponse.json(response);
  } catch (err) {
    console.error("Client upload error:", err);
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
