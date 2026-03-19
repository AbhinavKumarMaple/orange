"use client";

import { useRef, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface MediaInputProps {
    label: string;
    value: string;
    onChange?: (value: string) => void;
    accept?: string;
    /** Enable multi-file upload mode — hides the URL input, shows only an upload button */
    multiple?: boolean;
    /** Called with array of base64 strings when multiple files are selected */
    onMultipleChange?: (values: string[]) => void;
    /** Extra content rendered below the input (e.g. a list of uploaded files) */
    extraContent?: ReactNode;
}

/**
 * Dual-mode media input: paste a URL or upload a file (converted to base64).
 * In multiple mode, only file upload is available and each file is returned via onMultipleChange.
 * The stored value is always a string — either a URL or a data URI.
 */
export default function MediaInput({
    label, value, onChange, accept = "image/*",
    multiple, onMultipleChange, extraContent,
}: MediaInputProps) {
    const fileRef = useRef<HTMLInputElement>(null);
    const isBase64 = value.startsWith("data:");

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;

        if (multiple && onMultipleChange) {
            Promise.all(files.map((file) => new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            }))).then(onMultipleChange);
        } else if (files[0] && onChange) {
            const reader = new FileReader();
            reader.onload = () => onChange(reader.result as string);
            reader.readAsDataURL(files[0]);
        }

        // reset so same file can be re-selected
        e.target.value = "";
    }

    function clear() {
        onChange?.("");
        if (fileRef.current) fileRef.current.value = "";
    }

    return (
        <div className="flex flex-col gap-1.5">
            <Label className="block">{label}</Label>

            {multiple ? (
                <Button type="button" size="sm" variant="outline" className="w-fit" onClick={() => fileRef.current?.click()}>
                    + Upload files
                </Button>
            ) : isBase64 ? (
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 truncate flex-1 bg-gray-50 border border-gray-200 rounded px-3 py-2">
                        📎 File uploaded ({Math.round(value.length / 1024)}kb)
                    </span>
                    <Button type="button" size="sm" variant="outline" onClick={clear}>Remove</Button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <Input value={value} onChange={(e) => onChange?.(e.target.value)} placeholder="https://..." className="flex-1" />
                    <Button type="button" size="sm" variant="outline" onClick={() => fileRef.current?.click()}>Upload</Button>
                </div>
            )}

            <input ref={fileRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={handleFile} />

            {extraContent}
        </div>
    );
}
