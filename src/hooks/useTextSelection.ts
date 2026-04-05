"use client";

import { useEffect, useRef } from "react";
import { isAnalyticsEnabled } from "@/lib/posthog";
import { useAnalytics } from "@/hooks/useAnalytics";

/**
 * Tracks when users select/copy text on the page.
 * Captures the selected text (truncated), the section it came from, and the element tag.
 */
export function useTextSelection() {
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { capture } = useAnalytics();

  useEffect(() => {
    if (!isAnalyticsEnabled) return;

    function onSelectionChange() {
      if (debounce.current) clearTimeout(debounce.current);

      debounce.current = setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) return;

        const text = selection.toString().trim();
        if (text.length < 3 || text.length > 500) return;

        const anchor = selection.anchorNode?.parentElement;
        const section = anchor
          ?.closest("[data-section]")
          ?.getAttribute("data-section");

        capture("text_selected", {
          text: text.slice(0, 200),
          text_length: text.length,
          section: section || undefined,
          element_tag: anchor?.tagName?.toLowerCase() || undefined,
          path: window.location.pathname,
        });
      }, 800);
    }

    document.addEventListener("selectionchange", onSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", onSelectionChange);
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [capture]);
}
