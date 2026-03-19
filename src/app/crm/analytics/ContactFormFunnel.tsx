"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsData } from "./types";

const FIELD_ORDER = ["name", "email", "company", "message"];
const FIELD_LABELS: Record<string, string> = {
    name: "Name",
    email: "Email",
    company: "Company",
    message: "Message",
};

interface Props {
    formFunnel: AnalyticsData["formFunnel"];
    formResults: AnalyticsData["formResults"];
}

export default function ContactFormFunnel({ formFunnel, formResults }: Props) {
    const funnelMap = new Map(formFunnel.map((f) => [f.field, f]));
    const submissions = formResults.find((r) => r.event === "contact_form_submitted")?.count || 0;
    const errors = formResults.find((r) => r.event === "contact_form_error")?.count || 0;

    const maxFocus = Math.max(...formFunnel.map((f) => f.unique_sessions), 1);

    const steps = [
        ...FIELD_ORDER.map((field) => ({
            label: FIELD_LABELS[field] || field,
            count: funnelMap.get(field)?.unique_sessions || 0,
        })),
        { label: "Submitted", count: submissions },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm">Contact Form Funnel</CardTitle>
            </CardHeader>
            <CardContent>
                {formFunnel.length === 0 && submissions === 0 ? (
                    <p className="text-sm text-gray-400">No form interaction data yet</p>
                ) : (
                    <div className="space-y-3">
                        {steps.map((step, i) => {
                            const pct = maxFocus > 0 ? (step.count / maxFocus) * 100 : 0;
                            const isLast = i === steps.length - 1;
                            return (
                                <div key={step.label}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className={isLast ? "font-medium text-green-700" : "text-gray-700"}>
                                            {step.label}
                                        </span>
                                        <span className="font-mono text-gray-500">{step.count}</span>
                                    </div>
                                    <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${isLast ? "bg-green-500" : "bg-blue-500"}`}
                                            style={{ width: `${Math.max(pct, 2)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {errors > 0 && (
                            <p className="text-xs text-red-500 mt-2">
                                {errors} submission error{errors !== 1 ? "s" : ""}
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
