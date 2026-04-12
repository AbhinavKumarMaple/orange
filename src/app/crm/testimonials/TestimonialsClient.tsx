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
import type { testimonials } from "@/db/schema";
import MediaInput from "@/components/custom/MediaInput";

type Testimonial = InferSelectModel<typeof testimonials>;

const POSITIONS = ["10%", "55%", "25%", "45%", "15%", "60%", "35%", "50%"];

const empty = { company: "", quote: "", avatar: "", name: "", role: "", xPercent: "25%", order: 0 };

export default function TestimonialsClient({ initialData }: { initialData: Testimonial[] }) {
    const [data, setData] = useState(initialData);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const [form, setForm] = useState<typeof empty>(empty);
    const [saving, setSaving] = useState(false);

    function openNew() {
        const nextPos = POSITIONS[data.length % POSITIONS.length];
        setEditing(null);
        setForm({ ...empty, xPercent: nextPos, order: data.length });
        setOpen(true);
    }
    function openEdit(t: Testimonial) {
        setEditing(t);
        setForm({ company: t.company, quote: t.quote, avatar: t.avatar, name: t.name, role: t.role, xPercent: t.xPercent, order: t.order });
        setOpen(true);
    }

    async function save() {
        setSaving(true);
        try {
            const url = editing ? `/api/crm/testimonials/${editing.id}` : "/api/crm/testimonials";
            const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) throw new Error();
            const saved = await res.json();
            setData(editing ? data.map((x) => (x.id === saved.id ? saved : x)) : [...data, saved]);
            toast.success(editing ? "Updated" : "Created");
            setOpen(false);
        } catch { toast.error("Save failed"); }
        finally { setSaving(false); }
    }

    async function del(id: string) {
        if (!confirm("Delete?")) return;
        await fetch(`/api/crm/testimonials/${id}`, { method: "DELETE" });
        setData(data.filter((x) => x.id !== id));
        toast.success("Deleted");
    }

    const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((p) => ({ ...p, [k]: e.target.value }));

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold text-gray-900">Testimonials</h1><p className="text-sm text-gray-500">Client results cards shown in the scrolling section.</p></div>
                <Button onClick={openNew}>+ New Testimonial</Button>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow><TableHead>Name</TableHead><TableHead>Company</TableHead><TableHead>Role</TableHead><TableHead>Order</TableHead><TableHead className="w-24" /></TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((x) => (
                            <TableRow key={x.id}>
                                <TableCell className="font-medium">{x.name}</TableCell>
                                <TableCell>{x.company}</TableCell>
                                <TableCell className="text-gray-500">{x.role}</TableCell>
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
                    <DialogHeader><DialogTitle>{editing ? "Edit Testimonial" : "New Testimonial"}</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div><Label className="mb-1 block">Name</Label><Input value={form.name} onChange={f("name")} /></div>
                        <div><Label className="mb-1 block">Company</Label><Input value={form.company} onChange={f("company")} /></div>
                        <div><Label className="mb-1 block">Role</Label><Input value={form.role} onChange={f("role")} /></div>
                        <div><Label className="mb-1 block">X Position (e.g. 25%)</Label><Input value={form.xPercent} onChange={f("xPercent")} /></div>
                        <div className="col-span-2">
                            <MediaInput label="Avatar" value={form.avatar} onChange={(v) => setForm((p) => ({ ...p, avatar: v }))} />
                        </div>
                        <div className="col-span-2"><Label className="mb-1 block">Quote</Label><Textarea rows={3} value={form.quote} onChange={f("quote")} /></div>
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
