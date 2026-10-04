"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Download, FileText } from "lucide-react";
import {
  FLIBEN_DOC_CATEGORIES,
  FLIBEN_DOCS,
  FLIBEN_PARTNER_NOTE,
  type FlibenDocCategory,
} from "@/constants/fliben-docs";
import { PATHS } from "@/constants/brand";
import { sitePath } from "@/lib/site-path";

export default function FlibenDocsClient() {
  const [category, setCategory] = useState<FlibenDocCategory | "all">("all");
  const [activeFile, setActiveFile] = useState<string | null>(
    FLIBEN_DOCS.find((d) => d.file)?.file ?? null
  );

  const filtered = useMemo(
    () => (category === "all" ? FLIBEN_DOCS : FLIBEN_DOCS.filter((d) => d.category === category)),
    [category]
  );

  const activeDoc = FLIBEN_DOCS.find((d) => d.file === activeFile) ?? filtered.find((d) => d.file);

  return (
    <div className="min-h-screen bg-zinc-950 pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-14">
        <Link
          href={PATHS.ourPartners}
          className="inline-flex items-center gap-2 text-zinc-500 text-sm hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          Каталог
        </Link>

        <h1 className="text-white font-semibold tracking-tight text-3xl sm:text-4xl mb-3">
          Документы Fliben
        </h1>
        <p className="text-zinc-400 text-base leading-relaxed max-w-3xl mb-4">
          Каталоги, сертификаты ISEGA, технические характеристики и прайс-листы — на сайте
          СТП-КОТОВ. Открывайте и скачивайте без перехода на сторонние ресурсы.
        </p>
        <p className="text-zinc-600 text-sm leading-relaxed max-w-3xl mb-8">{FLIBEN_PARTNER_NOTE}</p>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`px-4 py-2 rounded-full text-sm border transition-colors ${
              category === "all"
                ? "bg-cyan-400/10 border-cyan-400/40 text-cyan-300"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            Все
          </button>
          {(Object.keys(FLIBEN_DOC_CATEGORIES) as FlibenDocCategory[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setCategory(id)}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                category === id
                  ? "bg-cyan-400/10 border-cyan-400/40 text-cyan-300"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              {FLIBEN_DOC_CATEGORIES[id].shortLabel}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
          <ul className="space-y-2">
            {filtered.filter((doc) => doc.file).map((doc) => (
              <li key={doc.id}>
                <button
                  type="button"
                  onClick={() => doc.file && setActiveFile(doc.file)}
                  className={`w-full text-left rounded-xl border px-4 py-3 transition-colors ${
                    activeDoc?.id === doc.id
                      ? "border-cyan-400/40 bg-zinc-900"
                      : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-cyan-500/80 shrink-0 mt-0.5" strokeWidth={1.75} />
                    <div>
                      <p className="text-white text-sm font-medium leading-snug">{doc.title}</p>
                      <p className="text-zinc-600 text-xs mt-1">{doc.sizeMb} МБ · PDF</p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {activeDoc && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-white font-medium">{activeDoc.title}</p>
                  <p className="text-zinc-500 text-sm mt-1">{activeDoc.description}</p>
                </div>
                <a
                  href={sitePath(activeDoc.file ?? "")}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 text-zinc-300 text-sm hover:text-white hover:border-zinc-500 transition-colors"
                >
                  <Download className="w-4 h-4" strokeWidth={1.75} />
                  Скачать
                </a>
              </div>
              <iframe
                title={activeDoc.title}
                src={activeDoc.file}
                className="w-full h-[min(72vh,820px)] bg-zinc-800"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
