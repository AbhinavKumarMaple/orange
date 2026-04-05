import { Metadata } from "next";
import { getProjects, getSocialLinks } from "@/lib/queries";
import ProjectsPageClient from "./ProjectsPageClient";

export const metadata: Metadata = {
    title: "Portfolio — Orange Studios",
    description: "Explore our selected work — crafted projects that blend creativity and strategy to help brands grow with impact.",
};

export default async function ProjectsPage() {
    const [projects, socialLinks] = await Promise.all([getProjects(), getSocialLinks()]);
    return <ProjectsPageClient projects={projects} socialLinks={socialLinks} />;
}
