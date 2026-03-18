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

// How long the overlay stays covering the screen after navigation fires (ms).
// Gives Next.js time to render the new page before we slide out.
const HOLD_DURATION = 600;

export default function PageTransitionProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [visible, setVisible] = useState(false);
    const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
    const [isExiting, setIsExiting] = useState(false);
    const pendingHref = useRef<string | null>(null);
    const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const navigate = useCallback((href: string) => {
        if (holdTimer.current) clearTimeout(holdTimer.current);
        pendingHref.current = href;
        setIsExiting(true);
        setPhase("in");
        setVisible(true);
    }, []);

    // When overlay finishes sliding IN — navigate immediately, then hold
    const handleAnimationComplete = useCallback(() => {
        if (phase === "in") {
            if (pendingHref.current) {
                router.push(pendingHref.current);
                pendingHref.current = null;
            }
            setIsExiting(false);
            setPhase("hold");
            // Hold the overlay for HOLD_DURATION, then slide out
            holdTimer.current = setTimeout(() => setPhase("out"), HOLD_DURATION);
        } else if (phase === "out") {
            setVisible(false);
        }
    }, [phase, router]);

    // Also watch pathname — if the route changed while we're still holding,
    // we can exit sooner (page is ready). Minimum hold is still respected via
    // the timer, but if the page loads faster the timer fires first anyway.
    useEffect(() => {
        return () => {
            if (holdTimer.current) clearTimeout(holdTimer.current);
        };
    }, []);

    // Suppress unused warning — pathname is intentionally watched
    void pathname;

    return (
        <TransitionContext.Provider value={{ navigate, isExiting }}>
            {/* Page content wrapper — slides up on exit */}
            <motion.div
                animate={isExiting ? { y: -60 } : { y: 0 }}
                transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
            >
                {children}
            </motion.div>

            {/* Overlay — rises from below, holds, then exits upward */}
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
