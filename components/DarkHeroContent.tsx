"use client";

import { motion } from "framer-motion";
import BrandLogo from "@/components/BrandLogo";
import HeroCtaSection from "@/components/HeroCtaSection";
import SocialLinks from "@/components/SocialLinks";
import { SLOGAN } from "@/constants/brand";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export default function DarkHeroContent() {
  return (
    <div className="relative z-10 max-w-6xl mx-auto w-full">
      <motion.p
        {...fadeUp(0.06)}
        style={{ fontFamily: "var(--font-slogan)" }}
        className="text-zinc-400 text-sm sm:text-base lg:text-lg font-light tracking-wide mb-5 sm:mb-8 max-w-2xl mx-auto leading-relaxed"
      >
        {SLOGAN}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        className="flex justify-center mb-5 sm:mb-8"
      >
        <div className="ksd-logo-shimmer relative mx-auto w-[min(88vw,36rem)]">
          <BrandLogo
            dark
            fluid
            height={84}
            className="drop-shadow-[0_8px_32px_rgba(0,0,0,0.55)]"
          />
        </div>
      </motion.div>

      <motion.p
        {...fadeUp(0.35)}
        className="text-zinc-500 text-sm sm:text-base mb-8 sm:mb-10 max-w-xl mx-auto leading-snug"
      >
        Вентиляция и микроклимат нового поколения
      </motion.p>

      <HeroCtaSection />

      <motion.div {...fadeUp(1.05)} className="mt-8 sm:mt-10">
        <SocialLinks />
      </motion.div>
    </div>
  );
}
