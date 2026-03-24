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
import type { projects } from "@/db/schema";
import MediaInput from "@/components/custom/MediaInput";
import GalleryInput from "./GalleryInput";

type Project = InferSelectModel<typeof projects>;

const empty: Omit<Project, "id" | "createdAt"> = {
    slug: "", name: "", category: "", year: "", industry: "", timeline: "",
    description: "", problem: "", solution: "", heroImage: "", images: [], icon: "", order: 0,
};

export default function ProjectsClient({ initialData }: { initialData: Project[] }) {
    const [data, setData] = useState(initialData);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Project | null>(null);
    const [form, setForm] = useState<Omit<Project, "id" | "createdAt">>(empty);
    const [saving, setSaving] = useState(false);

    function openNew() { setEditing(null); setForm(empty); setOpen(true); }
    function openEdit(p: Project) {
        setEditing(p);
        setForm({
            slug: p.slug, name: p.name, category: p.category, year: p.year,
            industry: p.industry, timeline: p.timeline, description: p.description,
            problem: p.problem, solution: p.solution, heroImage: p.heroImage,
            images: p.images, icon: p.icon, order: p.order
        });
        setOpen(true);
    }

    async function save() {
        setSaving(true);
        try {
            const url = editing ? `/api/crm/projects/${editing.id}` : "/api/crm/projects";
            const res = await fetch(url, {
                method: editing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" }, body: JSON.stringify(form)
            });
            if (!res.ok) throw new Error();
            const saved = await res.json();
            setData(editing ? data.map((p) => (p.id === saved.id ? saved : p)) : [...data, saved]);
            toast.success(editing ? "Project updated" : "Project created");
            setOpen(false);
        } catch { toast.error("Save failed"); }
        finally { setSaving(false); }
    }

    async function del(id: string) {
        if (!confirm("Delete this project?")) return;
        await fetch(`/api/crm/projects/${id}`, { method: "DELETE" });
        setData(data.filter((p) => p.id !== id));
        toast.success("Deleted");
    }

    const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((prev) => ({ ...prev, [k]: e.target.value }));

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                    <p className="text-sm text-gray-500">Portfolio items shown on the homepage and project pages.</p></div>
                <Button onClick={openNew}>+ New Project</Button>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead><TableHead>Category</TableHead>
                            <TableHead>Year</TableHead><TableHead>Order</TableHead><TableHead className="w-24" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell className="font-medium">{p.name}</TableCell>
                                <TableCell><Badge variant="secondary">{p.category}</Badge></TableCell>
                                <TableCell>{p.year}</TableCell>
                                <TableCell>{p.order}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => openEdit(p)}>Edit</Button>
                                    <Button size="sm" variant="destructive" onClick={() => del(p.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editing ? "Edit Project" : "New Project"}</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        {(["name", "slug", "category", "year", "industry", "timeline"] as const).map((k) => (
                            <div key={k} className={k === "slug" ? "col-span-2" : ""}>
                                <Label className="capitalize mb-1 block">{k}</Label>
                                <Input value={form[k] as string} onChange={f(k)} placeholder={k} />
                            </div>
                        ))}
                        <div className="col-span-2">
                            <MediaInput label="Icon" value={form.icon} onChange={(v) => setForm((p) => ({ ...p, icon: v }))} accept="image/*,image/svg+xml" />
                        </div>
                        <div className="col-span-2">
                            <MediaInput label="Hero Image" value={form.heroImage} onChange={(v) => setForm((p) => ({ ...p, heroImage: v }))} />
                        </div>
                        <div className="col-span-2">
                            <GalleryInput
                                images={form.images}
                                onChange={(images) => setForm((p) => ({ ...p, images }))}
                            />
                        </div>
                        <div className="col-span-2"><Label className="mb-1 block">Description</Label><Textarea rows={2} value={form.description} onChange={f("description")} /></div>
                        <div className="col-span-2"><Label className="mb-1 block">Problem</Label><Textarea rows={3} value={form.problem} onChange={f("problem")} /></div>
                        <div className="col-span-2"><Label className="mb-1 block">Solution</Label><Textarea rows={3} value={form.solution} onChange={f("solution")} /></div>
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
