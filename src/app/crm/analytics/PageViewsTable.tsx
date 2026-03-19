"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AnalyticsData } from "./types";

interface Props {
    pageViews: AnalyticsData["pageViews"];
    scrollDepth: AnalyticsData["scrollDepth"];
}

export default function PageViewsTable({ pageViews, scrollDepth }: Props) {
    // Build a map of page -> max scroll depth reached by most users
    const depthMap = new Map<string, number>();
    for (const d of scrollDepth) {
        const current = depthMap.get(d.page) || 0;
        if (d.depth > current) depthMap.set(d.page, d.depth);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm">Page Performance</CardTitle>
            </CardHeader>
            <CardContent>
                {pageViews.length === 0 ? (
                    <p className="text-sm text-gray-400">No page view data yet</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Page</TableHead>
                                <TableHead className="text-right">Views</TableHead>
                                <TableHead className="text-right">Unique Sessions</TableHead>
                                <TableHead className="text-right">Max Scroll</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pageViews.map((p) => (
                                <TableRow key={p.page}>
                                    <TableCell className="font-mono text-sm">{p.page || "/"}</TableCell>
                                    <TableCell className="text-right">{p.views.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">{p.unique_sessions.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        {depthMap.get(p.page) ? `${depthMap.get(p.page)}%` : "—"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
