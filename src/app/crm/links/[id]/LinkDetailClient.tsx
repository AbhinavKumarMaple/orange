"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { siteConfig } from "@/lib/site";
import type { AnalyticsResponse, BreakdownRow } from "../types";

export default function LinkDetailClient({ id }: { id: string }) {
    const [data, setData] = useState<AnalyticsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState<string>("30");
    const [includeBots, setIncludeBots] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams({ days, includeBots: String(includeBots) });
        fetch(`/api/crm/links/${id}/analytics?${params.toString()}`)
            .then(async (r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((d: AnalyticsResponse) => setData(d))
            .catch(() => toast.error("Failed to load analytics"))
            .finally(() => setLoading(false));
    }, [id, days, includeBots]);

    useEffect(() => { load(); }, [load]);

    if (loading || !data) {
        return (
            <div className="text-sm text-gray-400 py-10 text-center">
                {loading ? "Loading analytics…" : "No data."}
            </div>
        );
    }

    const { link, totals, daily, breakdowns, recent } = data;
    const shortUrl = `${siteConfig.url.replace(/\/$/, "")}/t/${link.slug}`;
    const maxDaily = Math.max(1, ...daily.map((d) => d.count));

    async function copyUrl() {
        try {
            await navigator.clipboard.writeText(shortUrl);
            toast.success("Short URL copied");
        } catch {
            toast.error("Couldn't access clipboard");
        }
    }

    return (
        <div className="flex flex-col gap-6 max-w-7xl">
            {/* Header */}
            <div className="flex items-center gap-3 text-sm text-gray-500">
                <Link href="/crm/links" className="inline-flex items-center gap-1.5 hover:text-gray-900">
                    <ArrowLeft size={14} /> Tracking Links
                </Link>
            </div>

            <header className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {link.label || link.slug}
                    </h1>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-gray-700">{shortUrl}</span>
                        <button onClick={copyUrl} className="text-gray-400 hover:text-gray-700" title="Copy">
                            <Copy size={13} />
                        </button>
                    </div>
                    <a
                        href={link.destinationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 hover:text-gray-800 inline-flex items-center gap-1"
                    >
                        <ExternalLink size={11} /> {link.destinationUrl}
                    </a>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {link.source && <Badge variant="secondary">source: {link.source}</Badge>}
                        {link.medium && <Badge variant="outline">medium: {link.medium}</Badge>}
                        {link.campaign && <Badge variant="outline">campaign: {link.campaign}</Badge>}
                        {!link.active && <Badge variant="outline" className="text-gray-500">disabled</Badge>}
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Link
                        href={`/crm/links/visitors?linkId=${link.id}`}
                        className="inline-flex items-center h-9 px-3 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
                        title="Open this link in the visitor-insights dashboard with its filter pre-applied"
                    >
                        Open in Visitor Insights →
                    </Link>
                    <Select value={days} onValueChange={setDays}>
                        <SelectTrigger className="h-9 w-36">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">Last 7 days</SelectItem>
                            <SelectItem value="30">Last 30 days</SelectItem>
                            <SelectItem value="90">Last 90 days</SelectItem>
                            <SelectItem value="365">Last year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant={includeBots ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIncludeBots((v) => !v)}
                    >
                        {includeBots ? "Bots ✓" : "Hide bots"}
                    </Button>
                </div>
            </header>

            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Stat label="Clicks" value={totals.total.toLocaleString()} sub={`in last ${days} days`} />
                <Stat label="Unique visitors" value={totals.uniqueIps.toLocaleString()} sub="by IP" />
                <Stat
                    label="Bots filtered"
                    value={totals.bots.toLocaleString()}
                    sub={includeBots ? "showing in totals" : "hidden from totals"}
                />
                <Stat
                    label="Last click"
                    value={totals.lastClick ? new Date(totals.lastClick).toLocaleString() : "—"}
                    sub={totals.firstClick ? `first: ${new Date(totals.firstClick).toLocaleDateString()}` : "no clicks yet"}
                />
            </div>

            {/* Daily sparkline */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Clicks per day</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-4">
                    <Sparkline data={daily} max={maxDaily} />
                </CardContent>
            </Card>

            {/* Breakdowns grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                <BreakdownCard title="Country" rows={breakdowns.country} />
                <BreakdownCard title="Device type" rows={breakdowns.deviceType} />
                <BreakdownCard title="Browser" rows={breakdowns.browser} />
                <BreakdownCard title="Operating system" rows={breakdowns.os} />
                <BreakdownCard title="Referrer" rows={breakdowns.referrerHost} />
                <BreakdownCard title="Inbound utm_source" rows={breakdowns.source} />
            </div>

            {/* Recent clicks */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Recent clicks ({recent.length})</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-2">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[180px]">Time</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Device</TableHead>
                                    <TableHead>Browser</TableHead>
                                    <TableHead>OS</TableHead>
                                    <TableHead>Referrer</TableHead>
                                    <TableHead>IP</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recent.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-gray-400 py-8 text-sm">
                                            No clicks in this window.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recent.map((c) => (
                                        <TableRow key={c.id}>
                                            <TableCell className="text-xs whitespace-nowrap">
                                                {new Date(c.ts).toLocaleString()}
                                                {c.isBot && <Badge variant="outline" className="ml-1 text-[9px]">bot</Badge>}
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                {c.city ? `${c.city}, ` : ""}
                                                {c.region ? `${c.region}, ` : ""}
                                                {c.country || "—"}
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                {c.deviceType || "—"}
                                                {c.deviceVendor && <span className="text-gray-400"> · {c.deviceVendor}</span>}
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                {c.browser || "—"}
                                                {c.browserVersion && <span className="text-gray-400"> {c.browserVersion}</span>}
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                {c.os || "—"}
                                                {c.osVersion && <span className="text-gray-400"> {c.osVersion}</span>}
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                {c.referrerHost || (c.referrer ? "(invalid)" : "—")}
                                            </TableCell>
                                            <TableCell className="text-xs text-gray-500 font-mono">
                                                {c.ip || "—"}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
    return (
        <Card>
            <CardContent className="py-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
                {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
            </CardContent>
        </Card>
    );
}

function Sparkline({ data, max }: { data: { day: string; count: number }[]; max: number }) {
    if (data.length === 0) return null;
    // Inline SVG histogram. Width is responsive; we use a viewBox so it scales.
    const W = 800;
    const H = 120;
    const padX = 8;
    const padY = 12;
    const barW = Math.max(2, (W - padX * 2) / data.length - 2);

    return (
        <div className="px-6">
            <svg
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="none"
                className="w-full h-32"
                role="img"
                aria-label="Daily clicks histogram"
            >
                {data.map((d, i) => {
                    const x = padX + i * ((W - padX * 2) / data.length);
                    const h = max === 0 ? 0 : ((d.count / max) * (H - padY * 2));
                    const y = H - padY - h;
                    return (
                        <g key={d.day}>
                            <title>{`${d.day}: ${d.count} click${d.count === 1 ? "" : "s"}`}</title>
                            <rect
                                x={x}
                                y={y}
                                width={barW}
                                height={Math.max(1, h)}
                                rx={2}
                                fill={d.count > 0 ? "var(--brand-accent)" : "#e5e7eb"}
                            />
                        </g>
                    );
                })}
            </svg>
            <div className="flex justify-between text-[10px] text-gray-400 px-1 mt-1">
                <span>{data[0]?.day}</span>
                <span>{data[data.length - 1]?.day}</span>
            </div>
        </div>
    );
}

function BreakdownCard({ title, rows }: { title: string; rows: BreakdownRow[] | undefined }) {
    // Defensive: the analytics endpoint should always return an array, but
    // a stale tab + new deploy or any future shape regression shouldn't
    // crash the entire detail page — just show an empty state.
    const safeRows: BreakdownRow[] = Array.isArray(rows) ? rows : [];
    const total = safeRows.reduce((acc, r) => acc + r.count, 0) || 1;
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm">{title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
                {safeRows.length === 0 ? (
                    <p className="text-xs text-gray-400">No data.</p>
                ) : (
                    <div className="flex flex-col gap-1.5">
                        {safeRows.slice(0, 8).map((r) => {
                            const pct = (r.count / total) * 100;
                            return (
                                <div key={r.key} className="flex items-center gap-2 text-xs">
                                    <span className="w-24 truncate text-gray-700" title={r.key}>{r.key}</span>
                                    <div className="flex-1 h-1.5 rounded bg-gray-100 overflow-hidden">
                                        <div
                                            className="h-full bg-gray-900"
                                            style={{ width: `${Math.max(2, pct)}%` }}
                                        />
                                    </div>
                                    <span className="w-12 text-right text-gray-500 tabular-nums">{r.count}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
