"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 to `target` when `inView` becomes true.
 * Returns the current display value as a string with the original suffix preserved.
 */
export function useCountUp(
  target: string,
  inView: boolean,
  duration = 1.5,
): string {
  // Parse numeric value and suffix (e.g. "150+" → 150, "+")
  const match = target.match(/^(\d+\.?\d*)(.*)/);
  const numericTarget = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : "";

  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;

    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * numericTarget * 10) / 10);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCurrent(numericTarget);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, numericTarget, duration]);

  // Format: if target had a decimal (like 3.2x), show one decimal place
  const formatted =
    numericTarget % 1 !== 0
      ? current.toFixed(1)
      : Math.round(current).toString();

  return formatted + suffix;
}
