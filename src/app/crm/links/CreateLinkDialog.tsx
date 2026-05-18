"use client";

import { useEffect, useState } from "react";
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
    /** Fires after a successful create OR edit. Single callback covers both modes. */
    onSaved: (link: TrackingLink) => void;
    /** Provide an existing link to switch the dialog into edit mode. Slug is locked. */
    link?: TrackingLink | null;
}

export default function CreateLinkDialog({ open, onOpenChange, onSaved, link }: Props) {
    const isEdit = !!link;
    const [destinationUrl, setDestinationUrl] = useState("");
    const [label, setLabel] = useState("");
    const [source, setSource] = useState("");
    const [medium, setMedium] = useState("");
    const [campaign, setCampaign] = useState("");
    const [slug, setSlug] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // When the dialog opens (or the target link changes), seed the form. In
    // create mode the link is null, so all fields reset to empty.
    useEffect(() => {
        if (!open) return;
        setDestinationUrl(link?.destinationUrl ?? "");
        setLabel(link?.label ?? "");
        setSource(link?.source ?? "");
        setMedium(link?.medium ?? "");
        setCampaign(link?.campaign ?? "");
        setSlug(link?.slug ?? "");
    }, [open, link]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        try {
            // PATCH sends nulls for cleared optional fields so the server
            // overwrites a previously-set value; POST omits them so the
            // server treats them as "not provided".
            const payload = isEdit
                ? {
                      destinationUrl: destinationUrl.trim(),
                      label: label.trim() || null,
                      source: source.trim() || null,
                      medium: medium.trim() || null,
                      campaign: campaign.trim() || null,
                  }
                : {
                      destinationUrl: destinationUrl.trim(),
                      label: label.trim() || undefined,
                      source: source.trim() || undefined,
                      medium: medium.trim() || undefined,
                      campaign: campaign.trim() || undefined,
                      slug: slug.trim() || undefined,
                  };

            const res = await fetch(
                isEdit ? `/api/crm/links/${link!.id}` : "/api/crm/links",
                {
                    method: isEdit ? "PATCH" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                },
            );
            const data = await res.json();
            if (!res.ok) {
                toast.error(data?.error ?? (isEdit ? "Failed to save changes" : "Failed to create link"));
                return;
            }
            toast.success(isEdit ? "Changes saved" : "Link created");
            onSaved(data as TrackingLink);
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
                            {isEdit ? "Edit tracking link" : "New tracking link"}
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
                            label={isEdit ? "Slug (locked)" : "Custom slug"}
                            placeholder="auto-generated if left blank"
                            // Slug is the public identifier — changing it would invalidate
                            // every place the short link has already been pasted, so edit
                            // mode keeps it read-only.
                            hint={isEdit
                                ? "Slugs are permanent — old shares would 404 if this changed."
                                : "3–32 chars, letters / numbers / _ / - only."}
                            value={slug}
                            onChange={setSlug}
                            pattern={isEdit ? undefined : "^[A-Za-z0-9_-]{3,32}$"}
                            disabled={isEdit}
                        />

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <DialogPrimitive.Close asChild>
                                <Button variant="outline" type="button">Cancel</Button>
                            </DialogPrimitive.Close>
                            <Button type="submit" disabled={submitting || !destinationUrl}>
                                {submitting
                                    ? (isEdit ? "Saving…" : "Creating…")
                                    : (isEdit ? "Save changes" : "Create link")}
                            </Button>
                        </div>
                    </form>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}

function Field({
    id, label, value, onChange, placeholder, hint, required, type = "text", pattern, disabled,
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
    disabled?: boolean;
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
                disabled={disabled}
                className={`h-9 ${disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`}
            />
            {hint && <p className="text-[11px] text-gray-400 leading-tight">{hint}</p>}
        </div>
    );
}
