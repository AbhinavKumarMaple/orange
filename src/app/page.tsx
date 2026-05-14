import type { Metadata } from "next";
import Script from "next/script";
import IntroOverlay from "@/components/custom/IntroOverlay";
import HeroSection from "@/components/custom/HeroSection";
import HashScroller from "@/components/custom/HashScroller";
import ShowreelSection from "@/components/custom/ShowreelSection";
import PortfolioSection from "@/components/custom/PortfolioSection";
import ServicesSection from "@/components/custom/ServicesSection";
import WhyUsSection from "@/components/custom/WhyUsSection";
import ClientResultsSection from "@/components/custom/ClientResultsSection";
// import PricingSection from "@/components/custom/PricingSection";
import BlogSection from "@/components/custom/BlogSection";
import FaqSection from "@/components/custom/FaqSection";
import ContactSection from "@/components/custom/ContactSection";
import Footer from "@/components/custom/Footer";
import { VideoPosterProvider } from "@/components/custom/VideoPosterProvider";
import { siteConfig, twitterCard } from "@/lib/site";
import { loadVideoPosters, collectMediaUrls } from "@/lib/media-posters";
import {
  getProjects,
  getArticles,
  getTestimonials,
  getFaqs,
  getServices,
  getSocialLinks,
  getHeroContent,
  getBrands,
  getShowreelContent,
  getClientLogos,
  getWhyUsContent,
} from "@/lib/queries";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} — ${siteConfig.tagline}`,
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    ...twitterCard(),
  },
};

export default async function Home() {
  const [
    projects,
    articles,
    testimonials,
    faqs,
    services,
    socialLinks,
    hero,
    brands,
    showreel,
    clientLogos,
    whyUs,
  ] = await Promise.all([
    getProjects(),
    getArticles(),
    getTestimonials(),
    getFaqs(),
    getServices(),
    getSocialLinks(),
    getHeroContent(),
    getBrands(),
    getShowreelContent(),
    getClientLogos(),
    getWhyUsContent(),
  ]);

  // Collect every URL that might point to a video, then look up posters in
  // a single DB query so MediaRenderer down the tree can pick them up via
  // context without prop threading.
  const allMediaUrls = collectMediaUrls(
    hero?.image,
    hero?.mobileImage,
    showreel?.video,
    ...projects.flatMap((p) => [p.heroImage, p.coverImage, p.icon, ...(p.images ?? [])]),
    ...articles.flatMap((a) => [a.image, a.coverImage, a.icon, ...(a.images ?? [])]),
    ...brands.map((b) => b.image),
    ...clientLogos.map((l) => l.image),
    ...testimonials.map((t) => t.avatar),
    ...services.map((s) => s.image),
  );
  const posterMap = await loadVideoPosters(allMediaUrls);
  const posters = Array.from(posterMap.entries());

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <VideoPosterProvider posters={posters}>
      {faqs.length > 0 && (
        <Script
          id="ld-json-faq"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <HashScroller />
      <IntroOverlay />
      <HeroSection
        image={hero?.image}
        mobileImage={hero?.mobileImage}
        heading={hero?.heading}
        subtext={hero?.subtext}
        description={hero?.description}
        ctaLabel={hero?.ctaLabel}
        ctaHref={hero?.ctaHref}
        rating={hero?.rating}
        roi={hero?.roi}
      />
      <ShowreelSection brands={brands} showreel={showreel} />
      <PortfolioSection projects={projects} />
      <ServicesSection services={services} />
      <WhyUsSection data={whyUs} logos={clientLogos} />
      <ClientResultsSection testimonials={testimonials} />
      {/* <PricingSection plans={pricingPlans} /> */}
      <BlogSection articles={articles} />
      <FaqSection faqs={faqs} />
      <ContactSection />
      <Footer socialLinks={socialLinks} />
    </VideoPosterProvider>
  );
}
