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
import { siteConfig } from "@/lib/site";
import {
  getProjects,
  getArticles,
  getTestimonials,
  getFaqs,
  getServices,
  getSocialLinks,
  getHeroContent,
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
  },
};

export default async function Home() {
  const [projects, articles, testimonials, faqs, services, socialLinks, hero] =
    await Promise.all([
      getProjects(),
      getArticles(),
      getTestimonials(),
      getFaqs(),
      getServices(),
      getSocialLinks(),
      getHeroContent(),
    ]);

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
    <>
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
        heading={hero?.heading}
        subtext={hero?.subtext}
        description={hero?.description}
        ctaLabel={hero?.ctaLabel}
        ctaHref={hero?.ctaHref}
        rating={hero?.rating}
        roi={hero?.roi}
      />
      <ShowreelSection />
      <PortfolioSection projects={projects} />
      <ServicesSection services={services} />
      <WhyUsSection />
      <ClientResultsSection testimonials={testimonials} />
      {/* <PricingSection plans={pricingPlans} /> */}
      <BlogSection articles={articles} />
      <FaqSection faqs={faqs} />
      <ContactSection />
      <Footer socialLinks={socialLinks} />
    </>
  );
}
