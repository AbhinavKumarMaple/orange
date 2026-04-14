"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { isVideo } from "@/lib/utils";
import { toast } from "sonner";
import type { MediaFile, MediaVersion } from "./types";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getExt(pathname: string) {
  return pathname.split(".").pop()?.toUpperCase() ?? "FILE";
}

interface Props {
  file: MediaFile;
  /** Called when a new version is uploaded and the file's URL changes */
  onVersionUploaded?: (updated: MediaFile) => void;
  /** Action buttons — rendered below details */
  actions?: React.ReactNode;
}

export default function MediaPreviewPanel({ file, onVersionUploaded, actions }: Props) {
  const replaceRef = useRef<HTMLInputElement>(null);
  const [replacing, setReplacing] = useState(false);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(
    file.width && file.height ? { w: file.width, h: file.height } : null
  );

  // Detect image dimensions client-side if not stored
  useEffect(() => {
    if (file.width && file.height) {
      setDims({ w: file.width, h: file.height });
      return;
    }
    if (isVideo(file.url)) { setDims(null); return; }
    const img = new window.Image();
    img.onload = () => {
      setDims({ w: img.naturalWidth, h: img.naturalHeight });
      // Persist to DB if we have an asset id
      if (file.id) {
        fetch(`/api/crm/media/${file.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ width: img.naturalWidth, height: img.naturalHeight }),
        }).catch(() => {});
      }
    };
    img.src = file.url;
  }, [file.url, file.width, file.height, file.id]);

  async function handleReplace(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f || !file.id) return;
    setReplacing(true);
    try {
      const formData = new FormData();
      formData.append("file", f);
      const res = await fetch(`/api/crm/media/${file.id}`, { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      toast.success("Version updated — all references replaced");
      onVersionUploaded?.({
        ...file,
        url: updated.url,
        pathname: updated.pathname,
        size: updated.size,
        versions: updated.versions,
      });
    } catch {
      toast.error("Replace failed");
    } finally {
      setReplacing(false);
      e.target.value = "";
    }
  }

  const versions = (file.versions ?? []) as MediaVersion[];
  const isVid = isVideo(file.url);

  return (
    <div className="w-72 shrink-0 flex flex-col bg-gray-50/60 overflow-y-auto">
      {/* Preview */}
      <div className="relative w-full aspect-square bg-white border-b border-gray-200 flex items-center justify-center">
        {isVid ? (
          <video src={file.url} controls muted playsInline className="max-w-full max-h-full object-contain" />
        ) : (
          <Image src={file.url} alt="" fill className="object-contain p-3" sizes="288px" />
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col gap-2.5 text-[13px]">
        <p className="font-medium text-gray-900 break-all leading-tight">
          {file.pathname.split("/").pop()}
        </p>

        <div className="flex flex-col gap-1 text-gray-500">
          <Row label="Type" value={isVid ? "Video" : getExt(file.pathname)} />
          <Row label="Size" value={formatBytes(file.size)} />
          {dims && <Row label="Dimensions" value={`${dims.w} × ${dims.h}`} />}
          {dims && !isVid && <Row label="Aspect" value={simplifyRatio(dims.w, dims.h)} />}
          <Row label="Uploaded" value={new Date(file.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
          {versions.length > 0 && (
            <Row label="Versions" value={`${versions.length + 1} (current + ${versions.length} old)`} />
          )}
        </div>

        {/* Version history */}
        {versions.length > 0 && (
          <div className="pt-1">
            <p className="text-[11px] text-gray-400 font-medium mb-1.5">Version History</p>
            <div className="flex flex-col gap-1">
              {[...versions].reverse().map((v, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] text-gray-500 bg-white rounded px-2 py-1.5 border border-gray-100">
                  <span>v{versions.length - i} · {formatBytes(v.size)}</span>
                  <span>{new Date(v.replacedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-1.5 pt-2">
          {actions}
          {file.id && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                disabled={replacing}
                onClick={() => replaceRef.current?.click()}
              >
                {replacing ? "Replacing…" : "Upload New Version"}
              </Button>
              <input ref={replaceRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleReplace} />
            </>
          )}
          <Button size="sm" variant="outline" className="w-full" onClick={() => { navigator.clipboard.writeText(file.url); toast.success("URL copied"); }}>
            Copy URL
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="text-gray-700 text-right">{value}</span>
    </div>
  );
}

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }
function simplifyRatio(w: number, h: number) {
  const d = gcd(w, h);
  return `${w / d}:${h / d}`;
}
