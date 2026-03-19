"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";

interface Testimonial {
    id: number;
    company: string;
    quote: string;
    avatar: string;
    name: string;
    role: string;
    xPercent: string;
    order: number;
}

interface ClientResultsSectionProps {
    testimonials: Testimonial[];
}

const companyIcons: Record<string, React.ReactNode> = {
    "Urban bites": (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z" fill="currentColor" />
        </svg>
    ),
    "Baseline Sports": (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M8 12a4 4 0 018 0" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="8" r="2" fill="currentColor" />
        </svg>
    ),
    "Northcap Supply": (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 3l9 18L21 3H3z" fill="currentColor" />
        </svg>
    ),
    "Velo Studio": (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
};

function TestimonialCard({ t }: { t: Testimonial }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <span className="text-gray-900">
                    {companyIcons[t.company] ?? <span className="w-6 h-6 bg-gray-900 rounded-sm block" />}
                </span>
                <span className="font-medium text-gray-900 text-[15px]">{t.company}</span>
            </div>
            <div className="border-t border-gray-100" />
            <p className="text-gray-700 text-[14px] leading-relaxed">{t.quote}</p>
            <div className="border-t border-gray-100 pt-4 flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 relative">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                    <p className="text-[14px] font-medium text-gray-900">{t.name}</p>
                    <p className="text-[12px] text-gray-500">{t.role}</p>
                </div>
            </div>
        </div>
    );
}

function FloatingCard({
    t,
    scrollYProgress,
    index,
    total,
}: {
    t: Testimonial;
    scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
    index: number;
    total: number;
}) {
    const sliceSize = 1 / total;
    const cardStart = index * sliceSize * 0.6;
    const cardEnd = cardStart + 0.6;
    const y = useTransform(scrollYProgress, [cardStart, cardEnd], ["100vh", "-100vh"]);

    return (
        <motion.div
            style={{ y, left: t.xPercent }}
            className="absolute top-1/2 -translate-y-1/2 w-[360px] bg-white rounded-2xl shadow-sm p-8 flex flex-col gap-5"
        >
            <div className="flex items-center gap-3">
                <span className="text-gray-900">
                    {companyIcons[t.company] ?? <span className="w-6 h-6 bg-gray-900 rounded-sm block" />}
                </span>
                <span className="font-medium text-gray-900 text-[16px]">{t.company}</span>
            </div>
            <div className="border-t border-gray-100" />
            <p className="text-gray-700 text-[15px] leading-relaxed">{t.quote}</p>
            <div className="border-t border-gray-100 pt-4 flex items-center gap-3 mt-auto">
                <div className="w-11 h-11 rounded-full bg-gray-200 overflow-hidden shrink-0 relative">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                    <p className="text-[15px] font-medium text-gray-900">{t.name}</p>
                    <p className="text-[13px] text-gray-500">{t.role}</p>
                </div>
            </div>
        </motion.div>
    );
}

export default function ClientResultsSection({ testimonials }: ClientResultsSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    return (
        <>
            {/* Mobile: simple stacked cards */}
            <section className="block sm:hidden bg-[#F0F5F9] px-5 py-16">
                <p className="font-bold uppercase text-[#C8D0D8] text-[clamp(36px,10vw,60px)] leading-none tracking-tight mb-8 select-none">
                    CLIENT<br />RESULTS
                </p>
                <div className="flex flex-col gap-4">
                    {testimonials.map((t) => (
                        <TestimonialCard key={t.company} t={t} />
                    ))}
                </div>
            </section>

            {/* Desktop: scroll-animated floating cards */}
            <section
                ref={sectionRef}
                className="hidden sm:block relative bg-[#F0F5F9]"
                style={{ height: "300vh" }}
            >
                <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
                    <span
                        className="absolute select-none pointer-events-none font-bold uppercase text-[#C8D0D8] whitespace-nowrap"
                        style={{ fontSize: "clamp(80px, 16vw, 240px)", letterSpacing: "-0.03em", lineHeight: 1 }}
                    >
                        CLIENT RESULTS
                    </span>
                    <div className="absolute inset-0">
                        {testimonials.map((t, i) => (
                            <FloatingCard
                                key={t.company}
                                t={t}
                                scrollYProgress={scrollYProgress}
                                index={i}
                                total={testimonials.length}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
