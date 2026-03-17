"use client";

import { motion, AnimatePresence } from "motion/react";
import { slideDown, createTransition, stagger } from "@/lib/motion";

const navLinks = ["Home", "Our work", "About us", "Contact", "Blog"];

interface NavOverlayProps {
    isOpen: boolean;
}

export default function NavOverlay({ isOpen }: NavOverlayProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-30 flex items-center justify-center"
                    style={{ backgroundColor: "#2E7EB5" }}
                    initial={slideDown.hidden}
                    animate={slideDown.visible}
                    exit={slideDown.hidden}
                    transition={createTransition({ duration: "slow", ease: "snappy" })}
                >
                    <nav className="flex flex-col items-center gap-2">
                        {navLinks.map((link, i) => (
                            <div key={link} className="overflow-hidden">
                                <motion.a
                                    href="#"
                                    className="block text-white text-4xl md:text-5xl font-light tracking-wide hover:opacity-70 transition-opacity py-1"
                                    initial={{ y: "-100%" }}
                                    animate={{ y: 0 }}
                                    exit={{ y: "-100%" }}
                                    transition={createTransition({
                                        duration: "medium",
                                        ease: "snappy",
                                        delay: i * stagger.normal,
                                    })}
                                >
                                    {link}
                                </motion.a>
                            </div>
                        ))}
                    </nav>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
