import type { Metadata } from "next";
import { BRAND_NAME } from "@/constants/brand";
import DarkHero from "@/components/DarkHero";
import AsaAdvantagesSection from "@/components/AsaAdvantagesSection";
import TechFeatures from "@/components/TechFeatures";
import BentoGrid from "@/components/BentoGrid";
import QualityGuarantee from "@/components/QualityGuarantee";
import ConfiguratorSection from "@/components/ConfiguratorSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: `${BRAND_NAME} — Камеры статического давления нового поколения`,
  description:
    "Камеры статического давления КСД нового поколения. Единая цена 50 000 ₽ за погонный метр. Гарантия 25 лет. Тип потолка и врезки включены в стоимость.",
};

const sectionDivider = (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent" />
  </div>
);

export default function Home() {
  return (
    <div className="bg-zinc-950">
      <DarkHero />
      <AsaAdvantagesSection />
      {sectionDivider}
      <TechFeatures />
      {sectionDivider}
      <BentoGrid />
      <QualityGuarantee />
      {sectionDivider}
      <ConfiguratorSection />
      <Footer />
    </div>
  );
}
