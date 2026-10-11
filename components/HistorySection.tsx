"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getSiteArticleBySlug } from "@/lib/site-articles";
import { PATHS } from "@/constants/brand";

const viewEase = [0.16, 1, 0.3, 1] as const;

const HISTORY = getSiteArticleBySlug("istoriya-sozdaniya");

export default function HistorySection() {
  if (!HISTORY?.body) return null;

  const paragraphs = HISTORY.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section id="history" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950 scroll-mt-24">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: viewEase }}
        >
          <p className="text-zinc-600 text-[11px] font-mono tracking-[0.24em] uppercase mb-3">
            История
          </p>
          <h2
            className="text-white font-semibold tracking-tighter leading-tight mb-8"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            {HISTORY.title}
          </h2>

          <div className="space-y-5 text-zinc-400 text-[15px] sm:text-base leading-relaxed">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="text-zinc-300/90">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`${PATHS.articles}/istoriya-sozdaniya`}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-zinc-700 text-zinc-300 text-sm hover:border-cyan-400/40 hover:text-white transition-colors"
            >
              Открыть как статью
            </Link>
            <Link
              href={PATHS.team}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-100 transition-colors"
            >
              Команда
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
