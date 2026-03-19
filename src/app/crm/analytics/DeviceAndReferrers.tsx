"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsData } from "./types";

interface Props {
    deviceBreakdown: AnalyticsData["deviceBreakdown"];
    referrers: AnalyticsData["referrers"];
}

function cleanReferrer(url: string): string {
    try {
        return new URL(url).hostname;
    } catch {
        return url.slice(0, 40);
    }
}

export default function DeviceAndReferrers({ deviceBreakdown, referrers }: Props) {
    const totalDeviceSessions = deviceBreakdown.reduce((sum, d) => sum + d.sessions, 0) || 1;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Device Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    {deviceBreakdown.length === 0 ? (
                        <p className="text-sm text-gray-400">No device data yet</p>
                    ) : (
                        <div className="space-y-3">
                            {deviceBreakdown.map((d) => {
                                const pct = Math.round((d.sessions / totalDeviceSessions) * 100);
                                return (
                                    <div key={d.device_type}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="capitalize">{d.device_type || "Unknown"}</span>
                                            <span className="font-mono text-gray-500">{d.sessions} ({pct}%)</span>
                                        </div>
                                        <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-violet-500 h-full rounded-full"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Top Referrers</CardTitle>
                </CardHeader>
                <CardContent>
                    {referrers.length === 0 ? (
                        <p className="text-sm text-gray-400">No referrer data yet</p>
                    ) : (
                        <div className="space-y-2">
                            {referrers.map((r, i) => (
                                <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                                    <span className="text-sm text-gray-700 truncate pr-4">
                                        {cleanReferrer(r.referrer)}
                                    </span>
                                    <span className="font-mono text-sm text-gray-500 shrink-0">
                                        {r.sessions}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
