import type { Transition } from "motion/react";

// ── Easing Presets ──────────────────────────────────────────────

export const easings = {
  /** Snappy ease-out — great for slide-ups and reveals */
  snappy: [0.76, 0, 0.24, 1] as [number, number, number, number],
  /** Smooth ease-in-out — general purpose */
  smooth: [0.45, 0, 0.55, 1] as [number, number, number, number],
  /** Bouncy overshoot — playful entrances */
  bounce: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  /** Gentle ease-out — subtle fades and shifts */
  gentle: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
} as const;

export type EasingName = keyof typeof easings;

// ── Duration Presets (seconds) ──────────────────────────────────

export const durations = {
  fast: 0.3,
  normal: 0.5,
  medium: 0.6,
  slow: 0.8,
  xslow: 1.2,
} as const;

export type DurationName = keyof typeof durations;

// ── Delay Presets (seconds) ─────────────────────────────────────

export const delays = {
  none: 0,
  tiny: 0.1,
  short: 0.15,
  normal: 0.3,
  long: 0.5,
  xlong: 1.0,
} as const;

export type DelayName = keyof typeof delays;

// ── Stagger Config ──────────────────────────────────────────────

export const stagger = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
  relaxed: 0.25,
} as const;

export type StaggerName = keyof typeof stagger;

// ── Transition Builder ──────────────────────────────────────────

interface TransitionConfig {
  duration?: DurationName;
  ease?: EasingName;
  delay?: DelayName | number;
}

/** Build a motion transition from preset names */
export function createTransition(config: TransitionConfig = {}): Transition {
  const { duration = "medium", ease = "snappy", delay = "none" } = config;

  return {
    duration: durations[duration],
    ease: easings[ease],
    delay: typeof delay === "number" ? delay : delays[delay],
  };
}

// ── Common Animation Variants ───────────────────────────────────

/** Slide up from below (text reveal, section entrance) */
export const slideUp = {
  hidden: { y: "100%" },
  visible: { y: 0 },
} as const;

/** Fade in with upward shift (cards, content blocks) */
export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
} as const;

/** Simple fade */
export const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
} as const;

/** Scale up from slightly smaller */
export const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
} as const;

/** Full-screen overlay slide away (intro screen) */
export const overlayExit = {
  initial: { y: 0 },
  exit: { y: "-100%" },
} as const;

/** Slide down from above (nav overlay, dropdowns) */
export const slideDown = {
  hidden: { y: "-100%" },
  visible: { y: 0 },
} as const;

// ── Intro Screen Timing ─────────────────────────────────────────

export const introTiming = {
  /** Delay before text starts revealing */
  textAppear: 400,
  /** Delay between title and subtitle */
  subtitleOffset: 0.15,
  /** When the overlay starts sliding away (ms) */
  dismiss: 2400,
} as const;
