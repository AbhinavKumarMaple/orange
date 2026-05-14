import type { Metadata } from "next";
import Script from "next/script";
import { getProjects, getSocialLinks } from "@/lib/queries";
import { siteConfig, absoluteUrl, twitterCard } from "@/lib/site";
import { VideoPosterProvider } from "@/components/custom/VideoPosterProvider";
import { loadVideoPosters, collectMediaUrls } from "@/lib/media-posters";
import ProjectsPageClient from "./ProjectsPageClient";

const title = "Portfolio — Selected Work";
const description =
    "Explore Orange Studios' selected work — crafted projects that blend creativity and strategy to help brands grow with measurable impact.";

export const metadata: Metadata = {
    title,
    description,
    keywords: ["portfolio", "case studies", "design projects", "creative work", ...siteConfig.keywords],
    alternates: { canonical: "/projects" },
    openGraph: {
        type: "website",
        url: absoluteUrl("/projects"),
        title,
        description,
        siteName: siteConfig.name,
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
        ...twitterCard(),
    },
};

export default async function ProjectsPage() {
    const [projects, socialLinks] = await Promise.all([getProjects(), getSocialLinks()]);

    const itemListJsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${siteConfig.name} Portfolio`,
        url: absoluteUrl("/projects"),
        itemListElement: projects.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: absoluteUrl(`/projects/${p.slug}`),
            name: p.name,
        })),
    };

    const posters = Array.from(
        (
            await loadVideoPosters(
                collectMediaUrls(
                    ...projects.flatMap((p) => [p.heroImage, p.coverImage, p.icon, ...(p.images ?? [])]),
                ),
            )
        ).entries(),
    );

    return (
        <VideoPosterProvider posters={posters}>
            <Script
                id="ld-json-portfolio"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
            />
            <ProjectsPageClient projects={projects} socialLinks={socialLinks} />
        </VideoPosterProvider>
    );
}
