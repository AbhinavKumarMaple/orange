import { Metadata } from "next";
import { articles } from "@/lib/articles";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
    title: "Blog — Nori Studio",
    description: "Ideas that drive growth. Practical tips and fresh insights on branding, design, and marketing.",
};

export default function BlogPage() {
    return <BlogPageClient articles={articles} />;
}
