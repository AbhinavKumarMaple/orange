"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    slideUp,
    overlayExit,
    createTransition,
    introTiming,
} from "@/lib/motion";
import { colors } from "@/lib/colors";

export default function IntroOverlay() {
    const [showText, setShowText] = useState(false);
    const [dismiss, setDismiss] = useState(false);
    const [skip, setSkip] = useState(true); // start hidden, reveal only if first visit

    useEffect(() => {
        const alreadySeen = sessionStorage.getItem("intro_seen");
        if (alreadySeen) {
            setDismiss(true);
            return;
        }
        sessionStorage.setItem("intro_seen", "1");
        setSkip(false);

        const textTimer = setTimeout(() => setShowText(true), introTiming.textAppear);
        const dismissTimer = setTimeout(() => setDismiss(true), introTiming.dismiss);

        return () => {
            clearTimeout(textTimer);
            clearTimeout(dismissTimer);
        };
    }, []);

    if (skip) return null;

    return (
        <AnimatePresence>
            {!dismiss && (
                <motion.div
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center"
                    style={{ backgroundColor: colors.blue }}
                    {...overlayExit}
                    transition={createTransition({ duration: "slow", ease: "snappy" })}
                >
                    <div className="overflow-hidden">
                        <motion.h1
                            className="text-3xl md:text-4xl font-medium tracking-tight"
                            style={{ color: colors.light }}
                            initial={slideUp.hidden}
                            animate={showText ? slideUp.visible : slideUp.hidden}
                            transition={createTransition({ duration: "medium", ease: "snappy" })}
                        >
                            Orange Studios<sup className="text-sm align-super">®</sup>
                        </motion.h1>
                    </div>

                    <div className="overflow-hidden mt-2">
                        <motion.p
                            className="text-sm md:text-base font-normal"
                            style={{ color: colors.light, opacity: 0.7, letterSpacing: "-0.48px" }}
                            initial={slideUp.hidden}
                            animate={showText ? slideUp.visible : slideUp.hidden}
                            transition={createTransition({
                                duration: "medium",
                                ease: "snappy",
                                delay: introTiming.subtitleOffset,
                            })}
                        >
                            Creative design studio
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
