import Link from "next/link";
import { colors } from "@/lib/colors";

const pages = [
    { name: "Home", href: "#" },
    { name: "About us", href: "#" },
    { name: "Work", href: "#" },
    { name: "Blog", href: "#" },
];

const socials = [
    { name: "Instagram", href: "#" },
    { name: "Facebook", href: "#" },
    { name: "Tiktok", href: "#" },
    { name: "Twitter", href: "#" },
];

export default function Footer() {
    return (
        <footer style={{ backgroundColor: colors.blue }} className="px-5 sm:px-8 pt-16 sm:pt-20 pb-6">
            <div className="w-full h-px mb-12 sm:mb-16" style={{ backgroundColor: "rgba(240,245,249,0.2)" }} />

            {/* Top row — stacks on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-12 mb-12 sm:mb-16">
                {/* Newsletter */}
                <div className="max-w-md">
                    <h3
                        className="font-sans font-medium italic mb-4"
                        style={{ color: colors.light, fontSize: "clamp(48px, 7vw, 76px)", lineHeight: "1", letterSpacing: "-0.04em" }}
                    >
                        Stay in loop
                    </h3>
                    <p
                        className="font-sans mb-6"
                        style={{ color: colors.light, fontSize: 16, lineHeight: "20.8px", letterSpacing: "-0.48px", opacity: 0.7 }}
                    >
                        Join our newsletter and stay updated on the latest trends in digital design.
                    </p>
                    <p className="font-sans font-medium mb-2" style={{ color: colors.light, fontSize: 16 }}>
                        Email
                    </p>
                    <div className="flex items-center gap-3">
                        <input
                            type="email"
                            placeholder="jane@framer.com"
                            className="bg-white rounded px-4 py-3 font-sans outline-none flex-1 min-w-0"
                            style={{ fontSize: 16, color: "rgb(6,18,24)" }}
                        />
                        <button
                            className="flex items-center justify-center rounded shrink-0 cursor-pointer"
                            style={{ backgroundColor: colors.light, width: 44, height: 44 }}
                            aria-label="Subscribe"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 13L13 3M13 3H5M13 3V11" stroke={colors.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Nav links */}
                <div className="flex gap-12 sm:gap-20">
                    <div>
                        <p className="font-sans mb-4" style={{ color: colors.light, fontSize: 16, opacity: 0.6 }}>Pages</p>
                        <div className="flex flex-col gap-2">
                            {pages.map((p) => (
                                <Link
                                    key={p.name}
                                    href={p.href}
                                    className="font-sans font-medium"
                                    style={{ color: colors.light, fontSize: "clamp(18px, 2vw, 24px)", lineHeight: "1.3", letterSpacing: "-0.48px" }}
                                >
                                    {p.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="font-sans mb-4" style={{ color: colors.light, fontSize: 16, opacity: 0.6 }}>Follow us</p>
                        <div className="flex flex-col gap-2">
                            {socials.map((s) => (
                                <Link
                                    key={s.name}
                                    href={s.href}
                                    className="font-sans font-medium"
                                    style={{ color: colors.light, fontSize: "clamp(18px, 2vw, 24px)", lineHeight: "1.3", letterSpacing: "-0.48px" }}
                                >
                                    {s.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Giant brand text */}
            <div className="overflow-hidden mb-8 -mx-5 sm:-mx-8">
                <h2
                    className="font-sans font-medium whitespace-nowrap text-center"
                    style={{
                        color: colors.light,
                        fontSize: "14vw",
                        lineHeight: 1.02,
                        letterSpacing: "-0.05em",
                    }}
                >
                    Orange Studios
                </h2>
            </div>

            {/* Bottom bar — stacks on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="font-sans" style={{ color: colors.light, fontSize: 14, opacity: 0.7 }}>
                    © 2026 Orange Studios. All rights reserved.
                </p>
                <div className="flex items-center gap-6 sm:gap-12">
                    <Link href="#" className="font-sans" style={{ color: colors.light, fontSize: 14, opacity: 0.7 }}>
                        Privacy policy
                    </Link>
                    <Link href="#" className="font-sans" style={{ color: colors.light, fontSize: 14, opacity: 0.7 }}>
                        Terms of Service
                    </Link>
                </div>
            </div>
        </footer>
    );
}
