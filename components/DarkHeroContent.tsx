"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BRAND_NAME, SLOGAN, PATHS } from "@/constants/brand";
import HeroCtaSection from "@/components/HeroCtaSection";

const titleContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.18 },
  },
};

const titleChar = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 24, stiffness: 160 },
  },
};

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, damping: 30, stiffness: 140, delay },
});

const TITLE_CHARS = BRAND_NAME.split("");
const AFTER_TITLE = 0.18 + TITLE_CHARS.length * 0.055 + 0.38;

export default function DarkHeroContent() {
  return (
    <div className="relative z-10 max-w-6xl mx-auto w-full">
      <motion.p
        {...fadeUp(0.04)}
        className="text-zinc-600 text-[11px] tracking-[0.30em] uppercase font-mono mb-6"
      >
        {SLOGAN}
      </motion.p>

      <motion.h1
        variants={titleContainer}
        initial="hidden"
        animate="visible"
        aria-label={BRAND_NAME}
        style={{
          fontFamily: "var(--font-brand)",
          lineHeight: 0.9,
          letterSpacing: "-0.04em",
        }}
        className="font-black text-white mb-6 select-none whitespace-nowrap text-center
                   text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
      >
        {TITLE_CHARS.map((ch, i) => (
          <motion.span
            key={i}
            variants={titleChar}
            className="inline-block will-change-[transform,opacity]"
          >
            {ch}
          </motion.span>
        ))}
      </motion.h1>

      <motion.p
        {...fadeUp(AFTER_TITLE)}
        style={{ fontFamily: "var(--font-slogan)" }}
        className="text-zinc-400 text-lg sm:text-xl lg:text-2xl font-light tracking-wide mb-10 max-w-2xl mx-auto leading-relaxed"
      >
        Камеры статического давления нового поколения
      </motion.p>

      <HeroCtaSection />

      <motion.nav
        {...fadeUp(AFTER_TITLE + 0.2)}
        aria-label="Быстрые ссылки"
        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-zinc-600 text-xs font-mono tracking-[0.12em] uppercase"
      >
        <a href="#about-asa" className="hover:text-cyan-400/90 transition-colors">
          ↓ О материале ASA
        </a>
        <a href="#technologies" className="hover:text-cyan-400/90 transition-colors">
          ↓ Технологии
        </a>
        <a href="#configurator" className="hover:text-cyan-400/90 transition-colors">
          ↓ Собрать конфигурацию
        </a>
        <Link href={PATHS.ourPartners} className="hover:text-cyan-400/90 transition-colors">
          ↓ Наши партнёры
        </Link>
      </motion.nav>
    </div>
  );
}
