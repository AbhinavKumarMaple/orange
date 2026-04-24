"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { slideDown, createTransition, stagger } from "@/lib/motion";
import { colors } from "@/lib/colors";

/**
 * Navigation links are defined once and rendered in two places:
 *  1. An always-mounted <nav> for crawlers/screen readers (visually hidden).
 *  2. The animated visual overlay that shows when the menu is open.
 *
 * Keeping a DOM-resident copy ensures Googlebot discovers /projects, /blog,
 * /contact even though it never clicks the hamburger button.
 */
const navLinks: { label: string; href: string }[] = [
    { label: "Home", href: "/" },
    { label: "Our work", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
];

interface NavOverlayProps {
    isOpen: boolean;
    onClose?: () => void;
}

export default function NavOverlay({ isOpen, onClose }: NavOverlayProps) {
    return (
        <>
            {/* Crawler/screen-reader accessible navigation — always in DOM. */}
            <nav aria-label="Primary" className="sr-only">
                <ul>
                    {navLinks.map((link) => (
                        <li key={`sr-${link.href}`}>
                            <Link href={link.href}>{link.label}</Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Visual overlay — animated, shown only when hamburger is open. */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-30 flex items-center justify-center"
                        style={{ backgroundColor: colors.blue }}
                        initial={slideDown.hidden}
                        animate={slideDown.visible}
                        exit={slideDown.hidden}
                        transition={createTransition({ duration: "slow", ease: "snappy" })}
                    >
                        <nav aria-label="Primary" className="flex flex-col items-center gap-2">
                            {navLinks.map((link, i) => (
                                <div key={link.href} className="overflow-hidden">
                                    <motion.div
                                        initial={{ y: "-100%" }}
                                        animate={{ y: 0 }}
                                        exit={{ y: "-100%" }}
                                        transition={createTransition({
                                            duration: "medium",
                                            ease: "snappy",
                                            delay: i * stagger.normal,
                                        })}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={onClose}
                                            className="block text-4xl md:text-5xl font-medium tracking-tight hover:opacity-70 transition-opacity py-1"
                                            style={{ color: colors.light }}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                </div>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
