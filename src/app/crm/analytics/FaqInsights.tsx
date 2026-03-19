"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsData } from "./types";

interface Props {
    faqOpens: AnalyticsData["faqOpens"];
}

export default function FaqInsights({ faqOpens }: Props) {
    const maxOpens = Math.max(...faqOpens.map((f) => f.opens), 1);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm">FAQ Engagement</CardTitle>
            </CardHeader>
            <CardContent>
                {faqOpens.length === 0 ? (
                    <p className="text-sm text-gray-400">No FAQ interaction data yet</p>
                ) : (
                    <div className="space-y-3">
                        {faqOpens.map((f, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-700 truncate pr-4">{f.question}</span>
                                    <span className="font-mono text-gray-500 shrink-0">{f.opens}</span>
                                </div>
                                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-amber-500 h-full rounded-full"
                                        style={{ width: `${(f.opens / maxOpens) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
