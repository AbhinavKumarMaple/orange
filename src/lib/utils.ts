import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the src for a media field.
 * If the value is a base64 data URI, returns it as-is (no query params).
 * Otherwise appends the provided query string for CDN resizing.
 */
export function mediaUrl(value: string, query?: string): string {
  if (!value) return value;
  if (value.startsWith("data:")) return value;
  return query ? `${value}?${query}` : value;
}
