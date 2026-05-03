import { colors } from "@/lib/colors";
import LogoMarquee, { type MarqueeBrand } from "./LogoMarquee";
import ShowreelContent from "./ShowreelContent";

export default function ShowreelSection({ brands }: { brands: MarqueeBrand[] }) {
    return (
        <section data-section="Showreel" style={{ backgroundColor: colors.background }}>
            <LogoMarquee brands={brands} />
            <ShowreelContent />
        </section>
    );
}
