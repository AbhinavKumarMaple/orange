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

export interface ClientLogo {
    id: string;
    name: string;
    image: string;
    width: number;
    height: number;
}

const dark = colors.dark;

export default function WhyUsSection({ logos = [] }: { logos?: ClientLogo[] }) {
    return (
        <SectionLayout
            label="//05 Why choose us"
            heading={<>Details make<br />the difference</>}
            description="We're not just designers. We're your partners who help you grow and get real results you can see."
            bg={dark}
            textColor={colors.light}
            headerMb="mb-16"
            data-section="WhyUs"
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

            {/* Client logos — 2 cols on mobile, 4 on desktop. Grid grows naturally
                with row count, so any logo count (2, 6, 8…) lays out cleanly. */}
            {logos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                    {logos.map((logo) => (
                        <div
                            key={logo.id}
                            className="flex items-center justify-center"
                            style={{ backgroundColor: dark, borderRadius: 8, height: 100, border: "1px solid rgba(240,245,249,0.1)" }}
                        >
                            <Image
                                src={logo.image}
                                alt={logo.name}
                                width={logo.width}
                                height={logo.height}
                                className="object-contain"
                                style={{ width: "auto", height: "auto", maxWidth: "70%", maxHeight: 40 }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </SectionLayout>
    );
}
