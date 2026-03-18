import { notFound } from "next/navigation";
import { getArticle, articles } from "@/lib/articles";
import ArticlePageClient from "./ArticlePageClient";

export function generateStaticParams() {
    return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = getArticle(slug);
    if (!article) return {};
    return { title: `${article.title} — Nori Studio` };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = getArticle(slug);
    if (!article) notFound();
    return <ArticlePageClient article={article} />;
}
