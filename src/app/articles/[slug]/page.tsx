import { notFound } from "next/navigation";
import { getArticle, getArticles, getRelatedArticles } from "@/lib/queries";
import ArticlePageClient from "./ArticlePageClient";

export const dynamicParams = true;

export async function generateStaticParams() {
    const articles = await getArticles();
    return articles.map((a) => ({ slug: a.slug }));
}

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await getArticle(slug);
    if (!article) return {};
    return { title: `${article.title} — Orange Studios` };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [article, related] = await Promise.all([
        getArticle(slug),
        getRelatedArticles(slug),
    ]);
    if (!article) notFound();
    return <ArticlePageClient article={article} related={related} />;
}
