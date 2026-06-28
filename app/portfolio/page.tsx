import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";

export default function PortfolioPage() {
  return (
    <main className="pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PortfolioHero />
        <ProjectGrid />
      </div>
    </main>
  );
}
