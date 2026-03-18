import IntroOverlay from "@/components/custom/IntroOverlay";
import HeroSection from "@/components/custom/HeroSection";
import ShowreelSection from "@/components/custom/ShowreelSection";
import PortfolioSection from "@/components/custom/PortfolioSection";
import ServicesSection from "@/components/custom/ServicesSection";
import WhyUsSection from "@/components/custom/WhyUsSection";
import ClientResultsSection from "@/components/custom/ClientResultsSection";
import PricingSection from "@/components/custom/PricingSection";
import BlogSection from "@/components/custom/BlogSection";
import FaqSection from "@/components/custom/FaqSection";
import ContactSection from "@/components/custom/ContactSection";
import Footer from "@/components/custom/Footer";
import {
  getProjects,
  getArticles,
  getTestimonials,
  getFaqs,
  getServices,
  getPricingPlans,
} from "@/lib/queries";

export default async function Home() {
  const [projects, articles, testimonials, faqs, services, pricingPlans] =
    await Promise.all([
      getProjects(),
      getArticles(),
      getTestimonials(),
      getFaqs(),
      getServices(),
      getPricingPlans(),
    ]);

  return (
    <>
      <IntroOverlay />
      <HeroSection />
      <ShowreelSection />
      <PortfolioSection projects={projects} />
      <ServicesSection services={services} />
      <WhyUsSection />
      <ClientResultsSection testimonials={testimonials} />
      <PricingSection plans={pricingPlans} />
      <BlogSection articles={articles} />
      <FaqSection faqs={faqs} />
      <ContactSection />
      <Footer />
    </>
  );
}
