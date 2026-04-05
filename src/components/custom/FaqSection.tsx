"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { colors } from "@/lib/colors";
import { easings, durations } from "@/lib/motion";
import Button from "./Button";
import type { faqs } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Faq = InferSelectModel<typeof faqs>;

interface Props {
    faqs: Faq[];
}

const transition = { duration: durations.fast, ease: easings.snappy };

export default function FaqSection({ faqs }: Props) {
    const [open, setOpen] = useState<number | null>(null);
    const { capture } = useAnalytics();

    return (
        <section data-section="FAQ" style={{ backgroundColor: colors.background }} className="px-5 sm:px-8 pt-16 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                {/* Left */}
                <div>
                    <p
                        className="font-mono font-medium mb-3"
                        style={{ color: colors.blue, fontSize: "clamp(14px, 2vw, 20px)", lineHeight: "26px", letterSpacing: "-0.4px" }}
                    >
                        //010 FAQ
                    </p>
                    <h2
                        className="font-sans font-medium uppercase mb-4"
                        style={{ color: "rgb(6,18,24)", fontSize: "clamp(48px, 7vw, 88px)", lineHeight: "1.1", letterSpacing: "-0.04em" }}
                    >
                        Questions we<br />often get
                    </h2>
                    <p
                        className="font-sans font-normal mb-6"
                        style={{ color: "rgb(6,18,24)", fontSize: "clamp(14px, 1.4vw, 16px)", lineHeight: "1.5", letterSpacing: "-0.32px", opacity: 0.6, maxWidth: 280 }}
                    >
                        Every project timeline is confirmed during onboarding, so you always know what to expect.
                    </p>
                    <Button href="#" variant="primary" style={{ fontSize: 14 }}>
                        Start your project
                    </Button>
                </div>

                {/* Right — accordion */}
                <div className="flex flex-col gap-3">
                    {faqs.map((faq, i) => (
                        <div key={faq.id} className="bg-white border border-gray-100 overflow-hidden" style={{ borderRadius: 8 }}>
                            <button
                                onClick={() => {
                                    const next = open === i ? null : i;
                                    setOpen(next);
                                    if (next !== null) {
                                        capture("faq_opened", {
                                            question: faq.question,
                                            faq_index: i,
                                            path: window.location.pathname,
                                        });
                                    }
                                }}
                                className="w-full flex items-center justify-between px-5 sm:px-6 py-5 text-left cursor-pointer"
                            >
                                <span
                                    className="font-sans pr-6"
                                    style={{ color: "rgb(6,18,24)", fontSize: "clamp(15px, 1.5vw, 20px)", fontWeight: 500, lineHeight: "1.4", letterSpacing: "-0.6px" }}
                                >
                                    {faq.question}
                                </span>
                                <motion.span
                                    animate={{ rotate: open === i ? 45 : 0 }}
                                    transition={transition}
                                    className="shrink-0 text-[22px] font-light leading-none select-none"
                                    style={{ color: colors.blue, display: "inline-block" }}
                                >
                                    +
                                </motion.span>
                            </button>
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
                                        <div className="px-5 sm:px-6 pb-5">
                                            <p
                                                className="font-sans"
                                                style={{ color: "rgb(6,18,24)", fontSize: 16, fontWeight: 400, lineHeight: "20.8px", letterSpacing: "-0.48px", opacity: 0.6 }}
                                            >
                                                {faq.answer}
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
