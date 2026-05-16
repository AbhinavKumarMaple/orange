"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { BreakdownRow, TrackingLink } from "../types";
import type { VisitorStats, VisitorRow, VisitorsResponse } from "./types";

const ALL_LINKS = "__all__";

type SortKey = "recent" | "first" | "most" | "least";

const PAGE_SIZE = 24;

export default function VisitorsClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [days, setDays] = useState("30");
    const [includeBots, setIncludeBots] = useState(false);
    // Link filter — empty = all links. Synced to the `linkId` URL param so
    // the filter survives reloads and the detail page can deep-link in.
    const [linkId, setLinkId] = useState<string>(ALL_LINKS);

    // All known tracking links (for the filter dropdown). Fetched once.
    const [links, setLinks] = useState<TrackingLink[]>([]);

    // ---- Overview state ----
    const [stats, setStats] = useState<VisitorStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    // ---- Visitors table state ----
    const [visitors, setVisitors] = useState<VisitorRow[]>([]);
    const [visitorsTotal, setVisitorsTotal] = useState(0);
    const [nextOffset, setNextOffset] = useState<number | null>(0);
    const [visitorsLoading, setVisitorsLoading] = useState(false);
    const [visitorsInitial, setVisitorsInitial] = useState(true);
    const [search, setSearch] = useState("");
    const [searchDebounced, setSearchDebounced] = useState("");
    const [sort, setSort] = useState<SortKey>("recent");
    const sentinelRef = useRef<HTMLDivElement>(null);
    const fetchSeqRef = useRef(0);

    // Initialise filter from URL on mount + whenever the param changes.
    useEffect(() => {
        const fromUrl = searchParams.get("linkId");
        setLinkId(fromUrl || ALL_LINKS);
    }, [searchParams]);

    // Fetch the link list for the dropdown (small payload, fetched once).
    useEffect(() => {
        let cancelled = false;
        fetch("/api/crm/links")
            .then((r) => r.json())
            .then((data: TrackingLink[]) => { if (!cancelled) setLinks(data); })
            .catch(() => { /* non-fatal; filter just shows All Links */ });
        return () => { cancelled = true; };
    }, []);

    const selectedLink = useMemo(
        () => (linkId !== ALL_LINKS ? links.find((l) => l.id === linkId) ?? null : null),
        [links, linkId],
    );

    // Push the link filter to the URL so the view is shareable.
    function handleLinkChange(next: string) {
        setLinkId(next);
        const params = new URLSearchParams(searchParams.toString());
        if (next === ALL_LINKS) params.delete("linkId");
        else params.set("linkId", next);
        const qs = params.toString();
        router.replace(qs ? `/crm/links/visitors?${qs}` : "/crm/links/visitors", { scroll: false });
    }

    // ---- Fetch overview stats whenever window/bots/link change ----
    useEffect(() => {
        let cancelled = false;
        setStatsLoading(true);
        const params = new URLSearchParams({ days, includeBots: String(includeBots) });
        if (linkId !== ALL_LINKS) params.set("linkId", linkId);
        fetch(`/api/crm/links/stats?${params.toString()}`)
            .then(async (r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((d: VisitorStats) => !cancelled && setStats(d))
            .catch(() => !cancelled && toast.error("Failed to load analytics"))
            .finally(() => !cancelled && setStatsLoading(false));
        return () => { cancelled = true; };
    }, [days, includeBots, linkId]);

    // ---- Debounce search input ----
    useEffect(() => {
        const t = setTimeout(() => setSearchDebounced(search.trim()), 250);
        return () => clearTimeout(t);
    }, [search]);

    // ---- Fetch first page of visitors when filters change ----
    const fetchPage = useCallback(
        async (offset: number, replace: boolean) => {
            const seq = ++fetchSeqRef.current;
            setVisitorsLoading(true);
            try {
                const params = new URLSearchParams({
                    days,
                    includeBots: String(includeBots),
                    limit: String(PAGE_SIZE),
                    offset: String(offset),
                    sort,
                });
                if (searchDebounced) params.set("q", searchDebounced);
                if (linkId !== ALL_LINKS) params.set("linkId", linkId);
                const res = await fetch(`/api/crm/links/visitors?${params.toString()}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data: VisitorsResponse = await res.json();
                if (seq !== fetchSeqRef.current) return;
                setVisitorsTotal(data.total);
                setNextOffset(data.nextOffset);
                setVisitors((prev) => (replace ? data.items : [...prev, ...data.items]));
            } catch {
                toast.error("Failed to load visitors");
            } finally {
                if (seq === fetchSeqRef.current) {
                    setVisitorsLoading(false);
                    setVisitorsInitial(false);
                }
            }
        },
        [days, includeBots, sort, searchDebounced, linkId],
    );

    useEffect(() => {
        setVisitorsInitial(true);
        setVisitors([]);
        setNextOffset(0);
        fetchPage(0, true);
    }, [fetchPage]);

    // ---- Infinite-scroll sentinel ----
    useEffect(() => {
        if (nextOffset == null || visitorsLoading) return;
        const node = sentinelRef.current;
        if (!node) return;
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) fetchPage(nextOffset, false);
            },
            { rootMargin: "300px 0px" },
        );
        io.observe(node);
        return () => io.disconnect();
    }, [nextOffset, visitorsLoading, fetchPage]);

    return (
        <div className="flex flex-col gap-6 max-w-7xl pb-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-3 text-sm text-gray-500">
                <Link href="/crm/links" className="inline-flex items-center gap-1.5 hover:text-gray-900">
                    <ArrowLeft size={14} /> Tracking Links
                </Link>
            </div>

            {/* Header + window controls */}
            <header className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Visitor Insights</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {selectedLink
                            ? `Analytics scoped to "${selectedLink.label || `/t/${selectedLink.slug}`}".`
                            : "Aggregated analytics across every tracking link — who's clicking, where they're coming from, what they're using."}
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Select value={linkId} onValueChange={handleLinkChange}>
                        <SelectTrigger className="h-9 min-w-[200px] max-w-[320px]">
                            <SelectValue placeholder="All links" />
                        </SelectTrigger>
                        <SelectContent className="max-h-80">
                            <SelectItem value={ALL_LINKS}>All links ({links.length})</SelectItem>
                            {links.map((l) => (
                                <SelectItem key={l.id} value={l.id}>
                                    {l.label ? `${l.label} (/t/${l.slug})` : `/t/${l.slug}`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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

            {selectedLink && (
                <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-md border border-amber-200 bg-amber-50 text-amber-900 text-sm">
                    <span>
                        Filtered to <strong className="font-semibold">{selectedLink.label || `/t/${selectedLink.slug}`}</strong>
                        <span className="text-amber-700"> · {selectedLink.destinationUrl}</span>
                    </span>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/crm/links/${selectedLink.id}`}
                            className="text-xs underline hover:no-underline"
                        >
                            Open link detail
                        </Link>
                        <button
                            type="button"
                            onClick={() => handleLinkChange(ALL_LINKS)}
                            className="inline-flex items-center gap-1 text-xs hover:text-amber-700"
                        >
                            <X size={13} /> Clear filter
                        </button>
                    </div>
                </div>
            )}

            {/* KPI strip */}
            <KpiStrip stats={stats} loading={statsLoading} />

            {/* Time series chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Clicks &amp; unique visitors</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-4">
                    {statsLoading || !stats ? (
                        <p className="text-sm text-gray-400 py-10 text-center">Loading…</p>
                    ) : (
                        <TimeSeriesChart data={stats.daily} />
                    )}
                </CardContent>
            </Card>

            {/* Top links + Audience tabs.
                When filtered to a single link, hide the link-performance table
                (it would be a one-row tautology) and let Audience take the
                full width. */}
            <div className={selectedLink ? "grid grid-cols-1 gap-4" : "grid lg:grid-cols-[1fr_1.2fr] gap-4"}>
                {/* Top links */}
                {!selectedLink && (
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-base">Link performance</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-2">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Link</TableHead>
                                        <TableHead className="text-right">Clicks</TableHead>
                                        <TableHead className="text-right">Visitors</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(stats?.topLinks ?? []).length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-gray-400 py-6 text-xs">
                                                {statsLoading ? "Loading…" : "No links."}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        (stats?.topLinks ?? []).map((l) => (
                                            <TableRow key={l.id}>
                                                <TableCell className="py-2">
                                                    <Link href={`/crm/links/${l.id}`} className="text-xs font-medium text-gray-900 hover:underline block max-w-[260px] truncate">
                                                        {l.label || `/t/${l.slug}`}
                                                    </Link>
                                                    <div className="flex gap-1 mt-0.5">
                                                        {l.source && <Badge variant="secondary" className="text-[9px] px-1 py-0">{l.source}</Badge>}
                                                        {!l.active && <Badge variant="outline" className="text-[9px] px-1 py-0 text-gray-400">off</Badge>}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums text-sm">{l.clicks.toLocaleString()}</TableCell>
                                                <TableCell className="text-right tabular-nums text-sm">{l.uniqueIps.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
                )}

                {/* Audience tabs */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Audience</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="country">
                            <TabsList className="flex-wrap h-auto">
                                <TabsTrigger value="country">Countries</TabsTrigger>
                                <TabsTrigger value="device">Devices</TabsTrigger>
                                <TabsTrigger value="browser">Browsers</TabsTrigger>
                                <TabsTrigger value="os">OS</TabsTrigger>
                                <TabsTrigger value="language">Languages</TabsTrigger>
                                <TabsTrigger value="referrer">Referrers</TabsTrigger>
                                <TabsTrigger value="source">Sources</TabsTrigger>
                                <TabsTrigger value="medium">Mediums</TabsTrigger>
                                <TabsTrigger value="campaign">Campaigns</TabsTrigger>
                            </TabsList>
                            <TabsContent value="country" className="pt-3"><BreakdownList rows={stats?.breakdowns.country} /></TabsContent>
                            <TabsContent value="device" className="pt-3"><BreakdownList rows={stats?.breakdowns.deviceType} /></TabsContent>
                            <TabsContent value="browser" className="pt-3"><BreakdownList rows={stats?.breakdowns.browser} /></TabsContent>
                            <TabsContent value="os" className="pt-3"><BreakdownList rows={stats?.breakdowns.os} /></TabsContent>
                            <TabsContent value="language" className="pt-3"><BreakdownList rows={stats?.breakdowns.language} /></TabsContent>
                            <TabsContent value="referrer" className="pt-3"><BreakdownList rows={stats?.breakdowns.referrerHost} /></TabsContent>
                            <TabsContent value="source" className="pt-3"><BreakdownList rows={stats?.breakdowns.source} /></TabsContent>
                            <TabsContent value="medium" className="pt-3"><BreakdownList rows={stats?.breakdowns.medium} /></TabsContent>
                            <TabsContent value="campaign" className="pt-3"><BreakdownList rows={stats?.breakdowns.campaign} /></TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* Visitors table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between gap-3">
                        <span>Visitors</span>
                        <div className="flex flex-wrap items-center gap-2 font-normal">
                            <Input
                                type="search"
                                placeholder="Search IP, country, city, browser…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-8 w-64 text-sm"
                            />
                            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                                <SelectTrigger className="h-8 w-40 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="recent">Last seen</SelectItem>
                                    <SelectItem value="first">First seen</SelectItem>
                                    <SelectItem value="most">Most visits</SelectItem>
                                    <SelectItem value="least">Least visits</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-xs text-gray-400">
                                {visitors.length} of {visitorsTotal.toLocaleString()}
                            </span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-2">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[140px]">IP</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Device</TableHead>
                                    <TableHead>Browser</TableHead>
                                    <TableHead>OS</TableHead>
                                    <TableHead>Language</TableHead>
                                    <TableHead className="text-right">Visits</TableHead>
                                    <TableHead>First seen</TableHead>
                                    <TableHead>Last seen</TableHead>
                                    <TableHead>Top referrer</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visitorsInitial ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center text-gray-400 py-10 text-sm">
                                            Loading…
                                        </TableCell>
                                    </TableRow>
                                ) : visitors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center text-gray-400 py-10 text-sm">
                                            {searchDebounced ? "No visitors match your search." : "No visitors in this window."}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    visitors.map((v) => (
                                        <TableRow key={v.ip}>
                                            <TableCell className="font-mono text-xs text-gray-700">
                                                {v.ip}
                                                {v.everBot && <Badge variant="outline" className="ml-1 text-[9px]">bot</Badge>}
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                {v.city ? `${v.city}, ` : ""}
                                                {v.region ? `${v.region}, ` : ""}
                                                {v.country || "—"}
                                            </TableCell>
                                            <TableCell className="text-xs">{v.deviceType || "—"}</TableCell>
                                            <TableCell className="text-xs">{v.browser || "—"}</TableCell>
                                            <TableCell className="text-xs">{v.os || "—"}</TableCell>
                                            <TableCell className="text-xs">{v.language || "—"}</TableCell>
                                            <TableCell className="text-right tabular-nums text-sm">{v.visits.toLocaleString()}</TableCell>
                                            <TableCell className="text-xs whitespace-nowrap text-gray-500">
                                                {fmtDate(v.firstSeen)}
                                            </TableCell>
                                            <TableCell className="text-xs whitespace-nowrap text-gray-500">
                                                {fmtDate(v.lastSeen)}
                                            </TableCell>
                                            <TableCell className="text-xs text-gray-500 max-w-[180px] truncate">
                                                {v.topReferrer || "—"}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {nextOffset != null && (
                        <div ref={sentinelRef} className="h-12 flex items-center justify-center text-xs text-gray-400">
                            {visitorsLoading ? "Loading more…" : "Scroll for more"}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function KpiStrip({ stats, loading }: { stats: VisitorStats | null; loading: boolean }) {
    const display = stats?.totals;
    const newPct = display && display.uniqueVisitors > 0
        ? Math.round((display.newVisitors / display.uniqueVisitors) * 100)
        : 0;
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Kpi label="Clicks" value={display ? display.total.toLocaleString() : (loading ? "—" : "0")} sub="all tracking links" />
            <Kpi label="Unique visitors" value={display ? display.uniqueVisitors.toLocaleString() : "0"} sub="by IP" />
            <Kpi label="New visitors" value={display ? display.newVisitors.toLocaleString() : "0"} sub={`${newPct}% of unique`} />
            <Kpi label="Avg clicks / visitor" value={display ? display.avgClicksPerVisitor.toString() : "0"} sub={display ? `${display.bots.toLocaleString()} bot clicks` : ""} />
        </div>
    );
}

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
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

function BreakdownList({ rows }: { rows: BreakdownRow[] | undefined }) {
    const safe = Array.isArray(rows) ? rows : [];
    const total = safe.reduce((acc, r) => acc + r.count, 0) || 1;
    if (safe.length === 0) return <p className="text-xs text-gray-400 py-4">No data in this window.</p>;
    return (
        <div className="flex flex-col gap-1.5">
            {safe.slice(0, 12).map((r) => {
                const pct = (r.count / total) * 100;
                return (
                    <div key={r.key} className="flex items-center gap-2 text-xs">
                        <span className="w-32 truncate text-gray-700" title={r.key}>{r.key}</span>
                        <div className="flex-1 h-1.5 rounded bg-gray-100 overflow-hidden">
                            <div className="h-full bg-gray-900" style={{ width: `${Math.max(2, pct)}%` }} />
                        </div>
                        <span className="w-12 text-right text-gray-500 tabular-nums">{r.count}</span>
                        <span className="w-10 text-right text-[10px] text-gray-400">{pct.toFixed(0)}%</span>
                    </div>
                );
            })}
        </div>
    );
}

function TimeSeriesChart({ data }: { data: Array<{ day: string; clicks: number; uniqueVisitors: number }> }) {
    if (data.length === 0) {
        return <p className="text-sm text-gray-400 py-10 text-center">No data.</p>;
    }
    const W = 1000;
    const H = 180;
    const padL = 32;
    const padR = 16;
    const padT = 12;
    const padB = 24;

    const maxClicks = Math.max(1, ...data.map((d) => d.clicks));
    const innerW = W - padL - padR;
    const innerH = H - padT - padB;
    const barW = Math.max(2, innerW / data.length - 2);

    // Path for unique-visitor line.
    const linePath = data
        .map((d, i) => {
            const x = padL + i * (innerW / data.length) + barW / 2;
            const y = padT + innerH - (d.uniqueVisitors / maxClicks) * innerH;
            return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(" ");

    // Y-axis tick labels at 0/50/100% of maxClicks. Dedupe — when
    // maxClicks is 1 or 2 the rounded mid-tick collides with one of the
    // endpoints, which would render two siblings with the same key.
    const yTicks = Array.from(new Set([0, Math.ceil(maxClicks / 2), maxClicks])).sort((a, b) => a - b);

    return (
        <div className="px-6">
            <svg
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="none"
                className="w-full h-44"
                role="img"
                aria-label="Daily clicks and unique visitors"
            >
                {/* Y-axis tick lines + labels */}
                {yTicks.map((v) => {
                    const y = padT + innerH - (v / maxClicks) * innerH;
                    return (
                        <g key={v}>
                            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f3f4f6" strokeWidth={1} />
                            <text x={padL - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#9ca3af">{v}</text>
                        </g>
                    );
                })}

                {/* Click bars */}
                {data.map((d, i) => {
                    const x = padL + i * (innerW / data.length);
                    const h = (d.clicks / maxClicks) * innerH;
                    const y = padT + innerH - h;
                    return (
                        <g key={d.day}>
                            <title>{`${d.day}\nClicks: ${d.clicks}\nVisitors: ${d.uniqueVisitors}`}</title>
                            <rect
                                x={x}
                                y={y}
                                width={barW}
                                height={Math.max(d.clicks > 0 ? 1 : 0, h)}
                                rx={1.5}
                                fill={d.clicks > 0 ? "var(--brand-accent)" : "#e5e7eb"}
                                opacity={0.85}
                            />
                        </g>
                    );
                })}

                {/* Unique visitors line */}
                <path d={linePath} fill="none" stroke="#111827" strokeWidth={1.5} strokeLinejoin="round" />
                {data.map((d, i) => {
                    const x = padL + i * (innerW / data.length) + barW / 2;
                    const y = padT + innerH - (d.uniqueVisitors / maxClicks) * innerH;
                    return <circle key={d.day} cx={x} cy={y} r={1.8} fill="#111827" />;
                })}

                {/* X-axis edge labels */}
                <text x={padL} y={H - 6} fontSize="9" fill="#9ca3af">{data[0]?.day}</text>
                <text x={W - padR} y={H - 6} textAnchor="end" fontSize="9" fill="#9ca3af">{data[data.length - 1]?.day}</text>
            </svg>
            <div className="flex items-center gap-4 text-[10px] text-gray-500 mt-1 px-1">
                <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-[var(--brand-accent)]" /> Clicks</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-px bg-gray-900" /> Unique visitors</span>
            </div>
        </div>
    );
}

function fmtDate(iso: string): string {
    try {
        const d = new Date(iso);
        const now = new Date();
        const sameYear = d.getFullYear() === now.getFullYear();
        return d.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: sameYear ? undefined : "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return iso;
    }
}

