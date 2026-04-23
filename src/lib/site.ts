export const siteConfig = {
  name: "Orange Studios",
  shortName: "Orange",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://orangestudios.com"),
  description:
    "Orange Studios is a creative design studio crafting standout brands, websites and digital experiences that scale with growth and deliver measurable results.",
  tagline: "Creative studio for brands that want to stand out.",
  locale: "en_US",
  twitter: "@orangestudios",
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
  ogImage: "/opengraph-image",
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
