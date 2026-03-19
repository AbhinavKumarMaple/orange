import { colors } from "@/lib/colors";
import LogoMarquee from "./LogoMarquee";
import ShowreelContent from "./ShowreelContent";

export default function ShowreelSection() {
    return (
        <section data-section="Showreel" style={{ backgroundColor: colors.background }}>
            <LogoMarquee />
            <ShowreelContent />
        </section>
    );
}
