"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";
import { usePageTransition } from "@/components/custom/PageTransition";
import Navbar from "@/components/custom/Navbar";
import NavOverlay from "@/components/custom/NavOverlay";
import Footer from "@/components/custom/Footer";
import ContactSection from "@/components/custom/ContactSection";
import { colors } from "@/lib/colors";
import { fadeUp, slideUp, createTransition } from "@/lib/motion";
import { mediaUrl, isVideo } from "@/lib/utils";
import MediaRenderer from "@/components/custom/MediaRenderer";
import type { articles } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Article = InferSelectModel<typeof articles>;
type SocialLink = { id: string; platform: string; url: string; order: number };

export default function BlogPageClient({ articles, socialLinks = [] }: { articles: Article[]; socialLinks?: SocialLink[] }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { navigate } = usePageTransition();

    return (
        <motion.main
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            style={{ backgroundColor: colors.background, minHeight: "100vh" }}
        >
            <Navbar isMenuOpen={menuOpen} onMenuToggle={() => setMenuOpen((p) => !p)} variant="dark" />
            <NavOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

            {/* Header */}
            <div className="px-5 sm:px-14 pt-24 pb-16">
                <motion.span
                    className="font-mono font-medium block mb-4"
                    style={{ color: colors.blue, fontSize: 20, lineHeight: "26px", letterSpacing: "-0.4px" }}
                    initial={fadeUp.hidden}
                    animate={fadeUp.visible}
                    transition={createTransition({ duration: "medium", ease: "gentle", delay: "short" })}
                >
                    //Blog
                </motion.span>

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="overflow-hidden">
                        <motion.h1
                            className="font-sans font-medium uppercase"
                            style={{ color: colors.dark, fontSize: "clamp(48px, 7vw, 100px)", lineHeight: 0.9, letterSpacing: "-0.04em" }}
                            initial={slideUp.hidden}
                            animate={slideUp.visible}
                            transition={createTransition({ duration: "slow", ease: "snappy", delay: "short" })}
                        >
                            Ideas that<br />drive growth
                        </motion.h1>
                    </div>

                    <motion.p
                        className="font-sans max-w-xs sm:text-right"
                        style={{ color: colors.dark, fontSize: 18, lineHeight: "27px", letterSpacing: "-0.36px", opacity: 0.6, marginTop: 8 }}
                        initial={fadeUp.hidden}
                        animate={fadeUp.visible}
                        transition={createTransition({ duration: "medium", ease: "gentle", delay: "normal" })}
                    >
                        Discover practical tips and fresh insights to strengthen your brand, improve design, and inspire lasting impact.
                    </motion.p>
                </div>
            </div>

            {/* First 2 articles — large cards */}
            <div className="px-5 sm:px-14 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {articles.slice(0, 2).map((article, i) => (
                    <motion.article
                        key={article.slug}
                        className="cursor-pointer group"
                        initial={fadeUp.hidden}
                        animate={fadeUp.visible}
                        transition={createTransition({ duration: "medium", ease: "snappy", delay: i === 0 ? "short" : "normal" })}
                        onClick={() => navigate(`/articles/${article.slug}`)}
                    >
                        <div style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "16/10", position: "relative" }}>
                            <MediaRenderer
                                src={mediaUrl(article.image, isVideo(article.image) ? undefined : "scale-down-to=1024&width=1200&height=673")}
                                alt={article.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="mt-5">
                            <div className="flex items-center gap-4 mb-3">
                                <span className="font-sans" style={{ color: colors.blue, fontSize: 16, letterSpacing: "-0.32px" }}>
                                    {article.category}
                                </span>
                                <span className="font-sans" style={{ color: colors.dark, fontSize: 16, letterSpacing: "-0.32px", opacity: 0.5 }}>
                                    {article.date}
                                </span>
                            </div>
                            <h2
                                className="font-sans font-medium"
                                style={{ color: colors.dark, fontSize: 24, lineHeight: "31.2px", letterSpacing: "-0.48px" }}
                            >
                                {article.title}
                            </h2>
                        </div>
                    </motion.article>
                ))}
            </div>

            {/* Remaining articles — 2-col grid */}
            {articles.length > 2 && (
                <div className="px-5 sm:px-14 pb-24 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {articles.slice(2).map((article, i) => (
                        <motion.article
                            key={article.slug}
                            className="cursor-pointer group"
                            initial={fadeUp.hidden}
                            animate={fadeUp.visible}
                            transition={createTransition({ duration: "medium", ease: "snappy", delay: "normal" })}
                            onClick={() => navigate(`/articles/${article.slug}`)}
                        >
                            <div style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "16/10", position: "relative" }}>
                                <MediaRenderer
                                    src={mediaUrl(article.image, isVideo(article.image) ? undefined : "scale-down-to=1024&width=1200&height=673")}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="mt-5">
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="font-sans" style={{ color: colors.blue, fontSize: 16, letterSpacing: "-0.32px" }}>
                                        {article.category}
                                    </span>
                                    <span className="font-sans" style={{ color: colors.dark, fontSize: 16, letterSpacing: "-0.32px", opacity: 0.5 }}>
                                        {article.date}
                                    </span>
                                </div>
                                <h2
                                    className="font-sans font-medium"
                                    style={{ color: colors.dark, fontSize: 24, lineHeight: "31.2px", letterSpacing: "-0.48px" }}
                                >
                                    {article.title}
                                </h2>
                            </div>
                        </motion.article>
                    ))}
                </div>
            )}

            <ContactSection />
            <Footer socialLinks={socialLinks} />
        </motion.main>
    );
}

