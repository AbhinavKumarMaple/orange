"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { slideUp, fadeUp, createTransition } from "@/lib/motion";
import { colors } from "@/lib/colors";
import Navbar from "./Navbar";
import NavOverlay from "./NavOverlay";
import StarRating from "./StarRating";

export default function HeroSection() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <section
            className="relative w-full overflow-hidden"
            style={{ backgroundColor: colors.blue, height: "100svh" }}
        >
            {/* Full-bleed background image */}
            <Image
                src="https://framerusercontent.com/images/PvGkgeiMfJS3ppQqn74U9dVhHg.png"
                alt=""
                fill
                className="object-cover object-center"
                priority
            />

            <Navbar
                isMenuOpen={menuOpen}
                onMenuToggle={() => setMenuOpen((prev) => !prev)}
            />
            <NavOverlay isOpen={menuOpen} />

            {/* H1 — top=56, left=37, nearly full width */}
            <div className="absolute overflow-hidden" style={{ top: 56, left: 37, right: 37 }}>
                <motion.h1
                    className="font-medium leading-none"
                    style={{
                        color: colors.light,
                        fontSize: "clamp(60px, 12.9vw, 247px)",
                        letterSpacing: "-0.05em",
                        lineHeight: "0.9",
                    }}
                    initial={slideUp.hidden}
                    animate={slideUp.visible}
                    transition={createTransition({ duration: "slow", ease: "snappy", delay: "long" })}
                >
                    Nori Studio
                </motion.h1>
            </div>

            {/* Since 2019 — ~43% down from top, left=57 */}
            <motion.p
                className="absolute font-mono font-medium"
                style={{
                    top: "43%",
                    left: 57,
                    color: colors.light,
                    fontSize: 20,
                    lineHeight: "26px",
                    letterSpacing: "-0.4px",
                }}
                initial={fadeUp.hidden}
                animate={fadeUp.visible}
                transition={createTransition({ duration: "medium", ease: "gentle", delay: "xlong" })}
            >
                Since 2019
            </motion.p>

            {/* Description — bottom=48, left=57, width=448 */}
            <motion.p
                className="absolute font-medium"
                style={{
                    bottom: 48,
                    left: 57,
                    width: 448,
                    color: colors.light,
                    fontSize: 20,
                    lineHeight: "26px",
                    letterSpacing: "-0.6px",
                }}
                initial={fadeUp.hidden}
                animate={fadeUp.visible}
                transition={createTransition({ duration: "medium", ease: "gentle", delay: "xlong" })}
            >
                We are a creative studio from Canada building brands and websites that stand out, scale with growth and deliver measurable results.
            </motion.p>

            {/* Bottom right — stars, ROI, CTA */}
            <motion.div
                className="absolute flex flex-col items-end"
                style={{ bottom: 21, right: 36 }}
                initial={fadeUp.hidden}
                animate={fadeUp.visible}
                transition={createTransition({ duration: "medium", ease: "gentle", delay: "xlong" })}
            >
                {/* Stars + 4.8/5 */}
                <div className="flex items-center gap-2 mb-1">
                    <StarRating />
                    <span
                        className="font-normal"
                        style={{ color: colors.light, fontSize: 16, lineHeight: "20.8px", letterSpacing: "-0.48px" }}
                    >
                        4.8/5
                    </span>
                </div>

                {/* 3.2x Average ROI */}
                <span
                    className="font-normal mb-3"
                    style={{ color: colors.light, fontSize: 16, lineHeight: "20.8px", letterSpacing: "-0.48px" }}
                >
                    3.2x Average ROI
                </span>

                {/* CTA — white bg, blue text, radius=10px, 138×36 */}
                <a
                    href="#"
                    className="flex items-center justify-center font-medium"
                    style={{
                        backgroundColor: "#ffffff",
                        color: colors.blue,
                        borderRadius: 10,
                        width: 138,
                        height: 36,
                        fontSize: 16,
                        letterSpacing: "-0.48px",
                    }}
                >
                    Start your project
                </a>
            </motion.div>
        </section>
    );
}
