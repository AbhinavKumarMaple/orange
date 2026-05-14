import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { and, asc, desc, ilike, not, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { mediaAssets } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * List uploaded media with pagination, type filter, sort, and full-text-ish
 * search on the filename. The DB row is the source of truth — Vercel Blob
 * tracks the same files but `media_assets` has the extra fields we need
 * (dimensions, versions, thumbnail_url).
 *
 * Query params:
 *   limit    1..100 (default 60)
 *   offset   >=0    (default 0)
 *   type     all|image|video (default all)
 *   sort     newest|oldest|largest|smallest|name (default newest)
 *   q        substring search against pathname (case-insensitive)
 *
 * Response shape:
 *   { items: MediaFile[], total: number, nextOffset: number | null }
 */

const VIDEO_EXTS = ["mp4", "webm", "mov", "ogg", "ogv", "avi", "mkv", "m4v"];

function buildVideoOrImagePredicate(type: "all" | "image" | "video"): SQL | undefined {
  if (type === "all") return undefined;
  // Build (pathname ILIKE '%.mp4' OR pathname ILIKE '%.webm' OR …) via the
  // drizzle helpers — no raw SQL, so we get correct parameter binding and
  // proper type inference.
  const videoLike = or(...VIDEO_EXTS.map((ext) => ilike(mediaAssets.pathname, `%.${ext}`)));
  if (!videoLike) return undefined;
  return type === "video" ? videoLike : not(videoLike);
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limit = clamp(parseInt(url.searchParams.get("limit") || "60", 10) || 60, 1, 100);
    const offset = Math.max(0, parseInt(url.searchParams.get("offset") || "0", 10) || 0);
    const type = (url.searchParams.get("type") || "all") as "all" | "image" | "video";
    const sortParam = url.searchParams.get("sort") || "newest";
    const q = (url.searchParams.get("q") || "").trim();

    const whereParts: SQL[] = [];
    const typePred = buildVideoOrImagePredicate(type);
    if (typePred) whereParts.push(typePred);
    if (q) whereParts.push(ilike(mediaAssets.pathname, `%${q}%`));
    const whereClause = whereParts.length === 0 ? undefined : whereParts.length === 1 ? whereParts[0] : and(...whereParts);

    // Posters auto-generated for videos clutter the library — we hide files
    // whose name ends in ".poster.<ext>" so editors only see real assets.
    // (Real assets keep their original filename; posters get the suffix
    //  written by `deriveThumbnailFilename` in lib/video-thumbnail.ts.)
    const hidePosters = sql`${mediaAssets.pathname} NOT ILIKE '%.poster.%'`;
    const finalWhere = whereClause ? and(whereClause, hidePosters) : hidePosters;

    const orderBy = (() => {
      switch (sortParam) {
        case "oldest": return asc(mediaAssets.uploadedAt);
        case "largest": return desc(mediaAssets.size);
        case "smallest": return asc(mediaAssets.size);
        case "name": return asc(mediaAssets.pathname);
        case "newest":
        default: return desc(mediaAssets.uploadedAt);
      }
    })();

    const [items, [{ count }]] = await Promise.all([
      db.select().from(mediaAssets).where(finalWhere).orderBy(orderBy).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(mediaAssets).where(finalWhere),
    ]);

    const nextOffset = offset + items.length < count ? offset + items.length : null;

    return NextResponse.json({
      items: items.map((a) => ({
        id: a.id,
        url: a.url,
        pathname: a.pathname,
        size: a.size,
        uploadedAt: a.uploadedAt?.toISOString(),
        width: a.width,
        height: a.height,
        versions: a.versions,
        thumbnailUrl: a.thumbnailUrl,
      })),
      total: count,
      nextOffset,
    });
  } catch (err) {
    console.error("Failed to list media:", err);
    return NextResponse.json({ items: [], total: 0, nextOffset: null }, { status: 500 });
  }
}

/** Upload a small (≤4MB) file — stores in blob + creates DB asset record */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const blob = await put(file.name, file, { access: "public", addRandomSuffix: true });

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
      thumbnailUrl: null,
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

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}
