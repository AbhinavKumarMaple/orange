"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Props {
    images: string[];
    onChange: (images: string[]) => void;
}

export default function GalleryInput({ images, onChange }: Props) {
    const [urlInput, setUrlInput] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    function addUrl() {
        const trimmed = urlInput.trim();
        if (!trimmed) return;
        onChange([...images, trimmed]);
        setUrlInput("");
    }

    function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;
        Promise.all(
            files.map((file) => new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            }))
        ).then((base64s) => onChange([...images, ...base64s]));
        e.target.value = "";
    }

    function remove(i: number) {
        onChange(images.filter((_, idx) => idx !== i));
    }

    return (
        <div className="flex flex-col gap-2">
            <Label className="block">Gallery Images</Label>

            {/* Add by URL */}
            <div className="flex gap-2">
                <Input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://..."
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
                />
                <Button type="button" size="sm" variant="outline" onClick={addUrl}>Add URL</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => fileRef.current?.click()}>Upload</Button>
            </div>

            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />

            {/* List of added images */}
            {images.length > 0 && (
                <div className="flex flex-col gap-1">
                    {images.map((img, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded px-3 py-1.5">
                            <span className="flex-1 truncate">
                                {img.startsWith("data:") ? `📎 File ${i + 1} (${Math.round(img.length / 1024)}kb)` : img}
                            </span>
                            <button type="button" className="text-red-400 hover:text-red-600 shrink-0" onClick={() => remove(i)}>✕</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
