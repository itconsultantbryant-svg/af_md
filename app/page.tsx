import { HeroSection } from "@/components/home/HeroSection";
import { TrustedByStrip } from "@/components/home/TrustedByStrip";
import { AboutStrip } from "@/components/home/AboutStrip";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { CaseStudyFeature } from "@/components/home/CaseStudyFeature";
import { WhyAfrimind } from "@/components/home/WhyAfrimind";
import { GlobeSection } from "@/components/home/GlobeSection";
import { Testimonials } from "@/components/home/Testimonials";
import { StatsBanner } from "@/components/home/StatsBanner";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustedByStrip />
      <AboutStrip />
      <ServicesGrid />
      <CaseStudyFeature />
      <WhyAfrimind />
      <GlobeSection />
      <Testimonials />
      <StatsBanner />
      <FinalCTA />
    </main>
  );
}
