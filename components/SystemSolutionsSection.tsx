"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PATHS } from "@/constants/brand";

const viewEase = [0.16, 1, 0.3, 1] as const;

export default function SystemSolutionsSection() {
  return (
    <section id="systems" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950 border-t border-zinc-800/60">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: viewEase }}
        >
          <p className="text-zinc-600 text-[11px] font-mono tracking-[0.24em] uppercase mb-3">
            Системные решения
          </p>
          <h2
            className="text-white font-semibold tracking-tighter leading-tight mb-6"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Системные решения
          </h2>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-8">
            Инженерия не терпит шаблонов, но мы создаем стандарты. Сейчас мы адаптируем наши лучшие кейсы
            под форматы BIM-библиотек и типовых узлов, чтобы вы могли интегрировать решения «СТП-КОТОВ» в
            свои проекты одним кликом.
          </p>
          <p className="text-zinc-500 text-sm uppercase tracking-wider mb-3">
            Что будет доступно в ближайшее время:
          </p>
          <ul className="space-y-3 text-zinc-400 text-[15px] leading-relaxed mb-8">
            <li className="flex gap-3">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2" />
              Готовые BIM-семейства (Revit/ArchiCAD) с настроенными аэродинамическими параметрами.
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2" />
              Альбомы технических решений (узлы примыкания, интеграция со светом).
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2" />
              Спецификации для различных сегментов: от частных резиденций до дата-центров.
            </li>
          </ul>
          <p className="text-zinc-300 text-[15px] leading-relaxed mb-8">
            Не ждите, действуйте сейчас: Пока мы готовим раздел, наши профильные инженеры уже рассчитывают
            проекты для ваших объектов.
          </p>
          <Link
            href={PATHS.contactsEngineer}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-100 transition-colors"
          >
            Запросить консультацию инженера
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
