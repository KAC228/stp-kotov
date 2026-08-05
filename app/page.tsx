import type { Metadata } from "next";
import { BRAND_NAME, PRICE_PER_METER_RUB, WARRANTY_YEARS } from "@/constants/brand";
import { buildPageMetadata } from "@/lib/metadata";
import DarkHero from "@/components/DarkHero";
import AsaAdvantagesSection from "@/components/AsaAdvantagesSection";
import TechFeatures from "@/components/TechFeatures";
import BentoGrid from "@/components/BentoGrid";
import QualityGuarantee from "@/components/QualityGuarantee";
import ConfiguratorSection from "@/components/ConfiguratorSection";
import SystemSolutionsSection from "@/components/SystemSolutionsSection";
import ReadySolutionsSection from "@/components/ReadySolutionsSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = buildPageMetadata({
  title: `${BRAND_NAME} — Камеры статического давления нового поколения`,
  description: `Камеры статического давления КСД нового поколения. Единая цена ${PRICE_PER_METER_RUB.toLocaleString("ru-RU")} ₽ за погонный метр. Гарантия ${WARRANTY_YEARS} лет. Тип потолка и врезки включены в стоимость.`,
  path: "/",
});

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
      <ReadySolutionsSection />
      {sectionDivider}
      <SystemSolutionsSection />
      {sectionDivider}
      <ConfiguratorSection />
      <Footer />
    </div>
  );
}
