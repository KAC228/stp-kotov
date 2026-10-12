"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Mail } from "lucide-react";
import { CONTACTS, PATHS } from "@/constants/brand";
import { PROJECT_SEGMENTS } from "@/constants/project-segments";

const ease = [0.16, 1, 0.3, 1] as const;

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
            Типовые проекты
          </p>
          <h1 className="text-white text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            Сегменты применения
          </h1>
        </motion.div>

        <div className="space-y-5 mb-12">
          {PROJECT_SEGMENTS.map((seg, index) => (
            <motion.article
              key={seg.id}
              id={seg.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.03, ease }}
              className="scroll-mt-28 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8"
            >
              <p className="text-zinc-600 text-[11px] font-mono tracking-wider mb-2">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="text-white text-xl sm:text-2xl font-semibold tracking-tight mb-4">
                {seg.title}
              </h2>
              <dl className="space-y-4 text-[15px] leading-relaxed">
                <div>
                  <dt className="ksd-shimmer-text text-xs uppercase tracking-wider mb-1 font-medium">
                    Для кого
                  </dt>
                  <dd className="text-zinc-300">{seg.forWhom}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500 text-xs uppercase tracking-wider mb-1">
                    Ваша проблема и запрос
                  </dt>
                  <dd className="text-zinc-400">{seg.problem}</dd>
                </div>
                <div>
                  <dt className="ksd-shimmer-text--accent text-xs uppercase tracking-wider mb-1 font-medium">
                    Предложение СТП-КОТОВ
                  </dt>
                  <dd className="text-zinc-300">{seg.offer}</dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`tel:${CONTACTS.phoneTel}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-700 text-zinc-300 text-sm hover:border-cyan-400/40 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" strokeWidth={1.75} />
                  Заказать звонок
                </a>
                <a
                  href={`mailto:${CONTACTS.email}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-700 text-zinc-300 text-sm hover:border-cyan-400/40 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" strokeWidth={1.75} />
                  Написать
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="sticky bottom-6 z-10 flex justify-center">
          <div className="flex flex-wrap items-center justify-center gap-3 rounded-full border border-zinc-700 bg-zinc-950/95 backdrop-blur px-4 py-3 shadow-lg">
            <a
              href={`tel:${CONTACTS.phoneTel}`}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-100"
            >
              Заказать звонок
            </a>
            <Link
              href={PATHS.contacts}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-600 text-zinc-300 text-sm hover:text-white"
            >
              Написать
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
