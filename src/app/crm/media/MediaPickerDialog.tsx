"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

export default function MediaPickerDialog({
  open, onOpenChange, onSelect, multiple, onMultiSelect, accept = "image/*",
}: Props) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/media");
      if (res.ok) setFiles(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open) {
      fetchFiles();
      setSelected(new Set());
    }
  }, [open, fetchFiles]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = Array.from(e.target.files ?? []);
    if (!fileList.length) return;

    const previews: UploadingFile[] = fileList.map((f) => ({
      name: f.name,
      progress: 0,
      preview: URL.createObjectURL(f),
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
          if (multiple) {
            setSelected((prev) => new Set([...prev, uploaded.url]));
          }
        }
      } catch { /* ignore */ }

      setUploading((prev) =>
        prev.map((p, idx) => (idx <= i ? { ...p, progress: 100 } : p))
      );
    }

    // Small delay so user sees 100% before clearing
    setTimeout(() => setUploading([]), 600);
    e.target.value = "";
  }

  function toggleSelect(url: string) {
    if (multiple) {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(url)) next.delete(url);
        else next.add(url);
        return next;
      });
    } else {
      onSelect(url);
      onOpenChange(false);
    }
  }

  function confirmMulti() {
    if (onMultiSelect) onMultiSelect(Array.from(selected));
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
          <Button size="sm" onClick={() => fileRef.current?.click()}>
            Upload {multiple ? "Files" : "File"}
          </Button>
          {multiple && selected.size > 0 && (
            <Button size="sm" onClick={confirmMulti}>
              Select {selected.size} file{selected.size > 1 ? "s" : ""}
            </Button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Uploading files */}
          {uploading.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-4 pt-3">
              {uploading.map((u, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={u.preview}
                    alt={u.name}
                    fill
                    className="object-cover opacity-40 grayscale"
                    sizes="150px"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200">
                    <div
                      className="h-full bg-gray-900 transition-all duration-300"
                      style={{ width: `${u.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Library grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16 text-sm text-gray-400">
              Loading media...
            </div>
          ) : files.length === 0 && uploading.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-sm text-gray-400">
              <p>No media uploaded yet</p>
              <Button size="sm" variant="outline" className="mt-3" onClick={() => fileRef.current?.click()}>
                Upload your first file
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 pt-3">
              {files.map((f) => (
                <button
                  key={f.url}
                  type="button"
                  onClick={() => toggleSelect(f.url)}
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:opacity-90",
                    selected.has(f.url) ? "border-gray-900 ring-2 ring-gray-900/20" : "border-gray-200"
                  )}
                >
                  <Image
                    src={f.url}
                    alt={f.pathname}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                  {selected.has(f.url) && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
