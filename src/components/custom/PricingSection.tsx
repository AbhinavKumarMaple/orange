"use client";

import { useState } from "react";
import { colors } from "@/lib/colors";
import SectionLayout from "./SectionLayout";

type BillingMode = "project" | "monthly";

interface Plan {
    name: string;
    subtitle: string;
    badge?: string;
    projectPrice: string;
    monthlyPrice: string;
    features: string[];
    delivery: string;
}

const plans: Plan[] = [
    {
        name: "Essential Plan",
        subtitle: "For Startups, new businesses, single location companies",
        projectPrice: "$3499",
        monthlyPrice: "$999",
        features: [
            "Brand identity design",
            "Basic website (5 pages)",
            "Social media templates",
            "Monthly strategy session",
            "Project kickoff workshop",
            "2 revision rounds per month",
        ],
        delivery: "3-4 weeks",
    },
    {
        name: "Professional Plan",
        subtitle: "Best for growing businesses ready to scale",
        badge: "Most chosen",
        projectPrice: "$6499",
        monthlyPrice: "$1999",
        features: [
            "Advanced brand identity system",
            "Custom website (up to 10 pages)",
            "Digital marketing strategy",
            "Monthly strategy session",
            "Unlimited revisions",
            "SEO optimization",
        ],
        delivery: "6-8 weeks",
    },
    {
        name: "Premium Plan",
        subtitle: "For companies serious about market leadership",
        projectPrice: "$11999",
        monthlyPrice: "$3499",
        features: [
            "Complete brand ecosystem",
            "Enterprise web platform",
            "Comprehensive marketing system",
            "12 months partnership support",
            "Dedicated account manager",
            "Quarterly strategy reviews",
        ],
        delivery: "8-12 weeks",
    },
];

function PricingCard({ plan, billing, featured = false }: { plan: Plan; billing: BillingMode; featured?: boolean }) {
    const price = billing === "project" ? plan.projectPrice : plan.monthlyPrice;
    const suffix = billing === "project" ? "/per project" : "/monthly";

    return (
        <div className={`relative bg-white rounded-xl flex flex-col gap-5 border border-gray-100 ${featured ? "p-8 pt-12 -mt-8 shadow-md" : "p-8"}`}>
            {plan.badge && (
                <span className="absolute -top-4 left-8 bg-[#1F75B2] text-white text-[13px] font-medium px-4 py-1.5 rounded-full">
                    {plan.badge}
                </span>
            )}
            <div className={plan.badge ? "mt-2" : ""}>
                <h3 className="text-[22px] font-bold text-gray-900">{plan.name}</h3>
                <p className="text-[14px] text-gray-600 mt-1">{plan.subtitle}</p>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="font-bold text-gray-900" style={{ fontSize: "clamp(40px, 4.5vw, 60px)" }}>{price}</span>
                <span className="text-[14px] text-gray-500">{suffix}</span>
            </div>
            <ul className="flex flex-col gap-3">
                {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[15px] text-gray-700">
                        <span className="w-[7px] h-[7px] rounded-full bg-[#1F75B2] mt-[6px] shrink-0" />
                        {f}
                    </li>
                ))}
            </ul>
            <button className="mt-auto w-full bg-[#1F75B2] hover:bg-[#1a6699] text-white text-[15px] font-medium py-4 rounded-lg transition-colors cursor-pointer">
                Choose this plan
            </button>
            <p className="text-center text-[13px] text-gray-400">Delivery time: {plan.delivery}</p>
        </div>
    );
}

export default function PricingSection() {
    const [billing, setBilling] = useState<BillingMode>("project");

    const toggle = (
        <div className="flex flex-col items-end gap-4 self-end">
            <p
                className="font-sans font-normal text-right"
                style={{ color: "rgb(6,18,24)", fontSize: 20, lineHeight: "26px", letterSpacing: "-0.6px", maxWidth: 332, opacity: 0.5 }}
            >
                Pick a plan that fits your needs, with fair prices and no hidden surprises.
            </p>
            <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: colors.blue }}>
                <button
                    onClick={() => setBilling("project")}
                    className="px-4 py-2 text-[14px] font-medium transition-colors cursor-pointer"
                    style={{ backgroundColor: billing === "project" ? colors.blue : "transparent", color: billing === "project" ? "#fff" : colors.blue }}
                >
                    Per project
                </button>
                <button
                    onClick={() => setBilling("monthly")}
                    className="px-4 py-2 text-[14px] font-medium transition-colors cursor-pointer"
                    style={{ backgroundColor: billing === "monthly" ? colors.blue : "transparent", color: billing === "monthly" ? "#fff" : colors.blue }}
                >
                    Monthly
                </button>
            </div>
        </div>
    );

    return (
        <SectionLayout
            label="//07 Pricing"
            heading={<>Clear and<br />simple plans</>}
            bg={colors.background}
            headerRight={toggle}
            headerMb="mb-12"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mt-8">
                {plans.map((plan) => (
                    <PricingCard key={plan.name} plan={plan} billing={billing} featured={plan.badge === "Most chosen"} />
                ))}
            </div>
        </SectionLayout>
    );
}
