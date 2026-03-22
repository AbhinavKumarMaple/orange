"use client";

import { useEffect, useRef } from "react";
import posthog from "posthog-js";

const MIN_HOVER_MS = 500; // only track hovers longer than 500ms

/**
 * Tracks hover duration on elements with `data-track-hover="label"`.
 * Only fires for hovers longer than 500ms to filter out accidental passes.
 */
export function useHoverTracking() {
  const hoverStart = useRef<Map<HTMLElement, number>>(new Map());

  useEffect(() => {
    function onMouseEnter(e: Event) {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const el = target.closest("[data-track-hover]") as HTMLElement | null;
      if (el && !hoverStart.current.has(el)) {
        hoverStart.current.set(el, Date.now());
      }
    }

    function onMouseLeave(e: Event) {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const el = target.closest("[data-track-hover]") as HTMLElement | null;
      if (!el) return;

      const start = hoverStart.current.get(el);
      hoverStart.current.delete(el);
      if (!start) return;

      const duration = Date.now() - start;
      if (duration >= MIN_HOVER_MS) {
        posthog.capture("element_hover", {
          label: el.dataset.trackHover,
          duration_ms: duration,
          section:
            el.closest("[data-section]")?.getAttribute("data-section") ||
            undefined,
          path: window.location.pathname,
        });
      }
    }

    document.addEventListener("mouseenter", onMouseEnter, true);
    document.addEventListener("mouseleave", onMouseLeave, true);

    return () => {
      document.removeEventListener("mouseenter", onMouseEnter, true);
      document.removeEventListener("mouseleave", onMouseLeave, true);
      hoverStart.current.clear();
    };
  }, []);
}
