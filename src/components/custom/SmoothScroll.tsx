"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Lenis smooth scroll for the public marketing site.
 *
 * Disabled on:
 *  - touch / coarse-pointer devices (native momentum scrolling is better)
 *  - the CRM and sign-in surfaces, which use internal scroll containers
 *    (overflow-y-auto). Lenis hooks wheel events on `window` and
 *    preventDefaults them, which swallows the events before they reach
 *    those inner containers — the result is "scroll wheel does nothing,
 *    user has to grab the scrollbar". Marketing pages have no inner
 *    scroll containers so they're unaffected.
 *
 * Lenis is dynamic-imported so devices that opt out never download it.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Surfaces that have their own internal scroll containers.
    const internalScrollRoute = pathname.startsWith("/crm") || pathname.startsWith("/sign-in");

    useEffect(() => {
        if (internalScrollRoute) return;
        if (!window.matchMedia("(pointer: fine)").matches) return;
        let cleanup: (() => void) | undefined;

        (async () => {
            const { default: Lenis } = await import("lenis");
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                // Hand off in-page anchor clicks to Lenis so smooth-scroll
                // doesn't fight the browser's native instant-jump.
                anchors: true,
            });

            let rafId = 0;
            function raf(time: number) {
                lenis.raf(time);
                rafId = requestAnimationFrame(raf);
            }
            rafId = requestAnimationFrame(raf);

            cleanup = () => {
                cancelAnimationFrame(rafId);
                lenis.destroy();
            };
        })();

        return () => cleanup?.();
    }, [internalScrollRoute]);

    return <>{children}</>;
}
