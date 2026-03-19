"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsData } from "./types";

interface Props {
    data: AnalyticsData;
}

export default function OverviewCards({ data }: Props) {
    const { overview, formResults, period } = data;
    const submissions = formResults.find((r) => r.event === "contact_form_submitted")?.count || 0;
    const errors = formResults.find((r) => r.event === "contact_form_error")?.count || 0;
    const conversionRate = overview.unique_visitors > 0
        ? ((submissions / overview.unique_visitors) * 100).toFixed(1)
        : "0";

    const cards = [
        { label: "Unique Visitors", value: overview.unique_visitors.toLocaleString() },
        { label: "Total Page Views", value: overview.total_pageviews.toLocaleString() },
        { label: "Sessions", value: overview.total_sessions.toLocaleString() },
        { label: "Contact Submissions", value: submissions.toLocaleString() },
        { label: "Form Errors", value: errors.toLocaleString() },
        { label: "Conversion Rate", value: `${conversionRate}%` },
    ];

    return (
        <div>
            <p className="text-xs text-gray-400 mb-3">Last {period} days</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {cards.map((c) => (
                    <Card key={c.label}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-medium text-gray-500">{c.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-gray-900">{c.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
