import Image from "next/image";
import { colors } from "@/lib/colors";
import PortfolioGrid from "./PortfolioGrid";

export default function PortfolioSection() {
    return (
        <section style={{ backgroundColor: colors.background }} className="px-8 pt-16 pb-16">
            {/* Header row */}
            <div className="flex items-start justify-between mb-12">
                <div>
                    <p
                        className="font-mono font-medium mb-3"
                        style={{ color: colors.blue, fontSize: 20, lineHeight: "26px", letterSpacing: "-0.4px" }}
                    >
            //03 Portfolio
                    </p>
                    <h2
                        className="font-sans font-medium uppercase"
                        style={{ color: "rgb(6, 18, 24)", fontSize: 88, lineHeight: "96.8px", letterSpacing: "-3.52px" }}
                    >
                        Selected work
                        <br />
                        (2023-2025)
                    </h2>
                </div>

                <p
                    className="font-sans font-normal self-end text-right"
                    style={{
                        color: "rgb(6, 18, 24)",
                        fontSize: 20,
                        lineHeight: "26px",
                        letterSpacing: "-0.6px",
                        maxWidth: 332,
                        opacity: 0.5,
                    }}
                >
                    Our portfolio showcases crafted work that blends creativity and strategy to help brands grow with impact.
                </p>
            </div>

            <PortfolioGrid />
        </section>
    );
}
