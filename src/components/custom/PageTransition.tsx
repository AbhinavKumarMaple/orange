"use client";

import { useRef, useState, createContext, useContext, useCallback, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

interface TransitionContextValue {
    navigate: (href: string) => void;
    isExiting: boolean;
}

const TransitionContext = createContext<TransitionContextValue>({ navigate: () => { }, isExiting: false });

export function usePageTransition() {
    return useContext(TransitionContext);
}

/**
 * Page transition flow:
 * 1. User clicks a link → router.push fires immediately to start loading
 * 2. Overlay slides in to cover the old page while Next.js fetches the new route
 * 3. Once the new pathname renders AND the overlay has fully covered the screen,
 *    the overlay slides out to reveal the new page
 */
export default function PageTransitionProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [visible, setVisible] = useState(false);
    const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
    const [isExiting, setIsExiting] = useState(false);

    const overlayFull = useRef(false);
    const pageReady = useRef(false);
    const targetHref = useRef<string | null>(null);
    const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prevPathname = useRef(pathname);

    // Minimum ms to hold the overlay once both conditions are met (prevents flash)
    const MIN_HOLD = 150;

    const startSlideOut = useCallback(() => {
        if (overlayFull.current && pageReady.current) {
            if (holdTimer.current) clearTimeout(holdTimer.current);
            holdTimer.current = setTimeout(() => {
                setIsExiting(false);
                setPhase("out");
            }, MIN_HOLD);
        }
    }, []);

    const navigate = useCallback((href: string) => {
        // Don't transition to the same page
        if (href === pathname) return;

        if (holdTimer.current) clearTimeout(holdTimer.current);
        overlayFull.current = false;
        pageReady.current = false;
        targetHref.current = href;

        // 1. Start loading the new page immediately
        router.push(href);

        // 2. Show the overlay animation while it loads
        setIsExiting(true);
        setPhase("in");
        setVisible(true);
    }, [router, pathname]);

    // Overlay animation complete handler
    const handleAnimationComplete = useCallback(() => {
        if (phase === "in") {
            setPhase("hold");
            overlayFull.current = true;
            startSlideOut();
        } else if (phase === "out") {
            // 3. Overlay has fully exited — clean up
            setVisible(false);
            overlayFull.current = false;
            pageReady.current = false;
            targetHref.current = null;
        }
    }, [phase, startSlideOut]);

    // Pathname changed → new page has rendered
    useEffect(() => {
        // Only react when pathname actually changes and we're in a transition
        if (pathname === prevPathname.current) return;
        prevPathname.current = pathname;

        if (!visible || !targetHref.current) return;

        pageReady.current = true;
        startSlideOut();
    }, [pathname, visible, startSlideOut]);

    useEffect(() => {
        return () => {
            if (holdTimer.current) clearTimeout(holdTimer.current);
        };
    }, []);

    return (
        <TransitionContext.Provider value={{ navigate, isExiting }}>
            <motion.div
                animate={isExiting ? { y: -60 } : { y: 0 }}
                transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
            >
                {children}
            </motion.div>

            <AnimatePresence>
                {visible && (
                    <motion.div
                        key="page-overlay"
                        className="fixed inset-0 z-[9999] pointer-events-none"
                        style={{ backgroundColor: "#F0F5F9" }}
                        initial={{ y: "100%" }}
                        animate={{ y: phase === "out" ? "-100%" : "0%" }}
                        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                        onAnimationComplete={handleAnimationComplete}
                    />
                )}
            </AnimatePresence>
        </TransitionContext.Provider>
    );
}
