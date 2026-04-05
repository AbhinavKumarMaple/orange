import posthog from "posthog-js";

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY!;
export const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

/** Returns true when analytics is explicitly enabled via env var. */
export const isAnalyticsEnabled =
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false";

export function initPostHog() {
  if (!isAnalyticsEnabled) return;
  if (typeof window === "undefined") return;
  if (posthog.__loaded) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: false,   // handled manually for SPA navigation
    capture_pageleave: true,
    autocapture: true,
    capture_heatmaps: true,
  });
}

/**
 * Capture an event via sendBeacon — lowest network priority, non-blocking,
 * survives page unload. Use this instead of posthog.capture() directly.
 */
export function captureEvent(event: string, properties?: Record<string, unknown>) {
  if (!isAnalyticsEnabled) return;
  posthog.capture(event, properties, { transport: "sendBeacon" });
}

export default posthog;
