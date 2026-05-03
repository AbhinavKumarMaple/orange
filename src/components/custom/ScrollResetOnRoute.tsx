"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Force-scrolls to the top whenever the route changes to anything other
 * than the landing page. The browser's default scroll restoration keeps
 * leaking the previous scroll position when re-entering /projects/[slug]
 * etc. via back+forward, so we override it for inner pages.
 *
 * The landing page (`/`) is intentionally excluded so that going *back*
 * to home from an inner page still lands you where you were when you
 * left — that's the desired behavior the user called out.
 */
export default function ScrollResetOnRoute() {
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === "/") return;

        // Disable native restoration globally so the browser doesn't beat
        // us to the punch with a flash of the saved position. Re-enabling
        // it for `/` is unnecessary because our useEffect already skips
        // that path; manual+nothing on `/` means React will not move the
        // scroll, and natural in-page anchors / bfcache still work.
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        // Lenis (smooth-scroll lib) observes documentElement.scrollTop, so
        // a native scrollTo is sufficient — Lenis syncs to it on next RAF.
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname]);

    return null;
}
