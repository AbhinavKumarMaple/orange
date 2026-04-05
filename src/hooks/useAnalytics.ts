"use client";

import { useEffect, useRef, useCallback } from "react";
import posthog from "posthog-js";
import { isAnalyticsEnabled, POSTHOG_KEY, POSTHOG_HOST } from "@/lib/posthog";

/**
 * Singleton worker reference shared across all hook instances.
 * We only want one worker per page load.
 */
let workerInstance: Worker | null = null;
let workerReady = false;

function getWorker(): Worker | null {
  if (!isAnalyticsEnabled) return null;
  if (typeof window === "undefined") return null;
  if (!("Worker" in window)) return null;

  if (!workerInstance) {
    workerInstance = new Worker("/analytics.worker.js");
    workerInstance.onmessage = () => {};
    workerInstance.onerror = (err) => {
      console.warn("[Analytics] Worker error, falling back to main thread:", err);
      workerInstance = null;
      workerReady = false;
    };
    workerInstance.postMessage({
      type: "init",
      payload: { key: POSTHOG_KEY, host: POSTHOG_HOST },
    });
    workerReady = true;
  }

  return workerInstance;
}

/**
 * Returns a `capture` function that routes PostHog events through a Web Worker
 * to keep analytics off the main thread. Falls back to direct posthog.capture
 * if workers are unavailable.
 */
export function useAnalytics() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (!isAnalyticsEnabled) return;
    workerRef.current = getWorker();
  }, []);

  const capture = useCallback(
    (event: string, properties?: Record<string, unknown>) => {
      if (!isAnalyticsEnabled) return;

      const worker = workerRef.current ?? getWorker();

      if (worker && workerReady) {
        worker.postMessage({ type: "capture", payload: { event, properties } });
      } else {
        // Fallback: defer to idle time on main thread
        if ("requestIdleCallback" in window) {
          requestIdleCallback(() => posthog.capture(event, properties));
        } else {
          setTimeout(() => posthog.capture(event, properties), 0);
        }
      }
    },
    [],
  );

  return { capture };
}
