import { colors } from "@/lib/colors";
import ServiceRows from "./ServiceRows";
import type { services } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Service = InferSelectModel<typeof services>;

interface Props {
    services: Service[];
}

export default function ServicesSection({ services }: Props) {
    return (
        <section
            data-section="Services"
            style={{ backgroundColor: colors.dark }}
            className="px-5 sm:px-8 pt-16 pb-16"
        >
            {/* Label */}
            <p
                className="font-mono font-medium mb-4"
                style={{ color: colors.accent, fontSize: "clamp(14px, 2vw, 20px)", lineHeight: "26px", letterSpacing: "-0.4px" }}
            >
                //04 Our services
            </p>

            {/* Full-width heading */}
            <h2
                className="font-sans font-medium uppercase w-full"
                style={{
                    color: colors.light,
                    fontSize: "clamp(52px, 9.85vw, 190px)",
                    lineHeight: "0.9",
                    letterSpacing: "-0.05em",
                    marginBottom: "4rem",
                }}
            >
                Our Services
            </h2>

            <ServiceRows services={services} />
        </section>
    );
}
