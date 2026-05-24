"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Lightbulb, Package, ShieldCheck } from "lucide-react";
import { WARRANTY_YEARS } from "@/constants/brand";

/** Как в TechFeatures: заголовок секции и карточки */
const viewEase = "easeOut" as const;
const viewDuration = 0.5;
const headerTransition = { duration: viewDuration, ease: viewEase };
const cardViewport = { once: true, margin: "-40px" } as const;
const headerViewport = { once: true, margin: "-80px" } as const;

const cardTransition = (delay: number) => ({
  duration: viewDuration,
  ease: viewEase,
  delay,
});

/** Одинаковые motion-пропсы у полосы гарантии и карточек */
const cardMotionProps = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: cardViewport,
  transition: cardTransition(delay),
});

const montageCardCls =
  "relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden " +
  "hover:border-cyan-400/35 hover:shadow-[0_0_28px_rgba(0,210,255,0.22)] " +
  "transition-[box-shadow,border-color] duration-300";

function BentoCard({
  audience,
  icon: Icon,
  title,
  description,
  accent,
  watermark,
  className = "",
  animationDelay = 0,
}: {
  audience: string;
  icon: React.ElementType;
  title: string;
  description: string;
  accent: string;
  watermark?: string;
  className?: string;
  animationDelay?: number;
}) {
  return (
    <motion.div
      {...cardMotionProps(animationDelay)}
      className={`relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col hover:border-cyan-400/35 hover:shadow-[0_0_28px_rgba(0,210,255,0.22)] transition-[box-shadow,border-color] duration-300 ${className}`}
    >
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${accent}`} />

      {watermark && (
        <div
          className="absolute bottom-2 right-4 text-zinc-800 font-black select-none leading-none pointer-events-none"
          style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontFamily: "var(--font-brand)" }}
          aria-hidden="true"
        >
          {watermark}
        </div>
      )}

      <div className="relative z-10 p-7 sm:p-8 flex flex-col gap-5 h-full">
        <div className="w-11 h-11 rounded-2xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-zinc-400" strokeWidth={1.75} />
        </div>

        <div className="flex-1">
          <p className="text-zinc-600 text-[11px] font-mono tracking-[0.2em] uppercase mb-3">
            {audience}
          </p>

          <h3
            className="text-white font-semibold tracking-tighter leading-tight mb-3"
            style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)" }}
          >
            {title}
          </h3>

          <p className="text-zinc-500 text-[15px] leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function BentoGrid() {
  return (
    <section id="bento" className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок — как блок «9 технологий» */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={headerViewport}
            transition={headerTransition}
          >
            <p className="text-zinc-700 text-[11px] font-mono tracking-[0.24em] uppercase mb-3">
              Ценность
            </p>
            <h2
              className="text-white font-semibold tracking-tighter leading-none"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
            >
              Система работает для всех.
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
          <motion.div
            {...cardMotionProps(0)}
            className="col-span-full bento-guarantee-strip relative mb-2 flex items-center gap-3 px-5 py-3.5 rounded-3xl overflow-hidden border border-cyan-400/25 bg-cyan-950/20 hover:border-cyan-400/45 hover:shadow-[0_0_28px_rgba(0,210,255,0.22)] transition-[box-shadow,border-color] duration-300 w-fit"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D2FF]/28 to-transparent" />
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 relative z-10" strokeWidth={1.75} />
            <p className="bento-guarantee-text text-cyan-300 text-sm font-semibold relative z-10">
              Гарантия <span className="text-white">{WARRANTY_YEARS} лет</span> на все изделия СТП-КОТОВ
            </p>
          </motion.div>

          <BentoCard
            audience="Для заказчика"
            icon={BadgeCheck}
            title="Абсолютная прозрачность."
            description="Единая цена 50 000 ₽ за метр. Тип потолка и врезки уже включены в стоимость — без скрытых доплат и сюрпризов на объекте."
            accent="from-transparent via-[#00D2FF]/28 to-transparent"
            watermark="50K"
            className="lg:col-span-2 min-h-[280px]"
            animationDelay={0}
          />

          <BentoCard
            audience="Для дизайнера"
            icon={Lightbulb}
            title="Свобода творчества."
            description="Магнитное крепление света в любом месте. Изготовим камеру любого нестандартного размера под ваш проект."
            accent="from-transparent via-[#00D2FF]/28 to-transparent"
            className="lg:col-span-1 min-h-[280px]"
            animationDelay={0.08}
          />

          <motion.div {...cardMotionProps(0.16)} className={`col-span-full ${montageCardCls}`}>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D2FF]/28 to-transparent" />

            <div
              className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-800 font-black select-none leading-none pointer-events-none hidden lg:block"
              style={{ fontSize: "9rem", fontFamily: "var(--font-brand)" }}
              aria-hidden="true"
            >
              MTG
            </div>

            <div className="relative z-10 p-7 sm:p-8 flex flex-col gap-5 h-full">
              <div className="w-11 h-11 rounded-2xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-zinc-400" strokeWidth={1.75} />
              </div>

              <div className="flex-1">
                <p className="text-zinc-600 text-[11px] font-mono tracking-[0.2em] uppercase mb-3">
                  Для монтажника
                </p>

                <h3
                  className="text-white font-semibold tracking-tighter leading-tight mb-3"
                  style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)" }}
                >
                  Монтаж из коробки.
                </h3>
                <p className="text-zinc-500 text-[15px] leading-relaxed max-w-xl">
                  Картонная разметка-шаблон, дроссельные заслонки и подготовленный каркас экономят часы работы на объекте. Открыл коробку — всё уже внутри.
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  {["Шаблон разметки", "Дроссельные заслонки", "Готовый каркас", "Инструкция"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-zinc-800 border border-zinc-700/60 rounded-full text-zinc-400 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
