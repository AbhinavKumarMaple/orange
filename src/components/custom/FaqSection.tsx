"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { colors } from "@/lib/colors";
import { easings, durations } from "@/lib/motion";

const faqs = [
    {
        q: "How long does a typical project take?",
        a: "Most brand projects take 4-6 weeks, websites take 6-8 weeks, and marketing campaigns launch within 2-3 weeks.",
    },
    {
        q: "What does your process look like?",
        a: "We usually start with a discovery call to understand your goals. Then we move into strategy and initial concepts, refine them through feedback rounds, and deliver a polished final product. Every step is transparent so you always know where we are in the process.",
    },
    {
        q: "What's included in ongoing support?",
        a: "All projects include 30 days of support post-launch, including updates and technical assistance.",
    },
    {
        q: "How much should I budget for a project?",
        a: "Projects typically range from $8,000 to $25,000 depending on scope. We provide detailed quotes after discovery calls.",
    },
    {
        q: "What if I'm not happy with initial concepts?",
        a: "We include revision rounds in every project and won't proceed until you're satisfied with the direction.",
    },
    {
        q: "Do you offer payment plans?",
        a: "Yes, most projects can be split into 2-3 payments aligned with project milestones.",
    },
];

const transition = { duration: durations.fast, ease: easings.snappy };

export default function FaqSection() {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <section style={{ backgroundColor: colors.background }} className="px-8 pt-16 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                {/* Left */}
                <div>
                    <p
                        className="font-mono font-medium mb-3"
                        style={{ color: colors.blue, fontSize: 20, lineHeight: "26px", letterSpacing: "-0.4px" }}
                    >
            //010 FAQ
                    </p>
                    <h2
                        className="font-sans font-medium uppercase mb-4"
                        style={{ color: "rgb(6,18,24)", fontSize: 88, lineHeight: "96.8px", letterSpacing: "-3.52px" }}
                    >
                        Questions we<br />often get
                    </h2>
                    <p
                        className="font-sans font-normal mb-6"
                        style={{ color: "rgb(6,18,24)", fontSize: 16, lineHeight: "24px", letterSpacing: "-0.32px", opacity: 0.6, maxWidth: 280 }}
                    >
                        Every project timeline is confirmed during onboarding, so you always know what to expect.
                    </p>
                    <Link
                        href="#"
                        className="inline-block px-5 py-2.5 text-[14px] font-medium text-white rounded-lg"
                        style={{ backgroundColor: colors.blue }}
                    >
                        Start your project
                    </Link>
                </div>

                {/* Right — accordion */}
                <div className="flex flex-col gap-3">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => setOpen(open === i ? null : i)}
                                className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
                            >
                                <span
                                    className="font-sans pr-8"
                                    style={{ color: "rgb(6,18,24)", fontSize: 20, fontWeight: 500, lineHeight: "26px", letterSpacing: "-0.6px" }}
                                >
                                    {faq.q}
                                </span>
                                {/* Spinning + icon */}
                                <motion.span
                                    animate={{ rotate: open === i ? 45 : 0 }}
                                    transition={transition}
                                    className="shrink-0 text-[22px] font-light leading-none select-none"
                                    style={{ color: colors.blue, display: "inline-block" }}
                                >
                                    +
                                </motion.span>
                            </button>

                            {/* Smooth height expand */}
                            <AnimatePresence initial={false}>
                                {open === i && (
                                    <motion.div
                                        key="content"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={transition}
                                        style={{ overflow: "hidden" }}
                                    >
                                        <div className="px-6 pb-5">
                                            <p
                                                className="font-sans"
                                                style={{ color: "rgb(6,18,24)", fontSize: 16, fontWeight: 400, lineHeight: "20.8px", letterSpacing: "-0.48px", opacity: 0.6 }}
                                            >
                                                {faq.a}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
