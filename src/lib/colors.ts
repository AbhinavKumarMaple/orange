/**
 * Brand color tokens — single source of truth.
 *
 * CSS custom properties are defined in globals.css (:root).
 * Tailwind utilities are generated from those vars:
 *   bg-brand-accent  text-brand-accent
 *   bg-brand-linen   text-brand-linen
 *   bg-brand-cotton  text-brand-cotton
 *   bg-brand-dark    text-brand-dark
 *
 * Use Tailwind classes in components wherever possible.
 * Only use these JS values when an inline `style` prop is unavoidable
 * (e.g. framer-motion style objects, dynamic canvas, etc.)
 */
export const colors = {
  /** Electric Tangerine — primary accent, hero/contact/footer bg */
  accent: "var(--brand-accent)",
  /** Sustainable Linen — page background, light text on dark */
  linen: "var(--brand-linen)",
  /** Recycled Cotton — secondary/card background */
  cotton: "var(--brand-cotton)",
  /** Black Hole — dark section backgrounds, body text */
  dark: "var(--brand-dark)",

  // Legacy aliases so existing inline style props keep working
  // without a big-bang refactor. Migrate to Tailwind classes over time.
  /** @deprecated use colors.accent */
  blue: "var(--brand-accent)",
  /** @deprecated use colors.linen */
  light: "var(--brand-linen)",
  /** @deprecated use colors.linen */
  background: "var(--brand-linen)",
  /** @deprecated use colors.accent */
  ctaText: "var(--brand-accent)",
} as const;
