"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const GLOW_DELAY_MS = 700;

export default function DarkHeroEffects() {
  const [showGlow, setShowGlow] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setShowGlow(true));
      });
    }, GLOW_DELAY_MS);
    return () => window.clearTimeout(id);
  }, []);

  if (!showGlow) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 -translate-y-1/2 z-[1]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        left: "-50vw",
        width: "200vw",
        height: "52%",
        borderRadius: "100%",
        background:
          "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(255,90,120,0.11) 0%, rgba(255,135,97,0.05) 42%, transparent 70%)",
        filter: "blur(150px)",
      }}
    />
  );
}
