import { NextRequest, NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";
import { db } from "@/db";
import { mediaAssets } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** List all uploaded media — merges blob list with DB metadata */
export async function GET() {
  try {
    const [{ blobs }, dbAssets] = await Promise.all([
      list(),
      db.select().from(mediaAssets),
    ]);

    const assetMap = new Map(dbAssets.map((a) => [a.url, a]));

    const files = blobs.map((b) => {
      const asset = assetMap.get(b.url);
      return {
        url: b.url,
        pathname: b.pathname,
        size: b.size,
        uploadedAt: b.uploadedAt,
        id: asset?.id ?? null,
        width: asset?.width ?? null,
        height: asset?.height ?? null,
        versions: (asset?.versions as { url: string; size: number; replacedAt: string }[]) ?? [],
      };
    });

    return NextResponse.json(files);
  } catch (err) {
    console.error("Failed to list media:", err);
    return NextResponse.json([], { status: 500 });
  }
}

/** Upload a file — stores in blob + creates DB asset record */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const blob = await put(file.name, file, { access: "public" });

    const [asset] = await db.insert(mediaAssets).values({
      url: blob.url,
      pathname: blob.pathname,
      size: file.size,
    }).returning();

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      id: asset.id,
      width: null,
      height: null,
      versions: [],
    });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

/** Delete a blob by URL — also removes DB record */
export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 });

    await del(url);
    await db.delete(mediaAssets).where(eq(mediaAssets.url, url));

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("Delete failed:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
