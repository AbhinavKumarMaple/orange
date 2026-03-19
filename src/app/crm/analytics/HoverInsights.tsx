"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { AnalyticsData } from "./types";

interface Props {
    hoverData: AnalyticsData["hoverData"];
}

function formatLabel(label: string): string {
    return label
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function HoverInsights({ hoverData }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm">Hover Engagement (What Catches the Eye)</CardTitle>
            </CardHeader>
            <CardContent>
                {hoverData.length === 0 ? (
                    <p className="text-sm text-gray-400">No hover data yet</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Element</TableHead>
                                <TableHead>Section</TableHead>
                                <TableHead className="text-right">Hovers</TableHead>
                                <TableHead className="text-right">Avg Duration</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hoverData.map((h, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium">{formatLabel(h.label)}</TableCell>
                                    <TableCell>
                                        {h.section && <Badge variant="secondary">{h.section}</Badge>}
                                    </TableCell>
                                    <TableCell className="text-right font-mono">{h.hover_count}</TableCell>
                                    <TableCell className="text-right font-mono">
                                        {(h.avg_duration_ms / 1000).toFixed(1)}s
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
