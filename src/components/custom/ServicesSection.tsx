import { colors } from "@/lib/colors";

const services = [
    { num: "001", name: "Branding", desc: "Visual systems that make your business unforgettable and differentiate you from competitors." },
    { num: "002", name: "Web design", desc: "Custom websites that look stunning, perform flawlessly, and convert visitors into customers." },
    { num: "003", name: "UX/UI Design", desc: "Strategic UX/UI design that turns confused visitors into converting loyal customers." },
    { num: "004", name: "Digital marketing", desc: "Data-driven campaigns that grow your audience and turn clicks into measurable revenue." },
];

export default function ServicesSection() {
    return (
        <section style={{ backgroundColor: "rgb(6, 18, 24)" }} className="px-8 pt-16 pb-16">
            {/* Label */}
            <p
                className="font-mono font-medium mb-4"
                style={{ color: colors.light, fontSize: 20, lineHeight: "26px", letterSpacing: "-0.4px" }}
            >
        //04 Our services
            </p>

            {/* Giant heading — full width */}
            <h2
                className="font-sans font-medium uppercase w-full mb-16"
                style={{
                    color: colors.light,
                    fontSize: "clamp(60px, 8.85vw, 170px)",
                    lineHeight: "0.9",
                    letterSpacing: "-0.05em",
                }}
            >
                Our Services
            </h2>

            {/* Service rows */}
            <div className="flex flex-col">
                {services.map((s, i) => (
                    <div
                        key={s.num}
                        className="flex items-center justify-between py-8 border-t"
                        style={{ borderColor: "rgba(240, 245, 249, 0.15)" }}
                    >
                        <div className="flex items-center gap-16">
                            <p
                                className="font-mono font-medium"
                                style={{ color: colors.light, fontSize: 16, letterSpacing: "-0.32px", opacity: 0.5, minWidth: 40 }}
                            >
                                {s.num}
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
                            style={{
                                color: colors.light,
                                fontSize: 20,
                                lineHeight: "26px",
                                letterSpacing: "-0.6px",
                                maxWidth: 280,
                                opacity: 0.5,
                            }}
                        >
                            {s.desc}
                        </p>
                    </div>
                ))}
                {/* Bottom border */}
                <div className="border-t" style={{ borderColor: "rgba(240, 245, 249, 0.15)" }} />
            </div>
        </section>
    );
}
