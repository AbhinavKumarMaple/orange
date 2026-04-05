/**
 * Analytics Web Worker
 * Handles PostHog event capture off the main thread.
 * Receives messages of shape: { type: 'capture', event: string, properties: object }
 */

let posthogLoaded = false;
let queue = [];
let posthog = null;

function flushQueue() {
  while (queue.length > 0) {
    const { event, properties } = queue.shift();
    posthog.capture(event, properties);
  }
}

self.onmessage = function (e) {
  const { type, payload } = e.data;

  if (type === "init") {
    const { key, host } = payload;
    // Import posthog-js in the worker context
    importScripts("https://cdn.jsdelivr.net/npm/posthog-js@latest/dist/array.full.js");
    posthog = self.posthog;
    posthog.init(key, {
      api_host: host,
      person_profiles: "identified_only",
      capture_pageview: false,
      capture_pageleave: false,
      autocapture: false,
      capture_heatmaps: false,
      disable_beacon: false,   // use sendBeacon — lowest priority, non-blocking
      loaded: () => {
        posthogLoaded = true;
        flushQueue();
      },
    });
    return;
  }

  if (type === "capture") {
    const { event, properties } = payload;
    if (posthogLoaded && posthog) {
      posthog.capture(event, properties);
    } else {
      queue.push({ event, properties });
    }
    return;
  }

  if (type === "identify") {
    const { distinctId, properties } = payload;
    if (posthogLoaded && posthog) {
      posthog.identify(distinctId, properties);
    }
    return;
  }
};
