import { upload } from "@vercel/blob/client";
import { extractVideoPoster, deriveThumbnailFilename } from "@/lib/video-thumbnail";
import type { MediaFile } from "./types";

const SERVER_LIMIT = 4 * 1024 * 1024; // 4 MB

/**
 * Generate a poster for an existing video URL and attach it to the media asset.
 *
 * Used by the /crm/media backfill flow for videos uploaded before posters
 * were a thing. Mirrors the new-upload code path: extract first settled
 * frame in the browser, upload the JPEG as a sibling Blob, PATCH the
 * `media_assets.thumbnail_url` column.
 *
 * Throws on any step that fails so the caller (admin UI) can surface a
 * specific error per asset.
 */
export async function backfillThumbnail(asset: MediaFile): Promise<string> {
    if (!asset.id) throw new Error("Asset is not in the database");
    if (!asset.url) throw new Error("Asset has no URL");

    const { blob } = await extractVideoPoster(asset.url);
    const posterName = deriveThumbnailFilename(filenameFromUrl(asset.url, asset.pathname));
    const posterFile = new File([blob], posterName, { type: "image/jpeg" });

    const thumbnailUrl = await uploadPoster(posterFile);
    await patchAssetThumbnail(asset.id, thumbnailUrl);
    return thumbnailUrl;
}

async function uploadPoster(file: File): Promise<string> {
    if (file.size > SERVER_LIMIT) {
        const uploaded = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/crm/media/upload",
            clientPayload: String(file.size),
        });
        return uploaded.url;
    }

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/crm/media", { method: "POST", body: formData });
    if (!res.ok) throw new Error(`Poster upload failed (${res.status})`);
    const json = (await res.json()) as MediaFile;
    return json.url;
}

async function patchAssetThumbnail(assetId: string, thumbnailUrl: string): Promise<void> {
    const res = await fetch(`/api/crm/media/${assetId}/thumbnail`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thumbnailUrl }),
    });
    if (!res.ok) throw new Error(`Failed to attach thumbnail (${res.status})`);
}

function filenameFromUrl(url: string, fallback: string): string {
    try {
        const u = new URL(url);
        const last = u.pathname.split("/").pop();
        if (last) return last;
    } catch {
        /* fall through */
    }
    return fallback;
}
