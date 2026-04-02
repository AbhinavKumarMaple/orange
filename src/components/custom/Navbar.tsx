"use client";

import posthog from "posthog-js";
import { colors } from "@/lib/colors";

interface NavbarProps {
    onMenuToggle: () => void;
    isMenuOpen: boolean;
    /** "light" = white text (default, for dark/blue bg), "dark" = dark text (for light bg) */
    variant?: "light" | "dark";
    transparent?: boolean;
}

export default function Navbar({ onMenuToggle, isMenuOpen, variant = "light" }: NavbarProps) {
    const fg = variant === "dark" ? "rgb(6,18,24)" : colors.light;

    return (
        <nav className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between">
            {/* Logo */}
            <div style={{ position: "absolute", top: 14, left: 33 }}>
                <span
                    className="font-sans font-medium text-xl"
                    style={{ color: fg, letterSpacing: "-0.02em" }}
                >
                    Orange<sup className="text-[11px]">®</sup>
                </span>
            </div>

            {/* Hamburger */}
            <button
                onClick={() => {
                    onMenuToggle();
                    posthog.capture("nav_menu_toggle", {
                        action: isMenuOpen ? "close" : "open",
                        path: window.location.pathname,
                    });
                }}
                className="absolute flex flex-col justify-center gap-[8px] cursor-pointer"
                style={{ top: 8, right: 48, width: 32, height: 32 }}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
                {isMenuOpen ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <line x1="1" y1="1" x2="19" y2="19" stroke={fg} strokeWidth="2" />
                        <line x1="19" y1="1" x2="1" y2="19" stroke={fg} strokeWidth="2" />
                    </svg>
                ) : (
                    <div className="flex flex-col gap-[8px]">
                        <div style={{ width: 32, height: 2, backgroundColor: fg }} />
                        <div style={{ width: 24, height: 2, backgroundColor: fg }} />
                    </div>
                )}
            </button>
        </nav>
    );
}
