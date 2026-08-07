import { ProHero } from "../../components/pro/ProHero";
import { TrustStrip } from "../../components/pro/TrustStrip";
import { ExpertiseGrid } from "../../components/pro/ExpertiseGrid";
import { HowItWorks } from "../../components/pro/HowItWorks";
import { getSpecialties } from "../../../data/pro/categories";

export default async function ProPage() {
  const specialties = await getSpecialties();
  return (
    <main>
      <ProHero />
      <TrustStrip />
      <ExpertiseGrid specialties={specialties} />
      <HowItWorks />
    </main>
  );
}
