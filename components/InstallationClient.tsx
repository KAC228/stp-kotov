"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Layers,
  Ruler,
  Cable,
  SlidersHorizontal,
  Clock,
  BadgeCheck,
  Sparkles,
  ShieldCheck,
  FileSignature,
  ScrollText,
} from "lucide-react";
import { PATHS, CONTACTS, WARRANTY_YEARS } from "@/constants/brand";
import {
  INSTALLATION_GUIDE_STAGES,
  INSTALLATION_GUIDE_TITLE,
  PNR_SECTION,
} from "@/constants/installation-guide";
import { sitePath } from "@/lib/site-path";

const spring = { type: "spring" as const, damping: 28, stiffness: 130 };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { ...spring, delay },
});

/** Единый холодный cyan (#00D2FF), как карточки на главной */
const CARD_HOVER_GLOW = "rgba(255,90,120,0.18)";

const CARDS = [
  {
    icon: Layers,
    title: "Работа с любым типом потолка",
    body: "Наши специалисты уверенно работают с натяжными потолками и конструкциями из ГКЛ, включая сложные двухслойные системы. Обеспечиваем надёжную фиксацию без риска повреждения полотна или каркаса.",
  },
  {
    icon: Ruler,
    title: "Запатентованная система крепежа",
    body: "Данный модуль кардинально упрощает процесс монтажа камеры, делая его быстрым и безошибочным. Не нужно производить замеры — достаточно отмерять по готовому шаблону место для теневого диффузора, не трогая саму камеру.",
  },
  {
    icon: Cable,
    title: "Грамотная интеграция с сетями",
    body: "Герметичное соединение с воздуховодами топовых производителей. Грамотный вывод проводов для светильников гарантирует безопасность и эстетику.",
  },
  {
    icon: SlidersHorizontal,
    title: "Точная настройка микроклимата",
    body: "Балансировка системы с помощью встроенных дроссельных заслонок на каждом подводе. Настраиваем воздушный поток для равномерного распределения воздуха.",
  },
] as const;

const BENEFITS = [
  {
    icon: Clock,
    keyword: "Экономию вашего времени.",
    desc: "Мы берём на себя весь цикл: от доставки до пусконаладки.",
  },
  {
    icon: BadgeCheck,
    keyword: "Сохранение гарантии.",
    desc: "Монтаж сертифицированными специалистами обязателен для сохранения заводской гарантии.",
  },
  {
    icon: Sparkles,
    keyword: "Скорость и чистоту.",
    desc: "Выполняем работы быстро и аккуратно, оставляя после себя чистоту.",
  },
] as const;

export default function InstallationClient() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-24">
      <div className="max-w-4xl mx-auto py-24 px-6">

        <motion.div {...fadeUp(0)}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors duration-200 text-sm group mb-14"
          >
            <ArrowLeft
              className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
              strokeWidth={1.75}
            />
            Назад на главную
          </Link>
        </motion.div>

        <motion.div {...fadeUp(0.04)} className="mb-2">
          <span className="text-zinc-700 text-[11px] font-mono tracking-[0.26em] uppercase">
            Услуги / Монтаж
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.09)}
          style={{ fontFamily: "var(--font-brand)" }}
          className="text-white font-black tracking-tighter leading-[1.0] text-4xl sm:text-5xl lg:text-[3.5rem]"
        >
          Монтаж нашими специалистами:
          <br />
          <span className="text-zinc-400">
            профессионализм, скорость
          </span>
          <br />
          и безупречный результат.
        </motion.h1>

        <motion.p
          {...fadeUp(0.15)}
          className="text-zinc-400 text-xl leading-relaxed mt-7 max-w-2xl"
        >
          Мы убеждены, что даже самый инновационный продукт раскрывает
          свой потенциал только при профессиональном монтаже.
        </motion.p>

        <motion.div {...fadeUp(0.18)} className="mt-8">
          <a
            href={sitePath(PATHS.foreman)}
            className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/35 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-400 hover:bg-cyan-400/15"
          >
            Регламент на объекте
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </a>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ ...spring, delay: 0.2 }}
          className="mt-12 mb-0 h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent origin-left"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.22 + i * 0.07 }}
                className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 overflow-hidden group hover:border-cyan-400/35 hover:shadow-[0_0_28px_rgba(255,90,120,0.22)] transition-[border-color,box-shadow] duration-300"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse 55% 55% at 0% 0%, ${CARD_HOVER_GLOW}, transparent)`,
                  }}
                />
                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center mb-6">
                    <Icon className="w-5 h-5 text-zinc-400" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-white font-semibold tracking-tight text-lg leading-snug mb-4">
                    {card.title}
                  </h3>
                  <p className="text-zinc-500 text-[15px] leading-relaxed">
                    {card.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.5 }}
          className="mt-14 relative rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,90,120,0.06) 0%, rgba(14,14,18,0) 60%)",
            border: "1px solid rgba(255,90,120,0.22)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,90,120,0.5), transparent)",
            }}
          />

          <div className="p-8 sm:p-12">
            <div className="flex items-start gap-5 mb-8">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-cyan-400/30 bg-cyan-400/10"
              >
                <ShieldCheck
                  className="w-6 h-6 text-cyan-400"
                  strokeWidth={1.75}
                />
              </div>
              <div>
                <p className="text-[11px] font-mono tracking-[0.24em] uppercase mb-1.5 text-cyan-400/80">
                  Гарантийный договор
                </p>
                <h2 className="text-white font-semibold tracking-tight leading-tight text-xl sm:text-2xl">
                  Сервисный контракт: Условия реализации 25-летней гарантии
                </h2>
              </div>
            </div>

            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl">
              Заводская гарантия {WARRANTY_YEARS} лет на камеры статического давления
              действует при монтаже авторизованными специалистами и соблюдении
              условий сервисного обслуживания, указанных в договоре и на этой странице.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="flex flex-col gap-3 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-1">
                  <ScrollText className="w-5 h-5 text-zinc-500 shrink-0" strokeWidth={1.75} />
                  <p className="text-zinc-400 text-xs font-mono tracking-[0.18em] uppercase">
                    Регулярное обслуживание
                  </p>
                </div>
                <p className="text-zinc-400 text-[15px] leading-relaxed">
                  Для сохранения и подтверждения гарантийных обязательств
                  производителя на весь срок критически важно{" "}
                  <span className="text-zinc-200 font-medium">регулярное сервисное обслуживание</span>{" "}
                  нашими авторизованными специалистами.
                </p>
              </div>

              <div className="flex flex-col gap-3 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-1">
                  <FileSignature className="w-5 h-5 text-zinc-500 shrink-0" strokeWidth={1.75} />
                  <p className="text-zinc-400 text-xs font-mono tracking-[0.18em] uppercase">
                    Документальное подтверждение
                  </p>
                </div>
                <p className="text-zinc-400 text-[15px] leading-relaxed">
                  Каждое сервисное обслуживание фиксируется{" "}
                  <span className="text-zinc-200 font-medium">официальными актами и отчётами</span>.
                  Эти документы служат неоспоримым доказательством соблюдения правил эксплуатации
                  и необходимы для реализации вашего права на гарантийный ремонт или замену
                  оборудования в течение любого из {WARRANTY_YEARS} лет.
                </p>
              </div>

              <div className="md:col-span-2 flex flex-col gap-3 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-1">
                  <BadgeCheck className="w-5 h-5 text-zinc-500 shrink-0" strokeWidth={1.75} />
                  <p className="text-zinc-400 text-xs font-mono tracking-[0.18em] uppercase">
                    Профилактика и уверенность
                  </p>
                </div>
                <p className="text-zinc-400 text-[15px] leading-relaxed">
                  Договор на сервисное обслуживание — это не только формальность.
                  Регулярные регламентные работы{" "}
                  <span className="text-zinc-200 font-medium">снижают риск неисправностей</span>{" "}
                  и помогают сохранить право на гарантийный ремонт или замену
                  в рамках условий договора.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl px-6 py-5 border border-cyan-400/25 bg-cyan-400/[0.06]">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-cyan-400/15">
                <ShieldCheck className="w-4 h-4 text-cyan-400" strokeWidth={2.5} />
              </div>
              <p className="text-base leading-snug">
                <span className="text-zinc-400">Цель сервиса: </span>
                <span className="text-white font-semibold">
                  обеспечить условия для реализации гарантии {WARRANTY_YEARS} лет —
                  при соблюдении регламента обслуживания и правил эксплуатации.
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.55 }}
          className="text-white text-2xl font-bold tracking-tight mt-20 mb-8"
        >
          Что вы получаете, заказывая монтаж у нас?
        </motion.h2>

        <div className="flex flex-col gap-4">
          {BENEFITS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.keyword}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...spring, delay: 0.62 + i * 0.08 }}
                className="relative flex items-start gap-5 bg-zinc-900/60 border border-zinc-800/70 rounded-2xl px-7 py-6 hover:border-zinc-700 transition-colors duration-300 group overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                  style={{ background: `radial-gradient(ellipse 55% 55% at 0% 0%, ${CARD_HOVER_GLOW}, transparent)` }}
                />
                <div className="relative z-10 w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-zinc-400" strokeWidth={1.75} />
                </div>
                <p className="relative z-10 text-zinc-400 text-base leading-relaxed">
                  <span className="text-white font-semibold">{item.keyword}</span>{" "}
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.section
          id="guide"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={spring}
          className="mt-20 scroll-mt-28"
        >
          <p className="text-zinc-600 text-[11px] font-mono tracking-[0.24em] uppercase mb-3">
            СМР
          </p>
          <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-tight mb-8">
            {INSTALLATION_GUIDE_TITLE}
          </h2>
          <div className="flex flex-col gap-6">
            {INSTALLATION_GUIDE_STAGES.map((stage) => (
              <article
                key={stage.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-5 py-5 sm:px-6 sm:py-6"
              >
                <h3 className="text-white text-base sm:text-lg font-semibold tracking-tight mb-4">
                  {stage.title}
                </h3>
                <ol className="space-y-3">
                  {stage.items.map((item, index) => (
                    <li
                      key={`${stage.title}-${index}`}
                      className="flex gap-3 text-[14px] sm:text-[15px] leading-relaxed text-zinc-400"
                    >
                      <span className="shrink-0 font-mono text-[11px] text-zinc-600 mt-0.5 w-5">
                        {index + 1}.
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="pnr"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={spring}
          className="mt-20 scroll-mt-28 rounded-3xl border border-zinc-800 bg-zinc-900/40 overflow-hidden"
        >
          <div className="p-6 sm:p-10">
            <p className="text-zinc-600 text-[11px] font-mono tracking-[0.24em] uppercase mb-3">
              {PNR_SECTION.eyebrow}
            </p>
            <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-tight mb-6">
              {PNR_SECTION.title}
            </h2>

            <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/[0.06] px-5 py-5 mb-8">
              <p className="text-cyan-300 text-sm font-semibold mb-2">
                {PNR_SECTION.attentionTitle}
              </p>
              <p className="text-zinc-300 text-[15px] leading-relaxed">
                {PNR_SECTION.attentionBody}
              </p>
            </div>

            <h3 className="text-white text-lg font-semibold tracking-tight mb-3">
              {PNR_SECTION.whoTitle}
            </h3>
            <p className="text-zinc-400 text-[15px] leading-relaxed mb-4">
              {PNR_SECTION.whoIntro}
            </p>
            <ol className="space-y-3 mb-10">
              {PNR_SECTION.whoItems.map((item, index) => (
                <li
                  key={item.slice(0, 40)}
                  className="flex gap-3 text-[14px] sm:text-[15px] leading-relaxed text-zinc-400"
                >
                  <span className="shrink-0 font-mono text-[11px] text-zinc-600 mt-0.5 w-5">
                    {index + 1}.
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>

            <h3 className="text-white text-lg font-semibold tracking-tight mb-3">
              {PNR_SECTION.whyTitle}
            </h3>
            <p className="text-zinc-400 text-[15px] leading-relaxed mb-3">
              {PNR_SECTION.whyIntro}
            </p>
            <ul className="space-y-2 mb-6">
              {PNR_SECTION.smrItems.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] text-zinc-400">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 text-[15px] leading-relaxed mb-3">
              {PNR_SECTION.warningIntro}
            </p>
            <ol className="space-y-3 mb-10">
              {PNR_SECTION.warningItems.map((item, index) => (
                <li
                  key={item.slice(0, 40)}
                  className="flex gap-3 text-[14px] sm:text-[15px] leading-relaxed text-zinc-400"
                >
                  <span className="shrink-0 font-mono text-[11px] text-zinc-600 mt-0.5 w-5">
                    {index + 1}.
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>

            <h3 className="text-white text-lg font-semibold tracking-tight mb-3">
              {PNR_SECTION.partnerTitle}
            </h3>
            <p className="text-zinc-400 text-[15px] leading-relaxed mb-8">
              {PNR_SECTION.partnerBody}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <Link
                href={PATHS.partnership}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-white text-zinc-950 text-[14px] font-semibold hover:bg-zinc-100 transition-colors"
              >
                Стать сертифицированным партнером
              </Link>
              <Link
                href={PATHS.contactsEngineer}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full border border-zinc-700 text-zinc-300 text-[14px] font-medium hover:border-zinc-500 hover:text-white transition-colors"
              >
                Запросить визит инженера ПНР
              </Link>
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.88 }}
          className="mt-16 pt-12 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <Link
            href={PATHS.configurator}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-zinc-950 rounded-full text-[15px] font-semibold hover:bg-zinc-100 transition-colors duration-200"
          >
            Собрать конфигурацию
          </Link>
          <a
            href={`tel:${CONTACTS.phoneTel}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-zinc-300 rounded-full text-[15px] font-medium border border-zinc-700 hover:border-zinc-500 hover:text-white transition-colors duration-200"
          >
            Позвонить: {CONTACTS.phoneDisplay}
          </a>
        </motion.div>

      </div>
    </div>
  );
}
