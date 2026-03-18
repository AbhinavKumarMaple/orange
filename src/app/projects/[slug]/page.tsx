import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/projects";
import ProjectPageClient from "./ProjectPageClient";

export function generateStaticParams() {
    return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = getProject(slug);
    if (!project) return {};
    return { title: `${project.name} — Nori Studio` };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = getProject(slug);
    if (!project) notFound();
    return <ProjectPageClient project={project} />;
}
