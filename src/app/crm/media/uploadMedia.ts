import { upload } from "@vercel/blob/client";
import type { MediaFile } from "./types";

const SERVER_LIMIT = 4 * 1024 * 1024; // 4 MB

/**
 * Uploads a file to Vercel Blob.
 * - Files ≤ 4MB: go through the server API route (simple, tracked immediately)
 * - Files > 4MB: use Vercel Blob client upload (direct browser → blob, no size limit)
 */
export async function uploadMedia(file: File): Promise<MediaFile> {
  if (file.size > SERVER_LIMIT) {
    // Client upload — goes directly from browser to Vercel Blob
    const blob = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/crm/media/upload",
    });

    return {
      url: blob.url,
      pathname: blob.pathname,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      versions: [],
    };
  }

  // Server upload — tracked in DB immediately
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/crm/media", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}
