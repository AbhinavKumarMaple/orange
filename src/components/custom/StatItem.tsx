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
        <div ref={ref} className="flex items-end justify-between">
            {/* Big number */}
            <p
                className="font-sans font-normal"
                style={{ color: colors.light, fontSize: 124, lineHeight: "1", letterSpacing: "-4.96px" }}
            >
                {animated}
            </p>
            {/* Label — right-aligned, sits at bottom of number */}
            <p
                className="font-sans font-normal pb-3"
                style={{ color: colors.light, fontSize: 20, lineHeight: "26px", letterSpacing: "-0.6px", opacity: 0.5 }}
            >
                {label}
            </p>
        </div>
    );
}
