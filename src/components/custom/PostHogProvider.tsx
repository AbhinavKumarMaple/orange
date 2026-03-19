"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog, { initPostHog } from "@/lib/posthog";

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize PostHog once
    useEffect(() => {
        initPostHog();
    }, []);

    // Track page views on route change
    useEffect(() => {
        if (!posthog.__loaded) return;

        const url = searchParams.toString()
            ? `${pathname}?${searchParams.toString()}`
            : pathname;

        posthog.capture("$pageview", {
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
