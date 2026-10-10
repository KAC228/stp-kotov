"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Magnet,
  Cpu,
  Ruler,
  Route,
  Shield,
  SlidersHorizontal,
  Package,
  Layers,
  ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Blocks,
  Plug,
} from "lucide-react";

// ─── data ──────────────────────────────────────────────────────────────────────

// Акцент палитры презентации (coral)
const CYAN_ACCENT = "rgba(255,90,120,0.14)";
const CYAN_BORDER = "rgba(255,90,120,0.32)";

const FEATURES = [
  {
    num: "01",
    icon: Layers,
    title: "Универсальность для любого потолка",
    desc: "Наша камера подходит для монтажа с любыми типами потолочных конструкций: идеально интегрируется в натяжные потолки; совместима с подвесными системами из гипсокартона (ГКЛ), включая одно- и двухслойные конструкции. Благодаря продуманной конструкции и универсальным креплениям, установка возможна в помещениях с любой сложностью потолка.",
    accent: CYAN_ACCENT,
    border: CYAN_BORDER,
  },
  {
    num: "02",
    icon: Zap,
    title: "Встроенный шинопровод",
    desc: "Уникальный встроенный шинопровод, который надёжно фиксируется на распределительных ламелях внутри корпуса. Это обеспечивает стабильную работу и функциональность, грамотное, равномерное распределение воздушного потока по всей поверхности щелевой решётки. Воздух выходит равномерно, что исключает появление «мёртвых зон» и сквозняков.",
    accent: CYAN_ACCENT,
    border: CYAN_BORDER,
  },
  {
    num: "03",
    icon: Cpu,
    title: "Запатентованная система крепежа",
    desc: "Данный модуль кардинально упрощает процесс монтажа камеры, делая его быстрым и безошибочным. Не нужно производить замеры. Достаточно отмерять по готовому шаблону необходимое место для положения теневого диффузора, не трогая саму камеру — это гарантирует идеальное позиционирование и исключает перекосы.",
    accent: CYAN_ACCENT,
    border: CYAN_BORDER,
  },
  {
    num: "04",
    icon: Magnet,
    title: "Магнитные трековые светильники",
    desc: "Светильник оснащён магнитным креплением для шинопровода. Это позволяет устанавливать осветительные приборы в любом удобном месте без сверления и дополнительных инструментов, гибко адаптировать освещение под дизайн-проект помещения.",
    accent: CYAN_ACCENT,
    border: CYAN_BORDER,
  },
  {
    num: "05",
    icon: Ruler,
    title: "Измерительная линейка",
    desc: "Линейка для корректировки по высоте позволяет точно настроить камеру под любые параметры потолка прямо в процессе монтажа.",
    accent: CYAN_ACCENT,
    border: CYAN_BORDER,
  },
  {
    num: "06",
    icon: Route,
    title: "Рельсы на корпусе",
    desc: "Обеспечивают уникальную простоту монтажа и последующего обслуживания.",
    accent: CYAN_ACCENT,
    border: CYAN_BORDER,
  },
  {
    num: "07",
    icon: SlidersHorizontal,
    title: "Дроссельная заслонка на каждом подводе",
    desc: "Позволяет точно регулировать воздушный поток под параметры конкретного помещения, обеспечивая идеальный микроклимат. Возможна бесшовная пристыковка к воздуховодам всех ведущих производителей.",
    accent: CYAN_ACCENT,
    border: CYAN_BORDER,
  },
  {
    num: "08",
    icon: Shield,
    title: "Идеальная геометрия на корпусе",
    desc: "Степень защиты IP44 — изделие защищено от влаги и пыли. Отсутствие сварных швов — идеальная геометрия и герметичность достигаются за счёт болтового соединения, что исключает температурные деформации.",
    accent: CYAN_ACCENT,
    border: CYAN_BORDER,
  },
  {
    num: "09",
    icon: Package,
    title: "Защита IP44 и точная геометрия",
    desc: "Степень защиты IP44 — изделие защищено от влаги и пыли. Точная геометрия нашей камеры гарантирует стабильные аэродинамические характеристики и предсказуемую работу системы вентиляции.",
    accent: CYAN_ACCENT,
    border: CYAN_BORDER,
  },
  {
    num: "10",
    icon: Crosshair,
    title: "Встроенный уровень нивелира",
    desc: "Нижняя часть камеры оснащена встроенным жидкостным уровнем нивелира. Это позволяет визуально контролировать горизонтальное положение камеры непосредственно во время установки.",
    accent: CYAN_ACCENT,
    border: CYAN_BORDER,
  },
  {
    num: "11",
    icon: Blocks,
    title: "Интуитивно понятная система крепления",
    desc: "Крепежный каркас камеры имеет заводскую разметку под установку анкеров. Отверстия на каркасе полностью продублированы и соосны с отверстиями на теневом диффузоре. Это решение превращает сложную процедуру в простую и быструю сборку по принципу «конструктора».",
    accent: CYAN_ACCENT,
    border: CYAN_BORDER,
  },
  {
    num: "12",
    icon: Plug,
    title: "Продуманный кабель-менеджмент",
    desc: "Этот модуль обеспечивает не только аккуратный внешний вид, но и безопасность, а также удобство обслуживания системы. Это значительно упрощает как первичный монтаж, так и последующее сервисное обслуживание.",
    accent: CYAN_ACCENT,
    border: CYAN_BORDER,
  },
] as const;

const PHOTOS_PER_CARD = 3;

// ─── lightbox ──────────────────────────────────────────────────────────────────

interface LightboxState {
  title: string;
  num: string;
  photoIdx: number;
  accent: string;
  border: string;
}

function Lightbox({
  item,
  onClose,
  onPrev,
  onNext,
}: {
  item: LightboxState;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  { e.preventDefault(); onPrev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); onNext(); }
      if (e.key === "Escape")     { e.preventDefault(); onClose(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onPrev, onNext, onClose]);

  const btnBase =
    "absolute top-1/2 -translate-y-1/2 z-20 w-4 h-4 sm:w-8 sm:h-8 flex items-center justify-center " +
    "rounded-full bg-zinc-900/80 border border-zinc-700 text-zinc-400 " +
    "hover:text-white hover:border-cyan-400/50 hover:shadow-[0_0_14px_rgba(255,90,120,0.50)] " +
    "will-change-[box-shadow] transition-all duration-200 focus-visible:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-cyan-400/60";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/92 backdrop-blur-md z-[200] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-colors z-20"
        aria-label="Закрыть"
      >
        <X className="w-4 h-4" strokeWidth={2} />
      </button>

      {/* Photo card */}
      <motion.div
        key={item.photoIdx}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1,    opacity: 1 }}
        exit={{    scale: 0.96, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 200 }}
        className="relative w-full max-w-3xl aspect-video rounded-2xl border flex flex-col items-center justify-center gap-4 overflow-hidden tech-feature-lightbox"
        style={{
          borderColor: item.border,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Prev / next — внутри рамки карточки */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className={`${btnBase} left-2 sm:left-3`}
          aria-label="Предыдущее фото"
        >
          <ChevronLeft className="w-[7px] h-[7px] sm:w-3.5 sm:h-3.5" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className={`${btnBase} right-2 sm:right-3`}
          aria-label="Следующее фото"
        >
          <ChevronRight className="w-[7px] h-[7px] sm:w-3.5 sm:h-3.5" strokeWidth={2.5} />
        </button>
        <ImageIcon className="w-14 h-14 text-zinc-700 relative z-10" strokeWidth={1.25} />
        <div className="text-center relative z-10">
          <p className="text-zinc-500 text-[11px] font-mono tracking-[0.26em] uppercase">
            Технология {item.num} · Фото {item.photoIdx + 1} / {PHOTOS_PER_CARD}
          </p>
          <p className="text-zinc-400 text-base font-medium mt-1.5">{item.title}</p>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {Array.from({ length: PHOTOS_PER_CARD }).map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-250"
              style={{
                width:  i === item.photoIdx ? "14px" : "6px",
                height: "6px",
                background: i === item.photoIdx
                  ? "rgba(255,90,120,0.90)"
                  : "rgba(255,255,255,0.30)",
                boxShadow: i === item.photoIdx
                  ? "0 0 8px rgba(255,90,120,0.7)"
                  : "none",
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── per-card photo slider ─────────────────────────────────────────────────────

function CardPhotoSlider({
  feature,
  onOpen,
}: {
  feature: (typeof FEATURES)[number];
  onOpen: (photoIdx: number) => void;
}) {
  const [idx, setIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i - 1 + PHOTOS_PER_CARD) % PHOTOS_PER_CARD);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i + 1) % PHOTOS_PER_CARD);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    touchDeltaX.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const onTouchEnd = () => {
    const delta = touchDeltaX.current;
    const threshold = 34;
    if (Math.abs(delta) > threshold) {
      setIdx((i) =>
        delta > 0
          ? (i - 1 + PHOTOS_PER_CARD) % PHOTOS_PER_CARD
          : (i + 1) % PHOTOS_PER_CARD
      );
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden ring-1 ring-zinc-700/60 tech-feature-photo-ring">
      {/* Clickable photo area */}
      <button
        type="button"
        onClick={() => onOpen(idx)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="tech-feature-photo absolute inset-0 flex flex-col items-center justify-center cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
        aria-label={`Открыть фото ${idx + 1}: ${feature.title}`}
      >
        {/* Grid texture */}
        <div
          aria-hidden
          className="tech-feature-photo-grid absolute inset-0 opacity-[0.03]"
        />
        <ImageIcon className="tech-feature-photo-icon w-6 h-6 text-zinc-700 relative z-10" strokeWidth={1.5} />
        <p className="tech-feature-photo-label text-zinc-600 text-[9px] font-mono tracking-[0.2em] uppercase relative z-10 mt-1.5">
          Фото {idx + 1} / {PHOTOS_PER_CARD}
        </p>
        {/* Watermark */}
        <span
          aria-hidden
          className="tech-feature-photo-num absolute bottom-1 right-2 font-black select-none leading-none pointer-events-none"
          style={{
            fontSize: "2.4rem",
            fontFamily: "var(--font-brand)",
          }}
        >
          {feature.num}
        </span>
      </button>

      {/* Prev arrow — always visible (opacity-80 at rest), full on hover */}
      <button
        type="button"
        onClick={prev}
        aria-label="Предыдущее фото"
        className="tech-feature-slider-nav absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-950/80 border border-zinc-600/60 text-zinc-300 opacity-80 hover:opacity-100 hover:text-cyan-400 hover:border-cyan-400/50 hover:shadow-[0_0_14px_rgba(255,90,120,0.55)] will-change-[box-shadow,opacity] transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={2.25} />
      </button>

      {/* Next arrow — always visible */}
      <button
        type="button"
        onClick={next}
        aria-label="Следующее фото"
        className="tech-feature-slider-nav absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-950/80 border border-zinc-600/60 text-zinc-300 opacity-80 hover:opacity-100 hover:text-cyan-400 hover:border-cyan-400/50 hover:shadow-[0_0_14px_rgba(255,90,120,0.55)] will-change-[box-shadow,opacity] transition-all duration-200"
      >
        <ChevronRight className="w-4 h-4" strokeWidth={2.25} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {Array.from({ length: PHOTOS_PER_CARD }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIdx(i);
            }}
            aria-label={`Фото ${i + 1}`}
            className="rounded-full transition-all duration-250"
            style={{
              width: i === idx ? "14px" : "6px",
              height: "6px",
              background:
                i === idx ? "rgba(255,90,120,0.90)" : "rgba(255,255,255,0.28)",
              boxShadow: i === idx ? "0 0 8px rgba(255,90,120,0.7)" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── main component ─────────────────────────────────────────────────────────────

const viewEase = "easeOut" as const;
const viewDuration = 0.5;
const headerTransition = { duration: viewDuration, ease: viewEase };

export default function TechFeatures() {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const openLightbox = useCallback(
    (f: (typeof FEATURES)[number], photoIdx: number) =>
      setLightbox({ title: f.title, num: f.num, photoIdx, accent: f.accent, border: f.border }),
    []
  );

  return (
    <section id="technologies" className="light-mesh-top bg-zinc-950 py-24 overflow-x-hidden scroll-mt-20">
      {/* Top divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent mb-20" />
      </div>

      {/* Section header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={headerTransition}
        >
          <p className="text-zinc-700 text-[11px] font-mono tracking-[0.24em] uppercase mb-3">
            Технологии
          </p>
          <h2
            className="text-white font-semibold tracking-tighter leading-none"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
          >
            Инженерная точность
            <br className="hidden sm:block" /> в каждом узле.
          </h2>
        </motion.div>
      </div>

      {/* ── Vertical cards list ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-6 items-start">
        {FEATURES.map((f, index) => {
          const Icon = f.icon;
          return (
            <motion.article
              key={f.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: viewDuration, ease: viewEase, delay: (index % 3) * 0.08 }}
              className="tech-feature-card w-full flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative isolate group hover:border-cyan-400/35 hover:shadow-[0_0_28px_rgba(255,90,120,0.22)] transition-[box-shadow,border-color,z-index] duration-300 z-0 hover:z-10"
            >
              {/* Glow overlay — identical pattern to InstallationClient cards */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none z-[1]"
                style={{
                  background: `radial-gradient(ellipse 55% 55% at 0% 0%, ${f.accent}, transparent)`,
                }}
              />

              {/* ── Photo slider ── */}
              <div className="p-3 pb-0 relative z-[2]">
                <CardPhotoSlider
                  feature={f}
                  onOpen={(photoIdx) => openLightbox(f, photoIdx)}
                />
              </div>

              {/* ── Text ── */}
              <div className="flex flex-col gap-2.5 p-5 pt-4 flex-1 relative z-[2]">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center border shrink-0"
                    style={{ background: f.accent, borderColor: f.border }}
                  >
                    <Icon className="w-3.5 h-3.5 text-zinc-300" strokeWidth={1.75} />
                  </div>
                  <span className="text-zinc-700 text-[9px] font-mono tracking-[0.2em] uppercase">
                    {f.num} / 12
                  </span>
                </div>

                <h3 className="text-white font-semibold text-[14px] leading-snug tracking-tight">
                  {f.title}
                </h3>
                <p className="text-zinc-500 text-[13px] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* ── Lightbox ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            item={lightbox}
            onClose={() => setLightbox(null)}
            onPrev={() =>
              setLightbox((lb) =>
                lb ? { ...lb, photoIdx: (lb.photoIdx - 1 + PHOTOS_PER_CARD) % PHOTOS_PER_CARD } : null
              )
            }
            onNext={() =>
              setLightbox((lb) =>
                lb ? { ...lb, photoIdx: (lb.photoIdx + 1) % PHOTOS_PER_CARD } : null
              )
            }
          />
        )}
      </AnimatePresence>
    </section>
  );
}
