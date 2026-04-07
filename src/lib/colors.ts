/**
 * Brand color tokens — single source of truth.
 *
 * CSS custom properties are defined in globals.css (:root).
 * To retheme the entire site, edit the 4 brand vars there.
 *
 * Tailwind utilities generated from those vars:
 *   bg-brand-accent  text-brand-accent
 *   bg-brand-linen   text-brand-linen
 *   bg-brand-cotton  text-brand-cotton
 *   bg-brand-dark    text-brand-dark
 *
 * Prefer Tailwind classes in components.
 * Use these JS values only when an inline `style` prop is unavoidable
 * (e.g. framer-motion style objects).
 */
export const colors = {
  /** Burnt Orange — primary accent, hero/contact/footer bg */
  accent: "var(--brand-accent)",
  /** Apricot Cream — page background, light text on dark */
  linen: "var(--brand-linen)",
  /** Golden Yellow — secondary/card background */
  cotton: "var(--brand-cotton)",
  /** Dark Chestnut — dark section backgrounds, body text */
  dark: "var(--brand-dark)",

  // Legacy aliases — keep existing inline style props working
  /** @deprecated use colors.accent */
  blue: "var(--brand-accent)",
  /** @deprecated use colors.linen */
  light: "var(--brand-linen)",
  /** @deprecated use colors.linen */
  background: "var(--brand-linen)",
  /** @deprecated use colors.accent */
  ctaText: "var(--brand-accent)",
} as const;
