import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the src for a media field.
 * If the value is a base64 data URI, returns it as-is.
 * Query params are only appended for non-blob CDN URLs that support URL-based resizing.
 * Vercel Blob URLs ignore query params, so we skip them.
 */
export function mediaUrl(value: string, _query?: string): string {
  if (!value) return value;
  if (value.startsWith("data:")) return value;
  return value;
}

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|ogg|avi|mkv)(\?|$)/i;

/** Returns true if the URL points to a video file */
export function isVideo(url: string): boolean {
  if (!url) return false;
  return VIDEO_EXTENSIONS.test(url);
}
