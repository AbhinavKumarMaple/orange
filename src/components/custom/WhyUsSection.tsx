import Image from "next/image";
import { colors } from "@/lib/colors";
import { splitHeading } from "@/lib/utils";
import SectionLayout from "./SectionLayout";
import StatItem from "./StatItem";

export interface ClientLogo {
    id: string;
    name: string;
    image: string;
    width: number;
    height: number;
}

export interface WhyUsData {
    label: string;
    heading: string;
    description: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
    stat4Value: string;
    stat4Label: string;
}

const FALLBACK: WhyUsData = {
    label: "//05 Why choose us",
    heading: "Details make|the difference",
    description:
        "We're not just designers. We're your partners who help you grow and get real results you can see.",
    stat1Value: "150+",
    stat1Label: "Completed projects",
    stat2Value: "3.2x",
    stat2Label: "Average ROI increase",
    stat3Value: "97%",
    stat3Label: "Client satisfaction rate",
    stat4Value: "24hr",
    stat4Label: "Average response time",
};

const dark = colors.dark;
const dividerStyle: React.CSSProperties = { height: 1, backgroundColor: "rgba(240, 245, 249, 0.12)" };

export default function WhyUsSection({
    data,
    logos = [],
}: {
    data?: WhyUsData | null;
    logos?: ClientLogo[];
}) {
    const d = data ?? FALLBACK;

    // Render heading via splitHeading so the "|" line-break convention works.
    const headingLines = splitHeading(d.heading);
    const headingNode = headingLines.length > 1 ? (
        <>{headingLines.map((l, i) => (
            <span key={i}>{l}{i < headingLines.length - 1 && <br />}</span>
        ))}</>
    ) : (
        d.heading
    );

    // Collect stats and drop empty slots so editors can hide one by clearing it.
    const stats = [
        { value: d.stat1Value, label: d.stat1Label },
        { value: d.stat2Value, label: d.stat2Label },
        { value: d.stat3Value, label: d.stat3Label },
        { value: d.stat4Value, label: d.stat4Label },
    ].filter((s) => s.value || s.label);

    return (
        <SectionLayout
            label={d.label}
            heading={headingNode}
            description={d.description}
            bg={dark}
            textColor={colors.light}
            headerMb="mb-16"
            data-section="WhyUs"
        >
            {/* Stats — render in rows of 2 with a divider between rows so the
                original 2x2 layout is preserved while still adapting to fewer
                stats (1, 2, 3) when an editor clears slots. */}
            {stats.length > 0 && (
                <div className="mb-16">
                    {Array.from({ length: Math.ceil(stats.length / 2) }).map((_, rowIdx) => {
                        const rowStats = stats.slice(rowIdx * 2, rowIdx * 2 + 2);
                        return (
                            <div key={rowIdx}>
                                {rowIdx > 0 && <div className="w-full my-2" style={dividerStyle} />}
                                <div className="grid grid-cols-1 sm:grid-cols-2">
                                    <StatItem value={rowStats[0].value} label={rowStats[0].label} />
                                    {rowStats[1] ? (
                                        <>
                                            <div className="w-full sm:hidden" style={dividerStyle} />
                                            <StatItem value={rowStats[1].value} label={rowStats[1].label} />
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Client logos — 2 cols on mobile, 4 on desktop. Grid wraps to
                additional rows naturally so any logo count works. */}
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
