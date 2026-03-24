"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { isAnalyticsEnabled } from "@/lib/posthog";

/**
 * Tracks clicks on elements with `data-track-click="label"`.
 * Captures the label, section context, and element text.
 */
export function useClickTracking() {
  useEffect(() => {
    if (!isAnalyticsEnabled) return;
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement).closest(
        "[data-track-click]",
      ) as HTMLElement | null;
      if (!el) return;

      const label = el.dataset.trackClick;
      const section = el
        .closest("[data-section]")
        ?.getAttribute("data-section");

      posthog.capture("cta_click", {
        label,
        section: section || undefined,
        element_text: el.textContent?.trim().slice(0, 100) || undefined,
        path: window.location.pathname,
      });
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
}
