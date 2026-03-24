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
import type { faqs } from "@/db/schema";

type Faq = InferSelectModel<typeof faqs>;
const empty = { question: "", answer: "", order: 0 };

export default function FaqsClient({ initialData }: { initialData: Faq[] }) {
    const [data, setData] = useState(initialData);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Faq | null>(null);
    const [form, setForm] = useState<typeof empty>(empty);
    const [saving, setSaving] = useState(false);

    function openNew() { setEditing(null); setForm(empty); setOpen(true); }
    function openEdit(x: Faq) { setEditing(x); setForm({ question: x.question, answer: x.answer, order: x.order }); setOpen(true); }

    async function save() {
        setSaving(true);
        try {
            const url = editing ? `/api/crm/faqs/${editing.id}` : "/api/crm/faqs";
            const res = await fetch(url, {
                method: editing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" }, body: JSON.stringify(form)
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
        if (!confirm("Delete?")) return;
        await fetch(`/api/crm/faqs/${id}`, { method: "DELETE" });
        setData(data.filter((x) => x.id !== id));
        toast.success("Deleted");
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
                    <p className="text-sm text-gray-500">Questions shown in the FAQ accordion section.</p></div>
                <Button onClick={openNew}>+ New FAQ</Button>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader><TableRow><TableHead>Question</TableHead><TableHead>Order</TableHead><TableHead className="w-24" /></TableRow></TableHeader>
                    <TableBody>
                        {data.map((x) => (
                            <TableRow key={x.id}>
                                <TableCell className="font-medium max-w-md truncate">{x.question}</TableCell>
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
                    <DialogHeader><DialogTitle>{editing ? "Edit FAQ" : "New FAQ"}</DialogTitle></DialogHeader>
                    <div className="flex flex-col gap-4 mt-2">
                        <div><Label className="mb-1 block">Question</Label>
                            <Input value={form.question} onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))} /></div>
                        <div><Label className="mb-1 block">Answer</Label>
                            <Textarea rows={4} value={form.answer} onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))} /></div>
                        <div><Label className="mb-1 block">Order</Label>
                            <Input type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))} /></div>
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
