"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

/**
 * Context that carries a `Map<videoUrl, posterUrl>` for the current page.
 *
 * Populated server-side via `loadVideoPosters(urls)` and passed into this
 * provider at the top of each page tree. `<MediaRenderer>` (which is a
 * client component) reads it via `useVideoPoster(src)` to set the
 * `<video poster>` attribute without any prop threading through layout
 * components.
 *
 * Pages that don't render any video can skip the provider — `useVideoPoster`
 * returns undefined when there's no provider above it.
 */

type PosterEntry = [string, string];

const VideoPosterContext = createContext<Map<string, string> | null>(null);

export function VideoPosterProvider({
    posters,
    children,
}: {
    /** Serializable entries (`Array.from(map.entries())`) so server → client transfer is clean. */
    posters: ReadonlyArray<PosterEntry> | null;
    children: ReactNode;
}) {
    // Stabilize the Map identity across re-renders so context consumers don't churn.
    const map = useMemo(() => new Map<string, string>(posters ?? []), [posters]);
    return <VideoPosterContext.Provider value={map}>{children}</VideoPosterContext.Provider>;
}

/** Returns the poster URL for the given video URL, or undefined when none is known. */
export function useVideoPoster(src: string | null | undefined): string | undefined {
    const map = useContext(VideoPosterContext);
    if (!map || !src) return undefined;
    return map.get(src);
}
