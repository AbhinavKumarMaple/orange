"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { slideUp, fadeUp, createTransition } from "@/lib/motion";
import { colors } from "@/lib/colors";
import { isVideo } from "@/lib/utils";
import Navbar from "./Navbar";
import NavOverlay from "./NavOverlay";
import StarRating from "./StarRating";
import Button from "./Button";

interface HeroProps {
  image?: string;
  heading?: string;
  subtext?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  rating?: string;
  roi?: string;
}

const FALLBACK_IMAGE = "https://tfo7hwi103lzosbj.public.blob.vercel-storage.com/hero.webp";

export default function HeroSection({
  image = FALLBACK_IMAGE,
  heading = "Orange Studios",
  subtext = "Since 2023",
  description = "We are a creative studio building brands and websites that stand out, scale with growth and deliver measurable results.",
  ctaLabel = "Start your project",
  ctaHref = "#",
  rating = "4.8/5",
  roi = "3.2x Average ROI",
}: HeroProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section
      data-section="Hero"
      className="relative w-full overflow-hidden"
      style={{ height: "100svh" }}
    >
      {/* Full-bleed background image/video */}
      {isVideo(image || FALLBACK_IMAGE) ? (
        <video
          src={image || FALLBACK_IMAGE}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      ) : (
        <Image
          src={image || FALLBACK_IMAGE}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      )}

      <Navbar
        isMenuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((prev) => !prev)}
      />
      <NavOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* H1 + Since subtext */}
      <div className="absolute" style={{ top: 56, left: 0, right: 0 }}>

        {/* Mobile: each word on its own line, fills viewport width */}
        <div className="lg:hidden overflow-hidden px-4">
          <motion.h1
            className="font-medium leading-none"
            style={{
              fontSize: "clamp(72px, 24vw, 140px)",
              color: colors.light,
              letterSpacing: "-0.03em",
              lineHeight: "0.92",
            }}
            initial={slideUp.hidden}
            animate={slideUp.visible}
            transition={createTransition({ duration: "slow", ease: "snappy", delay: "long" })}
          >
            {heading.split(" ").map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </motion.h1>
          <motion.p
            className="font-mono font-medium mt-4"
            style={{ color: colors.light, fontSize: 15, letterSpacing: "0.02em", opacity: 0.85 }}
            initial={fadeUp.hidden}
            animate={fadeUp.visible}
            transition={createTransition({ duration: "medium", ease: "gentle", delay: "xlong" })}
          >
            {subtext}
          </motion.p>
        </div>

        {/* Desktop: single line, centered */}
        <div className="hidden lg:block overflow-hidden">
          <motion.h1
            className="font-medium leading-none text-center whitespace-nowrap"
            style={{
              fontSize: "clamp(80px, 14.5vw, 280px)",
              color: colors.light,
              letterSpacing: "-0.05em",
              lineHeight: "1.03",
            }}
            initial={slideUp.hidden}
            animate={slideUp.visible}
            transition={createTransition({ duration: "slow", ease: "snappy", delay: "long" })}
          >
            {heading}
          </motion.h1>
        </div>
      </div>

      {/* Desktop only — "Since" absolute left, vertically centered */}
      <motion.p
        className="absolute font-mono font-medium hidden lg:block"
        style={{
          top: "35%",
          left: "clamp(20px, 4vw, 57px)",
          color: colors.light,
          fontSize: "clamp(14px, 2vw, 20px)",
          lineHeight: "26px",
          letterSpacing: "-0.4px",
        }}
        initial={fadeUp.hidden}
        animate={fadeUp.visible}
        transition={createTransition({ duration: "medium", ease: "gentle", delay: "xlong" })}
      >
        {subtext}
      </motion.p>

      {/* Bottom content */}
      <motion.div
        className="absolute flex flex-col"
        style={{
          bottom: "clamp(16px, 4vh, 48px)",
          left: "clamp(20px, 4vw, 57px)",
          right: "clamp(20px, 4vw, 57px)",
        }}
        initial={fadeUp.hidden}
        animate={fadeUp.visible}
        transition={createTransition({ duration: "medium", ease: "gentle", delay: "xlong" })}
      >
        <p
          className="font-medium mb-5"
          style={{
            color: colors.light,
            fontSize: "clamp(15px, 4vw, 20px)",
            lineHeight: "1.4",
            letterSpacing: "-0.6px",
            maxWidth: 448,
          }}
        >
          {description}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <Button
            href={ctaHref}
            variant="light"
            data-track-click="hero_start_project"
            className="w-full sm:w-auto"
            style={{ fontSize: 16, whiteSpace: "nowrap", paddingLeft: 24, paddingRight: 24, paddingTop: 12, paddingBottom: 12 }}
          >
            {ctaLabel}
          </Button>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <StarRating />
              <span
                className="font-normal"
                style={{ color: colors.light, fontSize: 16, lineHeight: "20.8px", letterSpacing: "-0.48px" }}
              >
                {rating}
              </span>
            </div>
            <span
              className="font-normal"
              style={{ color: colors.light, fontSize: 16, lineHeight: "20.8px", letterSpacing: "-0.48px" }}
            >
              {roi}
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
