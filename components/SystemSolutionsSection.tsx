"use client";

import { motion } from "framer-motion";
import { ArrowRight, Layers, Sparkles, ShieldCheck, Wind, Package } from "lucide-react";
import {
  HOMEPAGE_SYSTEM_SOLUTIONS,
  catalogHrefForCategory,
} from "@/constants/homepage-systems";
import { CatalogProductPhoto } from "@/components/SitePhoto";

const viewEase = [0.16, 1, 0.3, 1] as const;

function SystemIcon({ id }: { id: string }) {
  const cls = "w-5 h-5 text-cyan-300";
  if (id === "complex") return <Layers className="w-5 h-5 text-zinc-300" strokeWidth={1.75} />;
  if (id === "thermo") return <Wind className={cls} strokeWidth={1.75} />;
  if (id === "slim") return <Sparkles className={cls} strokeWidth={1.75} />;
  if (id === "flat") return <ShieldCheck className={cls} strokeWidth={1.75} />;
  if (id === "flex") return <Package className={cls} strokeWidth={1.75} />;
  return <Layers className={cls} strokeWidth={1.75} />;
}

export default function SystemSolutionsSection() {
  const fallbackPhoto = "/images/fliben-catalog/c2d192db42c342.webp";

  return (
    <section id="systems" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950 border-t border-zinc-800/60">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: viewEase }}
          className="mb-12 max-w-3xl"
        >
          <p className="text-zinc-600 text-[11px] font-mono tracking-[0.24em] uppercase mb-3">
            Партнёр Fliben
          </p>
          <h2
            className="text-white font-semibold tracking-tighter leading-tight"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Системные решения
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed mt-4">
            Линейки вентиляции для комплектации вместе с КСД. Описания и состав — как у производителя;
            подбор и отгрузку ведёт СТП-КОТОВ.
          </p>
        </motion.div>

        <div className="space-y-5">
          {HOMEPAGE_SYSTEM_SOLUTIONS.map((system, index) => (
            <motion.article
              key={system.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.05, ease: viewEase }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.35)] hover:border-cyan-400/25 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-stretch">
                <div className="min-w-0 flex-1 p-6 sm:p-8 flex flex-col">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-zinc-800/70 border border-zinc-700/60 flex items-center justify-center shrink-0">
                      <SystemIcon id={system.id} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-zinc-600 text-[11px] font-mono tracking-wider mb-2">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="text-white text-xl sm:text-2xl font-semibold tracking-tight mb-2">
                        {system.title}
                      </h3>
                      <p className="text-cyan-400/90 text-sm font-medium mb-3">{system.lead}</p>
                      <p className="text-zinc-400 text-sm sm:text-[15px] leading-relaxed whitespace-pre-line mb-4">
                        {system.description}
                      </p>
                      <ul className="flex flex-wrap gap-2 mb-4">
                        {system.highlights.map((h) => (
                          <li
                            key={h}
                            className="px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-500 text-xs"
                          >
                            {h}
                          </li>
                        ))}
                      </ul>
                      <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed mb-6">
                        {system.partnerNote}
                      </p>
                      <a
                        className="inline-flex items-center justify-center gap-2 shrink-0 px-5 py-2.5 rounded-full border border-zinc-700 text-zinc-300 text-sm hover:border-cyan-400/40 hover:text-white transition-colors"
                        href={catalogHrefForCategory(system.catalogCategory)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Каталог на fliben.ru
                        <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="relative lg:w-[min(42%,380px)] shrink-0 border-t lg:border-t-0 lg:border-l border-zinc-800 bg-zinc-900/40">
                  <CatalogProductPhoto
                    src={system.photoSrc ?? fallbackPhoto}
                    alt={system.title}
                    frameClassName="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[280px] rounded-none border-0"
                  />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
