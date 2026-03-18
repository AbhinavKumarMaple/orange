"use client";

import { useState } from "react";
import { colors } from "@/lib/colors";
import SectionLayout from "./SectionLayout";
import Button from "./Button";
import type { pricingPlans } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Plan = InferSelectModel<typeof pricingPlans>;
type BillingMode = "project" | "monthly";

interface Props {
    plans: Plan[];
}

function PricingCard({ plan, billing, featured = false }: { plan: Plan; billing: BillingMode; featured?: boolean }) {
    const price = billing === "project" ? `$${plan.priceProject}` : `$${plan.priceMonthly}`;
    const suffix = billing === "project" ? "/per project" : "/monthly";

    return (
        <div
            className={`relative bg-white flex flex-col gap-5 border border-gray-100 ${featured ? "p-8 pt-12 -mt-8 shadow-md" : "p-8"}`}
            style={{ borderRadius: 8 }}
        >
            {plan.isFeatured && (
                <span
                    className="absolute -top-4 left-8 text-white text-[13px] font-medium px-4 py-1.5"
                    style={{ backgroundColor: colors.blue, borderRadius: 2 }}
                >
                    Most chosen
                </span>
            )}
            <div className={plan.isFeatured ? "mt-2" : ""}>
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
            <Button variant="primary" className="mt-auto w-full" style={{ fontSize: 15, padding: "16px 24px" }}>
                Choose this plan
            </Button>
            <p className="text-center text-[13px] text-gray-400">Delivery time: {plan.delivery}</p>
        </div>
    );
}

export default function PricingSection({ plans }: Props) {
    const [billing, setBilling] = useState<BillingMode>("project");

    const toggle = (
        <div className="flex flex-col items-end gap-4 self-end">
            <p
                className="font-sans font-normal text-right"
                style={{ color: "rgb(6,18,24)", fontSize: 20, lineHeight: "26px", letterSpacing: "-0.6px", maxWidth: 332, opacity: 0.5 }}
            >
                Pick a plan that fits your needs, with fair prices and no hidden surprises.
            </p>
            <div className="flex border overflow-hidden" style={{ borderColor: colors.blue, borderRadius: 2 }}>
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
                    <PricingCard key={plan.id} plan={plan} billing={billing} featured={plan.isFeatured} />
                ))}
            </div>
        </SectionLayout>
    );
}
