import posthog from "posthog-js";

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY!;
export const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

export function initPostHog() {
  if (typeof window === "undefined") return;
  if (posthog.__loaded) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: false, // we handle this manually for SPA navigation
    capture_pageleave: true,
    autocapture: true,
    capture_heatmaps: true,
  });

  // PostHog blocks localhost by default — opt in explicitly for dev
  if (process.env.NODE_ENV === "development") {
    posthog.opt_in_capturing();
  }
}

export default posthog;
