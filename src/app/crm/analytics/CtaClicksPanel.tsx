"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { AnalyticsData } from "./types";

interface Props {
    ctaClicks: AnalyticsData["ctaClicks"];
    pricingToggle: AnalyticsData["pricingToggle"];
}

function formatLabel(label: string): string {
    return label
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function CtaClicksPanel({ ctaClicks, pricingToggle }: Props) {
    const projectClicks = pricingToggle.find((p) => p.label === "pricing_toggle_project")?.clicks || 0;
    const monthlyClicks = pricingToggle.find((p) => p.label === "pricing_toggle_monthly")?.clicks || 0;
    const totalToggle = projectClicks + monthlyClicks;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="text-sm">CTA Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                    {ctaClicks.length === 0 ? (
                        <p className="text-sm text-gray-400">No click data yet</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Element</TableHead>
                                    <TableHead>Section</TableHead>
                                    <TableHead className="text-right">Clicks</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ctaClicks.map((c, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <span className="font-medium">{formatLabel(c.label)}</span>
                                            {c.text && (
                                                <span className="text-xs text-gray-400 ml-2">"{c.text}"</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {c.section && <Badge variant="secondary">{c.section}</Badge>}
                                        </TableCell>
                                        <TableCell className="text-right font-mono">{c.clicks}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Pricing Preference</CardTitle>
                </CardHeader>
                <CardContent>
                    {totalToggle === 0 ? (
                        <p className="text-sm text-gray-400">No toggle data yet</p>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Per Project</span>
                                    <span className="font-mono">{projectClicks} ({totalToggle > 0 ? Math.round((projectClicks / totalToggle) * 100) : 0}%)</span>
                                </div>
                                <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-full rounded-full"
                                        style={{ width: `${totalToggle > 0 ? (projectClicks / totalToggle) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Monthly</span>
                                    <span className="font-mono">{monthlyClicks} ({totalToggle > 0 ? Math.round((monthlyClicks / totalToggle) * 100) : 0}%)</span>
                                </div>
                                <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-emerald-500 h-full rounded-full"
                                        style={{ width: `${totalToggle > 0 ? (monthlyClicks / totalToggle) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
