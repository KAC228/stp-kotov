"use client";

import { motion } from "framer-motion";
import { Shield, FlaskConical, Leaf, Wind } from "lucide-react";

const viewEase = "easeOut" as const;
const viewDuration = 0.5;

const BLOCKS = [
  {
    icon: Shield,
    title: "Надёжность и долговечность",
    paragraphs: [
      "Изготовлена из атмосферостойкого пластика ASA, который не подвержен коррозии, не ржавеет и не теряет своих свойств со временем.",
      "Сохраняет прочность и внешний вид даже при длительной эксплуатации в сложных климатических условиях.",
      "Срок службы значительно превышает аналоги из металла или обычного пластика.",
    ],
  },
  {
    icon: FlaskConical,
    title: "Устойчивость к агрессивным средам",
    paragraphs: [
      "Материал ASA устойчив к воздействию ультрафиолета, влаги, перепадам температур, химически активным веществам и загрязнениям.",
      "Не разрушается под воздействием солей, кислот, щелочей и других агрессивных факторов, характерных для промышленных и городских зон.",
    ],
  },
  {
    icon: Leaf,
    title: "Экологичность и безопасность",
    paragraphs: [
      "Пластик ASA не выделяет вредных веществ, безопасен для окружающей среды и здоровья человека.",
      "Соответствует современным экологическим стандартам и требованиям к материалам для систем вентиляции.",
    ],
  },
  {
    icon: Wind,
    title: "Идеально подходит для вентиляции и кондиционирования",
    paragraphs: [
      "Камера обеспечивает равномерное распределение воздуха, что повышает эффективность работы вентиляционного и климатического оборудования.",
      "Лёгкая, прочная, не требует дополнительной обработки или покраски, проста в монтаже и обслуживании.",
      "Подходит для использования в жилых, коммерческих и промышленных объектах.",
    ],
  },
] as const;

function AdvantageCard({
  block,
  index,
}: {
  block: (typeof BLOCKS)[number];
  index: number;
}) {
  const Icon = block.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: viewDuration, ease: viewEase, delay: index * 0.06 }}
      className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden relative group hover:border-cyan-400/35 hover:shadow-[0_0_28px_rgba(0,210,255,0.18)] transition-[box-shadow,border-color] duration-300"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="p-8 sm:p-10 lg:p-12 flex flex-col sm:flex-row gap-6 sm:gap-10">
        <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-cyan-400/90" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-xl sm:text-2xl tracking-tight mb-4">
            {block.title}
          </h3>
          <div className="space-y-3">
            {block.paragraphs.map((p) => (
              <p key={p.slice(0, 32)} className="text-zinc-400 text-[15px] sm:text-base leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function AsaAdvantagesSection() {
  return (
    <section id="about-asa" className="bg-zinc-950 py-20 sm:py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: viewDuration, ease: viewEase }}
          className="mb-12 sm:mb-16 text-center max-w-4xl mx-auto"
        >
          <p className="text-zinc-700 text-[11px] font-mono tracking-[0.24em] uppercase mb-4">
            Материал и качество
          </p>
          <h2
            className="text-white font-semibold tracking-tighter leading-tight"
            style={{ fontSize: "clamp(1.65rem, 3.8vw, 2.75rem)" }}
          >
            Преимущества инновационной камеры статического давления из{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-teal-300">
              атмосферостойкого пластика ASA
            </span>
          </h2>
        </motion.div>

        <div className="flex flex-col gap-5 sm:gap-6">
          {BLOCKS.map((block, i) => (
            <AdvantageCard key={block.title} block={block} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: viewDuration, ease: viewEase, delay: 0.1 }}
          className="mt-14 sm:mt-16 max-w-3xl mx-auto text-center space-y-4"
        >
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            Мы предлагаем инновационные решения, проверенные нашим опытом. Используем только
            качественные материалы и современные технологии производства.
          </p>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: viewDuration, ease: viewEase, delay: 0.15 }}
          className="mt-10 sm:mt-12 mx-auto max-w-4xl rounded-3xl border border-cyan-400/25 bg-gradient-to-br from-cyan-500/10 via-zinc-900 to-zinc-900 px-8 py-10 sm:px-12 sm:py-12 text-center shadow-[0_0_40px_rgba(0,210,255,0.08)]"
        >
          <p
            className="text-white font-medium leading-snug tracking-tight"
            style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.45rem)" }}
          >
            Выбирая нашу камеру статического давления, вы инвестируете в долговечность,
            безопасность и эффективность вашей вентиляционной системы!
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}
