"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  FileText,
  MessageSquare,
  Check,
  Loader2,
  Calculator,
  Wrench,
  Truck,
  HeadphonesIcon,
  Users,
} from "lucide-react";
import { CONTACTS, LEGAL, SOCIAL } from "@/constants/brand";
import { formatPhoneRuInput, isPhoneCompleteRu } from "@/lib/phone";
import { submitLeadJson } from "@/lib/submitLead";
import FormConsent from "@/components/FormConsent";

const sp = { type: "spring" as const, damping: 28, stiffness: 130 };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { ...sp, delay },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { ...sp, delay },
});

const REQUISITES = [
  {
    icon: MapPin,
    label: "Адрес производства",
    value: CONTACTS.address,
    sub: CONTACTS.hours,
    accent: "rgba(99,102,241,0.15)",
    border: "rgba(99,102,241,0.3)",
    iconColor: "text-indigo-400",
  },
  {
    icon: Phone,
    label: "Телефон",
    value: CONTACTS.phoneDisplay,
    sub: "Звонки и мессенджеры",
    accent: "rgba(34,197,94,0.15)",
    border: "rgba(34,197,94,0.3)",
    iconColor: "text-emerald-400",
    href: `tel:${CONTACTS.phoneTel}`,
  },
  {
    icon: Mail,
    label: "Электронная почта",
    value: CONTACTS.email,
    sub: "Ответим в течение рабочего дня",
    accent: "rgba(6,182,212,0.15)",
    border: "rgba(6,182,212,0.3)",
    iconColor: "text-cyan-400",
    href: `mailto:${CONTACTS.email}`,
  },
  {
    icon: Users,
    label: "ВКонтакте",
    value: "vk.com/stp_kotov",
    sub: "Группа СТП-КОТОВ",
    accent: "rgba(59,130,246,0.15)",
    border: "rgba(59,130,246,0.35)",
    iconColor: "text-blue-400",
    href: SOCIAL.vk,
  },
  {
    icon: FileText,
    label: "Реквизиты",
    value: `ИНН ${LEGAL.inn} / ${LEGAL.ogrnLabel} ${LEGAL.ogrn}`,
    sub: LEGAL.companyShort,
    accent: "rgba(245,158,11,0.15)",
    border: "rgba(245,158,11,0.3)",
    iconColor: "text-amber-400",
  },
] as const;

const STAGES = [
  {
    icon: Calculator,
    num: "01",
    title: "Расчёт конфигурации",
    desc: "Подбираем параметры КСД под ваш объект: тип потолка, длина, способ подключения. Выдаём точную спецификацию с ценой.",
  },
  {
    icon: Truck,
    num: "02",
    title: "Производство и доставка",
    desc: "Изготавливаем изделие и доставляем в упаковке с полным монтажным набором. Трек-номер — сразу после отгрузки.",
  },
  {
    icon: Wrench,
    num: "03",
    title: "Сопровождение монтажа",
    desc: "Консультируем монтажников прямо на объекте: по телефону, в мессенджере или видеосвязи. Полный монтажный комплект уже в коробке.",
  },
  {
    icon: HeadphonesIcon,
    num: "04",
    title: "Постгарантийная поддержка",
    desc: "После сдачи объекта вы не остаётесь одни. Отвечаем на вопросы эксплуатации, помогаем с повторными заказами.",
  },
] as const;

type FormData = { name: string; phone: string; role: string; question: string };
type Status = "idle" | "loading" | "success" | "error";

const ROLES = ["Дизайнер / Архитектор", "Монтажная компания", "Заказчик (физлицо)", "Другое"];

function EngineerForm() {
  const [form, setForm] = useState<FormData>({ name: "", phone: "", role: "", question: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [pdConsent, setPdConsent] = useState(false);

  const set =
    (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneCompleteRu(form.phone) || !pdConsent) return;
    setStatus("loading");
    try {
      const res = await submitLeadJson({
        type: "Вопрос инженеру",
        name: form.name || "Не указано",
        phone: form.phone || "Не указан",
        role: form.role || "не указана",
        question: form.question || "",
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const inputBase =
    "w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3.5 text-white text-[15px] placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors duration-200";

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <motion.div
          key="ok"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={sp}
          className="flex flex-col items-center justify-center gap-5 py-14 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <Check className="w-7 h-7 text-emerald-400" strokeWidth={2} />
          </div>
          <h3 className="text-white text-xl font-semibold tracking-tight">Вопрос отправлен</h3>
          <p className="text-zinc-400 text-[15px] max-w-xs leading-relaxed">
            Наш инженер свяжется с вами в рабочее время. Спасибо за обращение.
          </p>
          <button
            type="button"
            onClick={() => { setStatus("idle"); setForm({ name: "", phone: "", role: "", question: "" }); }}
            className="mt-2 text-zinc-500 hover:text-white text-sm transition-colors duration-200"
          >
            Задать ещё вопрос
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-600 text-xs font-mono tracking-[0.15em] uppercase">Имя</label>
              <input required value={form.name} onChange={set("name")} placeholder="Как вас зовут?" className={inputBase} />
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
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-600 text-xs font-mono tracking-[0.15em] uppercase">Кто вы?</label>
            <select value={form.role} onChange={set("role")} className={`${inputBase} appearance-none cursor-pointer`}>
              <option value="" disabled className="bg-zinc-900">Выберите роль…</option>
              {ROLES.map((r) => (
                <option key={r} value={r} className="bg-zinc-900">{r}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-600 text-xs font-mono tracking-[0.15em] uppercase">Ваш вопрос</label>
            <textarea
              required
              value={form.question}
              onChange={set("question")}
              rows={4}
              placeholder="Опишите задачу или вопрос — чем подробнее, тем точнее ответит инженер…"
              className={`${inputBase} resize-none`}
            />
          </div>

          {status === "error" && (
            <p className="text-red-400 text-sm leading-snug">
              Не удалось отправить вопрос — попробуйте ещё раз или позвоните нам.
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-4 pt-1">
            <FormConsent
              pdConsent={pdConsent}
              onPdConsentChange={setPdConsent}
              className="max-w-[320px]"
            />
            <button
              type="submit"
              disabled={status === "loading" || !pdConsent}
              className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-white text-zinc-950 rounded-full text-[15px] font-semibold hover:bg-zinc-100 disabled:opacity-60 transition-all duration-200"
            >
              {status === "loading" ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Отправляем…</>
              ) : (
                <><MessageSquare className="w-4 h-4" />Задать вопрос</>
              )}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

export default function ContactsClient() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-24">
      <div className="max-w-4xl mx-auto py-24 px-6">

        <motion.div {...fadeIn(0)}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors duration-200 text-sm group mb-14"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={1.75} />
            Назад на главную
          </Link>
        </motion.div>

        <motion.p {...fadeIn(0.04)} className="text-zinc-700 text-[11px] font-mono tracking-[0.26em] uppercase mb-4">
          Контакты
        </motion.p>

        <motion.h1
          {...fadeIn(0.08)}
          style={{ fontFamily: "var(--font-brand)" }}
          className="text-white font-black tracking-tighter leading-[1.0] text-4xl sm:text-5xl lg:text-[3.5rem] mb-5"
        >
          Давайте строить
          <br />
          <span className="text-zinc-400">диалог.</span>
        </motion.h1>

        <motion.p {...fadeIn(0.13)} className="text-zinc-400 text-xl leading-relaxed max-w-xl mb-4">
          Наша стратегия — это{" "}
          <span className="text-white font-medium">экспертность</span>,{" "}
          <span className="text-white font-medium">персонализация</span> и{" "}
          <span className="text-white font-medium">забота</span>.
        </motion.p>

        <motion.p {...fadeIn(0.17)} className="text-zinc-600 text-[15px] leading-relaxed max-w-lg mb-14">
          Мы сопровождаем каждый проект на всех этапах — от первого расчёта конфигурации
          до финальных консультаций монтажников прямо на объекте.
        </motion.p>

        <motion.div {...fadeUp(0)} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-20">
          {REQUISITES.map((r, i) => {
            const Icon = r.icon;
            const content = (
              <motion.div
                key={r.label}
                {...fadeUp(i * 0.07)}
                className="group relative flex items-start gap-4 rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.01] cursor-default"
                style={{ background: r.accent, borderColor: r.border }}
              >
                <div
                  className="shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center"
                  style={{ background: "rgba(9,9,11,0.5)", borderColor: r.border }}
                >
                  <Icon className={`w-5 h-5 ${r.iconColor}`} strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className="text-zinc-600 text-[10px] font-mono tracking-[0.2em] uppercase mb-1">{r.label}</p>
                  <p className="text-white text-[15px] font-medium leading-snug break-words sm:truncate">{r.value}</p>
                  {r.sub && <p className="text-zinc-600 text-xs mt-0.5">{r.sub}</p>}
                </div>
              </motion.div>
            );

            return "href" in r ? (
              <a
                key={r.label}
                href={r.href}
                className="block"
                {...(r.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {content}
              </a>
            ) : (
              <div key={r.label}>{content}</div>
            );
          })}
        </motion.div>

        <motion.div
          {...fadeUp(0.1)}
          className="mt-6 mb-20 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-4">
            <Image
              src="/images/logo.svg"
              alt="Логотип СТП-КОТОВ"
              width={747}
              height={684}
              className="h-10 w-auto"
              style={{ filter: "invert(1) brightness(1.1)" }}
            />
            <p className="text-zinc-500 text-[11px] font-mono tracking-[0.2em] uppercase">
              Полные реквизиты
            </p>
          </div>
          <dl className="divide-y divide-zinc-800">
            {([
              ["Наименование", LEGAL.companyFull],
              ["ИНН", LEGAL.inn],
              [LEGAL.ogrnLabel, LEGAL.ogrn],
              ["Адрес производства", CONTACTS.address],
              ["Банк", LEGAL.bank],
              ["БИК", LEGAL.bik],
              ["Р/с", LEGAL.account],
              ["К/с", LEGAL.corr],
            ] as [string, string][]).map(([label, value]) => (
              <div key={label} className="grid grid-cols-[140px,1fr] gap-4 px-6 py-3.5">
                <dt className="text-zinc-600 text-[13px]">{label}</dt>
                <dd className="text-zinc-300 text-[13px] font-mono break-all">{value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div {...fadeUp(0)} className="mb-20">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent mb-14" />

          <motion.div {...fadeUp(0)} className="mb-10">
            <p className="text-zinc-700 text-[11px] font-mono tracking-[0.24em] uppercase mb-3">Философия</p>
            <h2
              className="text-white font-semibold tracking-tighter leading-tight"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}
            >
              Мы рядом на каждом этапе.
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[22px] top-8 bottom-8 w-px bg-gradient-to-b from-zinc-700/60 via-zinc-700/30 to-transparent hidden sm:block" aria-hidden />
            <div className="flex flex-col gap-0">
              {STAGES.map((stage, i) => {
                const Icon = stage.icon;
                return (
                  <motion.div
                    key={stage.num}
                    {...fadeUp(i * 0.09)}
                    className="group relative flex items-start gap-6 py-7 border-b border-zinc-800/50 last:border-none"
                  >
                    <div className="shrink-0 relative z-10 w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-600 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors duration-300" strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-zinc-700 text-[10px] font-mono tracking-[0.28em]">{stage.num}</span>
                        <h3 className="text-white font-semibold text-base tracking-tight">{stage.title}</h3>
                      </div>
                      <p className="text-zinc-500 text-[15px] leading-relaxed">{stage.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div id="engineer" className="scroll-mt-24" {...fadeUp(0)}>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent mb-14" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start">
            <motion.div {...fadeUp(0)}>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-indigo-400" strokeWidth={1.75} />
                </div>
                <span className="text-indigo-400 text-[11px] font-mono tracking-[0.22em] uppercase">Прямая линия</span>
              </div>

              <h2
                className="text-white font-semibold tracking-tighter leading-tight mb-4"
                style={{ fontSize: "clamp(1.5rem, 2.8vw, 2rem)" }}
              >
                Задайте вопрос инженеру.
              </h2>

              <p className="text-zinc-500 text-[15px] leading-relaxed mb-8">
                Не знаете, какой КСД подойдёт для вашего объекта? Расскажите нам о
                задаче — инженер разберётся и ответит по существу, без скриптов и
                шаблонных ответов.
              </p>

              <ul className="flex flex-col gap-3">
                {[
                  "Ответ в тот же рабочий день",
                  "Живой инженер, а не бот",
                  "Конкретные расчёты под ваш объект",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-zinc-400 text-[14px]">
                    <span className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-zinc-400" strokeWidth={2.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div {...fadeUp(0.08)} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-500 text-xs font-mono tracking-[0.16em] uppercase">Инженер онлайн</span>
              </div>
              <EngineerForm />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp(0.1)}
          className="mt-20 pt-12 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="flex-1">
            <p className="text-zinc-500 text-sm leading-relaxed">Хотите стать партнёром?</p>
          </div>
          <Link
            href="/partnership"
            className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 border border-zinc-700 text-zinc-300 rounded-full text-[15px] font-medium hover:border-zinc-500 hover:text-white transition-colors duration-200 group"
          >
            Партнёрство
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
