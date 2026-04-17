import { upload } from "@vercel/blob/client";
import { compressMedia } from "./compressMedia";
import type { MediaFile } from "./types";

const SERVER_LIMIT = 4 * 1024 * 1024; // 4 MB

/**
 * Compresses then uploads a file to Vercel Blob.
 * - Files ≤ 4MB (after compression): server route
 * - Files > 4MB (after compression): client upload (direct browser → blob)
 */
export async function uploadMedia(file: File): Promise<MediaFile> {
  // Compress first (images only, videos pass through)
  const processed = await compressMedia(file);

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
