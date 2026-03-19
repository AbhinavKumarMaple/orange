import { colors } from "@/lib/colors";
import SectionLayout from "./SectionLayout";
import type { services } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Service = InferSelectModel<typeof services>;

interface Props {
    services: Service[];
}

const dark = "rgb(6, 18, 24)";

export default function ServicesSection({ services }: Props) {
    return (
        <SectionLayout
            label="//04 Our services"
            heading="Our Services"
            description="Our Services"
            bg={dark}
            textColor={colors.light}
            headingStyle={{
                fontSize: "clamp(52px, 8.85vw, 170px)",
                lineHeight: "0.9",
                letterSpacing: "-0.05em",
                marginBottom: "4rem",
            }}
            headerMb="mb-0"
        >
            <div className="flex flex-col">
                {services.map((s) => (
                    <div
                        key={s.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6 sm:py-8 border-t gap-2 sm:gap-0"
                        style={{ borderColor: "rgba(240, 245, 249, 0.15)" }}
                    >
                        <div className="flex items-center gap-4 sm:gap-16">
                            <p
                                className="font-mono font-medium shrink-0"
                                style={{ color: colors.light, fontSize: 16, letterSpacing: "-0.32px", opacity: 0.5, minWidth: 28 }}
                            >
                                {s.number}
                            </p>
                            <p
                                className="font-sans font-normal"
                                style={{ color: colors.light, fontSize: "clamp(32px, 5vw, 72px)", lineHeight: "1.1", letterSpacing: "-0.04em" }}
                            >
                                {s.name}
                            </p>
                        </div>
                        <p
                            className="font-sans font-normal sm:text-right pl-10 sm:pl-0"
                            style={{ color: colors.light, fontSize: "clamp(13px, 1.4vw, 20px)", lineHeight: "1.4", letterSpacing: "-0.6px", maxWidth: 280, opacity: 0.5 }}
                        >
                            {s.description}
                        </p>
                    </div>
                ))}
                <div className="border-t" style={{ borderColor: "rgba(240, 245, 249, 0.15)" }} />
            </div>
        </SectionLayout>
    );
}
