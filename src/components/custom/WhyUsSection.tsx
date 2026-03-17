import Image from "next/image";
import { colors } from "@/lib/colors";
import StatItem from "./StatItem";

const stats = [
    { value: "150+", label: "Completed projects" },
    { value: "3.2x", label: "Average ROI increase" },
    { value: "97%", label: "Client satisfaction rate" },
    { value: "24hr", label: "Average response time" },
];

const clientLogos = [
    { src: "https://framerusercontent.com/images/awDtj7rqkXF0BCm12jsm7BzLczg.svg", alt: "Velo Studio" },
    { src: "https://framerusercontent.com/images/zUJMCCKSzjR4tLQ8amSnfss8UUA.svg", alt: "Urban bites" },
    { src: "https://framerusercontent.com/images/faK3uVL6HKHj0lUYRZh2fWmn3o.svg", alt: "Baseline Sports" },
    { src: "https://framerusercontent.com/images/NwlOGrknUmkPlpa4MVL7oF0w48Q.svg", alt: "Northcap Supply" },
];

const dark = "rgb(6, 18, 24)";

export default function WhyUsSection() {
    return (
        <section style={{ backgroundColor: dark }} className="px-8 pt-16 pb-16">
            {/* Label + heading + description */}
            <div className="flex items-start justify-between mb-16">
                <div>
                    <p
                        className="font-mono font-medium mb-4"
                        style={{ color: colors.light, fontSize: 20, lineHeight: "26px", letterSpacing: "-0.4px" }}
                    >
            //05 Why choose us
                    </p>
                    <h2
                        className="font-sans font-medium uppercase"
                        style={{ color: colors.light, fontSize: 88, lineHeight: "96.8px", letterSpacing: "-3.52px", maxWidth: 692 }}
                    >
                        Details make
                        <br />
                        the difference
                    </h2>
                </div>

                <p
                    className="font-sans font-normal self-end text-right"
                    style={{
                        color: colors.light,
                        fontSize: 20,
                        lineHeight: "26px",
                        letterSpacing: "-0.6px",
                        maxWidth: 290,
                        opacity: 0.5,
                    }}
                >
                    We&apos;re not just designers. We&apos;re your partners who help you grow and get real results you can see.
                </p>
            </div>

            {/* Stats — 2 col grid, each stat has number left + label right-aligned */}
            <div className="mb-16">
                {/* Row 1 */}
                <div className="grid grid-cols-2">
                    <StatItem value={stats[0].value} label={stats[0].label} />
                    <StatItem value={stats[1].value} label={stats[1].label} />
                </div>

                {/* Divider */}
                <div className="w-full my-2" style={{ height: 1, backgroundColor: "rgba(240, 245, 249, 0.12)" }} />

                {/* Row 2 */}
                <div className="grid grid-cols-2">
                    <StatItem value={stats[2].value} label={stats[2].label} />
                    <StatItem value={stats[3].value} label={stats[3].label} />
                </div>
            </div>

            {/* Client logo cards */}
            <div className="grid grid-cols-4 gap-6">
                {clientLogos.map((logo) => (
                    <div
                        key={logo.alt}
                        className="flex items-center justify-center"
                        style={{
                            backgroundColor: dark,
                            borderRadius: 4,
                            height: 132,
                            border: "1px solid rgba(240,245,249,0.1)",
                        }}
                    >
                        <Image
                            src={`${logo.src}?width=320&height=104`}
                            alt={logo.alt}
                            width={160}
                            height={52}
                            className="object-contain"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
