"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MediaInput from "@/components/custom/MediaInput";
import Image from "next/image";
import type { InferSelectModel } from "drizzle-orm";
import type { services } from "@/db/schema";

type Service = InferSelectModel<typeof services>;
const empty = { number: "", name: "", description: "", image: "", order: 0 };

export default function ServicesClient({ initialData }: { initialData: Service[] }) {
    const [data, setData] = useState(initialData);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Service | null>(null);
    const [form, setForm] = useState<typeof empty>(empty);
    const [saving, setSaving] = useState(false);

    function openNew() { setEditing(null); setForm(empty); setOpen(true); }
    function openEdit(s: Service) {
        setEditing(s);
        setForm({ number: s.number, name: s.name, description: s.description, image: s.image, order: s.order });
        setOpen(true);
    }

    async function save() {
        setSaving(true);
        try {
            const url = editing ? `/api/crm/services/${editing.id}` : "/api/crm/services";
            const res = await fetch(url, {
                method: editing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" }, body: JSON.stringify(form)
            });
            if (!res.ok) throw new Error();
            const saved = await res.json();
            setData(editing ? data.map((s) => (s.id === saved.id ? saved : s)) : [...data, saved]);
            toast.success(editing ? "Updated" : "Created");
            setOpen(false);
        } catch { toast.error("Save failed"); }
        finally { setSaving(false); }
    }

    async function del(id: string) {
        if (!confirm("Delete?")) return;
        await fetch(`/api/crm/services/${id}`, { method: "DELETE" });
        setData(data.filter((s) => s.id !== id));
        toast.success("Deleted");
    }

    const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((p) => ({ ...p, [k]: e.target.value }));

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold text-gray-900">Services</h1>
                    <p className="text-sm text-gray-500">Service rows shown in the Our Services section.</p></div>
                <Button onClick={openNew}>+ New Service</Button>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader><TableRow><TableHead className="w-16">Image</TableHead><TableHead>Number</TableHead><TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead>Order</TableHead><TableHead className="w-24" /></TableRow></TableHeader>
                    <TableBody>
                        {data.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell>
                                    {s.image ? (
                                        <div className="relative w-10 h-10 rounded overflow-hidden border border-gray-200">
                                            <Image src={s.image} alt={s.name} fill className="object-cover" sizes="40px" />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200" />
                                    )}
                                </TableCell>
                                <TableCell className="font-mono text-sm">{s.number}</TableCell>
                                <TableCell className="font-medium">{s.name}</TableCell>
                                <TableCell className="text-gray-500 max-w-xs truncate">{s.description}</TableCell>
                                <TableCell>{s.order}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => openEdit(s)}>Edit</Button>
                                    <Button size="sm" variant="destructive" onClick={() => del(s.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader><DialogTitle>{editing ? "Edit Service" : "New Service"}</DialogTitle></DialogHeader>
                    <div className="flex flex-col gap-4 mt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label className="mb-1 block">Number (e.g. 001)</Label><Input value={form.number} onChange={f("number")} /></div>
                            <div><Label className="mb-1 block">Name</Label><Input value={form.name} onChange={f("name")} /></div>
                        </div>
                        <div><Label className="mb-1 block">Description</Label><Textarea rows={3} value={form.description} onChange={f("description")} /></div>
                        <MediaInput label="Hover Image" value={form.image} onChange={(url) => setForm((p) => ({ ...p, image: url }))} />
                        <div><Label className="mb-1 block">Order</Label><Input type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))} /></div>
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
