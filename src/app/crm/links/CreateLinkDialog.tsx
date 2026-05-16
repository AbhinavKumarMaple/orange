"use client";

import { useState } from "react";
import { toast } from "sonner";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TrackingLink } from "./types";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated: (link: TrackingLink) => void;
}

export default function CreateLinkDialog({ open, onOpenChange, onCreated }: Props) {
    const [destinationUrl, setDestinationUrl] = useState("");
    const [label, setLabel] = useState("");
    const [source, setSource] = useState("");
    const [medium, setMedium] = useState("");
    const [campaign, setCampaign] = useState("");
    const [slug, setSlug] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function reset() {
        setDestinationUrl("");
        setLabel("");
        setSource("");
        setMedium("");
        setCampaign("");
        setSlug("");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        try {
            const res = await fetch("/api/crm/links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    destinationUrl: destinationUrl.trim(),
                    label: label.trim() || undefined,
                    source: source.trim() || undefined,
                    medium: medium.trim() || undefined,
                    campaign: campaign.trim() || undefined,
                    slug: slug.trim() || undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data?.error ?? "Failed to create link");
                return;
            }
            toast.success("Link created");
            onCreated(data as TrackingLink);
            reset();
            onOpenChange(false);
        } catch (err) {
            console.error(err);
            toast.error("Network error");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                <DialogPrimitive.Content className="fixed z-50 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
                        <DialogPrimitive.Title className="text-base font-semibold text-gray-900">
                            New tracking link
                        </DialogPrimitive.Title>
                        <DialogPrimitive.Close className="text-gray-400 hover:text-gray-600 cursor-pointer">
                            <X size={18} />
                        </DialogPrimitive.Close>
                    </div>

                    <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-3">
                        <Field
                            id="destination"
                            label="Destination URL"
                            required
                            placeholder="https://www.theorangestudios.com/projects/procoach-platform"
                            value={destinationUrl}
                            onChange={setDestinationUrl}
                            type="url"
                        />
                        <Field
                            id="label"
                            label="Label"
                            placeholder="Spring sale → Procoach case study"
                            hint="For your own organization. Not appended to the URL."
                            value={label}
                            onChange={setLabel}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <Field
                                id="source"
                                label="Source"
                                placeholder="instagram"
                                hint="Where you'll post this link (utm_source)."
                                value={source}
                                onChange={setSource}
                            />
                            <Field
                                id="medium"
                                label="Medium"
                                placeholder="story"
                                hint="utm_medium — e.g. story, post, dm, bio."
                                value={medium}
                                onChange={setMedium}
                            />
                        </div>
                        <Field
                            id="campaign"
                            label="Campaign"
                            placeholder="spring-2026"
                            hint="utm_campaign — your campaign or push name."
                            value={campaign}
                            onChange={setCampaign}
                        />
                        <Field
                            id="slug"
                            label="Custom slug"
                            placeholder="auto-generated if left blank"
                            hint="3–32 chars, letters / numbers / _ / - only."
                            value={slug}
                            onChange={setSlug}
                            pattern="^[A-Za-z0-9_-]{3,32}$"
                        />

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <DialogPrimitive.Close asChild>
                                <Button variant="outline" type="button">Cancel</Button>
                            </DialogPrimitive.Close>
                            <Button type="submit" disabled={submitting || !destinationUrl}>
                                {submitting ? "Creating…" : "Create link"}
                            </Button>
                        </div>
                    </form>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}

function Field({
    id, label, value, onChange, placeholder, hint, required, type = "text", pattern,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    hint?: string;
    required?: boolean;
    type?: string;
    pattern?: string;
}) {
    return (
        <div className="flex flex-col gap-1">
            <Label htmlFor={id}>
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                type={type}
                pattern={pattern}
                className="h-9"
            />
            {hint && <p className="text-[11px] text-gray-400 leading-tight">{hint}</p>}
        </div>
    );
}
