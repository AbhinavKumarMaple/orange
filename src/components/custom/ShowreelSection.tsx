import { colors } from "@/lib/colors";
import LogoMarquee, { type MarqueeBrand } from "./LogoMarquee";
import ShowreelContent, { type ShowreelData } from "./ShowreelContent";

export default function ShowreelSection({
    brands,
    showreel,
}: {
    brands: MarqueeBrand[];
    showreel: ShowreelData | null;
}) {
    return (
        <section data-section="Showreel" style={{ backgroundColor: colors.background }}>
            <LogoMarquee brands={brands} />
            <ShowreelContent data={showreel} />
        </section>
    );
}
