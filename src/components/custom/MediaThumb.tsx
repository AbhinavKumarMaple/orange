"use client";

import { useState } from "react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { isVideo } from "@/lib/utils";

interface Props {
  src: string;
  alt?: string;
  sizes?: string;
  className?: string;
  /** Enable double-click to open full-size lightbox (default: true) */
  lightbox?: boolean;
}

/** Thumbnail for media library grids — shows image or video poster frame.
 *  Double-click opens a full-size lightbox. */
export default function MediaThumb({
  src,
  alt = "",
  sizes = "150px",
  className = "object-cover",
  lightbox = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const vid = isVideo(src);

  const thumb = vid ? (
    <video
      src={src}
      muted
      playsInline
      preload="metadata"
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      onDoubleClick={lightbox ? () => setOpen(true) : undefined}
    />
  ) : (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      onDoubleClick={lightbox ? () => setOpen(true) : undefined}
    />
  );

  if (!lightbox) return thumb;

  return (
    <>
      {thumb}

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
            onClick={() => setOpen(false)}
          />
          <DialogPrimitive.Content
            className="fixed z-[101] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            style={{ width: "calc(100vw - 80px)", maxWidth: 1200, maxHeight: "calc(100vh - 80px)" }}
          >
            <DialogPrimitive.Title className="sr-only">{alt || "Media preview"}</DialogPrimitive.Title>
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white cursor-pointer"
            >
              <X size={22} />
            </button>

            {vid ? (
              <video
                src={src}
                controls
                autoPlay
                playsInline
                className="w-full h-full rounded-lg"
                style={{ maxHeight: "calc(100vh - 120px)", objectFit: "contain" }}
              />
            ) : (
              <div className="relative" style={{ maxHeight: "calc(100vh - 120px)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt}
                  className="rounded-lg object-contain w-full"
                  style={{ maxHeight: "calc(100vh - 120px)" }}
                />
              </div>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
