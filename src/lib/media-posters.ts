import "server-only";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { mediaAssets } from "@/db/schema";
import { isVideo } from "@/lib/utils";

/**
 * Server-side helper: given a list of media URLs that a page is about to
 * render, return a Map<videoUrl, posterUrl> covering only the entries that
 * (a) are videos by extension and (b) have a thumbnail recorded.
 *
 * Single SELECT per page render. Pages call this in their data loader,
 * pass the result to <VideoPosterProvider>, and downstream <MediaRenderer>
 * instances pick up the poster from context without any prop threading.
 *
 * URLs that aren't in `media_assets` (e.g. legacy Framer URLs) simply
 * don't appear in the map — the renderer handles a missing poster as
 * "no poster", matching today's behavior with no regression.
 */
export async function loadVideoPosters(
  urls: ReadonlyArray<string | null | undefined>,
): Promise<Map<string, string>> {
  const videoUrls = Array.from(
    new Set(
      urls
        .filter((u): u is string => typeof u === "string" && u.length > 0)
        .filter((u) => isVideo(u)),
    ),
  );

  if (videoUrls.length === 0) return new Map();

  const rows = await db
    .select({ url: mediaAssets.url, thumbnailUrl: mediaAssets.thumbnailUrl })
    .from(mediaAssets)
    .where(inArray(mediaAssets.url, videoUrls));

  const out = new Map<string, string>();
  for (const row of rows) {
    if (row.thumbnailUrl) out.set(row.url, row.thumbnailUrl);
  }
  return out;
}

/** Convenience: flatten arbitrary URL-bearing fields from a content row into a flat list. */
export function collectMediaUrls(...sources: Array<string | null | undefined | ReadonlyArray<string | null | undefined>>): string[] {
  const out: string[] = [];
  for (const s of sources) {
    if (typeof s === "string") {
      if (s) out.push(s);
    } else if (Array.isArray(s)) {
      for (const item of s) if (typeof item === "string" && item) out.push(item);
    }
  }
  return out;
}
