/**
 * Browser-side video poster extraction.
 *
 * Loads a video off-screen, samples several candidate timestamps to find
 * a frame with visual content (not a flat black/white/single-color frame
 * which many videos open on), draws it to a canvas, and exports a JPEG
 * blob. Works in any modern browser; runs entirely client-side so we
 * don't need ffmpeg or a third-party service.
 *
 * Caveat: the source has to be reachable from the browser. Vercel Blob
 * serves with permissive CORS so canvas reads succeed; external CDNs may
 * or may not — when CORS prevents reads, `canvas.toBlob()` returns null
 * and we surface a clear error instead of silently producing a black JPEG.
 */

export interface ExtractOptions {
    /** Initial seek position. Used as the first candidate. Defaults to 0.3s. */
    timeSec?: number;
    /** Maximum width of the output thumbnail (in pixels). Aspect ratio preserved. Defaults to 1280. */
    maxWidth?: number;
    /** JPEG quality 0..1. Defaults to 0.85. */
    quality?: number;
}

export interface ExtractResult {
    blob: Blob;
    width: number;
    height: number;
    /** The timestamp (sec) of the chosen frame — useful for debugging / UI. */
    sourceTime: number;
    /** Frame "complexity" score (luminance stddev, 0..~128). Higher = more visual content. */
    score: number;
}

/**
 * Luminance stddev below this is considered "too flat / probably solid
 * color"; we keep searching. Empirically:
 *   0   — perfectly uniform (pure black, pure white, single tone)
 *   <5  — near-solid color with compression noise
 *   12+ — recognizable content
 *   30+ — busy frame
 */
const GOOD_FRAME_SCORE = 12;

export async function extractVideoPoster(
    source: File | string,
    options: ExtractOptions = {},
): Promise<ExtractResult> {
    const { timeSec = 0.3, maxWidth = 1280, quality = 0.85 } = options;

    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    // Tell the browser we expect to read pixels — required for cross-origin
    // sources to remain canvas-readable.
    video.crossOrigin = "anonymous";

    const objectUrl = source instanceof File ? URL.createObjectURL(source) : null;
    video.src = objectUrl ?? (source as string);

    try {
        await waitForMetadata(video);

        const duration = video.duration || 0;
        const candidates = buildCandidateTimes(duration, timeSec);

        // Pick the first frame whose complexity passes GOOD_FRAME_SCORE, or
        // the best of the bunch if none do.
        let best: { time: number; score: number } = { time: candidates[0], score: -1 };
        for (const t of candidates) {
            await seekTo(video, t);
            const score = scoreCurrentFrame(video);
            if (score > best.score) best = { time: t, score };
            if (score >= GOOD_FRAME_SCORE) break;
        }

        // If we ended on a different time than `best.time`, seek back so the
        // final draw lands on the chosen frame.
        if (Math.abs(video.currentTime - best.time) > 0.05) {
            await seekTo(video, best.time);
        }

        const naturalWidth = video.videoWidth;
        const naturalHeight = video.videoHeight;
        if (!naturalWidth || !naturalHeight) {
            throw new Error("Video has no intrinsic dimensions");
        }

        const scale = naturalWidth > maxWidth ? maxWidth / naturalWidth : 1;
        const width = Math.round(naturalWidth * scale);
        const height = Math.round(naturalHeight * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get 2D canvas context");
        ctx.drawImage(video, 0, 0, width, height);

        const blob = await canvasToBlob(canvas, "image/jpeg", quality);
        if (!blob) {
            throw new Error(
                "Canvas read failed — the video source likely doesn't allow cross-origin pixel reads (CORS).",
            );
        }

        return { blob, width, height, sourceTime: best.time, score: best.score };
    } finally {
        video.removeAttribute("src");
        video.load();
        if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
}

/**
 * Pick candidate seek times based on video duration. We start near the
 * beginning (where most intros and titles live), then probe further into
 * the body of the video if those frames look flat.
 *
 * Caller's `preferredFirst` (defaults to 0.3s) is tried first so the
 * common "first frame is fine" case stays fast — one seek, one draw.
 */
function buildCandidateTimes(duration: number, preferredFirst: number): number[] {
    if (!duration || !isFinite(duration) || duration < 0.2) {
        return [Math.max(0, preferredFirst)];
    }

    const cap = Math.max(0.1, duration - 0.1);
    const at = (sec: number) => Math.min(cap, Math.max(0, sec));

    if (duration < 1) {
        // Sub-second clip: try near-start and near-middle.
        return Array.from(new Set([at(preferredFirst), at(duration * 0.5), at(duration * 0.85)]));
    }

    if (duration < 5) {
        return Array.from(
            new Set([
                at(preferredFirst),
                at(0.8),
                at(1.5),
                at(duration * 0.5),
                at(duration * 0.85),
            ]),
        );
    }

    // Longer videos: probe across the timeline so we never default to a
    // flat title card if the body of the video has content.
    return Array.from(
        new Set([
            at(preferredFirst),
            at(1.0),
            at(2.5),
            at(duration * 0.15),
            at(duration * 0.35),
            at(duration * 0.6),
        ]),
    );
}

/**
 * Score how visually "interesting" the current video frame is by drawing
 * a downsampled copy and computing the standard deviation of pixel
 * luminance. Flat frames (pure black/white/single tone) score near 0;
 * frames with content score 15+.
 */
function scoreCurrentFrame(video: HTMLVideoElement): number {
    const W = 32;
    const H = 32;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d");
    if (!ctx) return 0;
    ctx.drawImage(video, 0, 0, W, H);
    let data: Uint8ClampedArray;
    try {
        data = ctx.getImageData(0, 0, W, H).data;
    } catch {
        // Tainted canvas (cross-origin) — we can't measure, so optimistically
        // accept the frame and let the final extractor surface the error.
        return GOOD_FRAME_SCORE;
    }

    let sum = 0;
    const n = W * H;
    const ys = new Float32Array(n);
    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
        // ITU-R BT.601 luma — perceptually weighted brightness.
        const y = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        ys[j] = y;
        sum += y;
    }
    const mean = sum / n;
    let variance = 0;
    for (let j = 0; j < n; j++) {
        const d = ys[j] - mean;
        variance += d * d;
    }
    return Math.sqrt(variance / n);
}

function waitForMetadata(video: HTMLVideoElement): Promise<void> {
    if (video.readyState >= 1 /* HAVE_METADATA */) return Promise.resolve();
    return new Promise((resolve, reject) => {
        const onLoaded = () => {
            cleanup();
            resolve();
        };
        const onError = () => {
            cleanup();
            reject(new Error("Video failed to load (network, codec, or CORS issue)"));
        };
        const cleanup = () => {
            video.removeEventListener("loadedmetadata", onLoaded);
            video.removeEventListener("error", onError);
        };
        video.addEventListener("loadedmetadata", onLoaded, { once: true });
        video.addEventListener("error", onError, { once: true });
    });
}

function seekTo(video: HTMLVideoElement, t: number): Promise<void> {
    return new Promise((resolve) => {
        const onSeeked = () => {
            video.removeEventListener("seeked", onSeeked);
            // Wait one frame so the painted frame is the seeked-to frame, not a
            // residual one from the decoder pipeline.
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        };
        video.addEventListener("seeked", onSeeked, { once: true });
        // Setting currentTime triggers `seeked`. If the value is identical to
        // the current position the event won't fire — nudge it slightly.
        video.currentTime = video.currentTime === t ? t + 0.001 : t;
    });
}

function canvasToBlob(
    canvas: HTMLCanvasElement,
    type: string,
    quality: number,
): Promise<Blob | null> {
    return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/** Convenience: turn a video pathname into a sibling thumbnail pathname. */
export function deriveThumbnailFilename(videoPathname: string): string {
    const dot = videoPathname.lastIndexOf(".");
    const base = dot > 0 ? videoPathname.slice(0, dot) : videoPathname;
    return `${base}.poster.jpg`;
}
