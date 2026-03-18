"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { colors } from "@/lib/colors";
import Button from "./Button";

const perks = [
    { icon: "⏱", text: "Quick 24-hour response" },
    { icon: "$", text: "Transparent pricing" },
    { icon: "📅", text: "Easy Scheduling" },
];

export default function ContactSection() {
    const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            toast.error("Please fill in name, email, and message.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/crm/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Failed");
            setSent(true);
            toast.success("Message sent! We'll get back to you within 24 hours.");
            setForm({ name: "", email: "", company: "", message: "" });
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section style={{ backgroundColor: colors.blue }} className="px-8 pt-16 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                {/* Left */}
                <div>
                    <p className="font-mono font-medium mb-3"
                        style={{ color: colors.light, fontSize: 20, lineHeight: "26px", letterSpacing: "-0.4px" }}>
                        //Contact
                    </p>
                    <h2 className="font-sans font-medium uppercase mb-4"
                        style={{ color: colors.light, fontSize: 88, lineHeight: "96.8px", letterSpacing: "-3.52px" }}>
                        READY TO<br />START?
                    </h2>
                    <p className="font-sans mb-6"
                        style={{ color: colors.light, fontSize: 20, lineHeight: "26px", letterSpacing: "-0.6px", opacity: 0.7, maxWidth: 280 }}>
                        Reach out today, we&apos;ll respond fast and keep things simple.
                    </p>
                    <Button href="mailto:hello@orangestudios.com" variant="light" style={{ fontSize: 16, padding: "12px 24px" }}>
                        Email us directly
                    </Button>
                    <div className="flex flex-col gap-3 mt-10">
                        {perks.map((p) => (
                            <div key={p.text} className="flex items-center gap-3">
                                <span style={{ color: colors.light, fontSize: 16 }}>{p.icon}</span>
                                <span className="font-sans"
                                    style={{ color: colors.light, fontSize: 16, fontWeight: 400, lineHeight: "20.8px", letterSpacing: "-0.48px" }}>
                                    {p.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — form card */}
                <div className="bg-white p-8" style={{ borderRadius: 8 }}>
                    {sent ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                            <span style={{ fontSize: 48 }}>✅</span>
                            <h3 className="font-sans font-semibold text-xl" style={{ color: "rgb(6,18,24)" }}>
                                Message received!
                            </h3>
                            <p className="font-sans text-sm" style={{ color: "rgb(6,18,24)", opacity: 0.6 }}>
                                We&apos;ll get back to you within 24 hours.
                            </p>
                            <button className="text-sm underline mt-2" style={{ color: colors.blue }} onClick={() => setSent(false)}>
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block font-sans mb-2" style={{ fontSize: 16, fontWeight: 500, color: "rgb(6,18,24)" }}>
                                    Name <span style={{ color: "red" }}>*</span>
                                </label>
                                <input type="text" name="name" value={form.name} onChange={handleChange}
                                    placeholder="Jane Smith"
                                    className="w-full border-b border-gray-200 pb-3 outline-none font-sans"
                                    style={{ fontSize: 16, color: "rgb(6,18,24)" }} />
                            </div>
                            <div>
                                <label className="block font-sans mb-2" style={{ fontSize: 16, fontWeight: 500, color: "rgb(6,18,24)" }}>
                                    Email <span style={{ color: "red" }}>*</span>
                                </label>
                                <input type="email" name="email" value={form.email} onChange={handleChange}
                                    placeholder="jane@framer.com"
                                    className="w-full border-b border-gray-200 pb-3 outline-none font-sans"
                                    style={{ fontSize: 16, color: "rgb(6,18,24)" }} />
                            </div>
                            <div>
                                <label className="block font-sans mb-2" style={{ fontSize: 16, fontWeight: 500, color: "rgb(6,18,24)" }}>
                                    Company
                                </label>
                                <input type="text" name="company" value={form.company} onChange={handleChange}
                                    placeholder="Your company"
                                    className="w-full border-b border-gray-200 pb-3 outline-none font-sans"
                                    style={{ fontSize: 16, color: "rgb(6,18,24)" }} />
                            </div>
                            <div>
                                <label className="block font-sans mb-2" style={{ fontSize: 16, fontWeight: 500, color: "rgb(6,18,24)" }}>
                                    Message <span style={{ color: "red" }}>*</span>
                                </label>
                                <textarea name="message" value={form.message} onChange={handleChange}
                                    placeholder="Your message" rows={4}
                                    className="w-full border-b border-gray-200 pb-3 outline-none font-sans resize-y"
                                    style={{ fontSize: 16, color: "rgb(6,18,24)" }} />
                            </div>
                            <Button type="submit" variant="primary" className="w-full" style={{ fontSize: 16, padding: "14px 24px" }}>
                                {loading ? "Sending..." : "Send request"}
                            </Button>
                            <p className="text-center font-sans" style={{ fontSize: 14, color: "rgb(6,18,24)", opacity: 0.5 }}>
                                By submitting, you agree to our{" "}
                                <Link href="#" className="underline">Terms</Link> and{" "}
                                <Link href="#" className="underline">Privacy Policy</Link>.
                            </p>
                        </form>
                    )}
                </div>

            </div>
        </section>
    );
}
