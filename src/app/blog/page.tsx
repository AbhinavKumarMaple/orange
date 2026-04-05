import { Metadata } from "next";
import { getArticles, getSocialLinks } from "@/lib/queries";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
    title: "Blog — Orange Studios",
    description: "Ideas that drive growth. Practical tips and fresh insights on branding, design, and marketing.",
};

export default async function BlogPage() {
    const [articles, socialLinks] = await Promise.all([getArticles(), getSocialLinks()]);
    return <BlogPageClient articles={articles} socialLinks={socialLinks} />;
}
