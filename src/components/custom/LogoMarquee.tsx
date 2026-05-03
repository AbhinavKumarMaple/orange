"use client";

import Image from "next/image";

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
                    <div
                        key={`${b.id}-${i}`}
                        className="flex items-center justify-center shrink-0"
                        style={{ width: 286, height: "100%", borderRight: "1px solid rgba(0,0,0,0.1)", paddingLeft: 40, paddingRight: 40 }}
                    >
                        <Image
                            src={b.image}
                            alt={b.name}
                            width={b.width}
                            height={b.height}
                            className="object-contain"
                            style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: 52 }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
