"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { fadeUp, createTransition } from "@/lib/motion";
import { usePageTransition } from "./PageTransition";
import { colors } from "@/lib/colors";
import { mediaUrl, isVideo } from "@/lib/utils";
import MediaRenderer from "./MediaRenderer";
import type { projects } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Project = InferSelectModel<typeof projects>;

interface Props {
    projects: Project[];
}

export default function PortfolioGrid({ projects }: Props) {
    const { navigate } = usePageTransition();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projects.map((project, i) => (
                <motion.div
                    key={project.slug}
                    initial={fadeUp.hidden}
                    whileInView={fadeUp.visible}
                    viewport={{ once: true }}
                    transition={createTransition({ duration: "medium", ease: "snappy", delay: (i % 2) * 0.1 })}
                    className="cursor-pointer group"
                    onClick={() => navigate(`/projects/${project.slug}`)}
                    data-track-click={`portfolio_${project.slug}`}
                    data-track-hover={`portfolio_${project.slug}`}
                >
                    <div style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "909 / 838", position: "relative", width: "100%" }}>
                        <MediaRenderer
                            src={mediaUrl(project.heroImage, isVideo(project.heroImage) ? undefined : "width=1818&height=1676")}
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
                </motion.div>
            ))}
        </div>
    );
}
