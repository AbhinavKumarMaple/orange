import Image from "next/image";
import { colors } from "@/lib/colors";
import SectionLayout from "./SectionLayout";
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
        <SectionLayout
            label="//05 Why choose us"
            heading={<>Details make<br />the difference</>}
            description="We're not just designers. We're your partners who help you grow and get real results you can see."
            bg={dark}
            textColor={colors.light}
            headerMb="mb-16"
        >
            {/* Stats */}
            <div className="mb-16">
                <div className="grid grid-cols-1 sm:grid-cols-2">
                    <StatItem value={stats[0].value} label={stats[0].label} />
                    <div className="w-full sm:hidden" style={{ height: 1, backgroundColor: "rgba(240, 245, 249, 0.12)" }} />
                    <StatItem value={stats[1].value} label={stats[1].label} />
                </div>
                <div className="w-full my-2" style={{ height: 1, backgroundColor: "rgba(240, 245, 249, 0.12)" }} />
                <div className="grid grid-cols-1 sm:grid-cols-2">
                    <StatItem value={stats[2].value} label={stats[2].label} />
                    <div className="w-full sm:hidden" style={{ height: 1, backgroundColor: "rgba(240, 245, 249, 0.12)" }} />
                    <StatItem value={stats[3].value} label={stats[3].label} />
                </div>
            </div>

            {/* Client logos — 2 cols on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {clientLogos.map((logo) => (
                    <div
                        key={logo.alt}
                        className="flex items-center justify-center"
                        style={{ backgroundColor: dark, borderRadius: 8, height: 100, border: "1px solid rgba(240,245,249,0.1)" }}
                    >
                        <Image
                            src={`${logo.src}?width=320&height=104`}
                            alt={logo.alt}
                            width={120}
                            height={40}
                            className="object-contain"
                        />
                    </div>
                ))}
            </div>
        </SectionLayout>
    );
}
