"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import MediaBrowser from "./MediaBrowser";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (url: string) => void;
    multiple?: boolean;
    onMultiSelect?: (urls: string[]) => void;
    accept?: string;
}

/**
 * Media library picker. The dialog is a thin chrome around the same
 * <MediaBrowser> the standalone /crm/media page uses, so pagination,
 * filtering, sorting, search, upload, and poster backfill behave
 * identically in both places.
 *
 * We pass `active={open}` so the browser only fetches when the dialog is
 * actually visible — opening a form that contains <MediaInput> doesn't
 * eagerly load the library.
 */
export default function MediaPickerDialog({
    open,
    onOpenChange,
    onSelect,
    multiple,
    onMultiSelect,
    accept = "image/*,video/*",
}: Props) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                <DialogPrimitive.Content
                    className="fixed z-50 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                    style={{ width: "calc(100vw - 48px)", maxWidth: 1280, height: "calc(100vh - 64px)", maxHeight: 860 }}
                >
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 shrink-0">
                        <DialogPrimitive.Title className="text-base font-semibold text-gray-900">
                            Media Library
                        </DialogPrimitive.Title>
                        <DialogPrimitive.Close className="text-gray-400 hover:text-gray-600 cursor-pointer">
                            <X size={18} />
                        </DialogPrimitive.Close>
                    </div>

                    <div className="flex-1 min-h-0">
                        <MediaBrowser
                            mode={multiple ? "multi" : "single"}
                            accept={accept}
                            active={open}
                            onSelect={(file) => {
                                onSelect(file.url);
                                onOpenChange(false);
                            }}
                            onMultiSelect={(urls) => {
                                onMultiSelect?.(urls);
                                onOpenChange(false);
                            }}
                        />
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
