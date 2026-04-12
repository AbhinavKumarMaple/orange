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
import type { projects } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Project = InferSelectModel<typeof projects>;
type SocialLink = { id: string; platform: string; url: string; order: number };

export default function ProjectsPageClient({ projects, socialLinks = [] }: { projects: Project[]; socialLinks?: SocialLink[] }) {
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
                    //Portfolio
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
                            Selected<br />Work
                        </motion.h1>
                    </div>

                    <motion.p
                        className="font-sans max-w-xs sm:text-right"
                        style={{ color: colors.dark, fontSize: 18, lineHeight: "27px", letterSpacing: "-0.36px", opacity: 0.6, marginTop: 8 }}
                        initial={fadeUp.hidden}
                        animate={fadeUp.visible}
                        transition={createTransition({ duration: "medium", ease: "gentle", delay: "normal" })}
                    >
                        Crafted work that blends creativity and strategy to help brands grow with impact.
                    </motion.p>
                </div>
            </div>

            {/* Project grid */}
            <div className="px-5 sm:px-14 pb-24 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {projects.map((project, i) => (
                    <motion.article
                        key={project.slug}
                        className="cursor-pointer group"
                        initial={fadeUp.hidden}
                        animate={fadeUp.visible}
                        transition={createTransition({ duration: "medium", ease: "snappy", delay: (i % 2) * 0.1 })}
                        onClick={() => navigate(`/projects/${project.slug}`)}
                    >
                        <div style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "909/838", position: "relative" }}>
                            <Image
                                src={mediaUrl(project.heroImage, "width=1818&height=1676")}
                                alt={project.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <div>
                                <p className="font-sans font-medium" style={{ color: colors.dark, fontSize: "clamp(18px, 2vw, 24px)", lineHeight: "1.3", letterSpacing: "-0.48px" }}>
                                    {project.name}
                                </p>
                                <p className="font-sans font-normal" style={{ color: colors.dark, fontSize: "clamp(14px, 1.5vw, 20px)", lineHeight: "1.4", letterSpacing: "-0.4px", opacity: 0.6 }}>
                                    {project.category}
                                </p>
                            </div>
                            <p className="font-mono font-medium" style={{ color: colors.dark, fontSize: "clamp(14px, 1.5vw, 20px)", lineHeight: "1.4", letterSpacing: "-0.4px" }}>
                                {project.year}
                            </p>
                        </div>
                    </motion.article>
                ))}
            </div>

            <ContactSection />
            <Footer socialLinks={socialLinks} />
        </motion.main>
    );
}

