"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsData } from "./types";

interface Props {
    dailyVisitors: AnalyticsData["dailyVisitors"];
}

export default function DailyTrend({ dailyVisitors }: Props) {
    if (dailyVisitors.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Daily Visitors Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-400">No trend data yet</p>
                </CardContent>
            </Card>
        );
    }

    const maxSessions = Math.max(...dailyVisitors.map((d) => d.sessions), 1);
    const maxPageviews = Math.max(...dailyVisitors.map((d) => d.pageviews), 1);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm">Daily Visitors Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-1 h-40">
                    {dailyVisitors.map((d) => {
                        const sessionHeight = (d.sessions / maxSessions) * 100;
                        const pvHeight = (d.pageviews / maxPageviews) * 100;
                        const dateStr = new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                        return (
                            <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5 group relative min-w-0">
                                <div className="w-full flex flex-col items-center gap-0.5" style={{ height: 140 }}>
                                    <div className="flex-1" />
                                    <div
                                        className="w-full bg-blue-200 rounded-t"
                                        style={{ height: `${pvHeight}%`, minHeight: 2 }}
                                        title={`${dateStr}: ${d.pageviews} pageviews`}
                                    />
                                    <div
                                        className="w-full bg-blue-600 rounded-t"
                                        style={{ height: `${sessionHeight}%`, minHeight: 2 }}
                                        title={`${dateStr}: ${d.sessions} sessions`}
                                    />
                                </div>
                                {/* Show date label for every 7th item or first/last */}
                                <span className="text-[9px] text-gray-400 truncate w-full text-center hidden lg:block">
                                    {dateStr}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-blue-600 rounded" />
                        <span>Sessions</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-blue-200 rounded" />
                        <span>Page Views</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
