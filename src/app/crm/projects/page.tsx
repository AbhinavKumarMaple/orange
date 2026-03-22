import { getProjects } from "@/lib/queries";
import ProjectsClient from "./ProjectsClient";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
    const projects = await getProjects();
    return <ProjectsClient initialData={projects} />;
}
