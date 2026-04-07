/**
 * Brand color tokens — single source of truth.
 *
 * CSS custom properties are defined in globals.css (:root).
 * Tailwind utilities are generated from those vars:
 *   bg-brand-accent   text-brand-accent
 *   bg-brand-surface  text-brand-surface
 *   bg-brand-muted    text-brand-muted
 *   bg-brand-dark     text-brand-dark
 *   bg-brand-footer   text-brand-footer
 *
 * Use Tailwind classes in components wherever possible.
 * Only use these JS values when an inline `style` prop is unavoidable
 * (e.g. framer-motion style objects, dynamic canvas, etc.)
 */
export const colors = {
  /** Viper Red — primary accent */
  accent: "var(--brand-accent)",
  /** Off-white — light text on dark backgrounds, surface color */
  surface: "var(--brand-surface)",
  /** Muted grey — secondary text */
  muted: "var(--brand-muted)",
  /** Near-black — dark section backgrounds, body text */
  dark: "var(--brand-dark)",
  /** Footer background */
  footer: "var(--brand-footer)",
  /** Contact section background */
  contact: "var(--brand-contact)",

  // Legacy aliases — keep existing inline style props working
  /** @deprecated use colors.accent */
  blue: "var(--brand-accent)",
  /** @deprecated use colors.surface */
  light: "var(--brand-surface)",
  /** @deprecated use colors.surface */
  background: "var(--brand-surface)",
  /** @deprecated use colors.accent */
  ctaText: "var(--brand-accent)",
} as const;
