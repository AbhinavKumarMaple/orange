/**
 * Single source of truth for site-wide identity, contact, and SEO metadata.
 *
 * Any value consumed by metadata generators, JSON-LD, sitemap, robots, OG
 * images, or the RSS feed should originate here so there is exactly one
 * place to update when the brand, domain, or contact info changes.
 *
 * Env overrides:
 *  - NEXT_PUBLIC_SITE_URL: overrides `url` (use in production deploys)
 *  - NEXT_PUBLIC_CONTACT_EMAIL: overrides contact.email
 *  - NEXT_PUBLIC_CONTACT_PHONE: overrides contact.phone
 *  - NEXT_PUBLIC_TWITTER_HANDLE: sets the (optional) Twitter/X handle
 */

const PRODUCTION_URL = "https://www.theorangestudios.com";

/**
 * Resolve the canonical site URL with these priorities:
 *   1. NEXT_PUBLIC_SITE_URL (explicit override — always wins)
 *   2. Hardcoded PRODUCTION_URL when VERCEL_ENV === "production"
 *      (prevents the per-deployment VERCEL_URL from leaking into sitemap,
 *       canonicals, OG tags, and JSON-LD on the live site)
 *   3. VERCEL_URL for preview deployments (so previews get working OG images)
 *   4. PRODUCTION_URL as a final local-dev fallback
 *
 * Rule of thumb: NEVER trust VERCEL_URL in production. Vercel sets it to the
 * specific deployment URL (e.g. orange-abc123-team.vercel.app), not the
 * custom domain. Using it for canonicals/sitemap is a catastrophic SEO bug.
 */
function resolveSiteUrl(): string {
  const raw = (() => {
    if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
    if (process.env.VERCEL_ENV === "production") return PRODUCTION_URL;
    if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    return PRODUCTION_URL;
  })();
  // Trim whitespace (env vars routinely get pasted with stray spaces/newlines)
  // and strip any trailing slashes so concatenation with paths is clean.
  return raw.trim().replace(/\/+$/, "");
}

export const siteConfig = {
  name: "Orange Studios",
  shortName: "Orange",
  legalName: "Orange Studios",
  url: resolveSiteUrl(),
  description:
    "Orange Studios is a creative design studio crafting standout brands, websites and digital experiences that scale with growth and deliver measurable results.",
  tagline: "Creative studio for brands that want to stand out.",
  locale: "en_US",
  /**
   * Optional Twitter/X handle. If empty, the twitter:creator/twitter:site
   * meta tags are omitted rather than filled with a placeholder.
   */
  twitter: process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? "",
  keywords: [
    "creative studio",
    "design studio",
    "branding",
    "web design",
    "web development",
    "portfolio",
    "UI/UX design",
    "Orange Studios",
  ],
  /** Path to the branded favicon/logo. Served from public/. */
  logo: "/fav.jpg",
  logoMimeType: "image/jpeg",
  ogImage: "/opengraph-image",
  /**
   * Contact info surfaced in JSON-LD ContactPoint, mailto/tel links, and the
   * Contact section UI. Keep these in sync with whatever the live site shows.
   */
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@theorangestudios.com",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+91 8999525221",
    phoneE164: process.env.NEXT_PUBLIC_CONTACT_PHONE_E164 ?? "+918999525221",
    responseTime: "24 hours",
  },
  /**
   * External origins to preconnect/dns-prefetch on every page.
   * Hero images and CMS-managed media are served from these — warming the
   * TCP/TLS handshake before the <img> request saves ~100-300ms on LCP.
   * Keep this list tight: too many preconnects evicts useful DNS entries.
   */
  preconnectOrigins: [
    "https://tfo7hwi103lzosbj.public.blob.vercel-storage.com",
    "https://framerusercontent.com",
  ],
  rssFeedUrl: "/articles/rss.xml",
} as const;

export function absoluteUrl(path: string = "") {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Build Twitter card metadata only when a handle is configured.
 * Returns an empty object when unset, so the spread `...twitterCard(...)` is
 * safe to inline in any Next.js `Metadata` object.
 */
export function twitterCard(override?: { creator?: string; site?: string }) {
  const handle = override?.creator ?? override?.site ?? siteConfig.twitter;
  if (!handle) return {};
  return {
    creator: override?.creator ?? handle,
    site: override?.site ?? handle,
  };
}
