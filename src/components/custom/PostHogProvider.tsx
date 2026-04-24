"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog, { initPostHog, isAnalyticsEnabled, captureEvent } from "@/lib/posthog";

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Defer PostHog init until the browser is idle (or a 2s timeout).
    // Analytics shouldn't compete with LCP/FCP for main-thread time, and the
    // pageview below is captured once the SDK finishes loading anyway.
    useEffect(() => {
        const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void });
        if (typeof idle.requestIdleCallback === "function") {
            const id = idle.requestIdleCallback(() => initPostHog(), { timeout: 2000 });
            return () => idle.cancelIdleCallback?.(id);
        }
        const t = window.setTimeout(initPostHog, 1500);
        return () => window.clearTimeout(t);
    }, []);

    // Track page views on route change
    useEffect(() => {
        if (!isAnalyticsEnabled || !posthog.__loaded) return;

        const url = searchParams.toString()
            ? `${pathname}?${searchParams.toString()}`
            : pathname;

        captureEvent("$pageview", {
            $current_url: window.location.origin + url,
            path: pathname,
            referrer: document.referrer || undefined,
            utm_source: searchParams.get("utm_source") || undefined,
            utm_medium: searchParams.get("utm_medium") || undefined,
            utm_campaign: searchParams.get("utm_campaign") || undefined,
        });
    }, [pathname, searchParams]);

    return <>{children}</>;
}
