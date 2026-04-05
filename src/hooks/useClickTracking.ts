"use client";

import { useEffect } from "react";
import { isAnalyticsEnabled } from "@/lib/posthog";
import { useAnalytics } from "@/hooks/useAnalytics";

/**
 * Tracks clicks on elements with `data-track-click="label"`.
 * Captures the label, section context, and element text.
 */
export function useClickTracking() {
  const { capture } = useAnalytics();

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

      capture("cta_click", {
        label,
        section: section || undefined,
        element_text: el.textContent?.trim().slice(0, 100) || undefined,
        path: window.location.pathname,
      });
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [capture]);
}
