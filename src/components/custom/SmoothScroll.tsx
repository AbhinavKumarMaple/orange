"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scroll is desktop-only.
 *
 * Why:
 *  - ~20KB of JS + a permanent requestAnimationFrame loop is a direct INP
 *    and TBT tax on mobile, where native momentum scrolling is already
 *    smooth and users expect it.
 *  - Smooth-scroll libraries regularly fight with mobile scroll-anchoring
 *    and pull-to-refresh, producing worse UX than stock.
 *
 * Implementation: gate by `pointer: fine` (mouse / trackpad) and dynamic-
 * import the Lenis module so touch-primary devices never download it.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (!window.matchMedia("(pointer: fine)").matches) return;
        let cleanup: (() => void) | undefined;

        (async () => {
            const { default: Lenis } = await import("lenis");
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
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
    }, []);

    return <>{children}</>;
}
