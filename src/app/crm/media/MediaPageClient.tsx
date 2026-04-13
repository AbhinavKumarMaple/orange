"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isVideo } from "@/lib/utils";
import MediaThumb from "@/components/custom/MediaThumb";
import type { MediaFile } from "./types";

interface UploadingFile {
  name: string;
  progress: number;
  preview: string;
}

export default function MediaPageClient() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/crm/media")
      .then((r) => r.json())
      .then(setFiles)
      .catch(() => toast.error("Failed to load media"))
      .finally(() => setLoading(false));
  }, []);

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
        }
      } catch {
        toast.error(`Failed to upload ${fileList[i].name}`);
      }
      setUploading((prev) =>
        prev.map((p, idx) => (idx <= i ? { ...p, progress: 100 } : p))
      );
    }
    setTimeout(() => setUploading([]), 600);
    e.target.value = "";
    toast.success("Upload complete");
  }

  function toggleSelect(url: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  }

  async function deleteSelected() {
    if (!confirm(`Delete ${selected.size} file(s)?`)) return;
    for (const url of selected) {
      try {
        await fetch("/api/crm/media", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        setFiles((prev) => prev.filter((f) => f.url !== url));
      } catch {
        toast.error("Failed to delete file");
      }
    }
    setSelected(new Set());
    toast.success("Deleted");
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media</h1>
          <p className="text-sm text-gray-500">Upload and manage images and videos used across the site.</p>
        </div>
        <div className="flex gap-2">
          {selected.size > 0 && (
            <Button variant="destructive" size="sm" onClick={deleteSelected}>
              Delete {selected.size}
            </Button>
          )}
          <Button onClick={() => fileRef.current?.click()}>Upload</Button>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleUpload} />

      {/* Uploading cards */}
      {uploading.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-3 mb-4">
          {uploading.map((u, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
              {isVideo(u.name) ? (
                <video src={u.preview} muted className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale" />
              ) : (
                <Image src={u.preview} alt={u.name} fill className="object-cover opacity-40 grayscale" sizes="150px" />
              )}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200">
                <div className="h-full bg-gray-900 transition-all duration-300" style={{ width: `${u.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 py-16 text-center">Loading...</p>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-sm text-gray-400 bg-white rounded-lg border border-gray-200">
          <p>No media uploaded yet</p>
          <Button size="sm" variant="outline" className="mt-3" onClick={() => fileRef.current?.click()}>
            Upload your first file
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-3">
          {files.map((f) => (
            <div key={f.url} className="group relative">
              <button
                type="button"
                onClick={() => toggleSelect(f.url)}
                className={cn(
                  "relative aspect-square rounded-lg overflow-hidden border-2 transition-all w-full",
                  selected.has(f.url) ? "border-gray-900 ring-2 ring-gray-900/20" : "border-gray-200 hover:border-gray-300"
                )}
              >
                <MediaThumb src={f.url} alt={f.pathname} />
                {selected.has(f.url) && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
              <button
                type="button"
                onClick={() => copyUrl(f.url)}
                className="absolute bottom-1.5 right-1.5 bg-white/90 text-gray-600 text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Copy URL
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
