"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn, isVideo } from "@/lib/utils";
import MediaThumb from "@/components/custom/MediaThumb";
import type { MediaFile } from "./types";

interface UploadingFile {
  name: string;
  progress: number;
  preview: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getExt(pathname: string) {
  return pathname.split(".").pop()?.toUpperCase() ?? "FILE";
}

export default function MediaPageClient() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<MediaFile | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/crm/media")
      .then((r) => r.json())
      .then((data: MediaFile[]) => {
        data.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        setFiles(data);
      })
      .catch(() => toast.error("Failed to load media"))
      .finally(() => setLoading(false));
  }, []);

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
        }
      } catch { toast.error(`Failed to upload ${fileList[i].name}`); }
      setUploading((prev) => prev.map((p, idx) => (idx <= i ? { ...p, progress: 100 } : p)));
    }
    setTimeout(() => setUploading([]), 600);
    e.target.value = "";
    toast.success("Upload complete");
  }

  function toggleSelect(url: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url); else next.add(url);
      return next;
    });
  }

  async function deleteSelected() {
    if (!confirm(`Delete ${selected.size} file(s)?`)) return;
    for (const url of selected) {
      try {
        await fetch("/api/crm/media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
        setFiles((prev) => prev.filter((f) => f.url !== url));
      } catch { toast.error("Failed to delete file"); }
    }
    setSelected(new Set());
    if (preview && selected.has(preview.url)) setPreview(null);
    toast.success("Deleted");
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media</h1>
          <p className="text-sm text-gray-500">Upload and manage images and videos used across the site.</p>
        </div>
        <div className="flex gap-2">
          {selected.size > 0 && (
            <Button variant="destructive" size="sm" onClick={deleteSelected}>Delete {selected.size}</Button>
          )}
          <Button onClick={() => fileRef.current?.click()}>Upload</Button>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleUpload} />

      {/* Body: grid + preview */}
      <div className="flex flex-1 min-h-0 gap-0 bg-white rounded-lg border border-gray-200 overflow-hidden">
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
            <p className="text-sm text-gray-400 py-16 text-center">Loading…</p>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-sm text-gray-400">
              <p>No media uploaded yet</p>
              <Button size="sm" variant="outline" className="mt-3" onClick={() => fileRef.current?.click()}>Upload your first file</Button>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2.5">
              {files.map((f) => (
                <div key={f.url} className="group relative">
                  <button
                    type="button"
                    onClick={() => setPreview(f)}
                    onDoubleClick={() => toggleSelect(f.url)}
                    className={cn(
                      "relative aspect-square rounded-lg overflow-hidden border-2 transition-all w-full focus:outline-none",
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview panel */}
        {preview && (
          <div className="w-72 shrink-0 flex flex-col bg-gray-50/60 overflow-y-auto">
            <div className="relative w-full aspect-square bg-white border-b border-gray-200 flex items-center justify-center">
              {isVideo(preview.url) ? (
                <video src={preview.url} controls muted playsInline className="max-w-full max-h-full object-contain" />
              ) : (
                <Image src={preview.url} alt="" fill className="object-contain p-3" sizes="288px" />
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
                <Button size="sm" variant={selected.has(preview.url) ? "destructive" : "outline"} className="w-full" onClick={() => toggleSelect(preview.url)}>
                  {selected.has(preview.url) ? "Deselect" : "Select"}
                </Button>
                <Button size="sm" variant="outline" className="w-full" onClick={() => { navigator.clipboard.writeText(preview.url); toast.success("URL copied"); }}>
                  Copy URL
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
