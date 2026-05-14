"use client";

import { useEffect, useRef, type CSSProperties, type Ref } from "react";
import { useVideoPoster } from "./VideoPosterProvider";

export interface DeferredVideoProps {
    src: string | undefined;
    className?: string;
    style?: CSSProperties;
    loop?: boolean;
    muted?: boolean;
    playsInline?: boolean;
    /** "auto" downloads enough to fire canplaythrough (so playback starts).
     *  "metadata" downloads only the poster frame — use for off-screen lazy
     *  videos where the parent component flips this to "auto" later. */
    preload?: "none" | "metadata" | "auto";
    poster?: string;
    videoRef?: Ref<HTMLVideoElement>;
}

/**
 * Renders a <video> that begins playback only after the browser fires
 * `canplaythrough` — i.e. it has buffered enough to play the entire clip
 * without re-stalling. Until then the video shows its first frame, which
 * looks identical to a still image.
 *
 * No `autoPlay` attribute is set; we always trigger play() ourselves once
 * the buffer is ready. play() may reject in browsers that block muted
 * autoplay in obscure circumstances, so the rejection is swallowed.
 */
export default function DeferredVideo({
    src,
    className,
    style,
    loop = true,
    muted = true,
    playsInline = true,
    preload = "auto",
    poster,
    videoRef,
}: DeferredVideoProps) {
    const internalRef = useRef<HTMLVideoElement | null>(null);

    // If no explicit poster was supplied, fall back to the one registered
    // for this URL by <VideoPosterProvider>. Lets every consumer of
    // DeferredVideo (Showreel, Hero, MediaRenderer, ...) auto-pick up the
    // matching poster without each one wiring it up itself.
    const contextPoster = useVideoPoster(src);
    const resolvedPoster = poster ?? contextPoster;

    const setRef = (el: HTMLVideoElement | null) => {
        internalRef.current = el;
        if (typeof videoRef === "function") {
            videoRef(el);
        } else if (videoRef && "current" in videoRef) {
            (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
        }
    };

    useEffect(() => {
        const el = internalRef.current;
        if (!el || !src) return;

        let cancelled = false;
        const start = () => {
            if (cancelled) return;
            // play() returns a promise; ignore rejections (e.g. user navigated away).
            el.play().catch(() => { });
        };

        // readyState 4 === HAVE_ENOUGH_DATA. Fast path for cached/second renders.
        if (el.readyState >= 4) {
            start();
            return;
        }

        el.addEventListener("canplaythrough", start, { once: true });
        return () => {
            cancelled = true;
            el.removeEventListener("canplaythrough", start);
        };
    }, [src]);

    return (
        <video
            ref={setRef}
            src={src}
            className={className}
            style={style}
            loop={loop}
            muted={muted}
            playsInline={playsInline}
            preload={preload}
            poster={resolvedPoster}
        />
    );
}
