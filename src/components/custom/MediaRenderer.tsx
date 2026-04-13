"use client";

import Image from "next/image";
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
  /** Video-specific: autoplay muted loop (default true) */
  autoPlay?: boolean;
}

/**
 * Renders an <Image> or <video> depending on the file extension.
 * Drop-in replacement anywhere you currently use next/image for media URLs.
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
  if (!src) return null;

  if (isVideo(src)) {
    return (
      <video
        src={src}
        className={className}
        autoPlay={autoPlay}
        muted
        loop
        playsInline
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
