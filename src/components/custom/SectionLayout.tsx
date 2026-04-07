import { colors } from "@/lib/colors";
import { cn } from "@/lib/utils";

interface SectionLayoutProps {
    label: string;
    heading: React.ReactNode;
    description?: string;
    bg?: string;
    textColor?: string;
    children?: React.ReactNode;
    className?: string;
    headerRight?: React.ReactNode;
    headingStyle?: React.CSSProperties;
    headerMb?: string;
    "data-section"?: string;
}

export default function SectionLayout({
    label,
    heading,
    description,
    bg = colors.background,
    textColor = colors.dark,
    children,
    className,
    headerRight,
    headingStyle,
    headerMb = "mb-12",
    "data-section": dataSection,
}: SectionLayoutProps) {
    const defaultHeadingStyle: React.CSSProperties = {
        color: textColor,
        fontSize: "clamp(48px, 7vw, 88px)",
        lineHeight: "1.1",
        letterSpacing: "-0.04em",
    };

    return (
        <section style={{ backgroundColor: bg }} className={cn("px-5 sm:px-8 pt-16 pb-16", className)} data-section={dataSection}>
            {/* Header row — stacks on mobile */}
            <div className={cn("flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4", headerMb)}>
                <div>
                    <p
                        className="font-mono font-medium mb-3"
                        style={{ color: colors.blue, fontSize: "clamp(14px, 2vw, 20px)", lineHeight: "26px", letterSpacing: "-0.4px" }}
                    >
                        {label}
                    </p>
                    <h2
                        className="font-sans font-medium uppercase"
                        style={{ ...defaultHeadingStyle, ...headingStyle }}
                    >
                        {heading}
                    </h2>
                </div>

                {headerRight ?? (description && (
                    <p
                        className="font-sans font-normal sm:self-end sm:text-right"
                        style={{
                            color: textColor,
                            fontSize: "clamp(14px, 1.5vw, 20px)",
                            lineHeight: "1.4",
                            letterSpacing: "-0.6px",
                            maxWidth: 332,
                            opacity: 0.5,
                        }}
                    >
                        {description}
                    </p>
                ))}
            </div>

            {children}
        </section>
    );
}
