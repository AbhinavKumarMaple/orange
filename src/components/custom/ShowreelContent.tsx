"use client";

import { motion } from "motion/react";
import { fadeUp, createTransition } from "@/lib/motion";
import { colors } from "@/lib/colors";

export interface ShowreelData {
    label: string;
    heading: string;
    description: string;
    video: string;
    aspectRatio: string;
}

const FALLBACK: ShowreelData = {
    label: "//02 Showreel",
    heading: "See Our Work\nIn Motion",
    description:
        "Experience a fast showcase of our best projects, highlighting bold design, seamless strategy, and measurable impact.",
    video: "https://framerusercontent.com/assets/3BDoGQqUun8oJGATqjDVryyVGRc.mp4",
    aspectRatio: "1841/1050",
};

export default function ShowreelContent({ data }: { data?: ShowreelData | null }) {
    const d = data ?? FALLBACK;

    return (
        <div className="px-5 sm:px-8 pt-16 pb-0">
            {/* Label + heading row — stacks on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                <div>
                    <motion.p
                        className="font-mono font-medium mb-3"
                        style={{
                            color: colors.blue,
                            fontSize: "clamp(14px, 2vw, 20px)",
                            lineHeight: "26px",
                            letterSpacing: "-0.4px",
                        }}
                        initial={fadeUp.hidden}
                        whileInView={fadeUp.visible}
                        viewport={{ once: true }}
                        transition={createTransition({ duration: "medium", ease: "snappy" })}
                    >
                        {d.label}
                    </motion.p>

                    <div className="overflow-hidden">
                        <motion.h2
                            className="font-sans font-medium uppercase whitespace-pre-line"
                            style={{
                                color: colors.dark,
                                fontSize: "clamp(48px, 7vw, 88px)",
                                lineHeight: "1.1",
                                letterSpacing: "-0.04em",
                            }}
                            initial={{ y: "100%" }}
                            whileInView={{ y: 0 }}
                            viewport={{ once: true }}
                            transition={createTransition({ duration: "slow", ease: "snappy", delay: "tiny" })}
                        >
                            {d.heading}
                        </motion.h2>
                    </div>
                </div>

                <motion.p
                    className="font-sans font-normal sm:self-end sm:text-right"
                    style={{
                        color: colors.dark,
                        fontSize: "clamp(14px, 1.5vw, 20px)",
                        lineHeight: "1.4",
                        letterSpacing: "-0.6px",
                        maxWidth: 380,
                        opacity: 0.6,
                    }}
                    initial={fadeUp.hidden}
                    whileInView={fadeUp.visible}
                    viewport={{ once: true }}
                    transition={createTransition({ duration: "medium", ease: "gentle", delay: "short" })}
                >
                    {d.description}
                </motion.p>
            </div>

            {d.video && (
                <motion.div
                    className="relative overflow-hidden w-full"
                    style={{
                        borderRadius: 8,
                        aspectRatio: (d.aspectRatio || "1841/1050").replace("/", " / "),
                    }}
                    initial={fadeUp.hidden}
                    whileInView={fadeUp.visible}
                    viewport={{ once: true }}
                    transition={createTransition({ duration: "slow", ease: "snappy", delay: "short" })}
                >
                    <video
                        key={d.video}
                        src={d.video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </motion.div>
            )}
        </div>
    );
}
