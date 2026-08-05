"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PATHS } from "@/constants/brand";
import type { FlibenArticle } from "@/lib/fliben-content";
import { CoverPhoto } from "@/components/SitePhoto";

const ease = [0.16, 1, 0.3, 1] as const;

export default function ArticlesClient({ articles }: { articles: FlibenArticle[] }) {
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
            Партнёр Fliben
          </p>
          <h1 className="text-white font-semibold tracking-tight text-3xl sm:text-4xl mb-4">Статьи</h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Практические материалы о современной вентиляции в частных домах — подборка с сайта производителя,
            оформленная в стиле СТП-КОТОВ.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {articles.map((article, index) => (
            <motion.article
              key={article.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.05, ease }}
            >
              <Link
                href={`/articles/${article.slug}`}
                className="group flex flex-col h-full rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden hover:border-cyan-400/25 transition-colors"
              >
                {article.image && (
                  <CoverPhoto
                    src={article.image}
                    alt={article.title}
                    imageClassName="opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                )}
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-white text-lg font-semibold tracking-tight mb-2 group-hover:text-cyan-50 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed line-clamp-4 flex-1">{article.excerpt}</p>
                  <span className="inline-flex items-center gap-2 mt-5 text-cyan-400/80 text-sm">
                    Читать
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.75} />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
