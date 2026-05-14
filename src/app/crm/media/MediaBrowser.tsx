"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn, isVideo } from "@/lib/utils";
import MediaThumb from "@/components/custom/MediaThumb";
import MediaPreviewPanel from "./MediaPreviewPanel";
import { uploadMedia } from "./uploadMedia";
import { backfillThumbnail } from "./backfillThumbnails";
import type { MediaFile } from "./types";

/**
 * Shared media library browser. Used by:
 *  - /crm/media (mode="manage": delete + generate posters, no select-and-return)
 *  - MediaPickerDialog (mode="single" | "multi": pick one or many URLs)
 *
 * Behavior:
 *  - Paginated server-side. Renders a "load more" sentinel that the
 *    IntersectionObserver triggers to fetch the next page automatically.
 *  - Type filter (all / image / video) and sort (newest / oldest / largest /
 *    smallest / name) talk to the same API params and reset pagination on
 *    change.
 *  - Search input is debounced (250ms) and also resets pagination.
 *  - Preview panel slides in on click; its action button is mode-dependent.
 *  - Auto-generated video posters are hidden by the API filter; they live in
 *    Blob but are never shown here as standalone "assets".
 */

// 24 = a clean 4×6 or 6×4 viewport. Small enough that infinite-scroll
// actually fires on libraries under ~100 items; large enough that we're
// not making a request every couple of rows.
const PAGE_SIZE = 24;

type Mode = "manage" | "single" | "multi";

export interface MediaBrowserProps {
    mode: Mode;
    accept?: string;
    /** Single-select callback (mode="single") — fires immediately on click. */
    onSelect?: (file: MediaFile) => void;
    /** Multi-select callback (mode="multi") — fires when "Insert N files" is pressed. */
    onMultiSelect?: (urls: string[]) => void;
    /** External signal that this browser is now visible / should fetch.
     *  Pass `true` when a dialog opens, `false` while closed. Defaults to true. */
    active?: boolean;
    className?: string;
}

interface ListResponse {
    items: MediaFile[];
    total: number;
    nextOffset: number | null;
}

type TypeFilter = "all" | "image" | "video";
type Sort = "newest" | "oldest" | "largest" | "smallest" | "name";

export default function MediaBrowser({
    mode,
    accept = "image/*,video/*",
    onSelect,
    onMultiSelect,
    active = true,
    className,
}: MediaBrowserProps) {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [total, setTotal] = useState(0);
    const [nextOffset, setNextOffset] = useState<number | null>(0);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [type, setType] = useState<TypeFilter>("all");
    const [sort, setSort] = useState<Sort>("newest");
    const [queryInput, setQueryInput] = useState("");
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [preview, setPreview] = useState<MediaFile | null>(null);
    const [uploading, setUploading] = useState<UploadingFile[]>([]);
    const [backfilling, setBackfilling] = useState<{ done: number; total: number } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const fetchSeqRef = useRef(0);

    // Debounce search input -> query state.
    useEffect(() => {
        const t = setTimeout(() => setQuery(queryInput.trim()), 250);
        return () => clearTimeout(t);
    }, [queryInput]);

    const fetchPage = useCallback(
        async (offset: number, opts?: { replace?: boolean }) => {
            const seq = ++fetchSeqRef.current;
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    limit: String(PAGE_SIZE),
                    offset: String(offset),
                    type,
                    sort,
                });
                if (query) params.set("q", query);
                const res = await fetch(`/api/crm/media?${params.toString()}`);
                if (!res.ok) throw new Error(`Status ${res.status}`);
                const json: ListResponse = await res.json();
                if (seq !== fetchSeqRef.current) return; // a newer fetch superseded us
                setTotal(json.total);
                setNextOffset(json.nextOffset);
                setFiles((prev) => (opts?.replace ? json.items : [...prev, ...json.items]));
            } catch {
                toast.error("Failed to load media");
            } finally {
                if (seq === fetchSeqRef.current) {
                    setLoading(false);
                    setInitialLoading(false);
                }
            }
        },
        [type, sort, query],
    );

    // Reset & reload when filter/sort/search/active change.
    useEffect(() => {
        if (!active) return;
        setInitialLoading(true);
        setFiles([]);
        setNextOffset(0);
        fetchPage(0, { replace: true });
    }, [type, sort, query, active, fetchPage]);

    // Infinite scroll: observe the sentinel; when it appears, request next page.
    useEffect(() => {
        if (!active || nextOffset == null || loading) return;
        const node = sentinelRef.current;
        if (!node) return;
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    fetchPage(nextOffset);
                }
            },
            { rootMargin: "300px 0px" },
        );
        io.observe(node);
        return () => io.disconnect();
    }, [active, nextOffset, loading, fetchPage]);

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const fileList = Array.from(e.target.files ?? []);
        if (!fileList.length) return;
        e.target.value = "";

        const previews: UploadingFile[] = fileList.map((f) => ({
            name: f.name,
            progress: 0,
            preview: URL.createObjectURL(f),
        }));
        setUploading(previews);

        for (let i = 0; i < fileList.length; i++) {
            try {
                const uploaded = await uploadMedia(fileList[i]);
                // Prepend to the visible grid so the user sees it immediately,
                // regardless of current sort. Subsequent filter changes will
                // re-fetch and place it correctly.
                setFiles((prev) => [uploaded, ...prev]);
                setTotal((t) => t + 1);
                if (mode === "multi") {
                    setSelected((prev) => new Set([...prev, uploaded.url]));
                }
            } catch {
                toast.error(`Failed to upload ${fileList[i].name}`);
            }
            setUploading((prev) => prev.map((p, idx) => (idx <= i ? { ...p, progress: 100 } : p)));
        }
        setTimeout(() => setUploading([]), 600);
        toast.success("Upload complete");
    }

    function handleThumbClick(f: MediaFile) {
        if (mode === "single") {
            // Show preview first; user confirms via the action button.
            setPreview(f);
            return;
        }
        if (mode === "multi") {
            setSelected((prev) => {
                const next = new Set(prev);
                if (next.has(f.url)) next.delete(f.url);
                else next.add(f.url);
                return next;
            });
            setPreview(f);
            return;
        }
        setPreview(f);
    }

    async function deleteSelected() {
        if (!confirm(`Delete ${selected.size} file(s)?`)) return;
        for (const url of selected) {
            try {
                await fetch("/api/crm/media", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url }),
                });
                setFiles((prev) => prev.filter((f) => f.url !== url));
                setTotal((t) => Math.max(0, t - 1));
            } catch {
                toast.error("Failed to delete file");
            }
        }
        setSelected(new Set());
        if (preview && selected.has(preview.url)) setPreview(null);
        toast.success("Deleted");
    }

    const videosMissingThumbnail = useMemo(
        () => files.filter((f) => isVideo(f.url) && !f.thumbnailUrl && f.id),
        [files],
    );

    async function generateMissingPosters() {
        const targets = videosMissingThumbnail;
        if (!targets.length) return;
        setBackfilling({ done: 0, total: targets.length });
        let failures = 0;
        for (let i = 0; i < targets.length; i++) {
            const asset = targets[i];
            try {
                const thumbnailUrl = await backfillThumbnail(asset);
                setFiles((prev) => prev.map((f) => (f.url === asset.url ? { ...f, thumbnailUrl } : f)));
            } catch (err) {
                failures++;
                console.error("Backfill failed for", asset.url, err);
            }
            setBackfilling({ done: i + 1, total: targets.length });
        }
        setBackfilling(null);
        if (failures === 0) toast.success(`Generated ${targets.length} poster(s)`);
        else toast.error(`Generated ${targets.length - failures}/${targets.length}. ${failures} failed — see console.`);
    }

    function confirmSinglePreview() {
        if (!preview) return;
        onSelect?.(preview);
    }
    function confirmMulti() {
        onMultiSelect?.(Array.from(selected));
    }

    return (
        <div className={cn("flex flex-col h-full min-h-0", className)}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50/60 shrink-0">
                <Input
                    type="search"
                    placeholder="Search filename…"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    className="h-9 w-56"
                />
                <Select value={type} onValueChange={(v) => setType(v as TypeFilter)}>
                    <SelectTrigger className="h-9 w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem value="image">Images</SelectItem>
                        <SelectItem value="video">Videos</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
                    <SelectTrigger className="h-9 w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest first</SelectItem>
                        <SelectItem value="oldest">Oldest first</SelectItem>
                        <SelectItem value="largest">Largest first</SelectItem>
                        <SelectItem value="smallest">Smallest first</SelectItem>
                        <SelectItem value="name">Name A–Z</SelectItem>
                    </SelectContent>
                </Select>

                <span className="text-xs text-gray-400 ml-auto">
                    {total === 0 ? "0 files" : `${files.length} of ${total} files`}
                </span>

                {mode === "manage" && videosMissingThumbnail.length > 0 && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={generateMissingPosters}
                        disabled={backfilling !== null}
                    >
                        {backfilling
                            ? `Generating posters ${backfilling.done}/${backfilling.total}…`
                            : `Generate ${videosMissingThumbnail.length} poster${videosMissingThumbnail.length === 1 ? "" : "s"}`}
                    </Button>
                )}

                {mode === "manage" && selected.size > 0 && (
                    <Button variant="destructive" size="sm" onClick={deleteSelected}>
                        Delete {selected.size}
                    </Button>
                )}

                {mode === "multi" && selected.size > 0 && (
                    <Button size="sm" onClick={confirmMulti}>
                        Insert {selected.size} file{selected.size > 1 ? "s" : ""}
                    </Button>
                )}

                <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                    Upload
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple
                    className="hidden"
                    onChange={handleUpload}
                />
            </div>

            {/* Body: grid + preview panel */}
            <div className="flex flex-1 min-h-0 bg-white">
                {/* Scrollable grid */}
                <div className={cn("flex-1 overflow-y-auto p-4", preview && "border-r border-gray-200")}>
                    {uploading.length > 0 && (
                        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2.5 mb-4">
                            {uploading.map((u, i) => (
                                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                    {isVideo(u.name) ? (
                                        <video src={u.preview} muted className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale" />
                                    ) : (
                                        <Image src={u.preview} alt={u.name} fill className="object-cover opacity-40 grayscale" sizes="160px" />
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                                        <div className="h-full bg-gray-900 transition-all duration-300" style={{ width: `${u.progress}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {initialLoading ? (
                        <p className="text-sm text-gray-400 py-16 text-center">Loading…</p>
                    ) : files.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-sm text-gray-400 gap-3">
                            <p>{query || type !== "all" ? "No media matches the current filters." : "No media uploaded yet."}</p>
                            {(!query && type === "all") && (
                                <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                    Upload your first file
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2.5">
                                {files.map((f) => (
                                    <div key={f.url} className="group relative">
                                        <button
                                            type="button"
                                            onClick={() => handleThumbClick(f)}
                                            className={cn(
                                                "relative aspect-square rounded-lg overflow-hidden border-2 transition-all w-full focus:outline-none",
                                                preview?.url === f.url
                                                    ? "border-blue-500 ring-2 ring-blue-200"
                                                    : selected.has(f.url)
                                                        ? "border-gray-900 ring-2 ring-gray-900/20"
                                                        : "border-transparent hover:border-gray-300",
                                            )}
                                        >
                                            <MediaThumb src={f.url} alt={f.pathname} sizes="160px" lightbox={false} />
                                            {selected.has(f.url) && (
                                                <div className="absolute top-1 right-1 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-[10px]">✓</span>
                                                </div>
                                            )}
                                            {isVideo(f.url) && (
                                                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
                                                    VIDEO
                                                </span>
                                            )}
                                            {isVideo(f.url) && !f.thumbnailUrl && f.id && (
                                                <span
                                                    className="absolute bottom-1 right-1 bg-amber-500/90 text-white text-[9px] font-medium px-1.5 py-0.5 rounded"
                                                    title="No poster image generated yet"
                                                >
                                                    NO POSTER
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Infinite-scroll sentinel */}
                            <div ref={sentinelRef} className="h-12 flex items-center justify-center text-xs text-gray-400">
                                {nextOffset != null
                                    ? loading
                                        ? "Loading more…"
                                        : "Scroll for more"
                                    : files.length > 0
                                        ? `${files.length} files`
                                        : ""}
                            </div>
                        </>
                    )}
                </div>

                {/* Preview panel */}
                {preview && (
                    <MediaPreviewPanel
                        file={preview}
                        onVersionUploaded={(updated) => {
                            setFiles((prev) => prev.map((f) => (f.url === preview.url ? { ...f, ...updated } : f)));
                            setPreview({ ...preview, ...updated });
                        }}
                        actions={
                            mode === "single" ? (
                                <Button size="sm" className="w-full" onClick={confirmSinglePreview}>
                                    Use this file
                                </Button>
                            ) : mode === "multi" ? (
                                <Button
                                    size="sm"
                                    variant={selected.has(preview.url) ? "destructive" : "default"}
                                    className="w-full"
                                    onClick={() => handleThumbClick(preview)}
                                >
                                    {selected.has(preview.url) ? "Deselect" : "Select"}
                                </Button>
                            ) : (
                                <Button
                                    size="sm"
                                    variant={selected.has(preview.url) ? "destructive" : "outline"}
                                    className="w-full"
                                    onClick={() => {
                                        setSelected((prev) => {
                                            const next = new Set(prev);
                                            if (next.has(preview.url)) next.delete(preview.url);
                                            else next.add(preview.url);
                                            return next;
                                        });
                                    }}
                                >
                                    {selected.has(preview.url) ? "Deselect" : "Select"}
                                </Button>
                            )
                        }
                    />
                )}
            </div>
        </div>
    );
}

interface UploadingFile {
    name: string;
    progress: number;
    preview: string;
}
