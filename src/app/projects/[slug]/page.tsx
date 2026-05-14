import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { getProject, getProjects, getSocialLinks } from "@/lib/queries";
import { siteConfig, absoluteUrl, twitterCard } from "@/lib/site";
import { flattenHeading } from "@/lib/utils";
import { VideoPosterProvider } from "@/components/custom/VideoPosterProvider";
import { loadVideoPosters, collectMediaUrls } from "@/lib/media-posters";
import ProjectPageClient from "./ProjectPageClient";

export const dynamicParams = true;

export async function generateStaticParams() {
    const projects = await getProjects();
    return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProject(slug);
    if (!project) return {};

    const url = absoluteUrl(`/projects/${project.slug}`);
    const ogImage =
        project.coverImage ||
        project.heroImage ||
        absoluteUrl(`/projects/${project.slug}/opengraph-image`);
    const flatName = flattenHeading(project.name);

    return {
        title: flatName,
        description: project.description,
        keywords: [project.category, project.industry, "case study", "project", ...siteConfig.keywords],
        alternates: { canonical: `/projects/${project.slug}` },
        openGraph: {
            type: "article",
            url,
            title: `${flatName} — ${project.category}`,
            description: project.description,
            siteName: siteConfig.name,
            images: [{ url: ogImage, width: 1200, height: 630, alt: flatName }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${flatName} — ${project.category}`,
            description: project.description,
            images: [ogImage],
            ...twitterCard(),
        },
    };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [project, socialLinks] = await Promise.all([getProject(slug), getSocialLinks()]);
    if (!project) notFound();

    const url = absoluteUrl(`/projects/${project.slug}`);
    const image = project.coverImage || project.heroImage;

    const flatName = flattenHeading(project.name);
    const projectJsonLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: flatName,
        description: project.description,
        image: image ? [image] : undefined,
        url,
        creator: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        datePublished: project.year,
        genre: project.category,
        about: project.industry,
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Portfolio", item: absoluteUrl("/projects") },
            { "@type": "ListItem", position: 3, name: flatName, item: url },
        ],
    };

    const posters = Array.from(
        (
            await loadVideoPosters(
                collectMediaUrls(
                    project.heroImage,
                    project.coverImage,
                    project.icon,
                    project.images,
                ),
            )
        ).entries(),
    );

    return (
        <VideoPosterProvider posters={posters}>
            <Script
                id={`ld-json-project-${project.slug}`}
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
            />
            <Script
                id={`ld-json-breadcrumb-${project.slug}`}
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <ProjectPageClient project={project} socialLinks={socialLinks} />
        </VideoPosterProvider>
    );
}
