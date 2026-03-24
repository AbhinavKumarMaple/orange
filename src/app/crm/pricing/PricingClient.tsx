"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { InferSelectModel } from "drizzle-orm";
import type { pricingPlans } from "@/db/schema";

type Plan = InferSelectModel<typeof pricingPlans>;
const empty = { name: "", subtitle: "", priceProject: 0, priceMonthly: 0, features: [] as string[], delivery: "", isFeatured: false, order: 0 };

export default function PricingClient({ initialData }: { initialData: Plan[] }) {
    const [data, setData] = useState(initialData);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Plan | null>(null);
    const [form, setForm] = useState<typeof empty>(empty);
    const [saving, setSaving] = useState(false);

    function openNew() { setEditing(null); setForm(empty); setOpen(true); }
    function openEdit(p: Plan) {
        setEditing(p);
        setForm({ name: p.name, subtitle: p.subtitle, priceProject: p.priceProject, priceMonthly: p.priceMonthly, features: p.features, delivery: p.delivery, isFeatured: p.isFeatured, order: p.order });
        setOpen(true);
    }

    async function save() {
        setSaving(true);
        try {
            const url = editing ? `/api/crm/pricing/${editing.id}` : "/api/crm/pricing";
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
        if (!confirm("Delete this plan?")) return;
        await fetch(`/api/crm/pricing/${id}`, { method: "DELETE" });
        setData(data.filter((x) => x.id !== id));
        toast.success("Deleted");
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold text-gray-900">Pricing Plans</h1><p className="text-sm text-gray-500">Plans shown in the pricing section.</p></div>
                <Button onClick={openNew}>+ New Plan</Button>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow><TableHead>Name</TableHead><TableHead>Per Project</TableHead><TableHead>Monthly</TableHead><TableHead>Featured</TableHead><TableHead>Order</TableHead><TableHead className="w-28" /></TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((x) => (
                            <TableRow key={x.id}>
                                <TableCell className="font-medium">{x.name}</TableCell>
                                <TableCell>${x.priceProject.toLocaleString()}</TableCell>
                                <TableCell>${x.priceMonthly.toLocaleString()}</TableCell>
                                <TableCell>{x.isFeatured && <Badge>Featured</Badge>}</TableCell>
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
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editing ? "Edit Plan" : "New Plan"}</DialogTitle></DialogHeader>
                    <div className="flex flex-col gap-4 mt-2">
                        <div><Label className="mb-1 block">Name</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
                        <div><Label className="mb-1 block">Subtitle</Label><Input value={form.subtitle} onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label className="mb-1 block">Price / Project ($)</Label><Input type="number" value={form.priceProject} onChange={(e) => setForm((p) => ({ ...p, priceProject: Number(e.target.value) }))} /></div>
                            <div><Label className="mb-1 block">Price / Month ($)</Label><Input type="number" value={form.priceMonthly} onChange={(e) => setForm((p) => ({ ...p, priceMonthly: Number(e.target.value) }))} /></div>
                        </div>
                        <div><Label className="mb-1 block">Delivery Time</Label><Input value={form.delivery} placeholder="6-8 weeks" onChange={(e) => setForm((p) => ({ ...p, delivery: e.target.value }))} /></div>
                        <div><Label className="mb-1 block">Features (one per line)</Label>
                            <Textarea rows={5} value={form.features.join("\n")} onChange={(e) => setForm((p) => ({ ...p, features: e.target.value.split("\n").filter(Boolean) }))} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label className="mb-1 block">Order</Label><Input type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))} /></div>
                            <div className="flex items-center gap-2 pt-6">
                                <input type="checkbox" id="featured" checked={form.isFeatured} onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))} className="w-4 h-4 cursor-pointer" />
                                <Label htmlFor="featured" className="cursor-pointer">Mark as featured</Label>
                            </div>
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
