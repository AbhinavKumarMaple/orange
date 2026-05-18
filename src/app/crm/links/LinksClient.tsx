"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Copy, ExternalLink, MoreHorizontal, Trash2, Power, RotateCcw, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { siteConfig } from "@/lib/site";
import CreateLinkDialog from "./CreateLinkDialog";
import type { TrackingLink } from "./types";

type SortKey = "newest" | "clicks" | "alpha";
type View = "live" | "trashed";

export default function LinksClient() {
    const [links, setLinks] = useState<TrackingLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [activeOnly, setActiveOnly] = useState(false);
    const [sort, setSort] = useState<SortKey>("newest");
    const [createOpen, setCreateOpen] = useState(false);
    const [view, setView] = useState<View>("live");
    /** When set, the form dialog opens in edit mode bound to this link. */
    const [editing, setEditing] = useState<TrackingLink | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (activeOnly) params.set("active", "true");
        if (view === "trashed") params.set("trashed", "true");
        params.set("sort", sort);
        fetch(`/api/crm/links?${params.toString()}`)
            .then((r) => r.json())
            .then((data: TrackingLink[]) => {
                if (!cancelled) setLinks(data);
            })
            .catch(() => !cancelled && toast.error("Failed to load links"))
            .finally(() => !cancelled && setLoading(false));
        return () => {
            cancelled = true;
        };
    }, [query, activeOnly, sort, view]);

    function shortUrl(slug: string) {
        return `${siteConfig.url.replace(/\/$/, "")}/t/${slug}`;
    }

    async function copyUrl(slug: string) {
        try {
            await navigator.clipboard.writeText(shortUrl(slug));
            toast.success("Short URL copied");
        } catch {
            toast.error("Couldn't access clipboard");
        }
    }

    async function toggleActive(link: TrackingLink) {
        try {
            const res = await fetch(`/api/crm/links/${link.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ active: !link.active }),
            });
            if (!res.ok) throw new Error();
            const updated = (await res.json()) as TrackingLink;
            setLinks((prev) => prev.map((l) => (l.id === link.id ? updated : l)));
            toast.success(updated.active ? "Link activated" : "Link disabled");
        } catch {
            toast.error("Failed to update");
        }
    }

    /** Move a link to trash (soft delete). Reversible from the Trash view. */
    async function trashLink(link: TrackingLink) {
        try {
            const res = await fetch(`/api/crm/links/${link.id}`, { method: "DELETE" });
            if (!res.ok && res.status !== 204) throw new Error();
            setLinks((prev) => prev.filter((l) => l.id !== link.id));
            toast.success("Moved to trash");
        } catch {
            toast.error("Failed to move to trash");
        }
    }

    /** Restore a trashed link — clears deleted_at, link comes back live. */
    async function restoreLink(link: TrackingLink) {
        try {
            const res = await fetch(`/api/crm/links/${link.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ restore: true }),
            });
            if (!res.ok) throw new Error();
            setLinks((prev) => prev.filter((l) => l.id !== link.id));
            toast.success("Link restored");
        } catch {
            toast.error("Failed to restore");
        }
    }

    /** Hard-delete a link AND all its click history. Irreversible. */
    async function permanentDelete(link: TrackingLink) {
        if (!confirm(`Permanently delete "${link.label || link.slug}" and all its click history? This cannot be undone.`)) return;
        try {
            const res = await fetch(`/api/crm/links/${link.id}?permanent=true`, { method: "DELETE" });
            if (!res.ok && res.status !== 204) throw new Error();
            setLinks((prev) => prev.filter((l) => l.id !== link.id));
            toast.success("Deleted permanently");
        } catch {
            toast.error("Failed to delete");
        }
    }

    const totalClicks = useMemo(() => links.reduce((acc, l) => acc + (l.clickCount || 0), 0), [links]);

    return (
        <div className="flex flex-col gap-5 max-w-7xl">
            <header className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tracking Links</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Create short links that run through your domain and capture full visitor metadata on every click.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/crm/links/visitors"
                        className="inline-flex items-center h-9 px-3 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        Visitor insights →
                    </Link>
                    <Button onClick={() => setCreateOpen(true)}>New link</Button>
                </div>
            </header>

            <div className="flex flex-wrap items-center gap-2">
                <Tabs value={view} onValueChange={(v) => setView(v as View)}>
                    <TabsList>
                        <TabsTrigger value="live">Active</TabsTrigger>
                        <TabsTrigger value="trashed">Trash</TabsTrigger>
                    </TabsList>
                </Tabs>
                <Input
                    type="search"
                    placeholder="Search label, source, slug, destination…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-9 w-72"
                />
                <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                    <SelectTrigger className="h-9 w-44">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest first</SelectItem>
                        <SelectItem value="clicks">Most clicked</SelectItem>
                        <SelectItem value="alpha">Label A–Z</SelectItem>
                    </SelectContent>
                </Select>
                <Button
                    variant={activeOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveOnly((v) => !v)}
                >
                    {activeOnly ? "Active only ✓" : "Active only"}
                </Button>
                <span className="ml-auto text-xs text-gray-500">
                    {links.length} link{links.length === 1 ? "" : "s"} · {totalClicks.toLocaleString()} total clicks
                </span>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[180px]">Short link</TableHead>
                            <TableHead>Destination & tags</TableHead>
                            <TableHead className="w-[100px] text-right">Clicks</TableHead>
                            <TableHead className="w-[180px]">Status</TableHead>
                            <TableHead className="w-[120px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-gray-400 py-10 text-sm">
                                    Loading…
                                </TableCell>
                            </TableRow>
                        ) : links.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-gray-400 py-10 text-sm">
                                    {query || activeOnly
                                        ? "No links match these filters."
                                        : view === "trashed"
                                            ? "Trash is empty. Deleted links will appear here until permanently removed."
                                            : "No tracking links yet."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            links.map((link) => (
                                <TableRow key={link.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <Link
                                                href={`/crm/links/${link.id}`}
                                                className="font-mono text-xs text-gray-900 hover:underline"
                                            >
                                                /t/{link.slug}
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => copyUrl(link.slug)}
                                                className="text-gray-400 hover:text-gray-700"
                                                title="Copy full URL"
                                            >
                                                <Copy size={12} />
                                            </button>
                                        </div>
                                        {link.createdAt && (
                                            <p className="text-[11px] text-gray-400 mt-0.5">
                                                {new Date(link.createdAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {link.label && (
                                                <span className="text-sm text-gray-900 font-medium">{link.label}</span>
                                            )}
                                            <a
                                                href={link.destinationUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-gray-500 hover:text-gray-800 inline-flex items-center gap-1 truncate max-w-md"
                                            >
                                                <ExternalLink size={11} />
                                                <span className="truncate">{link.destinationUrl}</span>
                                            </a>
                                            <div className="flex flex-wrap gap-1 mt-0.5">
                                                {link.source && <Badge variant="secondary">{link.source}</Badge>}
                                                {link.medium && <Badge variant="outline">{link.medium}</Badge>}
                                                {link.campaign && <Badge variant="outline">{link.campaign}</Badge>}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link
                                            href={`/crm/links/${link.id}`}
                                            className="font-semibold text-gray-900 hover:underline"
                                        >
                                            {link.clickCount.toLocaleString()}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {link.deletedAt ? (
                                            <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
                                                In trash · {new Date(link.deletedAt).toLocaleDateString()}
                                            </Badge>
                                        ) : link.active ? (
                                            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-gray-500">Disabled</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {view === "trashed" ? (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => restoreLink(link)}
                                                        title="Restore"
                                                    >
                                                        <RotateCcw size={14} />
                                                    </Button>
                                                    <Link
                                                        href={`/crm/links/${link.id}`}
                                                        className="inline-flex items-center justify-center h-8 px-2 rounded-md text-gray-500 hover:bg-gray-100"
                                                        title="View analytics"
                                                    >
                                                        <MoreHorizontal size={14} />
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => permanentDelete(link)}
                                                        title="Delete permanently"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setEditing(link)}
                                                        title="Edit"
                                                    >
                                                        <Pencil size={14} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleActive(link)}
                                                        title={link.active ? "Disable" : "Enable"}
                                                    >
                                                        <Power size={14} />
                                                    </Button>
                                                    <Link
                                                        href={`/crm/links/${link.id}`}
                                                        className="inline-flex items-center justify-center h-8 px-2 rounded-md text-gray-500 hover:bg-gray-100"
                                                        title="View analytics"
                                                    >
                                                        <MoreHorizontal size={14} />
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => trashLink(link)}
                                                        title="Move to trash"
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <CreateLinkDialog
                open={createOpen || !!editing}
                onOpenChange={(o) => {
                    if (!o) {
                        setCreateOpen(false);
                        setEditing(null);
                    } else if (!editing) {
                        setCreateOpen(true);
                    }
                }}
                link={editing}
                onSaved={(saved) =>
                    setLinks((prev) =>
                        editing
                            ? prev.map((l) => (l.id === saved.id ? saved : l))
                            : [saved, ...prev],
                    )
                }
            />
        </div>
    );
}
