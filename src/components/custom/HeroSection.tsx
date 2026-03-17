"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { slideUp, fadeUp, createTransition } from "@/lib/motion";
import Navbar from "./Navbar";
import NavOverlay from "./NavOverlay";

export default function HeroSection() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <section
            className="relative h-screen w-full overflow-hidden"
            style={{ backgroundColor: "#2E7EB5" }}
        >
            <Navbar
                isMenuOpen={menuOpen}
                onMenuToggle={() => setMenuOpen((prev) => !prev)}
            />
            <NavOverlay isOpen={menuOpen} />

            {/* Giant title */}
            <div className="absolute inset-0 flex items-start px-6 md:px-10 pt-16 md:pt-20">
                <div className="overflow-hidden">
                    <motion.h1
                        className="text-white text-[15vw] md:text-[12vw] font-bold leading-[0.9] tracking-tight"
                        initial={slideUp.hidden}
                        animate={slideUp.visible}
                        transition={createTransition({ duration: "slow", ease: "snappy", delay: "long" })}
                    >
                        Nori Studio
                    </motion.h1>
                </div>
            </div>

            {/* Since 2019 */}
            <motion.p
                className="absolute left-6 md:left-10 top-[55%] text-white/70 text-sm font-light tracking-wider"
                style={{ fontFamily: "monospace" }}
                {...fadeUp}
                initial={fadeUp.hidden}
                animate={fadeUp.visible}
                transition={createTransition({ duration: "medium", ease: "gentle", delay: "xlong" })}
            >
                Since 2019
            </motion.p>

            {/* Bottom left description */}
            <motion.p
                className="absolute left-6 md:left-10 bottom-8 md:bottom-10 text-white/80 text-sm md:text-base font-light leading-relaxed max-w-xs md:max-w-sm"
                initial={fadeUp.hidden}
                animate={fadeUp.visible}
                transition={createTransition({ duration: "medium", ease: "gentle", delay: "xlong" })}
            >
                We are a creative studio from Canada building
                brands and websites that stand out, scale
                with growth and deliver measurable results.
            </motion.p>

            {/* Bottom right stats + CTA */}
            <div className="absolute right-6 md:right-10 bottom-8 md:bottom-10 flex flex-col items-end gap-3">
                <motion.div
                    className="flex flex-col items-end gap-1"
                    initial={fadeUp.hidden}
                    animate={fadeUp.visible}
                    transition={createTransition({ duration: "medium", ease: "gentle", delay: "xlong" })}
                >
                    <span className="text-white text-sm">
                        ★★★★★ 4.8/5
                    </span>
                    <span className="text-white/70 text-sm">
                        3.2x Average ROI
                    </span>
                </motion.div>

                <motion.a
                    href="#"
                    className="border border-white text-white text-sm px-5 py-2.5 rounded-full hover:bg-white hover:text-[#2E7EB5] transition-colors"
                    initial={fadeUp.hidden}
                    animate={fadeUp.visible}
                    transition={createTransition({ duration: "medium", ease: "gentle", delay: "xlong" })}
                >
                    Start your project
                </motion.a>
            </div>
        </section>
    );
}
