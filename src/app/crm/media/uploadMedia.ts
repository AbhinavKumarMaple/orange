import { upload } from "@vercel/blob/client";
import { compressMedia } from "./compressMedia";
import { extractVideoPoster, deriveThumbnailFilename } from "@/lib/video-thumbnail";
import type { MediaFile } from "./types";

const SERVER_LIMIT = 4 * 1024 * 1024; // 4 MB

/**
 * Compresses then uploads a file to Vercel Blob.
 * - Files ≤ 4MB (after compression): server route
 * - Files > 4MB (after compression): client upload (direct browser → blob)
 *
 * Videos additionally trigger a browser-side poster extraction (first
 * settled frame, ~0.3s in). The poster JPEG is uploaded as a sibling
 * blob and the `media_assets.thumbnail_url` column is patched so the
 * public renderer can pass it to `<video poster=...>`. A failed poster
 * step is logged but never fails the underlying upload.
 */
export async function uploadMedia(file: File): Promise<MediaFile> {
  // Compress first (images only, videos pass through)
  const processed = await compressMedia(file);
  const result = await uploadProcessed(processed);

  // Generate + attach a poster for videos. Best-effort: any failure is
  // logged so the admin can retry from the backfill UI later.
  if (file.type.startsWith("video/") && result.id) {
    try {
      const thumbnailUrl = await generateAndUploadPoster(file, result.url);
      await patchAssetThumbnail(result.id, thumbnailUrl);
      result.thumbnailUrl = thumbnailUrl;
    } catch (err) {
      console.error("Video poster generation failed:", err);
    }
  }

  return result;
}

async function uploadProcessed(processed: File): Promise<MediaFile> {
  if (processed.size > SERVER_LIMIT) {
    const blob = await upload(processed.name, processed, {
      access: "public",
      handleUploadUrl: "/api/crm/media/upload",
      clientPayload: String(processed.size),
    });

    return {
      url: blob.url,
      pathname: blob.pathname,
      size: processed.size,
      uploadedAt: new Date().toISOString(),
      versions: [],
    };
  }

  const formData = new FormData();
  formData.append("file", processed);
  const res = await fetch("/api/crm/media", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

/**
 * Generate a poster from the source video (still in browser memory),
 * then upload it via the public direct-upload route. Returns the
 * thumbnail's public URL.
 *
 * We deliberately upload the poster via the same /api/crm/media/upload
 * client-token flow even when small, so the file is registered into
 * `media_assets` and shows up in the media library inventory.
 */
async function generateAndUploadPoster(videoFile: File, videoUrl: string): Promise<string> {
  const { blob } = await extractVideoPoster(videoFile);
  const posterName = deriveThumbnailFilename(filenameOf(videoUrl, videoFile.name));
  const posterFile = new File([blob], posterName, { type: "image/jpeg" });

  if (posterFile.size > SERVER_LIMIT) {
    const uploaded = await upload(posterFile.name, posterFile, {
      access: "public",
      handleUploadUrl: "/api/crm/media/upload",
      clientPayload: String(posterFile.size),
    });
    return uploaded.url;
  }

  const formData = new FormData();
  formData.append("file", posterFile);
  const res = await fetch("/api/crm/media", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Poster upload failed");
  const json = (await res.json()) as MediaFile;
  return json.url;
}

async function patchAssetThumbnail(assetId: string, thumbnailUrl: string): Promise<void> {
  const res = await fetch(`/api/crm/media/${assetId}/thumbnail`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ thumbnailUrl }),
  });
  if (!res.ok) {
    throw new Error(`Failed to attach thumbnail (${res.status})`);
  }
}

function filenameOf(url: string, fallback: string): string {
  try {
    const u = new URL(url);
    const last = u.pathname.split("/").pop();
    if (last) return last;
  } catch {
    /* fall through */
  }
  return fallback;
}
