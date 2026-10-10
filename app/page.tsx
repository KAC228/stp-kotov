import type { Metadata } from "next";
import { BRAND_NAME, HERO_TAGLINE, WARRANTY_YEARS } from "@/constants/brand";
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
import SectionReveal from "@/components/SectionReveal";

export const metadata: Metadata = buildPageMetadata({
  title: `${BRAND_NAME} — Камеры статического давления нового поколения`,
  description: `${HERO_TAGLINE}. Гарантия ${WARRANTY_YEARS} лет.`,
  path: "/",
});

const sectionDivider = (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="ksd-section-line h-px w-full bg-gradient-to-r from-transparent via-[rgba(255,90,120,0.35)] to-transparent" />
  </div>
);

export default function Home() {
  return (
    <div className="bg-zinc-950">
      <DarkHero />
      <SectionReveal>
        <AsaAdvantagesSection />
      </SectionReveal>
      {sectionDivider}
      <SectionReveal delay={0.04}>
        <TechFeatures />
      </SectionReveal>
      {sectionDivider}
      <SectionReveal delay={0.04}>
        <BentoGrid />
      </SectionReveal>
      <SectionReveal>
        <QualityGuarantee />
      </SectionReveal>
      {sectionDivider}
      <SectionReveal>
        <ReadySolutionsSection />
      </SectionReveal>
      {sectionDivider}
      <SectionReveal>
        <SystemSolutionsSection />
      </SectionReveal>
      {sectionDivider}
      <SectionReveal>
        <ConfiguratorSection />
      </SectionReveal>
      <Footer />
    </div>
  );
}
