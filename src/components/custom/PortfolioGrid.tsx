"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { fadeUp, createTransition } from "@/lib/motion";

const projects = [
    {
        name: "Baseline Sports",
        category: "Web Design & Development",
        year: "2025",
        image: "https://framerusercontent.com/images/kf0L3mld1QAbDZWfDp3yi4LfwV8.png",
    },
    {
        name: "Urban Bites",
        category: "UI/UX Design",
        year: "2024",
        image: "https://framerusercontent.com/images/Vzqe1Y7Hjtxberq3o9cKXZ514.png",
    },
    {
        name: "Northcap supply",
        category: "Brand identity",
        year: "2024",
        image: "https://framerusercontent.com/images/FZLSLkf4KypXwztwnGP7AfQOpo.png",
    },
    {
        name: "Velo Studio",
        category: "Web Design & Development",
        year: "2023",
        image: "https://framerusercontent.com/images/RAVhlibsB1Uz6MJmEED2G3SQc.png",
    },
];

export default function PortfolioGrid() {
    return (
        <div className="grid grid-cols-2 gap-6">
            {projects.map((project, i) => (
                <motion.div
                    key={project.name}
                    initial={fadeUp.hidden}
                    whileInView={fadeUp.visible}
                    viewport={{ once: true }}
                    transition={createTransition({ duration: "medium", ease: "snappy", delay: (i % 2) * 0.1 })}
                >
                    {/* Image clip wrapper */}
                    <div style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "909 / 838", position: "relative", width: "100%" }} className="group">
                        <Image
                            src={`${project.image}?width=1818&height=1676`}
                            alt={project.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            style={{ borderRadius: 8 }}
                        />
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center justify-between mt-4">
                        <div>
                            <p
                                className="font-sans font-medium"
                                style={{ color: "rgb(6, 18, 24)", fontSize: 24, lineHeight: "31.2px", letterSpacing: "-0.48px" }}
                            >
                                {project.name}
                            </p>
                            <p
                                className="font-sans font-normal"
                                style={{ color: "rgb(6, 18, 24)", fontSize: 20, lineHeight: "26px", letterSpacing: "-0.4px", opacity: 0.6 }}
                            >
                                {project.category}
                            </p>
                        </div>
                        <p
                            className="font-mono font-medium"
                            style={{ color: "rgb(6, 18, 24)", fontSize: 20, lineHeight: "26px", letterSpacing: "-0.4px" }}
                        >
                            {project.year}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
