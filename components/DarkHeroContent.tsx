"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import BrandLogo from "@/components/BrandLogo";
import { SLOGAN, HERO_TAGLINE, PATHS } from "@/constants/brand";
import HeroCtaSection from "@/components/HeroCtaSection";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 22, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export default function DarkHeroContent() {
  return (
    <div className="relative z-10 max-w-6xl mx-auto w-full">
      <motion.p
        {...fadeUp(0.06)}
        className="text-zinc-500 text-sm sm:text-base tracking-[0.22em] uppercase font-mono mb-8"
      >
        Скрытые теневые потоки
      </motion.p>

      {/* Серебристый wordmark на фото/атмосфере героя */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, filter: "blur(12px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
        className="flex justify-center mb-8 sm:mb-10"
      >
        <div className="ksd-logo-shimmer relative mx-auto w-[min(92vw,40rem)]">
          <BrandLogo
            dark
            fluid
            height={84}
            className="drop-shadow-[0_8px_32px_rgba(0,0,0,0.55)]"
          />
        </div>
      </motion.div>

      <motion.p
        {...fadeUp(0.55)}
        style={{ fontFamily: "var(--font-slogan)" }}
        className="text-zinc-400 text-lg sm:text-xl lg:text-2xl font-light tracking-wide mb-4 max-w-3xl mx-auto leading-relaxed"
      >
        {HERO_TAGLINE}
      </motion.p>
      <motion.p
        {...fadeUp(0.62)}
        className="text-zinc-600 text-sm mb-10 max-w-2xl mx-auto"
      >
        {SLOGAN}
      </motion.p>

      <HeroCtaSection />

      <motion.nav
        {...fadeUp(0.85)}
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
