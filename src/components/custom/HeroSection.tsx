"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { slideUp, fadeUp, createTransition } from "@/lib/motion";
import { colors } from "@/lib/colors";
import Navbar from "./Navbar";
import NavOverlay from "./NavOverlay";
import StarRating from "./StarRating";
import Button from "./Button";

export default function HeroSection() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <section
            data-section="Hero"
            className="relative w-full overflow-hidden"
            style={{ backgroundColor: colors.blue, height: "100svh" }}
        >
            {/* Full-bleed background image */}
            <Image
                src="https://framerusercontent.com/images/PvGkgeiMfJS3ppQqn74U9dVhHg.png"
                alt=""
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority
            />
            {/* Blue tint overlay image */}
            <Image
                src="https://framerusercontent.com/images/m4n0B2QJMVZOeIGk5AiOqozWVg.png"
                alt=""
                fill
                className="object-cover object-center"
                sizes="100vw"
            />

            <Navbar
                isMenuOpen={menuOpen}
                onMenuToggle={() => setMenuOpen((prev) => !prev)}
            />
            <NavOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

            {/* H1 + Since 2019 — stacked naturally */}
            <div className="absolute overflow-hidden" style={{ top: 56, left: 0, right: 0 }}>
                <motion.h1
                    className="font-medium leading-none pl-4 lg:pl-0 lg:text-center"
                    style={{
                        fontSize: "clamp(68px, 22vw, 280px)",
                        color: colors.light,
                        letterSpacing: "-0.05em",
                        lineHeight: "1.03",
                    }}
                    initial={slideUp.hidden}
                    animate={slideUp.visible}
                    transition={createTransition({ duration: "slow", ease: "snappy", delay: "long" })}
                >
                    Orange Studios
                </motion.h1>
                {/* Mobile only — flows below title */}
                <motion.p
                    className="font-mono font-medium pl-4 mt-2 lg:hidden"
                    style={{ color: colors.light, fontSize: "clamp(14px, 2vw, 20px)", letterSpacing: "-0.4px" }}
                    initial={fadeUp.hidden}
                    animate={fadeUp.visible}
                    transition={createTransition({ duration: "medium", ease: "gentle", delay: "xlong" })}
                >
                    Since 2019
                </motion.p>
            </div>

            {/* Desktop only — absolute left, vertically centered */}
            <motion.p
                className="absolute font-mono font-medium hidden lg:block"
                style={{
                    top: "35%",
                    left: "clamp(20px, 4vw, 57px)",
                    color: colors.light,
                    fontSize: "clamp(14px, 2vw, 20px)",
                    lineHeight: "26px",
                    letterSpacing: "-0.4px",
                }}
                initial={fadeUp.hidden}
                animate={fadeUp.visible}
                transition={createTransition({ duration: "medium", ease: "gentle", delay: "xlong" })}
            >
                Since 2019
            </motion.p>

            {/* Mobile: bottom content stacked left-aligned */}
            <motion.div
                className="absolute flex flex-col"
                style={{
                    bottom: "clamp(16px, 4vh, 48px)",
                    left: "clamp(20px, 4vw, 57px)",
                    right: "clamp(20px, 4vw, 57px)",
                }}
                initial={fadeUp.hidden}
                animate={fadeUp.visible}
                transition={createTransition({ duration: "medium", ease: "gentle", delay: "xlong" })}
            >
                {/* Description */}
                <p
                    className="font-medium mb-5"
                    style={{
                        color: colors.light,
                        fontSize: "clamp(15px, 2vw, 20px)",
                        lineHeight: "1.4",
                        letterSpacing: "-0.6px",
                        maxWidth: 448,
                    }}
                >
                    We are a creative studio from Canada building brands and websites that stand out, scale with growth and deliver measurable results.
                </p>

                {/* CTA + stats row */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <Button
                        href="#"
                        variant="light"
                        data-track-click="hero_start_project"
                        style={{ fontSize: 16, whiteSpace: "nowrap", paddingLeft: 24, paddingRight: 24, paddingTop: 10, paddingBottom: 10, alignSelf: "flex-start" }}
                    >
                        Start your project
                    </Button>

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <StarRating />
                            <span
                                className="font-normal"
                                style={{ color: colors.light, fontSize: 16, lineHeight: "20.8px", letterSpacing: "-0.48px" }}
                            >
                                4.8/5
                            </span>
                        </div>
                        <span
                            className="font-normal"
                            style={{ color: colors.light, fontSize: 16, lineHeight: "20.8px", letterSpacing: "-0.48px" }}
                        >
                            3.2x Average ROI
                        </span>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
