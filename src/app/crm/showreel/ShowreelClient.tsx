"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import MediaInput from "@/components/custom/MediaInput";
import type { InferSelectModel } from "drizzle-orm";
import type { showreelContent } from "@/db/schema";

type ShowreelContent = InferSelectModel<typeof showreelContent>;

type FormData = Omit<ShowreelContent, "id" | "updatedAt">;

const defaults: FormData = {
    label: "//02 Showreel",
    heading: "See Our Work\nIn Motion",
    description:
        "Experience a fast showcase of our best projects, highlighting bold design, seamless strategy, and measurable impact.",
    video: "",
};

export default function ShowreelClient({ initialData }: { initialData: ShowreelContent | null }) {
    const [form, setForm] = useState<FormData>(
        initialData
            ? {
                label: initialData.label,
                heading: initialData.heading,
                description: initialData.description,
                video: initialData.video,
            }
            : defaults,
    );
    const [saving, setSaving] = useState(false);

    const f =
        (k: keyof FormData) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                setForm((prev) => ({ ...prev, [k]: e.target.value }));

    async function save() {
        setSaving(true);
        try {
            const res = await fetch("/api/crm/showreel", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error();
            toast.success("Showreel section updated");
        } catch {
            toast.error("Save failed");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="max-w-2xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Showreel Section</h1>
                <p className="text-sm text-gray-500">
                    Edit the //02 Showreel block on the homepage. Heading supports line breaks (Enter for a new line).
                </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col gap-5">
                {/* Video preview */}
                {form.video && (
                    <div className="relative w-full aspect-video rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                        <video
                            key={form.video}
                            src={form.video}
                            muted
                            autoPlay
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <MediaInput
                    label="Showreel Video"
                    value={form.video}
                    onChange={(v) => setForm((p) => ({ ...p, video: v }))}
                    accept="video/*"
                />

                <div>
                    <Label className="mb-1 block">Section Label</Label>
                    <Input value={form.label} onChange={f("label")} placeholder="//02 Showreel" />
                </div>

                <div>
                    <Label className="mb-1 block">Heading (use Enter for line breaks)</Label>
                    <Textarea
                        rows={3}
                        value={form.heading}
                        onChange={f("heading")}
                        placeholder={"See Our Work\nIn Motion"}
                    />
                </div>

                <div>
                    <Label className="mb-1 block">Description</Label>
                    <Textarea rows={3} value={form.description} onChange={f("description")} />
                </div>

                <div className="flex justify-end pt-2">
                    <Button onClick={save} disabled={saving}>
                        {saving ? "Saving..." : "Save changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
