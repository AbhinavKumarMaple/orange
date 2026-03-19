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
import type { articles } from "@/db/schema";
import MediaInput from "@/components/custom/MediaInput";

type Article = InferSelectModel<typeof articles>;
type ContentBlock = { heading: string; body: string };

const emptyBlock = (): ContentBlock => ({ heading: "", body: "" });
const empty = { slug: "", title: "", category: "", date: "", excerpt: "", image: "", content: [emptyBlock()], order: 0 };

export default function ArticlesClient({ initialData }: { initialData: Article[] }) {
    const [data, setData] = useState(initialData);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Article | null>(null);
    const [form, setForm] = useState<typeof empty>(empty);
    const [saving, setSaving] = useState(false);

    function openNew() { setEditing(null); setForm({ ...empty, content: [emptyBlock()] }); setOpen(true); }
    function openEdit(a: Article) {
        setEditing(a);
        setForm({
            slug: a.slug, title: a.title, category: a.category, date: a.date,
            excerpt: a.excerpt, image: a.image, content: (a.content as ContentBlock[]) ?? [emptyBlock()], order: a.order
        });
        setOpen(true);
    }

    async function save() {
        setSaving(true);
        try {
            const url = editing ? `/api/crm/articles/${editing.id}` : "/api/crm/articles";
            const res = await fetch(url, {
                method: editing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" }, body: JSON.stringify(form)
            });
            if (!res.ok) throw new Error();
            const saved = await res.json();
            setData(editing ? data.map((a) => (a.id === saved.id ? saved : a)) : [...data, saved]);
            toast.success(editing ? "Article updated" : "Article created");
            setOpen(false);
        } catch { toast.error("Save failed"); }
        finally { setSaving(false); }
    }

    async function del(id: number) {
        if (!confirm("Delete this article?")) return;
        await fetch(`/api/crm/articles/${id}`, { method: "DELETE" });
        setData(data.filter((a) => a.id !== id));
        toast.success("Deleted");
    }

    function updateBlock(i: number, key: keyof ContentBlock, val: string) {
        setForm((p) => { const c = [...p.content]; c[i] = { ...c[i], [key]: val }; return { ...p, content: c }; });
    }
    function addBlock() { setForm((p) => ({ ...p, content: [...p.content, emptyBlock()] })); }
    function removeBlock(i: number) { setForm((p) => ({ ...p, content: p.content.filter((_, idx) => idx !== i) })); }

    const f = (k: keyof Omit<typeof form, "content" | "order">) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, [k]: e.target.value }));

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold text-gray-900">Articles</h1>
                    <p className="text-sm text-gray-500">Blog posts shown on the blog page and homepage.</p></div>
                <Button onClick={openNew}>+ New Article</Button>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead><TableHead>Category</TableHead>
                            <TableHead>Date</TableHead><TableHead>Order</TableHead><TableHead className="w-24" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((a) => (
                            <TableRow key={a.id}>
                                <TableCell className="font-medium max-w-xs truncate">{a.title}</TableCell>
                                <TableCell><Badge variant="secondary">{a.category}</Badge></TableCell>
                                <TableCell>{a.date}</TableCell>
                                <TableCell>{a.order}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => openEdit(a)}>Edit</Button>
                                    <Button size="sm" variant="destructive" onClick={() => del(a.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editing ? "Edit Article" : "New Article"}</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="col-span-2"><Label className="mb-1 block">Title</Label><Input value={form.title} onChange={f("title")} /></div>
                        <div><Label className="mb-1 block">Slug</Label><Input value={form.slug} onChange={f("slug")} /></div>
                        <div><Label className="mb-1 block">Category</Label><Input value={form.category} onChange={f("category")} /></div>
                        <div><Label className="mb-1 block">Date</Label><Input value={form.date} onChange={f("date")} placeholder="Jun 17, 2025" /></div>
                        <div><Label className="mb-1 block">Order</Label><Input type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))} /></div>
                        <div className="col-span-2">
                            <MediaInput
                                label="Image"
                                value={form.image}
                                onChange={(v) => setForm((p) => ({ ...p, image: v }))}
                            />
                        </div>
                        <div className="col-span-2"><Label className="mb-1 block">Excerpt</Label><Textarea rows={2} value={form.excerpt} onChange={f("excerpt")} /></div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <Label>Content Blocks</Label>
                            <Button size="sm" variant="outline" onClick={addBlock}>+ Add Block</Button>
                        </div>
                        <div className="flex flex-col gap-4">
                            {form.content.map((block, i) => (
                                <div key={i} className="border border-gray-200 rounded-lg p-4 relative">
                                    <button onClick={() => removeBlock(i)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xs">✕</button>
                                    <Label className="mb-1 block text-xs text-gray-500">Heading</Label>
                                    <Input className="mb-2" value={block.heading} onChange={(e) => updateBlock(i, "heading", e.target.value)} />
                                    <Label className="mb-1 block text-xs text-gray-500">Body</Label>
                                    <Textarea rows={3} value={block.body} onChange={(e) => updateBlock(i, "body", e.target.value)} />
                                </div>
                            ))}
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
