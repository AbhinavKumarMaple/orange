"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { InferSelectModel } from "drizzle-orm";
import type { socialLinks } from "@/db/schema";

type SocialLink = InferSelectModel<typeof socialLinks>;
const empty = { platform: "", url: "", order: 0 };

export default function SocialLinksClient({ initialData }: { initialData: SocialLink[] }) {
    const [data, setData] = useState(initialData);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<SocialLink | null>(null);
    const [form, setForm] = useState<typeof empty>(empty);
    const [saving, setSaving] = useState(false);

    function openNew() { setEditing(null); setForm(empty); setOpen(true); }
    function openEdit(x: SocialLink) { setEditing(x); setForm({ platform: x.platform, url: x.url, order: x.order }); setOpen(true); }

    async function save() {
        setSaving(true);
        try {
            const endpoint = editing ? `/api/crm/social-links/${editing.id}` : "/api/crm/social-links";
            const res = await fetch(endpoint, {
                method: editing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error();
            const saved = await res.json();
            setData(editing ? data.map((x) => (x.id === saved.id ? saved : x)) : [...data, saved]);
            toast.success(editing ? "Updated" : "Created");
            setOpen(false);
        } catch { toast.error("Save failed"); }
        finally { setSaving(false); }
    }

    async function del(id: string) {
        if (!confirm("Delete this social link?")) return;
        await fetch(`/api/crm/social-links/${id}`, { method: "DELETE" });
        setData(data.filter((x) => x.id !== id));
        toast.success("Deleted");
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Social Links</h1>
                    <p className="text-sm text-gray-500">Manage the social media links shown in the footer.</p>
                </div>
                <Button onClick={openNew}>+ New Link</Button>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Platform</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead className="w-24" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((x) => (
                            <TableRow key={x.id}>
                                <TableCell className="font-medium">{x.platform}</TableCell>
                                <TableCell className="max-w-xs truncate">{x.url}</TableCell>
                                <TableCell>{x.order}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => openEdit(x)}>Edit</Button>
                                    <Button size="sm" variant="destructive" onClick={() => del(x.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader><DialogTitle>{editing ? "Edit Social Link" : "New Social Link"}</DialogTitle></DialogHeader>
                    <div className="flex flex-col gap-4 mt-2">
                        <div>
                            <Label className="mb-1 block">Platform</Label>
                            <Input placeholder="e.g. Instagram" value={form.platform} onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value }))} />
                        </div>
                        <div>
                            <Label className="mb-1 block">URL</Label>
                            <Input placeholder="https://instagram.com/..." value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} />
                        </div>
                        <div>
                            <Label className="mb-1 block">Order</Label>
                            <Input type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
