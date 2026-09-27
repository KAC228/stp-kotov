"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Wand2,
  FileStack,
  ShieldCheck,
  Package,
  Target,
  SlidersHorizontal,
  Building2,
  Check,
  Loader2,
} from "lucide-react";
import { formatPhoneRuInput, isPhoneCompleteRu } from "@/lib/phone";
import { submitLeadJson } from "@/lib/submitLead";
import FormConsent from "@/components/FormConsent";

const spring = { type: "spring" as const, damping: 28, stiffness: 130 };

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { ...spring, delay },
});

const inViewX = (x: number, delay = 0) => ({
  initial: { opacity: 0, x },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { ...spring, delay },
});

const DESIGNER_FEATURES = [
  {
    icon: Wand2,
    title: "Визуальная интеграция",
    desc: "Магнитное крепление позволяет создавать любые световые сценарии без компромиссов с вентиляцией. Свет и воздух — единый архитектурный элемент.",
    accent: "rgba(139,92,246,0.2)",
    border: "rgba(139,92,246,0.35)",
  },
  {
    icon: FileStack,
    title: "Техподдержка и 3D-модели",
    desc: "Помогаем на ранней стадии: предоставляем BIM-объекты, чертежи и все технические данные для ваших концепций. Ваш проект выйдет без правок.",
    accent: "rgba(99,102,241,0.2)",
    border: "rgba(99,102,241,0.35)",
  },
  {
    icon: ShieldCheck,
    title: "Гарантия результата",
    desc: "Идеальная геометрия и отсутствие сварных швов — объект будет выглядеть точно как на ваших рендерах. Никакого зазора между идеей и реализацией.",
    accent: "rgba(168,85,247,0.2)",
    border: "rgba(168,85,247,0.35)",
  },
] as const;

const BUILDER_CARDS = [
  {
    icon: Package,
    title: "Полный монтажный набор",
    desc: "Забудьте о поиске комплектующих — всё уже в комплекте. Каркас, заслонки, крепёж и инструкция — открыл коробку и начал работу.",
    num: "01",
  },
  {
    icon: Target,
    title: "Минимизация ошибок",
    desc: "Заводская разметка на каркасе и интуитивная система крепления ускоряют монтаж в разы. Идеальная точность без сложных замеров.",
    num: "02",
  },
  {
    icon: SlidersHorizontal,
    title: "Точная настройка",
    desc: "Дроссельные заслонки позволяют вашим инженерам идеально настроить поток воздуха прямо на объекте — балансировка за минуты.",
    num: "03",
  },
] as const;

function DesignerRow({
  feature,
  index,
}: {
  feature: (typeof DESIGNER_FEATURES)[number];
  index: number;
}) {
  const Icon = feature.icon;
  const fromLeft = index % 2 === 0;

  return (
    <motion.div
      {...inViewX(fromLeft ? -24 : 24, index * 0.1)}
      className="flex flex-col sm:flex-row items-start gap-6 py-8 border-b border-zinc-800/60 last:border-none group"
    >
      <div
        className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105"
        style={{ background: feature.accent, borderColor: feature.border }}
      >
        <Icon className="w-6 h-6 text-violet-300" strokeWidth={1.75} />
      </div>
      <div className="flex-1">
        <h4 className="text-white font-semibold text-lg tracking-tight mb-2">{feature.title}</h4>
        <p className="text-zinc-400 text-[15px] leading-relaxed">{feature.desc}</p>
      </div>
    </motion.div>
  );
}

function BuilderCard({
  card,
  index,
}: {
  card: (typeof BUILDER_CARDS)[number];
  index: number;
}) {
  const Icon = card.icon;
  return (
    <motion.div
      {...inView(0.05 + index * 0.09)}
      className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-7 overflow-hidden group hover:border-zinc-600 transition-colors duration-300"
    >
      <div
        className="absolute -bottom-2 -right-1 text-zinc-800 font-black leading-none select-none pointer-events-none"
        style={{ fontSize: "5.5rem", fontFamily: "var(--font-brand)" }}
        aria-hidden
      >
        {card.num}
      </div>
      <div className="relative z-10">
        <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center mb-5">
          <Icon className="w-5 h-5 text-zinc-400" strokeWidth={1.75} />
        </div>
        <h4 className="text-white font-semibold text-lg tracking-tight mb-3">{card.title}</h4>
        <p className="text-zinc-500 text-[15px] leading-relaxed">{card.desc}</p>
      </div>
    </motion.div>
  );
}

type FormState = { name: string; phone: string; company: string; message: string };
type Status = "idle" | "loading" | "success" | "error";

function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", phone: "", company: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [pdConsent, setPdConsent] = useState(false);

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneCompleteRu(form.phone) || !pdConsent) return;
    setStatus("loading");
    try {
      const res = await submitLeadJson({
        type: "Заявка на партнёрство",
        name: form.name || "Не указано",
        phone: form.phone || "Не указан",
        company: form.company || "не указана",
        message: form.message || "",
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", phone: "", company: "", message: "" });
      setPdConsent(false);
    } catch {
      setStatus("error");
    }
  };

  const inputBase =
    "w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-[15px] placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors duration-200";

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring}
          className="flex flex-col items-center justify-center gap-5 py-16 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <Check className="w-7 h-7 text-emerald-400" strokeWidth={2} />
          </div>
          <h3 className="text-white text-xl font-semibold tracking-tight">Заявка отправлена</h3>
          <p className="text-zinc-400 text-[15px] max-w-xs leading-relaxed">
            Мы свяжемся с вами в ближайшее время. Спасибо за интерес к партнёрству.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-600 text-xs font-mono tracking-[0.15em] uppercase">Имя</label>
            <input required value={form.name} onChange={set("name")} placeholder="Алексей Иванов" className={inputBase} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-600 text-xs font-mono tracking-[0.15em] uppercase">Телефон</label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => {
                const raw = e.target.value;
                setForm((f) => ({
                  ...f,
                  phone: formatPhoneRuInput(f.phone, raw),
                }));
              }}
              onFocus={() => { if (!form.phone) setForm((f) => ({ ...f, phone: "+7 " })); }}
              placeholder="+7 (___) ___-__-__"
              maxLength={18}
              className={inputBase}
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-zinc-600 text-xs font-mono tracking-[0.15em] uppercase">Компания</label>
            <input value={form.company} onChange={set("company")} placeholder="ООО «Ваша Компания»" className={inputBase} />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-zinc-600 text-xs font-mono tracking-[0.15em] uppercase">Сообщение</label>
            <textarea value={form.message} onChange={set("message")} rows={4} placeholder="Расскажите о вашем запросе..." className={`${inputBase} resize-none`} />
          </div>
          <div className="sm:col-span-2 flex flex-col items-end gap-2 pt-2">
            {status === "error" && (
              <p className="text-red-400 text-sm w-full text-left">
                Не удалось отправить заявку — попробуйте ещё раз или позвоните нам.
              </p>
            )}
            <FormConsent
              pdConsent={pdConsent}
              onPdConsentChange={setPdConsent}
              className="w-full text-left"
            />
            <button
              type="submit"
              disabled={status === "loading" || !pdConsent}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-zinc-950 rounded-full text-[15px] font-semibold hover:bg-zinc-100 disabled:opacity-60 transition-all duration-200"
            >
              {status === "loading" ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Отправляем…</>
              ) : (
                "Отправить заявку"
              )}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

export default function PartnershipClient() {
  const formRef = useRef<HTMLElement>(null);

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-screen bg-zinc-950 pt-24">
      <div className="max-w-4xl mx-auto py-24 px-6">

        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ ...spring, delay: 0 }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors duration-200 text-sm group mb-14"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={1.75} />
            Назад на главную
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.04 }}
          className="text-zinc-700 text-[11px] font-mono tracking-[0.26em] uppercase mb-4"
        >
          Партнёрство
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.08 }}
          style={{ fontFamily: "var(--font-brand)" }}
          className="text-white font-black tracking-tighter leading-[1.01] text-4xl sm:text-5xl lg:text-[3.25rem]"
        >
          Партнёрство с СТП-КОТОВ:
          <br />
          <span className="text-zinc-400">вместе создаём будущее</span>
          <br />
          комфорта.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.15 }}
          className="text-zinc-400 text-xl leading-relaxed mt-7 max-w-2xl"
        >
          Мы верим, что самые прорывные решения рождаются в сотрудничестве. Наша
          инновационная КСД — это основа для синергии вашего профессионализма и нашей
          инженерной мысли.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.22 }}
          className="mt-10"
        >
          <button
            type="button"
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-zinc-950 rounded-full text-[15px] font-semibold hover:bg-zinc-100 transition-colors duration-200 group"
          >
            Стать партнёром
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </motion.div>

        <section className="mt-24">
          <motion.div {...inView(0)} className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-violet-400" strokeWidth={1.75} />
            </div>
            <span className="text-violet-400 text-xs font-mono tracking-[0.22em] uppercase">
              Для дизайнеров и архитекторов
            </span>
          </motion.div>

          <motion.h2
            {...inView(0.05)}
            className="text-white font-semibold tracking-tighter leading-tight mb-2"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          >
            Реализуйте самые смелые идеи.
          </motion.h2>
          <motion.p {...inView(0.1)} className="text-zinc-500 text-[15px] leading-relaxed mb-2 max-w-xl">
            Наш продукт создан с мыслью о свободе проектирования. Ваш замысел не будет
            скомпрометирован инженерными ограничениями.
          </motion.p>

          <div className="mt-8 border-t border-zinc-800/60">
            {DESIGNER_FEATURES.map((f, i) => (
              <DesignerRow key={f.title} feature={f} index={i} />
            ))}
          </div>
        </section>

        <motion.div {...inView(0)} className="my-16 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-zinc-700/50" />
          <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-zinc-600" strokeWidth={1.5} />
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-zinc-700/50 to-zinc-700/50" />
        </motion.div>

        <section>
          <motion.div {...inView(0)} className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <Package className="w-4 h-4 text-amber-400" strokeWidth={1.75} />
            </div>
            <span className="text-amber-400 text-xs font-mono tracking-[0.22em] uppercase">
              Для строительных и монтажных компаний
            </span>
          </motion.div>

          <motion.h2
            {...inView(0.05)}
            className="text-white font-semibold tracking-tighter leading-tight mb-2"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          >
            Работайте быстрее и качественнее.
          </motion.h2>
          <motion.p {...inView(0.1)} className="text-zinc-500 text-[15px] leading-relaxed mb-10 max-w-xl">
            Мы убрали все технические барьеры для монтажной бригады. Меньше времени
            на объекте — выше маржинальность вашего бизнеса.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {BUILDER_CARDS.map((card, i) => (
              <BuilderCard key={card.title} card={card} index={i} />
            ))}
          </div>
        </section>

        <section id="partnership-form" ref={formRef} className="mt-24 scroll-mt-24">
          <motion.div
            {...inView(0)}
            className="h-px w-full bg-gradient-to-r from-transparent via-zinc-600/60 to-transparent mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
            <motion.div {...inViewX(-24, 0)}>
              <p className="text-zinc-700 text-[11px] font-mono tracking-[0.26em] uppercase mb-5">
                Партнёрство
              </p>
              <h2
                className="text-white font-semibold tracking-tighter leading-tight mb-5"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}
              >
                Станьте официальным представителем.
              </h2>
              <p className="text-zinc-400 text-[15px] leading-relaxed mb-8">
                Развивайте свой бизнес вместе с лидером рынка. Мы предоставляем
                маркетинговую поддержку, обучение и эксклюзивные условия для
                партнёров первого уровня.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "Эксклюзивная территория продаж",
                  "Маркетинговые материалы и обучение",
                  "Приоритетная техническая поддержка",
                  "Гибкие условия оплаты и отсрочки",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-zinc-400 text-[15px]">
                    <span className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-zinc-400" strokeWidth={2.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              {...inViewX(24, 0.08)}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 sm:p-8"
            >
              <h3 className="text-white font-semibold text-lg tracking-tight mb-1">Оставьте заявку</h3>
              <p className="text-zinc-600 text-sm mb-7">Ответим в течение одного рабочего дня.</p>
              <ContactForm />
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  );
}
