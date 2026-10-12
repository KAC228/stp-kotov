"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PATHS } from "@/constants/brand";
import type { SiteArticle } from "@/lib/site-articles";

const ease = [0.16, 1, 0.3, 1] as const;

export default function ArticlesClient({ articles }: { articles: SiteArticle[] }) {
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
          className="mb-12 max-w-3xl"
        >
          <p className="text-zinc-600 text-[11px] font-mono tracking-[0.24em] uppercase mb-3">
            Материалы
          </p>
          <h1 className="text-white font-semibold tracking-tight text-3xl sm:text-4xl mb-4">Статьи</h1>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2">
          {articles.map((article, index) => (
            <motion.article
              key={article.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.04, ease }}
            >
              <Link
                href={`/articles/${article.slug}`}
                className="group flex flex-col h-full rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-cyan-400/25 transition-colors"
              >
                <h2 className="text-white text-lg font-semibold tracking-tight mb-3 group-hover:text-cyan-50 transition-colors">
                  {article.title}
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-3">{article.thesis}</p>
                <p className="text-zinc-600 text-xs leading-relaxed mb-5 flex-1">
                  <span className="ksd-shimmer-text font-medium">Для кого: </span>
                  {article.forWhom}
                </p>
                <span className="inline-flex items-center gap-2 text-sm">
                  <span className="ksd-shimmer-text--accent">Открыть</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400/80 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.75} />
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
