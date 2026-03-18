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

// Minimum ms to hold the overlay after the new page is ready (prevents flash)
const MIN_HOLD = 300;

export default function PageTransitionProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [visible, setVisible] = useState(false);
    const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
    const [isExiting, setIsExiting] = useState(false);

    // Track whether each condition is met before sliding out
    const overlayFull = useRef(false);   // overlay has fully covered the screen
    const pageReady = useRef(false);     // new pathname has rendered
    const pendingHref = useRef<string | null>(null);
    const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startSlideOut = useCallback(() => {
        if (overlayFull.current && pageReady.current) {
            if (holdTimer.current) clearTimeout(holdTimer.current);
            holdTimer.current = setTimeout(() => setPhase("out"), MIN_HOLD);
        }
    }, []);

    const navigate = useCallback((href: string) => {
        if (holdTimer.current) clearTimeout(holdTimer.current);
        pendingHref.current = href;
        overlayFull.current = false;
        pageReady.current = false;
        setIsExiting(true);
        setPhase("in");
        setVisible(true);
    }, []);

    // Overlay animation complete handler
    const handleAnimationComplete = useCallback(() => {
        if (phase === "in") {
            // Overlay is now fully covering the screen — fire navigation
            if (pendingHref.current) {
                router.push(pendingHref.current);
                pendingHref.current = null;
            }
            setIsExiting(false);
            setPhase("hold");
            overlayFull.current = true;
            startSlideOut();
        } else if (phase === "out") {
            setVisible(false);
            overlayFull.current = false;
            pageReady.current = false;
        }
    }, [phase, router, startSlideOut]);

    // Pathname changed = new page has rendered, safe to slide out
    useEffect(() => {
        if (!visible) return;
        pageReady.current = true;
        startSlideOut();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    useEffect(() => {
        return () => {
            if (holdTimer.current) clearTimeout(holdTimer.current);
        };
    }, []);

    return (
        <TransitionContext.Provider value={{ navigate, isExiting }}>
            {/* Page content wrapper — slides up on exit */}
            <motion.div
                animate={isExiting ? { y: -60 } : { y: 0 }}
                transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
            >
                {children}
            </motion.div>

            {/* Overlay — rises from below, holds until new page is ready, then exits upward */}
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
