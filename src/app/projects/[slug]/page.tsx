import { notFound } from "next/navigation";
import { getProject, getProjects, getSocialLinks } from "@/lib/queries";
import ProjectPageClient from "./ProjectPageClient";

export const dynamicParams = true;

export async function generateStaticParams() {
    const projects = await getProjects();
    return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await getProject(slug);
    if (!project) return {};
    return { title: `${project.name} — Orange Studios` };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [project, socialLinks] = await Promise.all([getProject(slug), getSocialLinks()]);
    if (!project) notFound();
    return <ProjectPageClient project={project} socialLinks={socialLinks} />;
}
