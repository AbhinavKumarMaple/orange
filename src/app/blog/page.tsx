import type { Metadata } from "next";
import Script from "next/script";
import { getArticles, getSocialLinks } from "@/lib/queries";
import { siteConfig, absoluteUrl } from "@/lib/site";
import BlogPageClient from "./BlogPageClient";

const title = "Blog — Ideas that drive growth";
const description =
    "Practical tips and fresh insights on branding, design, web development, and marketing from the Orange Studios team.";

export const metadata: Metadata = {
    title,
    description,
    keywords: ["blog", "design blog", "branding tips", "marketing insights", ...siteConfig.keywords],
    alternates: { canonical: "/blog" },
    openGraph: {
        type: "website",
        url: absoluteUrl("/blog"),
        title,
        description,
        siteName: siteConfig.name,
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
    },
};

export default async function BlogPage() {
    const [articles, socialLinks] = await Promise.all([getArticles(), getSocialLinks()]);

    const itemListJsonLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: `${siteConfig.name} Blog`,
        url: absoluteUrl("/blog"),
        blogPost: articles.map((a) => ({
            "@type": "BlogPosting",
            headline: a.title,
            description: a.excerpt,
            url: absoluteUrl(`/articles/${a.slug}`),
            datePublished: a.createdAt?.toISOString() ?? a.date,
            image: a.coverImage || a.image,
            author: { "@type": "Organization", name: siteConfig.name },
        })),
    };

    return (
        <>
            <Script
                id="ld-json-blog"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
            />
            <BlogPageClient articles={articles} socialLinks={socialLinks} />
        </>
    );
}
