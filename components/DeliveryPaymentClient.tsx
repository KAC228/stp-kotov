"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Truck,
  Box,
  PackageCheck,
  Zap,
  ShieldCheck,
  Eye,
  CreditCard,
  QrCode,
  Building2,
  Lock,
  Receipt,
  CheckCircle2,
  RotateCcw,
  Scale,
} from "lucide-react";
import { CONTACTS, PATHS, PRICE_PER_METER_RUB, WARRANTY_YEARS } from "@/constants/brand";

const sp = { type: "spring" as const, damping: 28, stiffness: 130 };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { ...sp, delay },
});

function IconVisa() {
  return (
    <svg viewBox="0 0 48 16" className="h-5 w-auto" fill="none" aria-label="Visa">
      <text x="0" y="13" fontFamily="Arial Black, sans-serif" fontWeight="900"
        fontSize="15" fill="white" letterSpacing="-0.5">VISA</text>
    </svg>
  );
}

function IconMir() {
  return (
    <svg viewBox="0 0 60 20" className="h-4 w-auto" fill="none" aria-label="Мир">
      <rect width="60" height="20" rx="4" fill="#00B33C" />
      <text x="6" y="14" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="11" fill="white">МИР</text>
    </svg>
  );
}

function IconMastercard() {
  return (
    <svg viewBox="0 0 38 24" className="h-5 w-auto" aria-label="Mastercard">
      <circle cx="14" cy="12" r="10" fill="#EB001B" />
      <circle cx="24" cy="12" r="10" fill="#F79E1B" fillOpacity="0.9" />
      <path d="M19 5.5a10 10 0 010 13A10 10 0 0119 5.5z" fill="#FF5F00" />
    </svg>
  );
}

function IconSBP() {
  return (
    <svg viewBox="0 0 60 20" className="h-4 w-auto" fill="none" aria-label="СБП">
      <rect width="60" height="20" rx="4" fill="#1C3A6E" />
      <text x="6" y="14" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="10" fill="white">СБП</text>
    </svg>
  );
}

function IconMirPay() {
  return (
    <svg viewBox="0 0 70 20" className="h-4 w-auto" fill="none" aria-label="Mir Pay">
      <rect width="70" height="20" rx="4" fill="#00B33C" />
      <text x="5" y="14" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="10" fill="white">МИР Pay</text>
    </svg>
  );
}

function IconSBPay() {
  return (
    <svg viewBox="0 0 70 20" className="h-4 w-auto" fill="none" aria-label="СБПэй">
      <rect width="70" height="20" rx="4" fill="#1C3A6E" />
      <text x="5" y="14" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="10" fill="white">СБПэй</text>
    </svg>
  );
}

type Tab = "delivery" | "payment";

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    label: "Безопасность",
    desc: "Специальная упаковка и ТК с опытом перевозки хрупких грузов",
    accent: "rgba(34,197,94,0.15)",
    border: "rgba(34,197,94,0.3)",
    text: "text-emerald-400",
  },
  {
    icon: Zap,
    label: "Скорость",
    desc: "Отгрузка в день заказа или на следующий рабочий день",
    accent: "rgba(245,158,11,0.15)",
    border: "rgba(245,158,11,0.3)",
    text: "text-amber-400",
  },
  {
    icon: Eye,
    label: "Прозрачность",
    desc: "Трек-номер для онлайн-отслеживания на каждом этапе",
    accent: "rgba(99,102,241,0.15)",
    border: "rgba(99,102,241,0.3)",
    text: "text-indigo-400",
  },
] as const;

const DELIVERY_CARDS = [
  {
    icon: Box,
    title: "Надёжная упаковка",
    body: "Каждое изделие упаковывается в жёсткий картон с демпферами. Магнитные крепления и рельсы защищены спецнакладками. Маркировка «Хрупкое» и «Верх» обязательна.",
    tag: "Packaging",
  },
  {
    icon: Truck,
    title: "Транспортировка",
    body: "Только проверенные транспортные компании с опытом перевозки хрупких грузов. Груз надёжно фиксируется ремнями внутри кузова.",
    tag: "Shipping",
  },
  {
    icon: Zap,
    title: "Оперативность",
    body: "Отгрузка со склада в день заказа или на следующий рабочий день. Вы получаете трек-номер для онлайн-отслеживания отправления.",
    tag: "Speed",
  },
  {
    icon: PackageCheck,
    title: "Готовность к монтажу",
    body: "Полный монтажный набор уже внутри коробки. Открыли — сразу приступаете к работе.",
    tag: "Ready",
  },
] as const;

interface PaymentCard {
  id: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  icon: React.ElementType;
  title: string;
  body: string;
  methods: readonly string[];
  logos: React.ReactNode;
  highlights: readonly string[];
}

const PAYMENT_CARDS: PaymentCard[] = [
  {
    id: "individuals",
    badge: "Физическим лицам",
    badgeColor: "text-violet-400",
    badgeBg: "rgba(139,92,246,0.10)",
    badgeBorder: "rgba(139,92,246,0.35)",
    icon: CreditCard,
    title: "Банковские карты и быстрые платежи",
    body: "Принимаем все популярные карты и платёжные сервисы. Оплата через защищённую форму — без перенаправления на сторонние сайты.",
    methods: ["Visa / Mastercard", "Мир", "СБП (QR-код / ссылка)", "Mir Pay", "СБПэй"],
    logos: (
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <IconVisa /><IconMastercard /><IconMir /><IconSBP /><IconMirPay /><IconSBPay />
      </div>
    ),
    highlights: [
      "Оплата по QR-коду или ссылке СБП — мгновенный перевод без комиссии",
      "Mir Pay и СБПэй — бесконтактная оплата с телефона",
      "Visa, Mastercard, Мир — стандартная оплата картой",
    ],
  },
  {
    id: "business",
    badge: "Юридическим лицам и ИП",
    badgeColor: "text-cyan-400",
    badgeBg: "rgba(6,182,212,0.10)",
    badgeBorder: "rgba(6,182,212,0.35)",
    icon: Building2,
    title: "Безналичный расчёт по счёту",
    body: "Выставляем счёт с полным пакетом закрывающих документов. Работаем с НДС и без НДС. Отсрочка платежа обсуждается индивидуально.",
    methods: ["Банковский перевод", "Счёт + счёт-фактура", "Накладная / акт"],
    logos: (
      <div className="flex items-center gap-2 mt-4">
        <Building2 className="w-5 h-5 text-cyan-500/60" strokeWidth={1.5} />
        <span className="text-zinc-600 text-xs font-mono">Безналичный расчёт</span>
      </div>
    ),
    highlights: [
      "Счёт-фактура, товарная накладная, акт выполненных работ — всё включено",
      "ИНН и банковские реквизиты в договоре и счёте",
      "Отсрочка платежа до 30 дней — по договорённости",
    ],
  },
  {
    id: "qr",
    badge: "СБП — быстро и без комиссии",
    badgeColor: "text-blue-400",
    badgeBg: "rgba(59,130,246,0.10)",
    badgeBorder: "rgba(59,130,246,0.35)",
    icon: QrCode,
    title: "Система быстрых платежей",
    body: "Отсканируйте QR-код или перейдите по ссылке СБП. Перевод между банками за секунды без комиссии для покупателя.",
    methods: ["QR-код СБП", "Ссылка для оплаты", "СБПэй"],
    logos: (
      <div className="flex items-center gap-3 mt-4">
        <IconSBP /><IconSBPay />
      </div>
    ),
    highlights: [
      "Мгновенный перевод из любого банка-участника СБП",
      "Нет комиссии для покупателя",
      "Подтверждение оплаты и фискальный чек — сразу в мессенджер",
    ],
  },
];

function PaymentCardItem({
  card,
  index,
  isActive,
  onToggle,
}: {
  card: PaymentCard;
  index: number;
  isActive: boolean;
  onToggle: () => void;
}) {
  const Icon = card.icon;

  return (
    <motion.div
      {...fadeUp(index * 0.07)}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      className={`group rounded-2xl border cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${
        isActive ? "border-opacity-100" : "border-zinc-800 hover:border-zinc-700 bg-zinc-900"
      }`}
      style={isActive ? { background: card.badgeBg, borderColor: card.badgeBorder } : undefined}
    >
      <div className="flex items-start gap-4 p-6 sm:p-7">
        <div
          className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border transition-colors duration-300 ${
            isActive ? "" : "bg-zinc-800 border-zinc-700/60"
          }`}
          style={
            isActive
              ? { background: card.badgeBg, borderColor: card.badgeBorder }
              : undefined
          }
        >
          <Icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? card.badgeColor : "text-zinc-400"}`} strokeWidth={1.75} />
        </div>

        <div className="flex-1 min-w-0">
          <span className={`text-[11px] font-mono tracking-[0.18em] uppercase transition-colors duration-300 ${isActive ? card.badgeColor : "text-zinc-600"}`}>
            {card.badge}
          </span>
          <h3 className="text-white font-semibold text-[16px] tracking-tight mt-1">{card.title}</h3>
          <p className="text-zinc-500 text-[14px] leading-relaxed mt-2 max-w-lg">{card.body}</p>
          {card.logos}
        </div>

        <motion.div
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="shrink-0 mt-1"
        >
          <svg className="w-4 h-4 text-zinc-600" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="overflow-hidden"
          >
            <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-0 pl-[4.75rem]">
              <div className="h-px mb-5" style={{ background: card.badgeBorder }} />
              <div className="flex flex-wrap gap-2 mb-5">
                {card.methods.map((m) => (
                  <span
                    key={m}
                    className="px-3 py-1 rounded-full text-xs font-medium border"
                    style={{ background: card.badgeBg, borderColor: card.badgeBorder, color: "rgba(228,228,231,0.9)" }}
                  >
                    {m}
                  </span>
                ))}
              </div>
              <ul className="flex flex-col gap-2">
                {card.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-zinc-400 text-[13px] leading-relaxed">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${card.badgeColor}`} strokeWidth={1.75} />
                    {h}
                  </li>
                ))}
              </ul>
              <Link
                href={PATHS.configurator}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 mt-5 text-sm font-medium text-white hover:text-zinc-300 transition-colors duration-200 group"
              >
                Перейти к заказу
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DeliverySection() {
  return (
    <motion.div
      key="delivery"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ ...sp }}
    >
      <div className="mb-10">
        <p className="text-zinc-700 text-[11px] font-mono tracking-[0.24em] uppercase mb-3">Доставка</p>
        <h2
          className="text-white font-semibold tracking-tighter leading-tight"
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
        >
          Профессиональная логистика
          <br className="hidden sm:block" /> и надёжность.
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {PRINCIPLES.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.label}
              {...fadeUp(i * 0.07)}
              className="flex flex-col gap-3 rounded-2xl border p-6"
              style={{ background: p.accent, borderColor: p.border }}
            >
              <Icon className={`w-6 h-6 ${p.text}`} strokeWidth={1.75} />
              <div>
                <p className={`font-semibold text-base ${p.text}`}>{p.label}</p>
                <p className="text-zinc-500 text-[13px] leading-relaxed mt-1">{p.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {DELIVERY_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              {...fadeUp(0.1 + i * 0.07)}
              className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-7 overflow-hidden hover:border-zinc-700 transition-colors duration-300"
            >
              <div
                className="absolute top-4 right-5 text-zinc-800 text-[10px] font-mono tracking-widest uppercase select-none pointer-events-none"
                aria-hidden
              >
                {card.tag}
              </div>
              <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center mb-5">
                <Icon className="w-5 h-5 text-zinc-400" strokeWidth={1.75} />
              </div>
              <h3 className="text-white font-semibold text-lg tracking-tight mb-3">{card.title}</h3>
              <p className="text-zinc-500 text-[15px] leading-relaxed">{card.body}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function PaymentSection() {
  const [activeId, setActiveId] = useState<string | null>("individuals");
  const toggle = (id: string) => setActiveId((prev) => (prev === id ? null : id));

  return (
    <motion.div
      key="payment"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ ...sp }}
    >
      <div className="mb-10">
        <p className="text-zinc-700 text-[11px] font-mono tracking-[0.24em] uppercase mb-3">Оплата</p>
        <h2
          className="text-white font-semibold tracking-tighter leading-tight mb-3"
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
        >
          Удобные способы расчёта.
        </h2>
        <p className="text-zinc-500 text-[15px] leading-relaxed max-w-xl">
          Стоимость КСД —{" "}
          <span className="text-white font-medium">
            {PRICE_PER_METER_RUB.toLocaleString("ru-RU")} ₽ за метр
          </span>{" "}
          — фиксирована. Оплата осуществляется в формате 100% предоплаты через эквайринг АО «ТБанк».
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        {PAYMENT_CARDS.map((card, i) => (
          <PaymentCardItem
            key={card.id}
            card={card}
            index={i}
            isActive={activeId === card.id}
            onToggle={() => toggle(card.id)}
          />
        ))}
      </div>

      <motion.div
        {...fadeUp(0.32)}
        className="flex items-start gap-5 rounded-2xl border border-emerald-800/40 bg-emerald-950/20 px-6 py-5"
      >
        <div className="w-11 h-11 rounded-xl bg-emerald-900/30 border border-emerald-700/40 flex items-center justify-center shrink-0">
          <Lock className="w-5 h-5 text-emerald-400" strokeWidth={1.75} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Receipt className="w-4 h-4 text-emerald-500" strokeWidth={1.75} />
            <p className="text-emerald-400 text-[11px] font-mono tracking-[0.18em] uppercase">
              Безопасность и фискальные документы
            </p>
          </div>
          <p className="text-zinc-400 text-[14px] sm:text-[15px] leading-relaxed">
            Все платежи проходят по{" "}
            <span className="text-white font-medium">зашифрованному протоколу TLS 1.3</span>.
            После каждой оплаты автоматически направляется{" "}
            <span className="text-white font-medium">электронный фискальный чек</span>{" "}
            на email или в мессенджер. Данные карты не хранятся на наших серверах.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ReturnsSection() {
  return (
    <motion.div
      {...fadeUp(0.05)}
      className="mt-16 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 space-y-5"
    >
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
          <RotateCcw className="w-4 h-4 text-zinc-400" strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-zinc-600 text-[10px] font-mono tracking-[0.2em] uppercase">ЗоЗПП</p>
          <h3 className="text-white font-semibold tracking-tight text-lg">Возврат и обмен</h3>
        </div>
      </div>
      <ul className="space-y-3 text-zinc-400 text-[14px] leading-relaxed">
        <li className="flex gap-2.5">
          <Scale className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" strokeWidth={1.75} />
          <span>
            Стандартные складские позиции надлежащего качества можно вернуть в течение{" "}
            <span className="text-zinc-200 font-medium">14 дней</span> с момента получения при
            сохранении товарного вида, упаковки и чека.
          </span>
        </li>
        <li className="flex gap-2.5">
          <Scale className="w-4 h-4 text-amber-600/80 shrink-0 mt-0.5" strokeWidth={1.75} />
          <span>
            Изделия по индивидуальному заказу (конфигуратор КСД) надлежащего качества{" "}
            <span className="text-amber-200/90 font-medium">не подлежат отказу</span> по п. 4 ст. 26.1
            Закона «О защите прав потребителей» — товар с индивидуально-определёнными свойствами.
          </span>
        </li>
        <li className="flex gap-2.5">
          <Scale className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" strokeWidth={1.75} />
          <span>
            Возврат денег — на тот же платёжный инструмент в течение{" "}
            <span className="text-zinc-200 font-medium">10 рабочих дней</span> после получения
            товара продавцом. Гарантия на КСД — {WARRANTY_YEARS} лет.
          </span>
        </li>
      </ul>
      <p className="text-zinc-600 text-xs leading-relaxed pt-1">
        Полные условия — в{" "}
        <Link href={PATHS.terms} className="text-zinc-400 underline underline-offset-2 hover:text-zinc-200">
          публичной оферте
        </Link>
        . Обработка персональных данных — в{" "}
        <Link href={PATHS.privacy} className="text-zinc-400 underline underline-offset-2 hover:text-zinc-200">
          политике конфиденциальности
        </Link>
        .
      </p>
    </motion.div>
  );
}

function TabBtn({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-[14px] font-medium transition-all duration-300 ${
        active
          ? "bg-white text-zinc-950"
          : "bg-transparent text-zinc-400 border border-zinc-700 hover:border-zinc-500 hover:text-zinc-200"
      }`}
    >
      <Icon className="w-4 h-4" strokeWidth={1.75} />
      {label}
    </button>
  );
}

export default function DeliveryPaymentClient() {
  const [tab, setTab] = useState<Tab>("delivery");

  return (
    <div className="min-h-screen bg-zinc-950 pt-24">
      <div className="max-w-4xl mx-auto py-24 px-6">

        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp }}
        >
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

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.04 }}
          className="text-zinc-700 text-[11px] font-mono tracking-[0.26em] uppercase mb-4"
        >
          Сервис
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.08 }}
          style={{ fontFamily: "var(--font-brand)" }}
          className="text-white font-black tracking-tighter leading-[1.01] text-4xl sm:text-5xl lg:text-[3.25rem] mb-4"
        >
          Доставка
          <span className="text-zinc-400"> и </span>
          Оплата.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.14 }}
          className="text-zinc-400 text-xl leading-relaxed mb-12 max-w-2xl"
        >
          Доставляем быстро и безопасно. Работаем только по безналичной 100% предоплате:
          онлайн-оплата картой, СБП или счёт для ИП и юридических лиц.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.2 }}
          className="flex items-center gap-3 mb-12"
        >
          <TabBtn active={tab === "delivery"} onClick={() => setTab("delivery")} icon={Truck} label="Доставка" />
          <TabBtn active={tab === "payment"} onClick={() => setTab("payment")} icon={CreditCard} label="Оплата" />
        </motion.div>

        <AnimatePresence mode="wait">
          {tab === "delivery" ? (
            <DeliverySection key="delivery" />
          ) : (
            <PaymentSection key="payment" />
          )}
        </AnimatePresence>

        <ReturnsSection />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...sp, delay: 0.1 }}
          className="mt-20 pt-12 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="flex-1">
            <p className="text-zinc-400 text-sm leading-relaxed">
              Остались вопросы по оплате или доставке в ваш регион?
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${CONTACTS.phoneTel}`}
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-950 rounded-full text-[14px] font-semibold hover:bg-zinc-100 transition-colors duration-200"
            >
              {CONTACTS.phoneDisplay}
            </a>
            <Link
              href={PATHS.configurator}
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 text-zinc-300 rounded-full text-[14px] font-medium hover:border-zinc-500 hover:text-white transition-colors duration-200"
            >
              Собрать заказ
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
