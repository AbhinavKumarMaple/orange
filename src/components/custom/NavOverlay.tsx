"use client";

import { motion, AnimatePresence } from "motion/react";
import { slideDown, createTransition, stagger } from "@/lib/motion";
import { colors } from "@/lib/colors";
import { useRouter } from "next/navigation";

const navLinks = [
    { label: "Home", section: "Hero" },
    { label: "Our work", href: "/projects" },
    { label: "About us", section: "Why Choose Us" },
    { label: "Contact", section: "Contact" },
    { label: "Blog", href: "/blog" },
];

interface NavOverlayProps {
    isOpen: boolean;
    onClose?: () => void;
}

export default function NavOverlay({ isOpen, onClose }: NavOverlayProps) {
    const router = useRouter();

    function handleClick(link: (typeof navLinks)[number]) {
        if (link.href) {
            router.push(link.href);
            onClose?.();
            return;
        }
        // If on homepage, scroll directly; otherwise navigate there first
        if (window.location.pathname === "/") {
            const el = document.querySelector(`[data-section="${link.section}"]`);
            if (el) {
                onClose?.();
                setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 300);
            }
        } else {
            onClose?.();
            router.push(`/#${link.section}`);
        }
    }

    return (
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
                    <nav className="flex flex-col items-center gap-2">
                        {navLinks.map((link, i) => (
                            <div key={link.label} className="overflow-hidden">
                                <motion.button
                                    type="button"
                                    onClick={() => handleClick(link)}
                                    className="block text-4xl md:text-5xl font-medium tracking-tight hover:opacity-70 transition-opacity py-1 cursor-pointer"
                                    style={{ color: colors.light, background: "none", border: "none" }}
                                    initial={{ y: "-100%" }}
                                    animate={{ y: 0 }}
                                    exit={{ y: "-100%" }}
                                    transition={createTransition({
                                        duration: "medium",
                                        ease: "snappy",
                                        delay: i * stagger.normal,
                                    })}
                                >
                                    {link.label}
                                </motion.button>
                            </div>
                        ))}
                    </nav>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
