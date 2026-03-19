"use client";

import { useEffect, useRef } from "react";
import posthog from "posthog-js";

/**
 * Tracks how long each section is visible in the viewport using IntersectionObserver.
 * Attach `data-section="SectionName"` to any element you want tracked.
 */
export function useSectionVisibility() {
  const timers = useRef<Map<string, number>>(new Map());
  const reported = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const section = (entry.target as HTMLElement).dataset.section;
          if (!section) continue;

          if (entry.isIntersecting) {
            timers.current.set(section, Date.now());

            // Fire section_enter once
            if (!reported.current.has(section)) {
              posthog.capture("section_visible", {
                section,
                path: window.location.pathname,
              });
              reported.current.set(section, 0);
            }
          } else {
            const start = timers.current.get(section);
            if (start) {
              const duration = Math.round((Date.now() - start) / 1000);
              if (duration >= 1) {
                const total = (reported.current.get(section) || 0) + duration;
                reported.current.set(section, total);
                posthog.capture("section_time", {
                  section,
                  duration_seconds: duration,
                  total_seconds: total,
                  path: window.location.pathname,
                });
              }
              timers.current.delete(section);
            }
          }
        }
      },
      { threshold: 0.3 },
    );

    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      // Flush any remaining timers
      for (const [section, start] of timers.current.entries()) {
        const duration = Math.round((Date.now() - start) / 1000);
        if (duration >= 1) {
          posthog.capture("section_time", {
            section,
            duration_seconds: duration,
            total_seconds: (reported.current.get(section) || 0) + duration,
            path: window.location.pathname,
          });
        }
      }
      timers.current.clear();
      reported.current.clear();
    };
  }, []);
}
