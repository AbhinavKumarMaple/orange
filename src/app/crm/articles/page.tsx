import { getArticles } from "@/lib/queries";
import ArticlesClient from "./ArticlesClient";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
    const articles = await getArticles();
    return <ArticlesClient initialData={articles} />;
}
