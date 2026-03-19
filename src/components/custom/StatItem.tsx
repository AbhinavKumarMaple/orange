"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { useCountUp } from "@/hooks/useCountUp";
import { colors } from "@/lib/colors";

interface StatItemProps {
    value: string;
    label: string;
}

export default function StatItem({ value, label }: StatItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });
    const animated = useCountUp(value, inView);

    return (
        <div ref={ref} className="flex items-end justify-between py-4 pr-4">
            {/* Big number */}
            <p
                className="font-sans font-normal"
                style={{ color: colors.light, fontSize: "clamp(72px, 8vw, 124px)", lineHeight: "1", letterSpacing: "-0.04em" }}
            >
                {animated}
            </p>
            {/* Label */}
            <p
                className="font-sans font-normal pb-1 text-right"
                style={{ color: colors.light, fontSize: "clamp(12px, 1.4vw, 20px)", lineHeight: "1.4", letterSpacing: "-0.6px", opacity: 0.5, maxWidth: 100 }}
            >
                {label}
            </p>
        </div>
    );
}
