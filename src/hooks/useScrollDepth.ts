"use client";

import { useEffect, useRef } from "react";
import { isAnalyticsEnabled } from "@/lib/posthog";
import { useAnalytics } from "@/hooks/useAnalytics";

const MILESTONES = [25, 50, 75, 100];

/**
 * Tracks scroll depth milestones (25%, 50%, 75%, 100%) and reports to PostHog.
 * Resets on pathname change.
 */
export function useScrollDepth() {
  const reached = useRef(new Set<number>());
  const { capture } = useAnalytics();

  useEffect(() => {
    if (!isAnalyticsEnabled) return;
    reached.current.clear();

    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const pct = Math.round((scrollTop / docHeight) * 100);

      for (const m of MILESTONES) {
        if (pct >= m && !reached.current.has(m)) {
          reached.current.add(m);
          capture("scroll_depth", {
            depth_percent: m,
            path: window.location.pathname,
          });
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [capture]);
}
