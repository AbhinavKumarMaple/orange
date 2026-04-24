"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { isVideo } from "@/lib/utils";

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
    return (
      <video
        ref={videoRef}
        src={shouldPlay ? src : undefined}
        data-src={src}
        className={className}
        autoPlay={autoPlay && shouldPlay}
        muted
        loop
        playsInline
        preload={shouldPlay ? "auto" : "metadata"}
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
