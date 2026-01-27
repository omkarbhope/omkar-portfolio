import Hero from "@/components/Hero";
import SectionOverview from "@/components/SectionOverview";
import PageTransition from "@/components/animations/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <Hero />
        <SectionOverview />
      </div>
    </PageTransition>
  );
}
