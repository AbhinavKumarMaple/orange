"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPostHog, isAnalyticsEnabled } from "@/lib/posthog";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { capture } = useAnalytics();

    // Initialize PostHog once (main thread still needed for session/identity)
    useEffect(() => {
        initPostHog();
    }, []);

    // Track page views on route change — via worker
    useEffect(() => {
        if (!isAnalyticsEnabled) return;

        const url = searchParams.toString()
            ? `${pathname}?${searchParams.toString()}`
            : pathname;

        capture("$pageview", {
            $current_url: window.location.origin + url,
            path: pathname,
            referrer: document.referrer || undefined,
            utm_source: searchParams.get("utm_source") || undefined,
            utm_medium: searchParams.get("utm_medium") || undefined,
            utm_campaign: searchParams.get("utm_campaign") || undefined,
        });
    }, [pathname, searchParams, capture]);

    return <>{children}</>;
}
