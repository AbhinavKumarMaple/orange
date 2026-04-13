"use client";

import Image from "next/image";
import { isVideo } from "@/lib/utils";

interface Props {
  src: string;
  alt?: string;
  sizes?: string;
  className?: string;
}

/** Thumbnail for media library grids — shows image or video poster frame */
export default function MediaThumb({ src, alt = "", sizes = "150px", className = "object-cover" }: Props) {
  if (isVideo(src)) {
    return (
      <video
        src={src}
        muted
        playsInline
        preload="metadata"
        className={className}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }

  return <Image src={src} alt={alt} fill className={className} sizes={sizes} />;
}
