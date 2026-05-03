"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { InferSelectModel } from "drizzle-orm";
import type { clientLogos } from "@/db/schema";
import MediaInput from "@/components/custom/MediaInput";

type ClientLogo = InferSelectModel<typeof clientLogos>;

const empty = { name: "", image: "", width: 120, height: 40, order: 0 };

export default function ClientLogosClient({ initialData }: { initialData: ClientLogo[] }) {
    const [data, setData] = useState(initialData);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<ClientLogo | null>(null);
    const [form, setForm] = useState<typeof empty>(empty);
    const [saving, setSaving] = useState(false);

    function openNew() {
        setEditing(null);
        setForm({ ...empty, order: data.length + 1 });
        setOpen(true);
    }
    function openEdit(b: ClientLogo) {
        setEditing(b);
        setForm({ name: b.name, image: b.image, width: b.width, height: b.height, order: b.order });
        setOpen(true);
    }

    async function save() {
        setSaving(true);
        try {
            const url = editing ? `/api/crm/client-logos/${editing.id}` : "/api/crm/client-logos";
            const res = await fetch(url, {
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
        if (!confirm("Delete this client logo?")) return;
        await fetch(`/api/crm/client-logos/${id}`, { method: "DELETE" });
        setData(data.filter((x) => x.id !== id));
        toast.success("Deleted");
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Client Logos</h1>
                    <p className="text-sm text-gray-500">
                        Logos shown in the //05 Why Choose Us grid below the stats. Add as many as you want — the grid is 2 columns on mobile, 4 on desktop.
                    </p>
                </div>
                <Button onClick={openNew}>+ New Client Logo</Button>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                        {data.map((x) => (
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
                                    <Button size="sm" variant="destructive" onClick={() => del(x.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader><DialogTitle>{editing ? "Edit Client Logo" : "New Client Logo"}</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="col-span-2">
                            <Label className="mb-1 block">Name</Label>
                            <Input placeholder="e.g. Velo Studio" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                        </div>
                        <div className="col-span-2">
                            <MediaInput label="Logo" accept="image/*" value={form.image} onChange={(v) => setForm((p) => ({ ...p, image: v }))} />
                        </div>
                        <div>
                            <Label className="mb-1 block">Width (px)</Label>
                            <Input type="number" value={form.width} onChange={(e) => setForm((p) => ({ ...p, width: Number(e.target.value) }))} />
                        </div>
                        <div>
                            <Label className="mb-1 block">Height (px)</Label>
                            <Input type="number" value={form.height} onChange={(e) => setForm((p) => ({ ...p, height: Number(e.target.value) }))} />
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
