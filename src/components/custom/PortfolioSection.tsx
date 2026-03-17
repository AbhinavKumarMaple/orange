import { colors } from "@/lib/colors";
import SectionLayout from "./SectionLayout";
import PortfolioGrid from "./PortfolioGrid";

export default function PortfolioSection() {
    return (
        <SectionLayout
            label="//03 Portfolio"
            heading={<>Selected work<br />(2023-2025)</>}
            description="Our portfolio showcases crafted work that blends creativity and strategy to help brands grow with impact."
            bg={colors.background}
        >
            <PortfolioGrid />
        </SectionLayout>
    );
}
