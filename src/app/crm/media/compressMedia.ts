/**
 * Client-side image compression using Canvas + WebP encoding.
 * - Images: re-encoded as WebP at quality 0.92 (visually lossless, ~30-60% smaller)
 * - Videos / SVGs: returned as-is (no browser-native compression)
 * - If the compressed result is larger than the original, returns the original
 */

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

export async function compressMedia(file: File): Promise<File> {
  // Skip non-compressible types
  if (!IMAGE_TYPES.includes(file.type)) return file;
  // Skip SVG — it's already text-based
  if (file.type === "image/svg+xml") return file;
  // Skip tiny files — not worth the overhead
  if (file.size < 100 * 1024) return file;

  try {
    const compressed = await compressImage(file);
    // Only use compressed version if it's actually smaller
    return compressed.size < file.size ? compressed : file;
  } catch {
    // If anything fails, fall back to original
    return file;
  }
}

function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("No canvas context")); return; }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error("Canvas toBlob failed")); return; }
          // Keep original filename but change extension to .webp
          const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
          resolve(new File([blob], name, { type: "image/webp" }));
        },
        "image/webp",
        0.92,
      );
    };

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load failed")); };
    img.src = url;
  });
}
