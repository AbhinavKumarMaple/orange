import { getArticles } from "@/lib/queries";
import ArticlesClient from "./ArticlesClient";

export default async function ArticlesPage() {
    const articles = await getArticles();
    return <ArticlesClient initialData={articles} />;
}
