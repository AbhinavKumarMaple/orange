import type { MetadataRoute } from "next";
import { getArticles, getProjects } from "@/lib/queries";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  try {
    const [projects, articles] = await Promise.all([getProjects(), getArticles()]);

    const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: p.createdAt ?? now,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
      url: `${base}/articles/${a.slug}`,
      lastModified: a.createdAt ?? now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...projectRoutes, ...articleRoutes];
  } catch {
    return staticRoutes;
  }
}
