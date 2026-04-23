import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { getArticle, getArticles, getRelatedArticles, getSocialLinks } from "@/lib/queries";
import { siteConfig, absoluteUrl } from "@/lib/site";
import ArticlePageClient from "./ArticlePageClient";

export const dynamicParams = true;

export async function generateStaticParams() {
    const articles = await getArticles();
    return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticle(slug);
    if (!article) return {};

    const url = absoluteUrl(`/articles/${article.slug}`);
    const ogImage = article.coverImage || article.image || absoluteUrl(`/articles/${article.slug}/opengraph-image`);

    return {
        title: article.title,
        description: article.excerpt,
        keywords: [article.category, "article", "blog", ...siteConfig.keywords],
        authors: [{ name: siteConfig.name, url: siteConfig.url }],
        alternates: { canonical: `/articles/${article.slug}` },
        openGraph: {
            type: "article",
            url,
            title: article.title,
            description: article.excerpt,
            siteName: siteConfig.name,
            publishedTime: article.createdAt?.toISOString(),
            authors: [siteConfig.name],
            section: article.category,
            images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: article.excerpt,
            images: [ogImage],
        },
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [article, related, socialLinks] = await Promise.all([
        getArticle(slug),
        getRelatedArticles(slug),
        getSocialLinks(),
    ]);
    if (!article) notFound();

    const url = absoluteUrl(`/articles/${article.slug}`);
    const image = article.coverImage || article.image;

    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        description: article.excerpt,
        image: image ? [image] : undefined,
        datePublished: article.createdAt?.toISOString() ?? article.date,
        dateModified: article.createdAt?.toISOString() ?? article.date,
        author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        articleSection: article.category,
        url,
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
            { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
    };

    return (
        <>
            <Script
                id={`ld-json-article-${article.slug}`}
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            <Script
                id={`ld-json-breadcrumb-${article.slug}`}
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <ArticlePageClient article={article} related={related} socialLinks={socialLinks} />
        </>
    );
}
