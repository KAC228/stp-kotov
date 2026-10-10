"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { PATHS } from "@/constants/brand";
import type { SiteArticle } from "@/lib/site-articles";

export default function ArticleDetailClient({ article }: { article: SiteArticle }) {
  const historyParagraphs = article.body
    ? article.body
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-zinc-950 pt-24">
      <article className="max-w-3xl mx-auto px-6 lg:px-8 py-10 lg:py-14">
        <Link
          href={PATHS.articles}
          className="inline-flex items-center gap-2 text-zinc-500 text-sm hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          Все статьи
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1 className="text-white font-semibold tracking-tight text-2xl sm:text-4xl leading-tight mb-4">
            {article.title}
          </h1>
          {article.thesis && (
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed mb-4">{article.thesis}</p>
          )}
          {article.forWhom && (
            <p className="text-zinc-600 text-sm">
              <span className="text-zinc-500">Для кого: </span>
              {article.forWhom}
            </p>
          )}
        </motion.header>

        {article.body ? (
          <div className="space-y-5">
            {historyParagraphs.map((p) => (
              <p key={p.slice(0, 48)} className="text-zinc-300 text-[15px] sm:text-base leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            <section>
              <h2 className="text-white font-semibold text-lg mb-3">Проблема</h2>
              <p className="text-zinc-300 text-[15px] sm:text-base leading-relaxed">{article.problem}</p>
            </section>
            <section>
              <h2 className="text-white font-semibold text-lg mb-3">Решение «СТП-КОТОВ»</h2>
              <p className="text-zinc-300 text-[15px] sm:text-base leading-relaxed">{article.solution}</p>
            </section>
          </div>
        )}
      </article>
    </div>
  );
}
