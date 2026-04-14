"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { cn, isVideo } from "@/lib/utils";
import MediaThumb from "@/components/custom/MediaThumb";
import { X } from "lucide-react";
import type { MediaFile } from "./types";

interface UploadingFile {
  name: string;
  progress: number;
  preview: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  multiple?: boolean;
  onMultiSelect?: (urls: string[]) => void;
  accept?: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getExt(pathname: string) {
  return pathname.split(".").pop()?.toUpperCase() ?? "FILE";
}

export default function MediaPickerDialog({
  open, onOpenChange, onSelect, multiple, onMultiSelect, accept = "image/*,video/*",
}: Props) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<MediaFile | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/media");
      if (res.ok) {
        const data: MediaFile[] = await res.json();
        data.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        setFiles(data);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open) { fetchFiles(); setSelected(new Set()); setPreview(null); }
  }, [open, fetchFiles]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = Array.from(e.target.files ?? []);
    if (!fileList.length) return;
    const previews: UploadingFile[] = fileList.map((f) => ({
      name: f.name, progress: 0, preview: URL.createObjectURL(f),
    }));
    setUploading(previews);
    for (let i = 0; i < fileList.length; i++) {
      const formData = new FormData();
      formData.append("file", fileList[i]);
      try {
        const res = await fetch("/api/crm/media", { method: "POST", body: formData });
        if (res.ok) {
          const uploaded: MediaFile = await res.json();
          setFiles((prev) => [uploaded, ...prev]);
          if (multiple) setSelected((prev) => new Set([...prev, uploaded.url]));
        }
      } catch { /* ignore */ }
      setUploading((prev) => prev.map((p, idx) => (idx <= i ? { ...p, progress: 100 } : p)));
    }
    setTimeout(() => setUploading([]), 600);
    e.target.value = "";
  }

  function handleThumbClick(f: MediaFile) { setPreview(f); }

  function handleSelectFile(f: MediaFile) {
    if (multiple) {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(f.url)) next.delete(f.url); else next.add(f.url);
        return next;
      });
    } else {
      onSelect(f.url);
      onOpenChange(false);
    }
  }

  function confirmMulti() {
    if (onMultiSelect) onMultiSelect(Array.from(selected));
    onOpenChange(false);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          className="fixed z-50 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          style={{ width: "calc(100vw - 64px)", maxWidth: 1120, height: "calc(100vh - 80px)", maxHeight: 760 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 shrink-0">
            <DialogPrimitive.Title className="text-base font-semibold text-gray-900">Media Library</DialogPrimitive.Title>
            <DialogPrimitive.Close className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <X size={18} />
            </DialogPrimitive.Close>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-3 px-5 py-2.5 border-b border-gray-100 shrink-0 bg-gray-50/60">
            <Button size="sm" onClick={() => fileRef.current?.click()}>Upload</Button>
            {multiple && selected.size > 0 && (
              <Button size="sm" variant="outline" onClick={confirmMulti}>
                Insert {selected.size} file{selected.size > 1 ? "s" : ""}
              </Button>
            )}
            <span className="text-xs text-gray-400 ml-auto">{files.length} files</span>
            <input ref={fileRef} type="file" accept={accept} multiple className="hidden" onChange={handleUpload} />
          </div>

          {/* Body */}
          <div className="flex flex-1 min-h-0">
            {/* Grid */}
            <div className={cn("flex-1 overflow-y-auto p-4", preview && "border-r border-gray-200")}>
              {uploading.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2.5 mb-4">
                  {uploading.map((u, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      {isVideo(u.name) ? (
                        <video src={u.preview} muted className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale" />
                      ) : (
                        <Image src={u.preview} alt={u.name} fill className="object-cover opacity-40 grayscale" sizes="160px" />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                        <div className="h-full bg-gray-900 transition-all duration-300" style={{ width: `${u.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center h-full text-sm text-gray-400">Loading…</div>
              ) : files.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-sm text-gray-400 gap-3">
                  <p>No media yet</p>
                  <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>Upload your first file</Button>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2.5">
                  {files.map((f) => (
                    <button
                      key={f.url}
                      type="button"
                      onClick={() => handleThumbClick(f)}
                      onDoubleClick={() => handleSelectFile(f)}
                      className={cn(
                        "relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:opacity-90 focus:outline-none",
                        preview?.url === f.url ? "border-blue-500 ring-2 ring-blue-200" :
                        selected.has(f.url) ? "border-gray-900 ring-2 ring-gray-900/20" : "border-transparent hover:border-gray-300"
                      )}
                    >
                      <MediaThumb src={f.url} alt={f.pathname} sizes="160px" />
                      {selected.has(f.url) && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                          <span className="text-white text-[10px]">✓</span>
                        </div>
                      )}
                      {isVideo(f.url) && (
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-medium px-1.5 py-0.5 rounded">VIDEO</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Preview panel */}
            {preview && (
              <div className="w-64 shrink-0 flex flex-col bg-gray-50/80 overflow-y-auto">
                <div className="relative w-full aspect-square bg-white border-b border-gray-200 flex items-center justify-center">
                  {isVideo(preview.url) ? (
                    <video src={preview.url} controls muted playsInline className="max-w-full max-h-full object-contain" />
                  ) : (
                    <Image src={preview.url} alt="" fill className="object-contain p-2" sizes="256px" />
                  )}
                </div>
                <div className="p-4 flex flex-col gap-2.5 text-[13px]">
                  <p className="font-medium text-gray-900 break-all leading-tight">{preview.pathname.split("/").pop()}</p>
                  <div className="flex flex-col gap-1.5 text-gray-500">
                    <div className="flex justify-between"><span>Type</span><span className="text-gray-700">{getExt(preview.pathname)}</span></div>
                    <div className="flex justify-between"><span>Size</span><span className="text-gray-700">{formatBytes(preview.size)}</span></div>
                    <div className="flex justify-between"><span>Uploaded</span><span className="text-gray-700">{new Date(preview.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span></div>
                  </div>
                  <div className="flex flex-col gap-1.5 pt-2">
                    <Button size="sm" className="w-full" onClick={() => handleSelectFile(preview)}>
                      {multiple ? (selected.has(preview.url) ? "Deselect" : "Select") : "Use this file"}
                    </Button>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => navigator.clipboard.writeText(preview.url)}>
                      Copy URL
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
