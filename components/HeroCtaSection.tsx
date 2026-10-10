"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PATHS } from "@/constants/brand";
import { HERO_CTA_LAYOUT, type HeroCtaLayout } from "@/constants/hero-cta";

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] as const },
});

function PrimaryCta() {
  return (
    <a href="#configurator" className="hero-cta-primary">
      Собрать конфигурацию
    </a>
  );
}

function StackedLayout() {
  return (
    <div className="hero-cta-stacked flex flex-col items-center gap-5 sm:gap-6 w-full">
      <motion.div {...enter(0.8)} className="hero-cta-stacked-primary">
        <PrimaryCta />
      </motion.div>
      <motion.div {...enter(0.95)} className="hero-cta-secondary">
        <Link href={PATHS.catalog} className="hero-cta-secondary-link">
          Каталог
        </Link>
        <span className="hero-cta-secondary-sep" aria-hidden />
        <a href={`tel:+79110156002`} className="hero-cta-secondary-link">
          Заказать звонок
        </a>
      </motion.div>
    </div>
  );
}

function RowLayout() {
  return (
    <motion.div {...enter(0.8)} className="hero-cta-row">
      <PrimaryCta />
      <Link href={PATHS.catalog} className="hero-cta-outline">
        Каталог
      </Link>
      <a href={`tel:+79110156002`} className="hero-cta-outline">
        Заказать звонок
      </a>
    </motion.div>
  );
}

function MinimalLayout() {
  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div {...enter(0.8)}>
        <PrimaryCta />
      </motion.div>
      <motion.div
        {...enter(0.95)}
        className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10"
      >
        <Link href={PATHS.catalog} className="hero-cta-text-link">
          Каталог
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </Link>
        <a href={`tel:+79110156002`} className="hero-cta-text-link">
          Заказать звонок
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </a>
      </motion.div>
    </div>
  );
}

const LAYOUTS: Record<HeroCtaLayout, () => React.JSX.Element> = {
  stacked: StackedLayout,
  row: RowLayout,
  minimal: MinimalLayout,
};

export default function HeroCtaSection() {
  const Layout = LAYOUTS[HERO_CTA_LAYOUT];
  return <Layout />;
}
