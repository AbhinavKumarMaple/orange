"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AnalyticsData } from "./types";

const SECTION_ORDER = [
    "Hero", "Showreel", "Portfolio", "Services", "WhyUs",
    "ClientResults", "Pricing", "Blog", "FAQ", "Contact", "Footer",
];

interface Props {
    sectionViews: AnalyticsData["sectionViews"];
    sectionTime: AnalyticsData["sectionTime"];
}

export default function SectionEngagement({ sectionViews, sectionTime }: Props) {
    const viewMap = new Map(sectionViews.map((s) => [s.section, s]));
    const timeMap = new Map(sectionTime.map((s) => [s.section, s]));

    const maxViews = Math.max(...sectionViews.map((s) => s.view_count), 1);
    const heroViews = viewMap.get("Hero")?.view_count || 1;

    const sections = SECTION_ORDER.map((name) => ({
        name,
        views: viewMap.get(name)?.view_count || 0,
        uniqueSessions: viewMap.get(name)?.unique_sessions || 0,
        avgTime: Math.round(timeMap.get(name)?.avg_duration || 0),
        totalTime: Math.round(timeMap.get(name)?.total_duration || 0),
        reachRate: heroViews > 0
            ? Math.round(((viewMap.get(name)?.unique_sessions || 0) / heroViews) * 100)
            : 0,
    }));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Section Views & Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Section</TableHead>
                                <TableHead className="text-right">Views</TableHead>
                                <TableHead className="text-right">Avg Time (s)</TableHead>
                                <TableHead className="text-right">Reach %</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sections.map((s) => (
                                <TableRow key={s.name}>
                                    <TableCell className="font-medium">{s.name}</TableCell>
                                    <TableCell className="text-right">{s.views.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">{s.avgTime}s</TableCell>
                                    <TableCell className="text-right">{s.reachRate}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Scroll Funnel (Section Reach)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {sections.map((s) => {
                        const pct = maxViews > 0 ? (s.views / maxViews) * 100 : 0;
                        return (
                            <div key={s.name} className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 w-24 shrink-0 truncate">{s.name}</span>
                                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-full rounded-full transition-all"
                                        style={{ width: `${Math.max(pct, 2)}%` }}
                                    />
                                </div>
                                <span className="text-xs text-gray-600 w-10 text-right">{s.reachRate}%</span>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
}
