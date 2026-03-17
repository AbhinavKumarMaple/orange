import { colors } from "@/lib/colors";
import LogoMarquee from "./LogoMarquee";
import ShowreelContent from "./ShowreelContent";

export default function ShowreelSection() {
    return (
        <section style={{ backgroundColor: colors.background }}>
            <LogoMarquee />
            <ShowreelContent />
        </section>
    );
}
