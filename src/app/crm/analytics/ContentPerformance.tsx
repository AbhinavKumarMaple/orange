"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsData } from "./types";

interface Props {
    topArticles: AnalyticsData["topArticles"];
    topProjects: AnalyticsData["topProjects"];
}

function extractSlug(path: string): string {
    const parts = path.split("/").filter(Boolean);
    return parts[parts.length - 1] || path;
}

function formatSlug(slug: string): string {
    return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function ContentList({ items, emptyMsg }: { items: { page: string; views: number }[]; emptyMsg: string }) {
    if (items.length === 0) {
        return <p className="text-sm text-gray-400">{emptyMsg}</p>;
    }

    const maxViews = Math.max(...items.map((i) => i.views), 1);

    return (
        <div className="space-y-2">
            {items.map((item, i) => {
                const pct = (item.views / maxViews) * 100;
                const slug = extractSlug(item.page);
                return (
                    <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 truncate pr-4">{formatSlug(slug)}</span>
                            <span className="font-mono text-gray-500 shrink-0">{item.views}</span>
                        </div>
                        <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-blue-500 h-full rounded-full"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function ContentPerformance({ topArticles, topProjects }: Props) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Top Articles</CardTitle>
                </CardHeader>
                <CardContent>
                    <ContentList items={topArticles} emptyMsg="No article views yet" />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Top Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    <ContentList items={topProjects} emptyMsg="No project views yet" />
                </CardContent>
            </Card>
        </div>
    );
}
