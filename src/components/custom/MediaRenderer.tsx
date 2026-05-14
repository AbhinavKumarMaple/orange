"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { isVideo } from "@/lib/utils";
import DeferredVideo from "./DeferredVideo";
import { useVideoPoster } from "./VideoPosterProvider";

interface Props {
  src: string;
  alt?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Video-specific: autoplay muted loop (default true). Defers to intersection observer so off-screen videos never download. */
  autoPlay?: boolean;
}

/**
 * Renders an <Image> or <video> depending on the file extension.
 *
 * Performance-critical behavior:
 *  - Videos use `preload="metadata"` so only the first few KB download until
 *    the element scrolls near the viewport, then IntersectionObserver flips
 *    preload to "auto" and starts playback. Previously every portfolio video
 *    downloaded and played on mount, contributing MBs to initial payload.
 *  - Next/image `loading="lazy"` is the default for non-priority images, so
 *    off-screen images already stay out of the initial request.
 */
export default function MediaRenderer({
  src,
  alt = "",
  fill,
  width,
  height,
  className = "",
  sizes,
  priority,
  autoPlay = true,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldPlay, setShouldPlay] = useState(priority === true);
  // Resolved by VideoPosterProvider higher up the tree. Undefined when the
  // src isn't a known video asset (legacy/external URL) or when no provider
  // is mounted (public pages without video have no provider).
  const poster = useVideoPoster(src);

  useEffect(() => {
    if (!isVideo(src) || !autoPlay || priority) return;
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldPlay(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src, autoPlay, priority]);

  if (!src) return null;

  if (isVideo(src)) {
    // shouldPlay flips true once the element scrolls near the viewport.
    // While false: no src is set, so nothing downloads.
    // While true: DeferredVideo waits for canplaythrough before calling
    // play(), so the first frame is shown still until the buffer is ready.
    return (
      <DeferredVideo
        videoRef={videoRef}
        src={shouldPlay ? src : undefined}
        className={className}
        preload={shouldPlay ? "auto" : "metadata"}
        poster={poster}
        style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } : { width, height }}
      />
    );
  }

  return fill ? (
    <Image src={src} alt={alt} fill className={className} sizes={sizes} priority={priority} />
  ) : (
    <Image src={src} alt={alt} width={width ?? 0} height={height ?? 0} className={className} sizes={sizes} priority={priority} />
  );
}
