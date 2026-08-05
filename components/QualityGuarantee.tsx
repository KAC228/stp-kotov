"use client";

import { motion } from "framer-motion";
import { Hash, UserCheck, ShieldCheck } from "lucide-react";

const sp = { type: "spring" as const, damping: 28, stiffness: 140 };
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { ...sp, delay },
});

const PILLARS = [
  {
    icon: Hash,
    title: "Прослеживаемость",
    desc: "По серийному номеру всегда можно узнать полную историю производства оборудования.",
  },
  {
    icon: UserCheck,
    title: "Личная ответственность",
    desc: "Подпись инженера подтверждает прохождение всех проверок качества перед отгрузкой.",
  },
  {
    icon: ShieldCheck,
    title: "Уверенность",
    desc: "Вы получаете изделие с подтверждённым качеством и надёжной защитой от подделок.",
  },
] as const;

export default function QualityGuarantee() {
  return (
    <section className="bg-zinc-950 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Outer card */}
        <motion.div
          {...fadeUp(0)}
          className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900"
        >
          {/* Subtle top shimmer */}
          <div
            aria-hidden
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(161,161,170,0.35) 40%, rgba(255,255,255,0.18) 50%, rgba(161,161,170,0.35) 60%, transparent 100%)",
            }}
          />

          {/* Faint radial silver glow bottom-right */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 55% at 95% 95%, rgba(161,161,170,0.07), transparent)",
            }}
          />

          <div className="relative z-10 p-8 sm:p-12">
            {/* Eyebrow */}
            <motion.p
              {...fadeUp(0.04)}
              className="text-zinc-600 text-[11px] font-mono tracking-[0.26em] uppercase mb-4"
            >
              Контроль качества
            </motion.p>

            {/* Heading */}
            <motion.h2
              {...fadeUp(0.08)}
              className="text-white font-semibold tracking-tighter leading-tight mb-6"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)" }}
            >
              Гарантия качества
              <br className="hidden sm:block" /> и полная прослеживаемость.
            </motion.h2>

            {/* Description + badge row */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start mb-10">
              <motion.p
                {...fadeUp(0.12)}
                className="text-zinc-400 text-base leading-relaxed max-w-lg"
              >
                Мы уделяем особое внимание контролю качества. Каждая камера
                статического давления комплектуется{" "}
                <span className="text-zinc-200 font-medium">
                  индивидуальной биркой
                </span>
                , на которой указаны: уникальный серийный номер, дата выпуска
                и личная подпись инженера контроля качества.
              </motion.p>

              {/* Tag mockup */}
              <motion.div
                {...fadeUp(0.16)}
                className="shrink-0 self-start"
              >
                <div
                  className="relative px-6 py-5 rounded-2xl border"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(63,63,70,0.6) 0%, rgba(39,39,42,0.8) 100%)",
                    borderColor: "rgba(161,161,170,0.2)",
                    boxShadow:
                      "0 0 0 1px rgba(255,255,255,0.04) inset, 0 4px 24px rgba(0,0,0,0.4)",
                  }}
                >
                  {/* Metallic top edge */}
                  <div
                    aria-hidden
                    className="absolute top-0 left-4 right-4 h-px rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(212,212,216,0.4), transparent)",
                    }}
                  />
                  <p className="text-zinc-600 text-[9px] font-mono tracking-[0.3em] uppercase mb-3">
                    СТП-КОТОВ · КСД
                  </p>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-8">
                      <span className="text-zinc-500 text-[10px] font-mono">S/N</span>
                      <span className="text-zinc-200 text-[11px] font-mono tracking-widest">
                        KSD-2026-00437
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-8">
                      <span className="text-zinc-500 text-[10px] font-mono">MFG</span>
                      <span className="text-zinc-300 text-[11px] font-mono">
                        01.05.2026
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-8">
                      <span className="text-zinc-500 text-[10px] font-mono">QC</span>
                      <span
                        className="text-zinc-400 text-[11px]"
                        style={{ fontFamily: "cursive" }}
                      >
                        А. Пырсов
                      </span>
                    </div>
                  </div>
                  {/* Tiny hole punch */}
                  <div
                    aria-hidden
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-zinc-700 bg-zinc-950"
                  />
                </div>
              </motion.div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent mb-8" />

            {/* 3 pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PILLARS.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.div
                    key={p.title}
                    {...fadeUp(0.2 + i * 0.07)}
                    className="flex flex-col gap-3 p-5 rounded-2xl border border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 transition-colors duration-300"
                  >
                    <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-zinc-400" strokeWidth={1.75} />
                    </div>
                    <p className="text-white font-semibold text-sm tracking-tight">
                      {p.title}
                    </p>
                    <p className="text-zinc-500 text-[13px] leading-relaxed">
                      {p.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
