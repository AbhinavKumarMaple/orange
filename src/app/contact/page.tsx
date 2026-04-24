import type { Metadata } from "next";
import Script from "next/script";
import ContactPageClient from "./ContactPageClient";
import { getSocialLinks } from "@/lib/queries";
import { siteConfig, absoluteUrl, twitterCard } from "@/lib/site";

const title = "Contact Us";
const description = "Get in touch with Orange Studios. We respond within 24 hours — tell us about your project, timeline and goals.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["contact", "get in touch", "hire designer", "start project", ...siteConfig.keywords],
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/contact"),
    title: `${title} — ${siteConfig.name}`,
    description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} — ${siteConfig.name}`,
    description,
    ...twitterCard(),
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contact ${siteConfig.name}`,
  url: absoluteUrl("/contact"),
  description,
  mainEntity: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  },
};

export default async function ContactPage() {
  const socialLinks = await getSocialLinks();
  return (
    <>
      <Script
        id="ld-json-contact"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <ContactPageClient socialLinks={socialLinks} />
    </>
  );
}
