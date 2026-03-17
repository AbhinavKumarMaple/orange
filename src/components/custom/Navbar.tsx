"use client";

interface NavbarProps {
    onMenuToggle: () => void;
    isMenuOpen: boolean;
}

export default function Navbar({ onMenuToggle, isMenuOpen }: NavbarProps) {
    return (
        <nav className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-10 py-5">
            <span className="text-white text-sm font-light tracking-wide">
                Nori<sup className="text-[10px] align-super">®</sup>
            </span>

            <button
                onClick={onMenuToggle}
                className="text-white z-50 relative w-8 h-8 flex items-center justify-center"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
                {isMenuOpen ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="2" y1="2" x2="18" y2="18" />
                        <line x1="18" y1="2" x2="2" y2="18" />
                    </svg>
                ) : (
                    <svg width="22" height="12" viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="0" y1="1" x2="22" y2="1" />
                        <line x1="0" y1="11" x2="22" y2="11" />
                    </svg>
                )}
            </button>
        </nav>
    );
}
