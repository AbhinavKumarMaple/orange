"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
    { label: "Dashboard", href: "/crm" },
    { label: "Analytics", href: "/crm/analytics" },
    { label: "Media", href: "/crm/media" },
    { label: "Projects", href: "/crm/projects" },
    { label: "Articles", href: "/crm/articles" },
    { label: "Services", href: "/crm/services" },
    { label: "Pricing", href: "/crm/pricing" },
    { label: "Testimonials", href: "/crm/testimonials" },
    { label: "FAQs", href: "/crm/faqs" },
    { label: "Contact Requests", href: "/crm/contact" },
];

export default function CrmSidebar() {
    const path = usePathname();
    return (
        <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col">
            <div className="px-6 py-5 border-b border-gray-200">
                <p className="font-semibold text-gray-900 text-sm tracking-tight">Orange Studios</p>
                <p className="text-xs text-gray-400 mt-0.5">Content Manager</p>
            </div>
            <nav className="flex flex-col gap-0.5 p-3 flex-1">
                {nav.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            path === item.href
                                ? "bg-gray-900 text-white"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className="p-3 border-t border-gray-200">
                <Link
                    href="/"
                    className="block px-3 py-2 rounded-md text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    target="_blank"
                >
                    ↗ View site
                </Link>
            </div>
        </aside>
    );
}
