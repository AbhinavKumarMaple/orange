"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";
import { usePageTransition } from "@/components/custom/PageTransition";
import Navbar from "@/components/custom/Navbar";
import NavOverlay from "@/components/custom/NavOverlay";
import Footer from "@/components/custom/Footer";
import { colors } from "@/lib/colors";
import { fadeUp, slideUp, createTransition } from "@/lib/motion";
import { articles } from "@/lib/articles";
import type { Article } from "@/lib/articles";

export default function ArticlePageClient({ article }: { article: Article }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { navigate } = usePageTransition();
    const related = articles.filter((a) => a.slug !== article.slug).slice(0, 2);

    return (
        <motion.main
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            style={{ backgroundColor: "#F0F5F9", minHeight: "100vh" }}
        >
            <Navbar isMenuOpen={menuOpen} onMenuToggle={() => setMenuOpen((p) => !p)} variant="dark" />
            <NavOverlay isOpen={menuOpen} />

            {/* All content centered in a max-width column */}
            <div style={{ maxWidth: 960, marginLeft: "auto", marginRight: "auto", paddingLeft: 32, paddingRight: 32 }}>

                {/* Meta + title */}
                <div className="pt-24 pb-10">
                    <motion.div
                        className="flex items-center gap-6 mb-5"
                        initial={fadeUp.hidden}
                        animate={fadeUp.visible}
                        transition={createTransition({ duration: "medium", ease: "gentle", delay: "short" })}
                    >
                        <span className="font-sans" style={{ color: colors.blue, fontSize: 16, letterSpacing: "-0.32px" }}>
                            {article.category}
                        </span>
                        <span className="font-sans" style={{ color: "rgb(6,18,24)", fontSize: 16, letterSpacing: "-0.32px", opacity: 0.5 }}>
                            {article.date}
                        </span>
                    </motion.div>

                    <div className="flex items-start justify-between gap-12">
                        <div className="overflow-hidden" style={{ maxWidth: 560 }}>
                            <motion.h1
                                className="font-sans font-medium"
                                style={{ color: "rgb(6,18,24)", fontSize: "clamp(32px, 3.5vw, 52px)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
                                initial={slideUp.hidden}
                                animate={slideUp.visible}
                                transition={createTransition({ duration: "slow", ease: "snappy", delay: "short" })}
                            >
                                {article.title}
                            </motion.h1>
                        </div>

                        <motion.p
                            className="font-sans shrink-0"
                            style={{ maxWidth: 280, color: "rgb(6,18,24)", fontSize: 17, lineHeight: "26px", letterSpacing: "-0.34px", opacity: 0.6, marginTop: 6 }}
                            initial={fadeUp.hidden}
                            animate={fadeUp.visible}
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
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
                >
                    <Image
                        src={`${article.image}?scale-down-to=1024&width=1200&height=673`}
                        alt={article.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>

                {/* Article body — narrower inner column */}
                <div style={{ maxWidth: 680, marginLeft: "auto", marginRight: "auto", paddingTop: 64, paddingBottom: 64 }}>
                    {article.content.map((section, i) => (
                        <motion.div
                            key={i}
                            className="mb-12"
                            initial={fadeUp.hidden}
                            whileInView={fadeUp.visible}
                            viewport={{ once: true }}
                            transition={createTransition({ duration: "medium", ease: "gentle" })}
                        >
                            <h2
                                className="font-sans font-medium mb-4"
                                style={{ color: "rgb(6,18,24)", fontSize: 26, lineHeight: "34px", letterSpacing: "-0.52px" }}
                            >
                                {section.heading}
                            </h2>
                            <p
                                className="font-sans"
                                style={{ color: "rgb(6,18,24)", fontSize: 17, lineHeight: "27px", letterSpacing: "-0.34px", opacity: 0.75 }}
                            >
                                {section.body}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Related articles */}
                <div className="pb-24">
                    <div className="border-t border-black/10 pt-12 mb-10">
                        <h3
                            className="font-sans font-medium"
                            style={{ color: "rgb(6,18,24)", fontSize: 26, lineHeight: "34px", letterSpacing: "-0.52px" }}
                        >
                            Related articles
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {related.map((a) => (
                            <div
                                key={a.slug}
                                className="cursor-pointer group"
                                onClick={() => navigate(`/articles/${a.slug}`)}
                            >
                                <div style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "16/10", position: "relative" }}>
                                    <Image
                                        src={`${a.image}?scale-down-to=1024&width=1200&height=673`}
                                        alt={a.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="font-sans" style={{ color: colors.blue, fontSize: 15, letterSpacing: "-0.3px" }}>{a.category}</span>
                                        <span className="font-sans" style={{ color: "rgb(6,18,24)", fontSize: 15, letterSpacing: "-0.3px", opacity: 0.5 }}>{a.date}</span>
                                    </div>
                                    <h4
                                        className="font-sans font-medium"
                                        style={{ color: "rgb(6,18,24)", fontSize: 20, lineHeight: "27px", letterSpacing: "-0.4px" }}
                                    >
                                        {a.title}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>{/* end centered column */}

            <Footer />
        </motion.main>
    );
}
