import { colors } from "@/lib/colors";
import SectionLayout from "./SectionLayout";
import ServiceRows from "./ServiceRows";
import type { services } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Service = InferSelectModel<typeof services>;

interface Props {
    services: Service[];
}

const dark = colors.dark;

export default function ServicesSection({ services }: Props) {
    return (
        <SectionLayout
            label="//04 Our services"
            heading="Our Services"
            description="Our Services"
            bg={dark}
            textColor={colors.light}
            data-section="Services"
            headingStyle={{
                fontSize: "clamp(52px, 8.85vw, 170px)",
                lineHeight: "0.9",
                letterSpacing: "-0.05em",
                marginBottom: "4rem",
            }}
            headerMb="mb-0"
        >
            <ServiceRows services={services} />
        </SectionLayout>
    );
}
