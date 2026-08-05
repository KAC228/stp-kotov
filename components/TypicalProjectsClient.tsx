"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { PATHS } from "@/constants/brand";
import {
  FLIBEN_TYPICAL,
  formatRub,
  type FlibenTypicalProject,
} from "@/lib/fliben-content";
import ProjectTariffInquiryForm from "@/components/ProjectTariffInquiryForm";
import { CoverPhoto } from "@/components/SitePhoto";

const ease = [0.16, 1, 0.3, 1] as const;

function ProjectBlock({ project, index }: { project: FlibenTypicalProject; index: number }) {
  return (
    <motion.section
      id={project.slug}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: index * 0.05, ease }}
      className="scroll-mt-28 rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden"
    >
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-0">
        <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-zinc-800">
          {project.image && (
            <CoverPhoto
              src={project.image}
              alt={project.title}
              aspectClass="aspect-[4/3]"
              frameClassName="rounded-xl mb-6 border border-zinc-800"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          )}
          <p className="text-zinc-600 text-[11px] font-mono tracking-wider mb-2">
            {String(project.areaSqm)} м²
          </p>
          <h2 className="text-white text-2xl font-semibold tracking-tight mb-2">{project.title}</h2>
          <p className="text-cyan-400/80 text-sm mb-4">{project.subtitle}</p>
          {project.description && (
            <p className="text-zinc-400 text-sm leading-relaxed">{project.description}</p>
          )}
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          {project.tariffs.map((tariff) => (
            <div
              key={tariff.id}
              className={`rounded-xl border p-5 ${
                tariff.recommended
                  ? "border-cyan-400/35 bg-cyan-500/5"
                  : "border-zinc-800 bg-zinc-950/60"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-white font-medium">{tariff.name}</h3>
                  {tariff.recommended && (
                    <span className="text-cyan-400 text-xs mt-1 inline-block">Рекомендуем</span>
                  )}
                </div>
                <p className="text-white text-lg font-semibold tabular-nums">{formatRub(tariff.priceRub)}</p>
              </div>
              {tariff.description && (
                <p className="text-zinc-500 text-sm mb-4 leading-relaxed">{tariff.description}</p>
              )}
              <ProjectTariffInquiryForm
                areaSqm={project.areaSqm}
                projectTitle={project.title}
                tariffName={tariff.name}
                priceRub={tariff.priceRub}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default function TypicalProjectsClient() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10 lg:py-14">
        <Link
          href={PATHS.home}
          className="inline-flex items-center gap-2 text-zinc-500 text-sm hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          На главную
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
          className="mb-10 max-w-3xl"
        >
          <p className="text-zinc-600 text-[11px] font-mono tracking-[0.24em] uppercase mb-3">
            Партнёр Fliben
          </p>
          <h1 className="text-white font-semibold tracking-tight text-3xl sm:text-4xl mb-4">
            Типовые проекты
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">{FLIBEN_TYPICAL.intro}</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-10">
          {FLIBEN_TYPICAL.projects.map((p) => (
            <a
              key={p.slug}
              href={`#${p.slug}`}
              className="px-4 py-2 rounded-full border border-zinc-800 text-zinc-400 text-sm hover:border-cyan-400/30 hover:text-white transition-colors"
            >
              {p.title}
            </a>
          ))}
        </div>

        <div className="space-y-8">
          {FLIBEN_TYPICAL.projects.map((project, index) => (
            <ProjectBlock key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
