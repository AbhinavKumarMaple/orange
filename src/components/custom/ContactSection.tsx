"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { captureEvent } from "@/lib/posthog";
import { colors } from "@/lib/colors";
import Button from "./Button";

import { Clock, DollarSign, CalendarDays, Phone } from "lucide-react";

const perks = [
    { icon: Clock, text: "Quick 24-hour response" },
    { icon: DollarSign, text: "Transparent pricing" },
    { icon: CalendarDays, text: "Easy Scheduling" },
    { icon: Phone, text: "+91 8999525221", href: "tel:+918999525221" },
];

export default function ContactSection() {
    const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleFieldFocus(field: string) {
        captureEvent("form_field_focus", {
            field,
            form: "contact",
            path: window.location.pathname,
        });
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
            toast.success("Message sent!");
            captureEvent("contact_form_submitted", {
                has_company: !!form.company,
                path: window.location.pathname,
            });
            setForm({ name: "", email: "", company: "", message: "" });
        } catch {
            toast.error("Something went wrong. Please try again.");
            captureEvent("contact_form_error", {
                path: window.location.pathname,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <section data-section="Contact" style={{ backgroundColor: colors.contact }} className="px-5 sm:px-8 pt-16 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                <div>
                    <p className="font-mono font-medium mb-3"
                        style={{ color: colors.accent, fontSize: 16, lineHeight: "26px", letterSpacing: "-0.4px" }}>
                        //Contact
                    </p>
                    <h2 className="font-sans font-medium uppercase mb-4 text-[34px] sm:text-[52px] md:text-[68px] lg:text-[88px] leading-[1.1] tracking-tight"
                        style={{ color: colors.dark }}>
                        READY TO START?
                    </h2>
                    <p className="font-sans mb-6 text-sm sm:text-base md:text-lg"
                        style={{ color: colors.dark, lineHeight: "1.4", letterSpacing: "-0.6px", opacity: 0.6, maxWidth: 280 }}>
                        Reach out today, we&apos;ll respond fast and keep things simple.
                    </p>
                    <Button href="mailto:hello@orangestudios.com" variant="primary" data-track-click="contact_email_direct" style={{ fontSize: 16, padding: "12px 24px" }}>
                        Email us directly
                    </Button>
                    <div className="flex flex-col gap-3 mt-10">
                        {perks.map((p) => (
                            <div key={p.text} className="flex items-center gap-3">
                                <p.icon size={18} strokeWidth={1.5} style={{ color: colors.accent, flexShrink: 0 }} />
                                {p.href ? (
                                    <a href={p.href} className="font-sans no-underline"
                                        style={{ color: colors.dark, fontSize: 16, fontWeight: 400, lineHeight: "20.8px", letterSpacing: "-0.48px" }}>
                                        {p.text}
                                    </a>
                                ) : (
                                    <span className="font-sans"
                                        style={{ color: colors.dark, fontSize: 16, fontWeight: 400, lineHeight: "20.8px", letterSpacing: "-0.48px" }}>
                                        {p.text}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 sm:p-8" style={{ borderRadius: 8 }}>
                    {sent ? (
                        <div className="flex flex-col items-start gap-8" style={{ minHeight: 400 }}>
                            <div>
                                <p className="font-mono font-medium mb-4"
                                    style={{ color: colors.blue, fontSize: 20, lineHeight: "26px", letterSpacing: "-0.4px" }}>
                                    //Sent
                                </p>
                                <h3 className="font-sans font-medium uppercase text-[32px] sm:text-[40px] md:text-[48px] leading-[1.1] tracking-tight"
                                    style={{ color: colors.dark }}>
                                    MESSAGE<br />RECEIVED
                                </h3>
                                <p className="font-sans mt-4"
                                    style={{ color: colors.dark, opacity: 0.5, fontSize: 16, lineHeight: "20.8px", letterSpacing: "-0.48px", maxWidth: 300 }}>
                                    Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                                </p>
                            </div>
                            <Button variant="primary" onClick={() => setSent(false)} style={{ fontSize: 16, padding: "14px 24px" }}>
                                Send another message
                            </Button>
                        </div>
                    ) : (
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block font-sans mb-2" style={{ fontSize: 16, fontWeight: 500, color: colors.dark }}>
                                    Name <span style={{ color: "red" }}>*</span>
                                </label>
                                <input type="text" name="name" value={form.name} onChange={handleChange}
                                    onFocus={() => handleFieldFocus("name")}
                                    placeholder="Jane Smith"
                                    className="w-full border-b border-gray-200 pb-3 outline-none font-sans"
                                    style={{ fontSize: 16, color: colors.dark }} />
                            </div>
                            <div>
                                <label className="block font-sans mb-2" style={{ fontSize: 16, fontWeight: 500, color: colors.dark }}>
                                    Email <span style={{ color: "red" }}>*</span>
                                </label>
                                <input type="email" name="email" value={form.email} onChange={handleChange}
                                    onFocus={() => handleFieldFocus("email")}
                                    placeholder="jane@framer.com"
                                    className="w-full border-b border-gray-200 pb-3 outline-none font-sans"
                                    style={{ fontSize: 16, color: colors.dark }} />
                            </div>
                            <div>
                                <label className="block font-sans mb-2" style={{ fontSize: 16, fontWeight: 500, color: colors.dark }}>
                                    Company
                                </label>
                                <input type="text" name="company" value={form.company} onChange={handleChange}
                                    onFocus={() => handleFieldFocus("company")}
                                    placeholder="Your company"
                                    className="w-full border-b border-gray-200 pb-3 outline-none font-sans"
                                    style={{ fontSize: 16, color: colors.dark }} />
                            </div>
                            <div>
                                <label className="block font-sans mb-2" style={{ fontSize: 16, fontWeight: 500, color: colors.dark }}>
                                    Message <span style={{ color: "red" }}>*</span>
                                </label>
                                <textarea name="message" value={form.message} onChange={handleChange}
                                    onFocus={() => handleFieldFocus("message")}
                                    placeholder="Your message" rows={4}
                                    className="w-full border-b border-gray-200 pb-3 outline-none font-sans resize-y"
                                    style={{ fontSize: 16, color: colors.dark }} />
                            </div>
                            <Button type="submit" variant="primary" className="w-full" data-track-click="contact_form_submit" style={{ fontSize: 16, padding: "14px 24px" }}>
                                {loading ? "Sending..." : "Send request"}
                            </Button>
                            <p className="text-center font-sans" style={{ fontSize: 14, color: colors.dark, opacity: 0.5 }}>
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
