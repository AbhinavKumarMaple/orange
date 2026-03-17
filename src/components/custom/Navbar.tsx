"use client";

import { colors } from "@/lib/colors";

interface NavbarProps {
    onMenuToggle: () => void;
    isMenuOpen: boolean;
}

export default function Navbar({ onMenuToggle, isMenuOpen }: NavbarProps) {
    return (
        <nav className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between">
            {/* Logo text — top=10, left=33, Geist font */}
            <div style={{ position: "absolute", top: 14, left: 33 }}>
                <span
                    className="font-sans font-medium text-sm"
                    style={{ color: colors.light, letterSpacing: "-0.02em" }}
                >
                    Nori<sup className="text-[8px]">®</sup>
                </span>
            </div>

            {/* Hamburger — two lines, right=48, top=8 (container) */}
            <button
                onClick={onMenuToggle}
                className="absolute flex flex-col justify-center gap-[8px] cursor-pointer"
                style={{ top: 8, right: 48, width: 32, height: 32 }}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
                {isMenuOpen ? (
                    /* X icon when open */
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <line x1="1" y1="1" x2="19" y2="19" stroke={colors.light} strokeWidth="2" />
                        <line x1="19" y1="1" x2="1" y2="19" stroke={colors.light} strokeWidth="2" />
                    </svg>
                ) : (
                    /* Two-line hamburger: top line 32px, bottom line 24px */
                    <div className="flex flex-col gap-[8px]">
                        <div style={{ width: 32, height: 2, backgroundColor: colors.light }} />
                        <div style={{ width: 24, height: 2, backgroundColor: colors.light }} />
                    </div>
                )}
            </button>
        </nav>
    );
}
