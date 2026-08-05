"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { PATHS } from "@/constants/brand";
import { splitArticleParagraphs, type FlibenArticle } from "@/lib/fliben-content";
import { CoverPhoto } from "@/components/SitePhoto";

export default function ArticleDetailClient({ article }: { article: FlibenArticle }) {
  const paragraphs = splitArticleParagraphs(article.body);

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
        >
          {article.image && (
            <CoverPhoto
              src={article.image}
              alt={article.title}
              aspectClass="aspect-[16/9]"
              frameClassName="rounded-2xl mb-8 border border-zinc-800"
              sizes="768px"
              priority
            />
          )}
          <h1 className="text-white font-semibold tracking-tight text-2xl sm:text-4xl leading-tight mb-4">
            {article.title}
          </h1>
          {article.publishedAt && (
            <p className="text-zinc-600 text-sm font-mono mb-8">
              {new Date(article.publishedAt.replace(" ", "T")).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </motion.header>

        <div className="prose prose-invert prose-zinc max-w-none">
          {paragraphs.map((p) => (
            <p key={p.slice(0, 40)} className="text-zinc-300 text-[15px] sm:text-base leading-relaxed mb-5">
              {p}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}
