import { Hero } from "@/components/marketing/hero";
import { FeatureCards } from "@/components/marketing/feature-cards";
import { SdgStrip } from "@/components/marketing/sdg-strip";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col justify-between">
      <Hero />
      <FeatureCards />
      <SdgStrip />
    </div>
  );
}
