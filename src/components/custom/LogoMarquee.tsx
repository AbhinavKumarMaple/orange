"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "motion/react";

export interface MarqueeBrand {
    id: string;
    name: string;
    image: string;
    width: number;
    height: number;
}

export default function LogoMarquee({ brands }: { brands: MarqueeBrand[] }) {
    if (brands.length === 0) return null;

    // Duplicate for seamless loop
    const items = [...brands, ...brands];

    return (
        <div className="w-full overflow-hidden border-y border-black/10" style={{ height: 132 }}>
            <div
                className="flex items-center h-full animate-marquee-ltr"
                style={{ width: "max-content" }}
            >
                {items.map((b, i) => (
                    <BrandTile key={`${b.id}-${i}`} brand={b} />
                ))}
            </div>
        </div>
    );
}

function BrandTile({ brand }: { brand: MarqueeBrand }) {
    const innerRef = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);
    // Cursor position as percentage within the inner image wrapper (drives
    // the clip-path origin so the reveal grows from where the cursor entered).
    const [pos, setPos] = useState({ xPct: 50, yPct: 50 });

    function track(e: React.MouseEvent<HTMLDivElement>) {
        const el = innerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setPos({
            xPct: ((e.clientX - rect.left) / rect.width) * 100,
            yPct: ((e.clientY - rect.top) / rect.height) * 100,
        });
    }

    return (
        <div
            onMouseEnter={(e) => { track(e); setHovered(true); }}
            onMouseMove={track}
            onMouseLeave={() => setHovered(false)}
            className="brand-tile relative flex items-center justify-center shrink-0"
            style={{
                width: 286,
                height: "100%",
                borderRight: "1px solid rgba(0,0,0,0.1)",
                paddingLeft: 40,
                paddingRight: 40,
            }}
        >
            <div ref={innerRef} className="relative inline-block">
                {/* Grayscale base. Dims on hover so the color reveal lands cleanly. */}
                <motion.div
                    animate={{ opacity: hovered ? 0.2 : 1 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    style={{ filter: "grayscale(100%) contrast(0.92) brightness(0.96)" }}
                >
                    <Image
                        src={brand.image}
                        alt={brand.name}
                        width={brand.width}
                        height={brand.height}
                        className="block object-contain"
                        style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: 52 }}
                    />
                </motion.div>

                {/* Color layer revealed via cursor-tracked clip-path with spring physics. */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                        clipPath: hovered
                            ? `circle(140% at ${pos.xPct}% ${pos.yPct}%)`
                            : `circle(0% at ${pos.xPct}% ${pos.yPct}%)`,
                        scale: hovered ? 1.04 : 1,
                    }}
                    transition={{
                        clipPath: { type: "spring", stiffness: 160, damping: 22 },
                        scale: { type: "spring", stiffness: 220, damping: 18 },
                    }}
                    style={{ filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.18))" }}
                >
                    <Image
                        src={brand.image}
                        alt=""
                        aria-hidden
                        width={brand.width}
                        height={brand.height}
                        className="block object-contain"
                        style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: 52 }}
                    />
                </motion.div>
            </div>
        </div>
    );
}
