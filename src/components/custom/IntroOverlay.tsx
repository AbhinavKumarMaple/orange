"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    slideUp,
    overlayExit,
    createTransition,
    introTiming,
} from "@/lib/motion";

export default function IntroOverlay() {
    const [showText, setShowText] = useState(false);
    const [dismiss, setDismiss] = useState(false);

    useEffect(() => {
        const textTimer = setTimeout(() => setShowText(true), introTiming.textAppear);
        const dismissTimer = setTimeout(() => setDismiss(true), introTiming.dismiss);

        return () => {
            clearTimeout(textTimer);
            clearTimeout(dismissTimer);
        };
    }, []);

    return (
        <AnimatePresence>
            {!dismiss && (
                <motion.div
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center"
                    style={{ backgroundColor: "#2E7EB5" }}
                    {...overlayExit}
                    transition={createTransition({ duration: "slow", ease: "snappy" })}
                >
                    <div className="overflow-hidden">
                        <motion.h1
                            className="text-white text-3xl md:text-4xl font-light tracking-wide"
                            initial={slideUp.hidden}
                            animate={showText ? slideUp.visible : slideUp.hidden}
                            transition={createTransition({ duration: "medium", ease: "snappy" })}
                        >
                            Nori Studio<sup className="text-sm align-super">®</sup>
                        </motion.h1>
                    </div>

                    <div className="overflow-hidden mt-2">
                        <motion.p
                            className="text-white/70 text-sm md:text-base font-light tracking-wide"
                            initial={slideUp.hidden}
                            animate={showText ? slideUp.visible : slideUp.hidden}
                            transition={createTransition({
                                duration: "medium",
                                ease: "snappy",
                                delay: introTiming.subtitleOffset,
                            })}
                        >
                            Creative design studio from Canada
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
