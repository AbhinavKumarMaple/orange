import { ReactNode } from "react";
import { colors } from "@/lib/colors";
import Link from "next/link";

interface ButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    /** "primary" = blue bg white text | "light" = white bg blue text | "outline" = transparent bg blue border+text */
    variant?: "primary" | "light" | "outline";
    className?: string;
    type?: "button" | "submit" | "reset";
    style?: React.CSSProperties;
}

export default function Button({
    children,
    href,
    onClick,
    variant = "primary",
    className = "",
    type = "button",
    style,
}: ButtonProps) {
    const base = "inline-flex items-center justify-center font-medium transition-colors cursor-pointer";

    const variantStyles: React.CSSProperties =
        variant === "primary"
            ? { backgroundColor: colors.blue, color: "#fff" }
            : variant === "light"
                ? { backgroundColor: colors.light, color: colors.blue }
                : { backgroundColor: "transparent", color: colors.blue, border: `1px solid ${colors.blue}` };

    const merged: React.CSSProperties = {
        borderRadius: 2,
        padding: "10px 20px",
        fontSize: 16,
        letterSpacing: "-0.48px",
        ...variantStyles,
        ...style,
    };

    if (href) {
        return (
            <Link href={href} className={`${base} ${className}`} style={merged}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} className={`${base} ${className}`} style={merged}>
            {children}
        </button>
    );
}
