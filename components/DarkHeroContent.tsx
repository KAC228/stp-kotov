"use client";

import { motion } from "framer-motion";
import { BRAND_NAME, SLOGAN, PATHS } from "@/constants/brand";

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
        className="text-zinc-400 text-lg sm:text-xl lg:text-2xl font-light tracking-wide mb-6 max-w-2xl mx-auto leading-relaxed"
      >
        Камеры статического давления нового поколения
      </motion.p>

      <motion.p
        {...fadeUp(AFTER_TITLE + 0.08)}
        className="text-zinc-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-10 px-2"
      >
        Инновационная КСД из атмосферостойкого пластика ASA — без коррозии, с точной геометрией
        и готовым комплектом для монтажа. Соберите конфигурацию онлайн или станьте партнёром.
      </motion.p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.65,
            delay: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ willChange: "transform, opacity" }}
        >
          <a
            href="#configurator"
            className="inline-flex items-center px-8 py-4 bg-white text-zinc-950 rounded-full text-[15px] font-semibold hover:bg-zinc-100 hover:shadow-[0_0_30px_rgba(0,210,255,0.55)] will-change-[box-shadow] transition-all duration-200"
          >
            Собрать конфигурацию
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.65,
            delay: 1.0,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ willChange: "transform, opacity" }}
        >
          <a
            href={PATHS.partnership}
            className="hero-cta-partnership inline-flex items-center gap-2 px-8 py-4 bg-transparent text-zinc-300 rounded-full text-[15px] font-medium border border-zinc-700 hover:border-cyan-400/50 hover:text-white hover:shadow-[0_0_22px_rgba(0,210,255,0.35)] will-change-[box-shadow] transition-all duration-200"
          >
            Партнёрская программа
          </a>
        </motion.div>
      </div>

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
      </motion.nav>
    </div>
  );
}
