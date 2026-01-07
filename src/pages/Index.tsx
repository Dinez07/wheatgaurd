import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { SolutionSection } from "@/components/SolutionSection";
import { DetectionSection } from "@/components/DetectionSection";
import { DiseasesSection } from "@/components/DiseasesSection";
import { TechStackSection } from "@/components/TechStackSection";
import { ImpactSection } from "@/components/ImpactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <DetectionSection />
        <DiseasesSection />
        <TechStackSection />
        <ImpactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
