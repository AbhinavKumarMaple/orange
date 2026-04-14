"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { usePageTransition } from "@/components/custom/PageTransition";
import { colors } from "@/lib/colors";
import { fadeUp, slideUp, createTransition } from "@/lib/motion";
import { mediaUrl, isVideo } from "@/lib/utils";
import Navbar from "@/components/custom/Navbar";
import NavOverlay from "@/components/custom/NavOverlay";
import ContactSection from "@/components/custom/ContactSection";
import Footer from "@/components/custom/Footer";
import MediaRenderer from "@/components/custom/MediaRenderer";
import { useState } from "react";
import type { projects } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Project = InferSelectModel<typeof projects>;
type SocialLink = { id: string; platform: string; url: string; order: number };

interface Props {
    project: Project;
    socialLinks?: SocialLink[];
}

export default function ProjectPageClient({ project, socialLinks = [] }: Props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { navigate } = usePageTransition();

    return (
        <motion.main
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            style={{ backgroundColor: "var(--brand-linen)", minHeight: "100vh" }}
        >
            {/* Navbar */}
            <Navbar isMenuOpen={menuOpen} onMenuToggle={() => setMenuOpen((p) => !p)} variant="dark" />
            <NavOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

            {/* Hero text */}
            <div className="px-5 sm:px-14 pt-24 pb-12">
                {/* Big title + description row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="overflow-hidden">
                        <motion.h1
                            className="font-sans font-medium uppercase"
                            style={{
                                color: "var(--brand-dark)",
                                fontSize: "clamp(56px, 8vw, 120px)",
                                lineHeight: 0.9,
                                letterSpacing: "-0.04em",
                            }}
                            initial={slideUp.hidden}
                            animate={slideUp.visible}
                            transition={createTransition({ duration: "slow", ease: "snappy", delay: "short" })}
                        >
                            {project.name.split(" ").map((word, i) => (
                                <span key={i} className="block">{word}</span>
                            ))}
                        </motion.h1>
                    </div>

                    <motion.p
                        className="font-sans max-w-sm sm:text-right"
                        style={{
                            color: "var(--brand-dark)",
                            fontSize: 18,
                            lineHeight: "27px",
                            letterSpacing: "-0.36px",
                            opacity: 0.6,
                            marginTop: 8,
                        }}
                        initial={fadeUp.hidden}
                        animate={fadeUp.visible}
                        transition={createTransition({ duration: "medium", ease: "gentle", delay: "normal" })}
                    >
                        {project.description}
                    </motion.p>
                </div>
            </div>

            {/* Hero image — full width */}
            <div className="px-5 sm:px-14">
                <motion.div
                    className="w-full overflow-hidden"
                    style={{ borderRadius: 8, aspectRatio: "16/9", position: "relative" }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
                >
                    <MediaRenderer
                        src={mediaUrl(project.heroImage)}
                        alt={project.name}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                </motion.div>
            </div>

            {/* Meta table */}
            <div className="px-5 sm:px-14 py-16 border-b border-black/10">
                {[
                    { label: "Year", value: project.year },
                    { label: "Industry", value: project.industry },
                    { label: "Timeline", value: project.timeline },
                ].map((row) => (
                    <div
                        key={row.label}
                        className="flex items-center justify-between py-5 border-t border-black/10"
                    >
                        <span
                            className="font-sans"
                            style={{ color: "var(--brand-dark)", fontSize: 18, letterSpacing: "-0.36px", opacity: 0.5 }}
                        >
                            {row.label}
                        </span>
                        <span
                            className="font-sans font-medium"
                            style={{ color: "var(--brand-dark)", fontSize: 18, letterSpacing: "-0.36px" }}
                        >
                            {row.value}
                        </span>
                    </div>
                ))}
            </div>

            {/* Problem / Solution */}
            <div className="px-5 sm:px-14 py-24 space-y-24">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-16">
                    <div className="sm:w-1/3 shrink-0">
                        <span
                            className="font-mono font-medium"
                            style={{ color: colors.blue, fontSize: 20, lineHeight: "26px", letterSpacing: "-0.4px" }}
                        >
                            //Problem
                        </span>
                    </div>
                    <p
                        className="font-sans"
                        style={{ color: "var(--brand-dark)", fontSize: 20, lineHeight: "30px", letterSpacing: "-0.4px" }}
                    >
                        {project.problem}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-16">
                    <div className="sm:w-1/3 shrink-0">
                        <span
                            className="font-mono font-medium"
                            style={{ color: colors.blue, fontSize: 20, lineHeight: "26px", letterSpacing: "-0.4px" }}
                        >
                            //Solution
                        </span>
                    </div>
                    <p
                        className="font-sans"
                        style={{ color: "var(--brand-dark)", fontSize: 20, lineHeight: "30px", letterSpacing: "-0.4px" }}
                    >
                        {project.solution}
                    </p>
                </div>
            </div>

            {/* Gallery images */}
            <div className="px-5 sm:px-14 pb-24 space-y-6">
                {/* First 2 images — side by side */}
                {project.images.length >= 2 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {project.images.slice(0, 2).map((img, i) => (
                            <div
                                key={i}
                                className="w-full overflow-hidden relative"
                                style={{ borderRadius: 8, aspectRatio: "4/3" }}
                            >
                                <MediaRenderer
                                    src={mediaUrl(img)}
                                    alt={`${project.name} detail ${i + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 100vw, 50vw"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Remaining images — full width stacked */}
                {project.images.slice(2).map((img, i) => (
                    <div
                        key={i + 2}
                        className="w-full overflow-hidden relative"
                        style={{ borderRadius: 8, aspectRatio: "16/9" }}
                    >
                        <MediaRenderer
                            src={mediaUrl(img)}
                            alt={`${project.name} ${i + 3}`}
                            fill
                            className="object-cover"
                            sizes="100vw"
                        />
                    </div>
                ))}
            </div>

            {/* Back link */}
            <div className="px-5 sm:px-14 pb-24">
                <button
                    onClick={() => navigate("/")}
                    className="font-mono font-medium cursor-pointer"
                    style={{ color: colors.blue, fontSize: 20, letterSpacing: "-0.4px", background: "none", border: "none" }}
                >
                    ← Back to work
                </button>
            </div>

            <ContactSection />
            <Footer socialLinks={socialLinks} />
        </motion.main>
    );
}
