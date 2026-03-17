import IntroOverlay from "@/components/custom/IntroOverlay";
import HeroSection from "@/components/custom/HeroSection";
import ShowreelSection from "@/components/custom/ShowreelSection";
import PortfolioSection from "@/components/custom/PortfolioSection";
import ServicesSection from "@/components/custom/ServicesSection";
import WhyUsSection from "@/components/custom/WhyUsSection";

export default function Home() {
  return (
    <>
      <IntroOverlay />
      <HeroSection />
      <ShowreelSection />
      <PortfolioSection />
      <ServicesSection />
      <WhyUsSection />
    </>
  );
}
