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
                fontSize: "clamp(60px, 8.85vw, 170px)",
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
                        className="flex items-center justify-between py-8 border-t"
                        style={{ borderColor: "rgba(240, 245, 249, 0.15)" }}
                    >
                        <div className="flex items-center gap-16">
                            <p
                                className="font-mono font-medium"
                                style={{ color: colors.light, fontSize: 16, letterSpacing: "-0.32px", opacity: 0.5, minWidth: 40 }}
                            >
                                {s.number}
                            </p>
                            <p
                                className="font-sans font-normal"
                                style={{ color: colors.light, fontSize: 72, lineHeight: "79.2px", letterSpacing: "-2.88px" }}
                            >
                                {s.name}
                            </p>
                        </div>
                        <p
                            className="font-sans font-normal text-right"
                            style={{ color: colors.light, fontSize: 20, lineHeight: "26px", letterSpacing: "-0.6px", maxWidth: 280, opacity: 0.5 }}
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
