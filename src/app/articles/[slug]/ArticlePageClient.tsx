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
import { mediaUrl } from "@/lib/utils";
import type { articles } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Article = InferSelectModel<typeof articles>;
type ContentBlock = { heading: string; body: string };
type SocialLink = { id: string; platform: string; url: string; order: number };

interface Props {
    article: Article;
    related: Article[];
    socialLinks?: SocialLink[];
}

export default function ArticlePageClient({ article, related, socialLinks = [] }: Props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { navigate } = usePageTransition();
    const content = (article.content as ContentBlock[]) ?? [];

    return (
        <motion.main
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            style={{ backgroundColor: colors.background, minHeight: "100vh" }}
        >
            <Navbar isMenuOpen={menuOpen} onMenuToggle={() => setMenuOpen((p) => !p)} variant="dark" />
            <NavOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

            <div className="px-5 sm:px-8" style={{ maxWidth: 960, marginLeft: "auto", marginRight: "auto" }}>
                {/* Meta + title */}
                <div className="pt-24 pb-10">
                    <motion.div
                        className="flex items-center gap-6 mb-5"
                        initial={fadeUp.hidden} animate={fadeUp.visible}
                        transition={createTransition({ duration: "medium", ease: "gentle", delay: "short" })}
                    >
                        <span className="font-sans" style={{ color: colors.blue, fontSize: 16, letterSpacing: "-0.32px" }}>{article.category}</span>
                        <span className="font-sans" style={{ color: "var(--brand-dark)", fontSize: 16, letterSpacing: "-0.32px", opacity: 0.5 }}>{article.date}</span>
                    </motion.div>
                    {/* Title + excerpt — stacked on mobile, side-by-side on md+ */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-12">
                        <div className="overflow-hidden">
                            <motion.h1
                                className="font-sans font-medium"
                                style={{ color: "var(--brand-dark)", fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.1, letterSpacing: "-0.03em", maxWidth: 560 }}
                                initial={slideUp.hidden} animate={slideUp.visible}
                                transition={createTransition({ duration: "slow", ease: "snappy", delay: "short" })}
                            >
                                {article.title}
                            </motion.h1>
                        </div>
                        <motion.p
                            className="font-sans md:shrink-0 mt-4 md:mt-0"
                            style={{ maxWidth: 280, color: "var(--brand-dark)", fontSize: 17, lineHeight: "26px", letterSpacing: "-0.34px", opacity: 0.6, marginTop: 6 }}
                            initial={fadeUp.hidden} animate={fadeUp.visible}
                            transition={createTransition({ duration: "medium", ease: "gentle", delay: "normal" })}
                        >
                            {article.excerpt}
                        </motion.p>
                    </div>
                </div>

                {/* Hero image */}
                <motion.div
                    className="overflow-hidden w-full"
                    style={{ borderRadius: 8, aspectRatio: "16/9", position: "relative" }}
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
                >
                    <Image src={mediaUrl(article.image, "scale-down-to=1024&width=1200&height=673")} alt={article.title} fill className="object-cover" priority />
                </motion.div>

                {/* Article body */}
                <div style={{ maxWidth: 680, marginLeft: "auto", marginRight: "auto", paddingTop: 64, paddingBottom: 64 }}>
                    {content.map((section, i) => (
                        <motion.div key={i} className="mb-12"
                            initial={fadeUp.hidden} whileInView={fadeUp.visible} viewport={{ once: true }}
                            transition={createTransition({ duration: "medium", ease: "gentle" })}
                        >
                            <h2 className="font-sans font-medium mb-4" style={{ color: "var(--brand-dark)", fontSize: 26, lineHeight: "34px", letterSpacing: "-0.52px" }}>
                                {section.heading}
                            </h2>
                            <p className="font-sans" style={{ color: "var(--brand-dark)", fontSize: 17, lineHeight: "27px", letterSpacing: "-0.34px", opacity: 0.75 }}>
                                {section.body}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Related articles */}
                <div className="pb-24">
                    <div className="border-t border-black/10 pt-12 mb-10">
                        <h3 className="font-sans font-medium" style={{ color: "var(--brand-dark)", fontSize: 26, lineHeight: "34px", letterSpacing: "-0.52px" }}>
                            Related articles
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {related.map((a) => (
                            <div key={a.slug} className="cursor-pointer group" onClick={() => navigate(`/articles/${a.slug}`)}>
                                <div style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "16/10", position: "relative" }}>
                                    <Image src={mediaUrl(a.image, "scale-down-to=1024&width=1200&height=673")} alt={a.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="font-sans" style={{ color: colors.blue, fontSize: 15, letterSpacing: "-0.3px" }}>{a.category}</span>
                                        <span className="font-sans" style={{ color: "var(--brand-dark)", fontSize: 15, letterSpacing: "-0.3px", opacity: 0.5 }}>{a.date}</span>
                                    </div>
                                    <h4 className="font-sans font-medium" style={{ color: "var(--brand-dark)", fontSize: 20, lineHeight: "27px", letterSpacing: "-0.4px" }}>
                                        {a.title}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ContactSection />
            <Footer socialLinks={socialLinks} />
        </motion.main>
    );
}
