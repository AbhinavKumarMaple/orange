"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { InferSelectModel } from "drizzle-orm";
import type { whyUsContent, clientLogos } from "@/db/schema";
import MediaInput from "@/components/custom/MediaInput";

type WhyUsContent = InferSelectModel<typeof whyUsContent>;
type ClientLogo = InferSelectModel<typeof clientLogos>;

type ContentForm = Omit<WhyUsContent, "id" | "updatedAt">;

const contentDefaults: ContentForm = {
    label: "//05 Why choose us",
    heading: "Details make|the difference",
    description:
        "We're not just designers. We're your partners who help you grow and get real results you can see.",
    stat1Value: "150+",
    stat1Label: "Completed projects",
    stat2Value: "3.2x",
    stat2Label: "Average ROI increase",
    stat3Value: "97%",
    stat3Label: "Client satisfaction rate",
    stat4Value: "24hr",
    stat4Label: "Average response time",
};

const emptyLogo = { name: "", image: "", width: 120, height: 40, order: 0 };

export default function WhyUsClient({
    initialContent,
    initialLogos,
}: {
    initialContent: WhyUsContent | null;
    initialLogos: ClientLogo[];
}) {
    // ── Section content (label/heading/description/stats) ─────────────
    const [content, setContent] = useState<ContentForm>(
        initialContent
            ? {
                label: initialContent.label,
                heading: initialContent.heading,
                description: initialContent.description,
                stat1Value: initialContent.stat1Value,
                stat1Label: initialContent.stat1Label,
                stat2Value: initialContent.stat2Value,
                stat2Label: initialContent.stat2Label,
                stat3Value: initialContent.stat3Value,
                stat3Label: initialContent.stat3Label,
                stat4Value: initialContent.stat4Value,
                stat4Label: initialContent.stat4Label,
            }
            : contentDefaults,
    );
    const [savingContent, setSavingContent] = useState(false);

    const c =
        (k: keyof ContentForm) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                setContent((prev) => ({ ...prev, [k]: e.target.value }));

    async function saveContent() {
        setSavingContent(true);
        try {
            const res = await fetch("/api/crm/why-us", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(content),
            });
            if (!res.ok) throw new Error();
            toast.success("Section content updated");
        } catch {
            toast.error("Save failed");
        } finally {
            setSavingContent(false);
        }
    }

    // ── Client logos (CRUD list) ──────────────────────────────────────
    const [logos, setLogos] = useState(initialLogos);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<ClientLogo | null>(null);
    const [logoForm, setLogoForm] = useState<typeof emptyLogo>(emptyLogo);
    const [savingLogo, setSavingLogo] = useState(false);

    function openNew() {
        setEditing(null);
        setLogoForm({ ...emptyLogo, order: logos.length + 1 });
        setOpen(true);
    }
    function openEdit(b: ClientLogo) {
        setEditing(b);
        setLogoForm({ name: b.name, image: b.image, width: b.width, height: b.height, order: b.order });
        setOpen(true);
    }

    async function saveLogo() {
        setSavingLogo(true);
        try {
            const url = editing ? `/api/crm/client-logos/${editing.id}` : "/api/crm/client-logos";
            const res = await fetch(url, {
                method: editing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(logoForm),
            });
            if (!res.ok) throw new Error();
            const saved = await res.json();
            setLogos(editing ? logos.map((x) => (x.id === saved.id ? saved : x)) : [...logos, saved]);
            toast.success(editing ? "Updated" : "Created");
            setOpen(false);
        } catch { toast.error("Save failed"); }
        finally { setSavingLogo(false); }
    }

    async function delLogo(id: string) {
        if (!confirm("Delete this client logo?")) return;
        await fetch(`/api/crm/client-logos/${id}`, { method: "DELETE" });
        setLogos(logos.filter((x) => x.id !== id));
        toast.success("Deleted");
    }

    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Why Choose Us</h1>
                <p className="text-sm text-gray-500">
                    Edit the //05 Why Choose Us section — label, heading, description, four stats, and the logos shown below.
                </p>
            </div>

            {/* Section content + stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col gap-5 mb-8">
                <h2 className="text-base font-semibold text-gray-900">Section content</h2>

                <div>
                    <Label className="mb-1 block">Section Label</Label>
                    <Input value={content.label} onChange={c("label")} placeholder="//05 Why choose us" />
                </div>

                <div>
                    <Label className="mb-1 block">Heading (use | for a line break)</Label>
                    <Input
                        value={content.heading}
                        onChange={c("heading")}
                        placeholder="Details make|the difference"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Example: <code>Details make|the difference</code> renders as two lines.
                    </p>
                </div>

                <div>
                    <Label className="mb-1 block">Description</Label>
                    <Textarea rows={3} value={content.description} onChange={c("description")} />
                </div>

                <div className="border-t border-gray-200 pt-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Stats</h3>
                    <p className="text-xs text-gray-500 mb-4">
                        Four stat slots laid out in a 2×2 grid. The big number animates up on scroll.
                        Leave both fields of a slot empty to hide it.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((n) => {
                            const valKey = `stat${n}Value` as keyof ContentForm;
                            const labelKey = `stat${n}Label` as keyof ContentForm;
                            return (
                                <div key={n} className="border border-gray-200 rounded-md p-4 flex flex-col gap-3">
                                    <Label className="text-xs uppercase tracking-wide text-gray-500">Stat {n}</Label>
                                    <div>
                                        <Label className="mb-1 block text-xs">Value (e.g. "150+")</Label>
                                        <Input value={content[valKey]} onChange={c(valKey)} placeholder="150+" />
                                    </div>
                                    <div>
                                        <Label className="mb-1 block text-xs">Label</Label>
                                        <Input value={content[labelKey]} onChange={c(labelKey)} placeholder="Completed projects" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <Button onClick={saveContent} disabled={savingContent}>
                        {savingContent ? "Saving..." : "Save section content"}
                    </Button>
                </div>
            </div>

            {/* Client logos */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">Client logos</h2>
                        <p className="text-sm text-gray-500">
                            Logos shown in the grid below the stats. 2 columns on mobile, 4 on desktop. Add as many as you need.
                        </p>
                    </div>
                    <Button onClick={openNew}>+ New Logo</Button>
                </div>
                <div className="border border-gray-200 rounded-md overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Logo</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Dimensions</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead className="w-24" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logos.map((x) => (
                                <TableRow key={x.id}>
                                    <TableCell>
                                        {x.image && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={x.image} alt={x.name} className="h-8 w-auto object-contain" />
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{x.name}</TableCell>
                                    <TableCell className="text-gray-500">{x.width} × {x.height}</TableCell>
                                    <TableCell>{x.order}</TableCell>
                                    <TableCell className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => openEdit(x)}>Edit</Button>
                                        <Button size="sm" variant="destructive" onClick={() => delLogo(x.id)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader><DialogTitle>{editing ? "Edit Client Logo" : "New Client Logo"}</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="col-span-2">
                            <Label className="mb-1 block">Name</Label>
                            <Input placeholder="e.g. Velo Studio" value={logoForm.name} onChange={(e) => setLogoForm((p) => ({ ...p, name: e.target.value }))} />
                        </div>
                        <div className="col-span-2">
                            <MediaInput label="Logo" accept="image/*" value={logoForm.image} onChange={(v) => setLogoForm((p) => ({ ...p, image: v }))} />
                        </div>
                        <div>
                            <Label className="mb-1 block">Width (px)</Label>
                            <Input type="number" value={logoForm.width} onChange={(e) => setLogoForm((p) => ({ ...p, width: Number(e.target.value) }))} />
                        </div>
                        <div>
                            <Label className="mb-1 block">Height (px)</Label>
                            <Input type="number" value={logoForm.height} onChange={(e) => setLogoForm((p) => ({ ...p, height: Number(e.target.value) }))} />
                        </div>
                        <div>
                            <Label className="mb-1 block">Order</Label>
                            <Input type="number" value={logoForm.order} onChange={(e) => setLogoForm((p) => ({ ...p, order: Number(e.target.value) }))} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={saveLogo} disabled={savingLogo}>{savingLogo ? "Saving..." : "Save"}</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
