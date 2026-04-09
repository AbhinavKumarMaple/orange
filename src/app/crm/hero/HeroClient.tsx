"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import MediaInput from "@/components/custom/MediaInput";
import type { InferSelectModel } from "drizzle-orm";
import type { heroContent } from "@/db/schema";

type HeroContent = InferSelectModel<typeof heroContent>;

type FormData = Omit<HeroContent, "id" | "updatedAt">;

const defaults: FormData = {
  image: "",
  heading: "Orange Studios",
  subtext: "Since 2023",
  description:
    "We are a creative studio building brands and websites that stand out, scale with growth and deliver measurable results.",
  ctaLabel: "Start your project",
  ctaHref: "#",
  rating: "4.8/5",
  roi: "3.2x Average ROI",
};

export default function HeroClient({ initialData }: { initialData: HeroContent | null }) {
  const [form, setForm] = useState<FormData>(
    initialData
      ? {
          image: initialData.image,
          heading: initialData.heading,
          subtext: initialData.subtext,
          description: initialData.description,
          ctaLabel: initialData.ctaLabel,
          ctaHref: initialData.ctaHref,
          rating: initialData.rating,
          roi: initialData.roi,
        }
      : defaults
  );
  const [saving, setSaving] = useState(false);

  const f =
    (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/crm/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Hero section updated");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hero Section</h1>
        <p className="text-sm text-gray-500">Edit the homepage hero content and background image.</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col gap-5">
        {/* Image preview */}
        {form.image && (
          <div className="relative w-full aspect-video rounded-md overflow-hidden border border-gray-200">
            <Image src={form.image} alt="Hero preview" fill className="object-cover" sizes="672px" />
          </div>
        )}

        <MediaInput
          label="Background Image"
          value={form.image}
          onChange={(v) => setForm((p) => ({ ...p, image: v }))}
        />

        <div>
          <Label className="mb-1 block">Heading</Label>
          <Input value={form.heading} onChange={f("heading")} placeholder="Orange Studios" />
        </div>

        <div>
          <Label className="mb-1 block">Subtext (e.g. "Since 2019")</Label>
          <Input value={form.subtext} onChange={f("subtext")} placeholder="Since 2019" />
        </div>

        <div>
          <Label className="mb-1 block">Description</Label>
          <Textarea rows={3} value={form.description} onChange={f("description")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-1 block">CTA Label</Label>
            <Input value={form.ctaLabel} onChange={f("ctaLabel")} placeholder="Start your project" />
          </div>
          <div>
            <Label className="mb-1 block">CTA Link</Label>
            <Input value={form.ctaHref} onChange={f("ctaHref")} placeholder="#contact" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-1 block">Rating</Label>
            <Input value={form.rating} onChange={f("rating")} placeholder="4.8/5" />
          </div>
          <div>
            <Label className="mb-1 block">ROI Stat</Label>
            <Input value={form.roi} onChange={f("roi")} placeholder="3.2x Average ROI" />
          </div>
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
