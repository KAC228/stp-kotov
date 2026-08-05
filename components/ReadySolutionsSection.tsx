"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PATHS } from "@/constants/brand";
import { FLIBEN_TYPICAL, formatRub } from "@/lib/fliben-content";
import { CoverPhoto } from "@/components/SitePhoto";

const ease = [0.16, 1, 0.3, 1] as const;

export default function ReadySolutionsSection() {
  const projects = FLIBEN_TYPICAL.projects;

  return (
    <section id="ready-solutions" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease }}
          className="mb-12 max-w-3xl"
        >
          <p className="text-zinc-600 text-[11px] font-mono tracking-[0.24em] uppercase mb-3">
            Готовые решения
          </p>
          <h2
            className="text-white font-semibold tracking-tighter leading-tight"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Три решения — под вашу площадь
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed mt-4">{FLIBEN_TYPICAL.intro}</p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {projects.map((project, index) => {
            const optimal = project.tariffs.find((t) => t.recommended) ?? project.tariffs[1];
            return (
              <motion.article
                key={project.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: index * 0.06, ease }}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden flex flex-col hover:border-cyan-400/25 transition-colors shadow-sm"
              >
                {project.image ? (
                  <CoverPhoto
                    src={project.image}
                    alt={project.title}
                    frameClassName="border-b border-zinc-800"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="relative aspect-[16/10] bg-zinc-800 border-b border-zinc-800 flex items-center justify-center text-zinc-600 text-xs font-mono tracking-wider uppercase">
                    Фото проекта
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1 min-h-[220px]">
                  <h3 className="text-white text-xl font-semibold tracking-tight mb-2">{project.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-4 flex-1">{project.subtitle}</p>
                  {optimal?.priceRub != null && (
                    <p className="text-zinc-400 text-sm mb-1">
                      от <span className="text-white font-semibold">{formatRub(optimal.priceRub)}</span>
                      <span className="text-zinc-600"> · {optimal.name}</span>
                    </p>
                  )}
                  <Link
                    href={`${PATHS.projects}#${project.slug}`}
                    className="inline-flex items-center gap-2 mt-5 text-cyan-400/90 text-sm hover:text-cyan-300 transition-colors"
                  >
                    Подробнее
                    <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={PATHS.projects}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-zinc-700 text-zinc-300 text-sm hover:border-cyan-400/40 hover:text-white transition-colors"
          >
            Все типовые проекты и тарифы
            <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </section>
  );
}
