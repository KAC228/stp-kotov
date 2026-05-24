"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const ProductConfigurator = dynamic(
  () => import("@/components/ProductConfigurator"),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-[28rem] w-full rounded-2xl border border-zinc-800/80 bg-zinc-900/40 animate-pulse"
        aria-hidden
      />
    ),
  },
);

const spring = { type: "spring" as const, damping: 28, stiffness: 140 };

export default function ConfiguratorSection() {
  return (
    <section id="configurator" className="relative bg-zinc-950 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...spring, delay: 0 }}
          className="text-zinc-700 text-[11px] font-mono tracking-[0.24em] uppercase mb-4"
        >
          Конфигуратор
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...spring, delay: 0.07 }}
          className="text-white font-semibold tracking-tighter leading-none mb-4"
          style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
        >
          Соберите свою систему.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...spring, delay: 0.13 }}
          className="text-zinc-500 text-lg max-w-xl mx-auto"
        >
          Четыре параметра — и вы получите точную стоимость готового изделия без скрытых доплат.
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductConfigurator dark />
      </div>
    </section>
  );
}
