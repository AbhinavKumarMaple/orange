"use client";

import { motion } from "motion/react";
import { fadeUp, createTransition } from "@/lib/motion";
import { colors } from "@/lib/colors";

export default function ShowreelContent() {
    return (
        <div className="px-8 pt-16 pb-0">
            {/* Label + heading row */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    {/* //02 Showreel */}
                    <motion.p
                        className="font-mono font-medium mb-3"
                        style={{
                            color: colors.blue,
                            fontSize: 20,
                            lineHeight: "26px",
                            letterSpacing: "-0.4px",
                        }}
                        initial={fadeUp.hidden}
                        whileInView={fadeUp.visible}
                        viewport={{ once: true }}
                        transition={createTransition({ duration: "medium", ease: "snappy" })}
                    >
            //02 Showreel
                    </motion.p>

                    {/* SEE OUR WORK IN MOTION */}
                    <div className="overflow-hidden">
                        <motion.h2
                            className="font-sans font-medium uppercase"
                            style={{
                                color: "rgb(6, 18, 24)",
                                fontSize: 88,
                                lineHeight: "96.8px",
                                letterSpacing: "-3.52px",
                            }}
                            initial={{ y: "100%" }}
                            whileInView={{ y: 0 }}
                            viewport={{ once: true }}
                            transition={createTransition({ duration: "slow", ease: "snappy", delay: "tiny" })}
                        >
                            See Our Work
                            <br />
                            In Motion
                        </motion.h2>
                    </div>
                </div>

                {/* Description — right aligned, max-width 380px */}
                <motion.p
                    className="font-sans font-normal self-end text-right"
                    style={{
                        color: "rgb(6, 18, 24)",
                        fontSize: 20,
                        lineHeight: "26px",
                        letterSpacing: "-0.6px",
                        maxWidth: 380,
                        opacity: 0.6,
                    }}
                    initial={fadeUp.hidden}
                    whileInView={fadeUp.visible}
                    viewport={{ once: true }}
                    transition={createTransition({ duration: "medium", ease: "gentle", delay: "short" })}
                >
                    Experience a fast showcase of our best projects, highlighting bold design, seamless strategy, and measurable impact.
                </motion.p>
            </div>

            {/* Video — left=32, right=47 from viewport, border-radius 12px */}
            <motion.div
                className="overflow-hidden"
                style={{ borderRadius: 12 }}
                initial={fadeUp.hidden}
                whileInView={fadeUp.visible}
                viewport={{ once: true }}
                transition={createTransition({ duration: "slow", ease: "snappy", delay: "short" })}
            >
                <video
                    src="https://framerusercontent.com/assets/3BDoGQqUun8oJGATqjDVryyVGRc.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full"
                    style={{ display: "block", aspectRatio: "1841 / 1050" }}
                />
            </motion.div>
        </div>
    );
}
