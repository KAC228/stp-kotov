"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BRAND_NAME } from "@/constants/brand";

const TITLE_LEN = BRAND_NAME.length;
const AFTER_TITLE = 0.18 + TITLE_LEN * 0.055 + 0.38;
const GLOW_DELAY_MS = Math.round((AFTER_TITLE + 0.18) * 1000);

export default function DarkHeroEffects() {
  const [showCyanGlow, setShowCyanGlow] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setShowCyanGlow(true));
      });
    }, GLOW_DELAY_MS);
    return () => window.clearTimeout(id);
  }, []);

  if (!showCyanGlow) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 -translate-y-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
      style={{
        left: "-50vw",
        width: "200vw",
        height: "50%",
        borderRadius: "100%",
        background:
          "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(0,210,255,0.09) 0%, rgba(0,210,255,0.04) 45%, transparent 70%)",
        filter: "blur(150px)",
      }}
    />
  );
}
