"use client";

import { useState } from "react";
import { colors } from "@/lib/colors";
import SectionLayout from "./SectionLayout";

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

function Accordion() {
    const [open, setOpen] = useState<number | null>(1);

    return (
        <div className="flex flex-col w-full max-w-[700px]">
            {faqs.map((faq, i) => (
                <div key={i} className="border-t border-gray-200">
                    <button
                        onClick={() => setOpen(open === i ? null : i)}
                        className="w-full flex items-center justify-between py-5 text-left cursor-pointer"
                    >
                        <span
                            className="font-sans font-medium pr-8"
                            style={{ color: "rgb(6,18,24)", fontSize: 18, lineHeight: "24px", letterSpacing: "-0.36px" }}
                        >
                            {faq.q}
                        </span>
                        <span className="shrink-0 text-[22px] font-light" style={{ color: colors.blue }}>
                            {open === i ? "×" : "+"}
                        </span>
                    </button>
                    {open === i && (
                        <p
                            className="pb-5 font-sans font-normal"
                            style={{ color: "rgb(6,18,24)", fontSize: 16, lineHeight: "24px", letterSpacing: "-0.32px", opacity: 0.6 }}
                        >
                            {faq.a}
                        </p>
                    )}
                </div>
            ))}
            <div className="border-t border-gray-200" />
        </div>
    );
}

export default function FaqSection() {
    return (
        <SectionLayout
            label="//010 FAQ"
            heading={<>Questions we<br />often get</>}
            bg={colors.background}
            headerRight={<Accordion />}
            headerMb="mb-0"
        />
    );
}
