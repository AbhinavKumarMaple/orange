"use client";

import Link from "next/link";
import { colors } from "@/lib/colors";

const perks = [
    { icon: "⏱", text: "Quick 24-hour response" },
    { icon: "$", text: "Transparent pricing" },
    { icon: "📅", text: "Easy Scheduling" },
];

export default function ContactSection() {
    return (
        <section style={{ backgroundColor: colors.blue }} className="px-8 pt-16 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                {/* Left */}
                <div>
                    <p
                        className="font-mono font-medium mb-3"
                        style={{ color: colors.light, fontSize: 20, lineHeight: "26px", letterSpacing: "-0.4px" }}
                    >
                        //Contact
                    </p>
                    <h2
                        className="font-sans font-medium uppercase mb-4"
                        style={{ color: colors.light, fontSize: 88, lineHeight: "96.8px", letterSpacing: "-3.52px" }}
                    >
                        READY TO<br />START?
                    </h2>
                    <p
                        className="font-sans mb-6"
                        style={{ color: colors.light, fontSize: 20, lineHeight: "26px", letterSpacing: "-0.6px", opacity: 0.7, maxWidth: 280 }}
                    >
                        Reach out today, we&apos;ll respond fast and keep things simple.
                    </p>
                    <Link
                        href="#"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium"
                        style={{ backgroundColor: colors.light, color: colors.blue, fontSize: 16 }}
                    >
                        Email us directly
                    </Link>

                    <div className="flex flex-col gap-3 mt-10">
                        {perks.map((p) => (
                            <div key={p.text} className="flex items-center gap-3">
                                <span style={{ color: colors.light, fontSize: 16 }}>{p.icon}</span>
                                <span
                                    className="font-sans"
                                    style={{ color: colors.light, fontSize: 16, fontWeight: 400, lineHeight: "20.8px", letterSpacing: "-0.48px" }}
                                >
                                    {p.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — form card */}
                <div className="bg-white rounded-2xl p-8">
                    <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="block font-sans mb-2" style={{ fontSize: 16, fontWeight: 500, color: "rgb(6,18,24)" }}>
                                Name
                            </label>
                            <input
                                type="text"
                                placeholder="Jane Smith"
                                className="w-full border-b border-gray-200 pb-3 outline-none font-sans"
                                style={{ fontSize: 16, color: "rgb(6,18,24)" }}
                            />
                        </div>
                        <div>
                            <label className="block font-sans mb-2" style={{ fontSize: 16, fontWeight: 500, color: "rgb(6,18,24)" }}>
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="jane@framer.com"
                                className="w-full border-b border-gray-200 pb-3 outline-none font-sans"
                                style={{ fontSize: 16, color: "rgb(6,18,24)" }}
                            />
                        </div>
                        <div>
                            <label className="block font-sans mb-2" style={{ fontSize: 16, fontWeight: 500, color: "rgb(6,18,24)" }}>
                                Company
                            </label>
                            <input
                                type="text"
                                placeholder="Your company"
                                className="w-full border-b border-gray-200 pb-3 outline-none font-sans"
                                style={{ fontSize: 16, color: "rgb(6,18,24)" }}
                            />
                        </div>
                        <div>
                            <label className="block font-sans mb-2" style={{ fontSize: 16, fontWeight: 500, color: "rgb(6,18,24)" }}>
                                Message
                            </label>
                            <textarea
                                placeholder="Your message"
                                rows={4}
                                className="w-full border-b border-gray-200 pb-3 outline-none font-sans resize-y"
                                style={{ fontSize: 16, color: "rgb(6,18,24)" }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3.5 rounded-xl font-sans font-medium text-white cursor-pointer"
                            style={{ backgroundColor: colors.blue, fontSize: 16 }}
                        >
                            Send request
                        </button>
                        <p className="text-center font-sans" style={{ fontSize: 14, color: "rgb(6,18,24)", opacity: 0.5 }}>
                            By submitting, you agree to our{" "}
                            <Link href="#" className="underline">Terms</Link> and{" "}
                            <Link href="#" className="underline">Privacy Policy</Link>.
                        </p>
                    </form>
                </div>

            </div>
        </section>
    );
}
