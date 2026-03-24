"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { colors } from "@/lib/colors";

interface ServiceItem {
  id: string;
  number: string;
  name: string;
  description: string;
  image: string;
  order: number;
}

interface Props {
  services: ServiceItem[];
}

/**
 * Renders service rows with a floating image that follows the cursor
 * with a smooth weighted (lerp) animation on hover.
 */
export default function ServiceRows({ services }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = useCallback(() => {
    pos.current.x = lerp(pos.current.x, mouse.current.x, 0.1);
    pos.current.y = lerp(pos.current.y, mouse.current.y, 0.1);

    const el = containerRef.current?.querySelector(
      "[data-hover-img]"
    ) as HTMLElement | null;
    if (el) {
      el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
    }

    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [animate]);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouse.current.x = e.clientX - rect.left;
    mouse.current.y = e.clientY - rect.top;
  }

  function handleRowEnter(image: string, e: React.MouseEvent) {
    if (!image) return;
    if (!visible) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        pos.current.x = e.clientX - rect.left;
        pos.current.y = e.clientY - rect.top;
      }
    }
    setActiveImage(image);
    setVisible(true);
  }

  function handleRowLeave() {
    setVisible(false);
  }

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col"
      style={{ cursor: visible ? "none" : undefined }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleRowLeave}
    >
      {/* Floating hover image */}
      <div
        data-hover-img
        className="pointer-events-none absolute top-0 left-0 z-30 will-change-transform"
        style={{
          width: 220,
          height: 220,
          marginLeft: -110,
          marginTop: -110,
          opacity: visible && activeImage ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
      >
        {activeImage && (
          <Image
            src={activeImage}
            alt=""
            fill
            className="object-cover rounded-md"
            sizes="220px"
            unoptimized
          />
        )}
      </div>

      {/* Service rows */}
      {services.map((s) => (
        <div
          key={s.id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6 sm:py-8 border-t"
          style={{ borderColor: "rgba(240, 245, 249, 0.15)" }}
          data-track-hover={`service_${s.name.toLowerCase().replace(/\s+/g, "_")}`}
          onMouseEnter={(e) => handleRowEnter(s.image, e)}
        >
          <div className="flex items-center gap-4 sm:gap-16">
            <p
              className="font-mono font-medium shrink-0"
              style={{
                color: colors.light,
                fontSize: 16,
                letterSpacing: "-0.32px",
                opacity: 0.5,
                minWidth: 28,
              }}
            >
              {s.number}
            </p>
            <p
              className="font-sans font-normal"
              style={{
                color: colors.light,
                fontSize: "clamp(32px, 5vw, 72px)",
                lineHeight: "1.1",
                letterSpacing: "-0.04em",
              }}
            >
              {s.name}
            </p>
          </div>
          <p
            className="font-sans font-normal sm:text-right pl-10 sm:pl-0"
            style={{
              color: colors.light,
              fontSize: "clamp(13px, 1.4vw, 20px)",
              lineHeight: "1.4",
              letterSpacing: "-0.6px",
              maxWidth: 280,
              opacity: 0.5,
            }}
          >
            {s.description}
          </p>
        </div>
      ))}
      <div
        className="border-t"
        style={{ borderColor: "rgba(240, 245, 249, 0.15)" }}
      />
    </div>
  );
}
