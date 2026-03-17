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
    /** Extra content to render in the right side of the header (replaces description) */
    headerRight?: React.ReactNode;
    /** Override heading style (font-size, line-height, etc.) */
    headingStyle?: React.CSSProperties;
    /** Override header row bottom margin class, default "mb-12" */
    headerMb?: string;
}

export default function SectionLayout({
    label,
    heading,
    description,
    bg = colors.background,
    textColor = "rgb(6, 18, 24)",
    children,
    className,
    headerRight,
    headingStyle,
    headerMb = "mb-12",
}: SectionLayoutProps) {
    const defaultHeadingStyle: React.CSSProperties = {
        color: textColor,
        fontSize: 88,
        lineHeight: "96.8px",
        letterSpacing: "-3.52px",
    };

    return (
        <section style={{ backgroundColor: bg }} className={cn("px-8 pt-16 pb-16", className)}>
            {/* Header row */}
            <div className={cn("flex items-start justify-between", headerMb)}>
                <div>
                    <p
                        className="font-mono font-medium mb-3"
                        style={{ color: colors.blue, fontSize: 20, lineHeight: "26px", letterSpacing: "-0.4px" }}
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
                        className="font-sans font-normal self-end text-right"
                        style={{
                            color: textColor,
                            fontSize: 20,
                            lineHeight: "26px",
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
