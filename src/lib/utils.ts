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

/**
 * Returns a responsive CSS `clamp(...)` font-size tuned to the title's length.
 *
 * Problem: a fixed `clamp(56px, 8vw, 120px)` means short titles look impactful
 * but long titles ("LUTHRA & LUTHRA LAW OFFICES INDIA") either overflow or
 * dominate the viewport. Character-length tiering gives the designer room to
 * be bold on short names while guaranteeing long names stay legible.
 *
 * Tiers are inclusive upper bounds on character count. Tune the px values
 * here to change the entire editorial typography in one place.
 */
export function heroTitleFontSize(text: string): string {
  const len = (text ?? "").trim().length;
  if (len <= 12) return "clamp(56px, 10vw, 140px)";
  if (len <= 20) return "clamp(48px, 8vw, 104px)";
  if (len <= 30) return "clamp(40px, 6vw, 80px)";
  if (len <= 45) return "clamp(36px, 5vw, 64px)";
  return "clamp(28px, 4vw, 52px)";
}
