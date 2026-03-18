"use client";

import { useRef, useState, createContext, useContext, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

interface TransitionContextValue {
    navigate: (href: string) => void;
    isExiting: boolean;
}

const TransitionContext = createContext<TransitionContextValue>({ navigate: () => { }, isExiting: false });

export function usePageTransition() {
    return useContext(TransitionContext);
}

export default function PageTransitionProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [phase, setPhase] = useState<"in" | "out">("in");
    const [isExiting, setIsExiting] = useState(false);
    const pendingHref = useRef<string | null>(null);

    const navigate = useCallback((href: string) => {
        pendingHref.current = href;
        setIsExiting(true);   // content starts sliding up
        setPhase("in");
        setVisible(true);     // overlay starts rising from below
    }, []);

    const handleAnimationComplete = useCallback(() => {
        if (phase === "in") {
            if (pendingHref.current) {
                router.push(pendingHref.current);
                pendingHref.current = null;
            }
            setIsExiting(false);
            setTimeout(() => setPhase("out"), 80);
        } else {
            setVisible(false);
        }
    }, [phase, router]);

    return (
        <TransitionContext.Provider value={{ navigate, isExiting }}>
            {/* Page content wrapper — slides up on exit */}
            <motion.div
                animate={isExiting ? { y: -60 } : { y: 0 }}
                transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
            >
                {children}
            </motion.div>

            {/* Overlay — rises from below, then exits upward */}
            <AnimatePresence>
                {visible && (
                    <motion.div
                        key="page-overlay"
                        className="fixed inset-0 z-9999 pointer-events-none"
                        style={{ backgroundColor: "#F0F5F9" }}
                        initial={{ y: "100%" }}
                        animate={{ y: phase === "in" ? "0%" : "-100%" }}
                        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                        onAnimationComplete={handleAnimationComplete}
                    />
                )}
            </AnimatePresence>
        </TransitionContext.Provider>
    );
}
