import { colors } from "@/lib/colors";
import SectionLayout from "./SectionLayout";
import PortfolioGrid from "./PortfolioGrid";
import type { projects } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Project = InferSelectModel<typeof projects>;

interface Props {
    projects: Project[];
}

export default function PortfolioSection({ projects }: Props) {
    return (
        <SectionLayout
            label="//03 Portfolio"
            heading={<>Selected work<br />(2023-2025)</>}
            description="Our portfolio showcases crafted work that blends creativity and strategy to help brands grow with impact."
            bg={colors.background}
            data-section="Portfolio"
        >
            <PortfolioGrid projects={projects} />
        </SectionLayout>
    );
}
