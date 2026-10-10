"use client";

/**
 * AirflowAnimation
 * ─────────────────────────────────────────────────────────────────────────────
 * Cold-air stream that pours from the black slot at the Header's bottom edge.
 *
 * Mobile  (< 768 px) — 1 animated layer, smaller blur → same "wow", less GPU.
 * Desktop (≥ 768 px) — 3 layers: wide bloom + focused core + slot shimmer.
 *
 * PERFORMANCE:
 *  • Only `transform` (y, scaleY) and `opacity` animated — compositor-only.
 *  • `will-change: transform, opacity` promotes layers to separate GPU tiles.
 *  • `pointer-events-none` — zero interaction cost.
 *
 * FIX — no rectangular ghost on fade-out:
 *  • bloom divs have borderRadius:"100%" → filter:blur() clips to an ellipse,
 *    so the blur halo has no straight edges at any opacity level.
 *  • minimum opacity on bloom layers is 0 → fully transparent at fade-out phase,
 *    zero chance of a visible tinted rectangle.
 *  • Shimmer line is unchanged (it is a 3 px gradient line, no rect artefact).
 */

import { useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";

const LOOP = { repeat: Infinity, ease: "easeInOut" as const };

export default function AirflowAnimation() {
  /** undefined до layout — иначе первый кадр всегда «десктоп» и даёт вспышку cyan */
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useLayoutEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile === undefined) {
    return null;
  }

  // ── mobile: single animated layer ────────────────────────────────────────
  if (isMobile) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 w-full"
        style={{ bottom: "-3rem", height: "3rem", zIndex: 10, overflow: "visible" }}
      >
        {/* Bloom — borderRadius:"100%" clips the blur halo to a pure ellipse */}
        <motion.div
          initial={{ opacity: 0, y: "0px" }}
          animate={{
            y:       ["0px", "16px", "0px"],
            opacity: [0, 0.58, 0],           // fully transparent at rest → no rect
          }}
          transition={{ ...LOOP, duration: 3.5 }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "100%",            // ← ellipse clip → no rectangular ghost
            background:
              "radial-gradient(ellipse 85% 100% at 50% 0%, rgba(255,90,120,0.70) 0%, transparent 100%)",
            filter: "blur(20px)",
            willChange: "transform, opacity",
            transformOrigin: "top center",
          }}
        />

        {/* Shimmer line — stays the same, gradient already fades to transparent at edges */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.82 }}
          animate={{ opacity: [0, 0.55, 0], scaleX: [0.82, 1.06, 0.82] }}
          transition={{ ...LOOP, duration: 2.8 }}
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: "3px",
            background:
              "linear-gradient(to right, transparent 0%, rgba(255,90,120,0.80) 20%, rgba(255,90,120,1) 50%, rgba(255,90,120,0.80) 80%, transparent 100%)",
            filter: "blur(2px)",
            willChange: "transform, opacity",
            transformOrigin: "center",
          }}
        />
      </div>
    );
  }

  // ── desktop: three layers ─────────────────────────────────────────────────
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 w-full"
      style={{ bottom: "-4rem", height: "4rem", zIndex: 10, overflow: "visible" }}
    >
      {/* Layer 1: wide outer bloom */}
      <motion.div
        initial={{ opacity: 0, y: "0px", scaleY: 1 }}
        animate={{
          y:       ["0px", "20px", "0px"],
          scaleY:  [1, 1.35, 1],
          opacity: [0, 0.65, 0],             // ← min = 0
        }}
        transition={{ ...LOOP, duration: 3.5 }}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "100%",             // ← ellipse clip
          background:
            "radial-gradient(ellipse 90% 100% at 50% 0%, rgba(255,90,120,0.72) 0%, transparent 100%)",
          filter: "blur(28px)",
          willChange: "transform, opacity",
          transformOrigin: "top center",
        }}
      />

      {/* Layer 2: focused core — offset phase */}
      <motion.div
        initial={{ opacity: 0, y: "0px", scaleY: 1 }}
        animate={{
          y:       ["0px", "14px", "0px"],
          scaleY:  [1, 1.20, 1],
          opacity: [0, 0.45, 0],             // ← min = 0
        }}
        transition={{ ...LOOP, duration: 5, delay: 0.6 }}
        style={{
          position: "absolute",
          left: "20%",
          right: "20%",
          top: 0,
          bottom: 0,
          borderRadius: "100%",             // ← ellipse clip
          background:
            "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(255,90,120,0.90) 0%, transparent 100%)",
          filter: "blur(14px)",
          willChange: "transform, opacity",
          transformOrigin: "top center",
        }}
      />

      {/* Layer 3: slot-exit shimmer — unchanged, no rect artefact */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.8 }}
        animate={{ opacity: [0, 0.55, 0], scaleX: [0.80, 1.08, 0.80] }}
        transition={{ ...LOOP, duration: 2.8 }}
        style={{
          position: "absolute",
          top: 0,
          left: "8%",
          right: "8%",
          height: "3px",
          background:
            "linear-gradient(to right, transparent 0%, rgba(255,90,120,0.80) 20%, rgba(255,90,120,1) 50%, rgba(255,90,120,0.80) 80%, transparent 100%)",
          filter: "blur(2px)",
          willChange: "transform, opacity",
          transformOrigin: "center",
        }}
      />
    </div>
  );
}
