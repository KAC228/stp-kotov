"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Ruler,
  ShoppingCart,
  Lightbulb,
  Lock,
  Box,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ConfiguratorQuotePayload, Product } from "@/types";
import { PATHS, PRICE_PER_METER_RUB, WARRANTY_YEARS } from "@/constants/brand";
import CustomSizeForm from "./CustomSizeForm";
import IdleInterceptor from "./IdleInterceptor";
import KsdEngineerViewer from "./KsdEngineerViewer";

// ─── types ─────────────────────────────────────────────────────────────────────

type CeilingType   = "stretch" | "gkl";
type LengthKey     = 500 | 1000 | 1500 | 2000 | "custom";
type HeightKey     = 85 | 105 | 110 | 125 | 145 | 155 | 160 | 185 | 225;
type ConnectionKey =
  | "flex75"
  | "flex90"
  | "flex110"
  | "flex125"
  | "flex160"
  | "flex200"
  | "rect204"
  | "rect100"
  | "rect132";
type TrackLightKey = "none" | "10cm" | "20cm" | "30cm";
type ColorKey      = "black" | "white";
type ExtColorKey   = "black" | "white" | "ral";
type PaintTypeKey  = "matte" | "gloss" | "moire";
type InDuctShape   = "round" | "rect";
type OutDuctSize   = "75" | "90" | "110" | "125" | "100x60" | "132x32" | "204x60";

// ─── static data ───────────────────────────────────────────────────────────────

const CEILING_OPTIONS: Array<{
  id: CeilingType; code: string; label: string; sublabel: string; desc: string;
}> = [
  {
    id: "stretch", code: "НП", label: "Натяжной потолок", sublabel: "Тип 1 — КСД-НП",
    desc: "КСД с фланцевым адаптером под натяжное полотно. Установка заподлицо.",
  },
  {
    id: "gkl", code: "ГКЛ", label: "ГКЛ / Гипсокартон", sublabel: "Тип 2 — КСД-ГКЛ",
    desc: "КСД с накладной рамкой под гипсокартонный потолок. Перекрывает зазор.",
  },
];

const LENGTH_OPTIONS: Array<{ id: Exclude<LengthKey, "custom">; label: string; price: number }> =
  ([500, 1000, 1500, 2000] as const).map((mm) => ({
    id: mm,
    label: `${mm} мм`,
    price: Math.round((mm / 1000) * PRICE_PER_METER_RUB),
  }));

const HEIGHT_OPTIONS: Array<{ id: HeightKey; label: string }> = [
  { id: 85,  label: "85 мм" },
  { id: 105, label: "105 мм" },
  { id: 110, label: "110 мм" },
  { id: 125, label: "125 мм" },
  { id: 145, label: "145 мм" },
  { id: 155, label: "155 мм" },
  { id: 160, label: "160 мм" },
  { id: 185, label: "185 мм" },
  { id: 225, label: "225 мм" },
];

const CONNECTION_OPTIONS: Array<{
  id: ConnectionKey; code: string; label: string; spec: string;
  shape: "sm" | "md" | "lg" | "rect" | "rect-sm" | "oval"; badge?: string;
  description: string;
}> = [
  {
    id: "rect204", code: "П204", label: "Прямоугольный", spec: "204 × 60",
    shape: "rect", badge: "Стандарт",
    description: "Плоский воздуховод Slim. Стандартное подключение КСД, высота сечения 60 мм.",
  },
  {
    id: "rect100", code: "П100", label: "Прямоугольный", spec: "100 × 60",
    shape: "rect-sm",
    description: "Узкий прямоугольник для компактных трасс. Высота сечения 60 мм — как у 204×60.",
  },
  {
    id: "rect132", code: "О132", label: "Овальный", spec: "132 × 32",
    shape: "oval",
    description: "Овальное сечение 132×32 мм — подходит для любой высоты КСД, удобно в плоских трассах.",
  },
  {
    id: "flex75", code: "Г075", label: "Гибкий", spec: "Ø 75 мм", shape: "sm",
    description: "Гибкий воздуховод DN 75 — для коротких отводов и сложной геометрии потолка.",
  },
  {
    id: "flex90", code: "Г090", label: "Гибкий", spec: "Ø 90 мм", shape: "lg",
    description: "Гибкий воздуховод DN 90 — повышенная пропускная способность при высоте КСД от 110 мм.",
  },
  {
    id: "flex110", code: "Г110", label: "Гибкий", spec: "Ø 110 мм", shape: "md",
    description: "Гибкий воздуховод DN 110 — доступен при высоте КСД от 145 мм.",
  },
  {
    id: "flex125", code: "Г125", label: "Гибкий", spec: "Ø 125 мм", shape: "lg",
    description: "Гибкий воздуховод DN 125 — только для КСД высотой 155 мм (максимальная конфигурация).",
  },
  {
    id: "flex160",
    code: "Г160",
    label: "Гибкий",
    spec: "Ø 160 мм",
    shape: "lg",
    description: "Гибкий воздуховод DN 160 — доступен для КСД высотой 185 мм и выше.",
  },
  {
    id: "flex200",
    code: "Г200",
    label: "Гибкий",
    spec: "Ø 200 мм",
    shape: "lg",
    description: "Гибкий воздуховод DN 200 — доступен только для КСД высотой 225 мм.",
  },
];

const TRACK_LIGHT_OPTIONS: Array<{ id: TrackLightKey; label: string; price: number }> = [
  { id: "none",  label: "Не нужен", price: 0      },
  { id: "10cm",  label: "10 см",    price: 5_000  },
  { id: "20cm",  label: "20 см",    price: 10_000 },
  { id: "30cm",  label: "30 см",    price: 15_000 },
];

/** Standard two-colour palette (used for collector) */
const COLOR_OPTIONS: Array<{ id: ColorKey; label: string; hex: string }> = [
  { id: "black", label: "Чёрный", hex: "#18181b" },
  { id: "white", label: "Белый",  hex: "#fafafa"  },
];

const PAINT_TYPE_OPTIONS: Array<{ id: PaintTypeKey; label: string }> = [
  { id: "matte", label: "Матовая" },
  { id: "gloss", label: "Глянец"  },
  { id: "moire", label: "Муар"    },
];

// 24 representative RAL colours
const RAL_COLORS = [
  { code: "RAL 9010", name: "Белый",                   hex: "#F4F4F4" },
  { code: "RAL 9016", name: "Транспортный белый",      hex: "#F7F6F1" },
  { code: "RAL 9003", name: "Сигнальный белый",        hex: "#ECECE7" },
  { code: "RAL 1013", name: "Жемчужно-белый",          hex: "#EAE5D7" },
  { code: "RAL 1015", name: "Слоновая кость",          hex: "#E9E0C8" },
  { code: "RAL 7044", name: "Шёлково-серый",           hex: "#B8B9AE" },
  { code: "RAL 7035", name: "Светло-серый",            hex: "#CBD0CC" },
  { code: "RAL 7037", name: "Пыльно-серый",            hex: "#7C7F7E" },
  { code: "RAL 7045", name: "Телегрей 1",              hex: "#8B9197" },
  { code: "RAL 7016", name: "Антрацит",                hex: "#3D4347" },
  { code: "RAL 9011", name: "Графитовый чёрный",       hex: "#1C1C1C" },
  { code: "RAL 9005", name: "Чёрный",                  hex: "#0E0E10" },
  { code: "RAL 5024", name: "Пастельно-синий",         hex: "#5D8EA2" },
  { code: "RAL 5015", name: "Небесно-синий",           hex: "#1F6494" },
  { code: "RAL 5002", name: "Ультрамарин",             hex: "#1A2D6B" },
  { code: "RAL 6034", name: "Пастельный бирюзовый",   hex: "#7FB9B3" },
  { code: "RAL 6018", name: "Жёлто-зелёный",          hex: "#4E8432" },
  { code: "RAL 6005", name: "Моховой зелёный",        hex: "#1B4A2A" },
  { code: "RAL 3020", name: "Транспортный красный",    hex: "#C1121C" },
  { code: "RAL 3000", name: "Огненно-красный",         hex: "#A52019" },
  { code: "RAL 2009", name: "Транспортный оранжевый",  hex: "#D55B00" },
  { code: "RAL 1003", name: "Сигнальный жёлтый",      hex: "#F9A800" },
  { code: "RAL 4005", name: "Голубая сирень",          hex: "#7C6F98" },
  { code: "RAL 8017", name: "Шоколадный коричневый",  hex: "#44261F" },
] as const;

// ─── height → available connections ────────────────────────────────────────────

function getAvailableConnections(h: HeightKey | null): Set<ConnectionKey> {
  const withOval = (keys: ConnectionKey[]) => new Set<ConnectionKey>([...keys, "rect132"]);
  if (h === 85)  return withOval(["rect204", "rect100"]);
  if (h === 105) return withOval(["rect204", "rect100", "flex75"]);
  if (h === 110) return withOval(["rect204", "rect100", "flex75", "flex90"]);
  if (h === 125) return withOval(["rect204", "rect100", "flex75", "flex90"]);
  if (h === 145) return withOval(["rect204", "rect100", "flex75", "flex90", "flex110"]);
  if (h === 155) return withOval(["rect204", "rect100", "flex75", "flex90", "flex110", "flex125"]);
  if (h === 160 || h === 185) return withOval(["rect204", "rect100", "flex75", "flex90", "flex110", "flex125", "flex160"]);
  if (h === 225) return withOval(["rect204", "rect100", "flex75", "flex90", "flex110", "flex125", "flex160", "flex200"]);
  return withOval(["rect204", "rect100", "flex75", "flex90", "flex110", "flex125"]);
}

function getConnectionRestrictionHint(h: HeightKey): string | null {
  switch (h) {
    case 85:
      return "Для высоты 85 мм доступны прямоугольные воздуховоды 204×60 и 100×60 (высота сечения 60 мм).";
    case 105:
      return "Для высоты 105 мм: прямоугольные 204×60, 100×60 и гибкий Ø 75 мм.";
    case 110:
      return "Для высоты 110 мм доступны гибкие Ø 75 и Ø 90 мм (максимум Ø 90).";
    case 125:
      return "Для высоты 125 мм: гибкие Ø 75 и Ø 90 мм. Овальное 132×32 — на любой высоте КСД.";
    case 145:
      return "Для высоты 145 мм доступны все сечения, кроме гибкого Ø 125 мм (нужна высота КСД 155 мм).";
    case 155:
      return null;
    case 160:
      return "Для высоты 160 мм: доступны все виды подключения, кроме гибкого Ø 200 мм.";
    case 185:
      return "Для высоты 185 мм: доступны все виды подключения, кроме гибкого Ø 200 мм.";
    case 225:
      return null;
  }
}

function connectionSpecLabel(c: ConnectionKey | null): string {
  if (c === "flex75") return "Ø 75 мм";
  if (c === "flex90") return "Ø 90 мм";
  if (c === "flex110") return "Ø 110 мм";
  if (c === "flex125") return "Ø 125 мм";
  if (c === "flex160") return "Ø 160 мм";
  if (c === "flex200") return "Ø 200 мм";
  if (c === "rect204") return "204×60 мм";
  if (c === "rect100") return "100×60 мм";
  if (c === "rect132") return "132×32 мм";
  return "—";
}

// ─── SKU builder ───────────────────────────────────────────────────────────────

function buildSKU(
  ceiling: CeilingType | null,
  length: LengthKey | null,
  height: HeightKey | null,
  connection: ConnectionKey | null,
): string {
  const c = ceiling === "stretch" ? "НП" : ceiling === "gkl" ? "ГКЛ" : "—";
  const l = length === "custom" ? "ИНД" : length ? String(length) : "—";
  const h = height ? `H${height}` : "—";
  const k = CONNECTION_OPTIONS.find((o) => o.id === connection)?.code ?? "—";
  return `КСД-${c}-${l}-${h}-${k}`;
}

// ─── SVG duct icons ─────────────────────────────────────────────────────────────

function DuctIcon({ shape }: { shape: "sm" | "md" | "lg" | "rect" | "rect-sm" | "oval" }) {
  if (shape === "rect") {
    return (
      <svg width="48" height="22" viewBox="0 0 48 22" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="46" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <rect x="5" y="5" width="38" height="12" rx="1.5" stroke="currentColor"
          strokeWidth="1" opacity="0.35" strokeDasharray="3 2" />
      </svg>
    );
  }
  if (shape === "rect-sm") {
    return (
      <svg width="36" height="22" viewBox="0 0 36 22" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="34" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <rect x="5" y="5" width="26" height="12" rx="1.5" stroke="currentColor"
          strokeWidth="1" opacity="0.35" strokeDasharray="3 2" />
      </svg>
    );
  }
  if (shape === "oval") {
    return (
      <svg width="52" height="24" viewBox="0 0 52 24" fill="none" aria-hidden="true">
        <ellipse cx="26" cy="12" rx="24" ry="10" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="26" cy="12" rx="17" ry="6" stroke="currentColor"
          strokeWidth="1" opacity="0.35" strokeDasharray="3 2" />
      </svg>
    );
  }
  const inner = shape === "lg" ? 9 : shape === "md" ? 8 : 7;
  const size = shape === "lg" ? 40 : shape === "md" ? 36 : 40;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 3} stroke="currentColor" strokeWidth="1.5" />
      <circle cx={size / 2} cy={size / 2} r={inner} stroke="currentColor"
        strokeWidth="1" opacity="0.35" strokeDasharray="3 2" />
    </svg>
  );
}

// ─── step label ────────────────────────────────────────────────────────────────

function StepLabel({ num, text, done, optional }: { num: string; text: string; done: boolean; optional?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-5 select-none">
      <span className={`font-mono text-xs tracking-[0.18em] shrink-0 transition-colors duration-300 ${
        done ? "text-emerald-500" : optional ? "text-zinc-700" : "text-zinc-600"
      }`}>
        {done ? "✓" : num}
      </span>
      <div className="flex-1 h-px bg-zinc-800" />
      <span className={`text-xs font-medium tracking-[0.14em] uppercase shrink-0 transition-colors duration-300 ${optional && !done ? "text-zinc-600" : "text-zinc-300"}`}>
        {text}
      </span>
      {optional && (
        <span className="text-[9px] font-mono tracking-[0.12em] text-zinc-700 uppercase shrink-0">
          необяз.
        </span>
      )}
      <div className="w-3 h-px bg-zinc-800" />
    </div>
  );
}

// ─── option tile ───────────────────────────────────────────────────────────────

function OptionTile({
  active, disabled = false, onClick, children, className = "",
}: {
  active: boolean; disabled?: boolean; onClick: () => void;
  children: React.ReactNode; className?: string;
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        relative w-full text-left rounded-2xl border transition-all duration-200
        will-change-[box-shadow]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60
        ${disabled
          ? "opacity-35 cursor-not-allowed bg-zinc-900/50 border-zinc-800/40"
          : active
            ? "bg-zinc-800 border-cyan-400/40 shadow-glow ring-2 ring-cyan-400/30"
            : "bg-zinc-900 border-zinc-800 hover:border-zinc-600 hover:bg-[#1c1c1e] hover:shadow-glow"
        }
        ${className}
      `}
    >
      {active && !disabled && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 340 }}
          className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-white flex items-center justify-center z-20 shadow-sm"
        >
          <Check className="w-3 h-3 text-zinc-950" strokeWidth={3} />
        </motion.div>
      )}
      {children}
    </button>
  );
}

// ─── shared input style ────────────────────────────────────────────────────────

const inputCls =
  "ksd-input w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white text-sm " +
  "placeholder-zinc-700 outline-none transition-all duration-200";

const labelCls = "text-zinc-600 text-[10px] font-mono tracking-[0.18em] uppercase";

// ─── RAL / extended colour picker ──────────────────────────────────────────────

function ColorPickerStep({
  value, paintType, ralCode,
  onChange, onPaintTypeChange, onRalChange,
}: {
  value: ExtColorKey | null;
  paintType: PaintTypeKey | null;
  ralCode: string | null;
  onChange: (v: ExtColorKey) => void;
  onPaintTypeChange: (v: PaintTypeKey) => void;
  onRalChange: (code: string) => void;
}) {
  const selectedRal = RAL_COLORS.find((c) => c.code === ralCode);

  return (
    <div>
      {/* Three main tiles: Black / White / By RAL */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Black */}
        <OptionTile active={value === "black"} onClick={() => onChange("black")}>
          <div className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 rounded-full shrink-0 border"
              style={{ background: "#18181b", borderColor: "rgba(255,255,255,0.1)" }} />
            <p className="text-white font-semibold text-[11px] sm:text-[13px] leading-tight whitespace-nowrap flex-shrink-0">
              Чёрный
            </p>
          </div>
        </OptionTile>

        {/* White */}
        <OptionTile active={value === "white"} onClick={() => onChange("white")}>
          <div className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 rounded-full shrink-0 border"
              style={{ background: "#fafafa", borderColor: "rgba(255,255,255,0.22)" }} />
            <p className="text-white font-semibold text-[11px] sm:text-[13px] leading-tight whitespace-nowrap flex-shrink-0">
              Белый
            </p>
          </div>
        </OptionTile>

        {/* RAL custom — full-width on mobile, single col on sm+ */}
        <OptionTile active={value === "ral"} onClick={() => onChange("ral")} className="col-span-2 sm:col-span-1">
          <div className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 rounded-full shrink-0 overflow-hidden"
              style={{
                background: "conic-gradient(from 0deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
                border: "1px solid rgba(255,255,255,0.1)",
              }} />
            <p className="text-white font-semibold text-[11px] sm:text-[13px] leading-tight whitespace-nowrap flex-shrink-0">
              По RAL
            </p>
          </div>
        </OptionTile>
      </div>

      {/* RAL sub-form */}
      <AnimatePresence>
        {value === "ral" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-4">

              {/* Paint type */}
              <div>
                <p className={`${labelCls} mb-2.5`}>Тип покрытия</p>
                <div className="flex gap-2 flex-wrap">
                  {PAINT_TYPE_OPTIONS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onPaintTypeChange(p.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 will-change-[box-shadow] ${
                        paintType === p.id
                          ? "bg-zinc-700 border-cyan-400/40 text-white shadow-glow ring-1 ring-cyan-400/25"
                          : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 hover:shadow-glow"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* RAL colour grid */}
              <div>
                <p className={`${labelCls} mb-2.5`}>Цвет RAL</p>
                <div className="flex flex-wrap gap-1.5">
                  {RAL_COLORS.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      title={`${c.code} — ${c.name}`}
                      aria-label={`${c.code} — ${c.name}`}
                      onClick={() => onRalChange(c.code)}
                      className={`w-8 h-8 rounded-lg shrink-0 transition-all duration-150 ${
                        ralCode === c.code
                          ? "ring-2 ring-white ring-offset-1 ring-offset-zinc-900 scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{
                        background: c.hex,
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    />
                  ))}
                </div>

                {/* Selected colour label */}
                {selectedRal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2.5 flex items-center gap-2"
                  >
                    <div className="w-4 h-4 rounded shrink-0"
                      style={{ background: selectedRal.hex, border: "1px solid rgba(255,255,255,0.1)" }} />
                    <p className="text-zinc-400 text-xs font-mono">
                      {selectedRal.code} — {selectedRal.name}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Info */}
              <div className="flex items-start gap-2 pt-1 border-t border-zinc-800">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <p className="text-zinc-600 text-[11px] leading-relaxed">
                  Цена на RAL-покрытие рассчитывается индивидуально — стоимость уточнит менеджер.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── animated price ────────────────────────────────────────────────────────────

function AnimatedPrice({ price, isCustom }: { price: number; isCustom: boolean }) {
  return (
    <div className="min-h-[3.8rem] flex items-end">
      <AnimatePresence mode="wait">
        {isCustom ? (
          <motion.p key="custom"
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className="text-[1.35rem] font-semibold text-zinc-100 tracking-tight leading-snug"
          >
            Стоимость<br />по запросу
          </motion.p>
        ) : price > 0 ? (
          <motion.div key={price}
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className="flex items-baseline gap-2"
          >
            <span className="text-[3rem] font-semibold text-white tracking-tighter leading-none">
              {price.toLocaleString("ru-RU")}
            </span>
            <span className="text-xl text-zinc-500 font-medium leading-none mb-1">₽</span>
          </motion.div>
        ) : (
          <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-zinc-700 text-sm pb-1">
            Выберите параметры
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── price panel ───────────────────────────────────────────────────────────────

function PricePanelContent({
  sku, currentPrice, basePrice, lightPrice,
  needsQuote, isComplete, added, onAdd, onOpenCustomForm, componentsHref,
}: {
  sku: string; currentPrice: number; basePrice: number; lightPrice: number;
  needsQuote: boolean; isComplete: boolean; added: boolean;
  onAdd: () => void; onOpenCustomForm: () => void; componentsHref: string;
}) {
  return (
    <div className="space-y-6">
      {/* SKU */}
      <div>
        <p className="text-zinc-700 text-[10px] font-mono tracking-[0.2em] uppercase mb-1.5">
          Артикул
        </p>
        <AnimatePresence mode="wait">
          <motion.p key={sku} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="text-zinc-400 text-xs font-mono tracking-wider">
            {sku}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Price */}
      <div>
        <p className="text-zinc-700 text-[10px] font-mono tracking-[0.2em] uppercase mb-2">
          Стоимость
        </p>
        <AnimatedPrice price={currentPrice} isCustom={needsQuote} />
        <AnimatePresence>
          {!needsQuote && currentPrice > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
              className="flex flex-col gap-1.5 mt-3 overflow-hidden"
            >
              {lightPrice > 0 && (
                <>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-600">Камера</span>
                    <span className="text-zinc-500 font-mono">{basePrice.toLocaleString("ru-RU")} ₽</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-600">Светильник</span>
                    <span className="text-zinc-500 font-mono">{lightPrice.toLocaleString("ru-RU")} ₽</span>
                  </div>
                </>
              )}
              <div className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-px" strokeWidth={2.5} />
                <p className="text-zinc-600 text-[11px] leading-snug">
                  Тип потолка и врезки включены в стоимость
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-px bg-zinc-800" />

      {/* CTA */}
      <div className="space-y-2">
        {needsQuote ? (
          <button type="button" onClick={onOpenCustomForm}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white text-zinc-950 rounded-2xl text-[15px] font-semibold hover:bg-zinc-100 hover:shadow-glow-strong will-change-[box-shadow] transition-all duration-200">
            <Ruler className="w-4 h-4" strokeWidth={2} />
            Рассчитать проект
          </button>
        ) : (
          <button onClick={onAdd} disabled={!isComplete}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[15px] font-semibold will-change-[box-shadow] transition-all duration-200 ${
              isComplete
                ? "bg-white text-zinc-950 hover:bg-zinc-100 hover:shadow-glow-strong"
                : "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800"
            }`}>
            <AnimatePresence mode="wait">
              <motion.span key={String(added)}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }} className="flex items-center gap-2">
                {added ? (
                  <><Check className="w-4 h-4" strokeWidth={2.5} />Добавлено в корзину</>
                ) : (
                  <><ShoppingCart className="w-4 h-4" strokeWidth={2} />Добавить в корзину</>
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        )}
        {!isComplete && !needsQuote && (
          <p className="text-zinc-700 text-xs text-center">Заполните все параметры</p>
        )}
        <p className="text-zinc-600 text-[11px] leading-relaxed text-center pt-2">
          *{" "}
          <a
            href={componentsHref}
            className="text-cyan-400/80 hover:text-cyan-300 underline-offset-2 hover:underline"
          >
            перейти к подбору компонентов
          </a>
          *
        </p>
      </div>
    </div>
  );
}

type ConfigMode = "standard" | "engineer";

// ─── main component ─────────────────────────────────────────────────────────────

export default function ProductConfigurator({ dark = false }: { dark?: boolean }) {
  const [configMode, setConfigMode] = useState<ConfigMode>("standard");
  const [mountPoints, setMountPoints] = useState<number[]>([]);

  // KSD params
  const [ceiling,    setCeiling]    = useState<CeilingType | null>(null);
  const [length,     setLength]     = useState<LengthKey | null>(null);
  const [height,     setHeight]     = useState<HeightKey | null>(null);
  const [connection, setConnection] = useState<ConnectionKey | null>(null);
  // Light
  const [trackLight, setTrackLight] = useState<TrackLightKey | null>(null);
  // KSD colour (ext: black / white / ral)
  const [ksdColor,     setKsdColor]     = useState<ExtColorKey | null>(null);
  const [ksdPaintType, setKsdPaintType] = useState<PaintTypeKey | null>(null);
  const [ksdRalCode,   setKsdRalCode]   = useState<string | null>(null);
  // Light colour
  const [lightColor,     setLightColor]     = useState<ExtColorKey | null>(null);
  const [lightPaintType, setLightPaintType] = useState<PaintTypeKey | null>(null);
  const [lightRalCode,   setLightRalCode]   = useState<string | null>(null);
  // Collector
  const [collectorEnabled,  setCollectorEnabled]  = useState(false);
  const [collectorColor,    setCollectorColor]    = useState<ColorKey | null>(null);
  const [collectorLen,      setCollectorLen]      = useState("");
  const [collectorWidth,    setCollectorWidth]    = useState("");
  const [collectorHt,       setCollectorHt]       = useState("");
  const [inDuctShape,       setInDuctShape]       = useState<InDuctShape | null>(null);
  const [inDuctDiam,        setInDuctDiam]        = useState("");
  const [inDuctRectH,       setInDuctRectH]       = useState("");
  const [inDuctRectW,       setInDuctRectW]       = useState("");
  const [outDuctCount,      setOutDuctCount]      = useState("");
  const [outDuctSize,       setOutDuctSize]       = useState<OutDuctSize | null>(null);
  // UI
  const [added, setAdded] = useState(false);

  const { addItem, openCart, openOrderFormWithQuote } = useCart();

  /** Nudge the page down ~1.5 natural swipes — mobile only (< 1024 px). */
  const scrollNudge = () => {
    if (typeof window === "undefined" || window.innerWidth >= 1024) return;
    setTimeout(() => window.scrollBy({ top: Math.round(window.innerHeight * 0.45), behavior: "smooth" }), 80);
  };

  // ── derived ──────────────────────────────────────────────────────────────────

  const availableConnections = getAvailableConnections(height);
  const isCustomLength  = length === "custom";
  const lightSelected   = trackLight !== null && trackLight !== "none";

  const handleSetHeight = (h: HeightKey) => {
    setHeight(h);
    if (connection && !getAvailableConnections(h).has(connection)) setConnection(null);
    scrollNudge();
  };

  const ksdColorDone =
    ksdColor !== null &&
    (ksdColor !== "ral" || (ksdPaintType !== null && ksdRalCode !== null));

  const lightColorDone =
    !lightSelected ||
    (lightColor !== null && (lightColor !== "ral" || (lightPaintType !== null && lightRalCode !== null)));

  // Any path that requires a quote instead of a fixed price
  const needsQuote =
    isCustomLength ||
    ksdColor === "ral" ||
    (lightSelected && lightColor === "ral") ||
    collectorEnabled;

  const basePrice =
    !needsQuote && typeof length === "number"
      ? LENGTH_OPTIONS.find((o) => o.id === length)?.price ?? 0
      : 0;
  const lightPrice =
    !needsQuote && trackLight
      ? TRACK_LIGHT_OPTIONS.find((o) => o.id === trackLight)?.price ?? 0
      : 0;
  const currentPrice = basePrice + lightPrice;
  const sku = buildSKU(ceiling, length, height, connection);

  const isComplete =
    ceiling !== null &&
    length  !== null &&
    (isCustomLength || (
      height      !== null &&
      connection  !== null &&
      trackLight  !== null &&
      ksdColorDone &&
      lightColorDone
    ));

  // ── step progress (for mobile sticky bar) ────────────────────────────────

  const totalSteps = isCustomLength ? 2 : 7;
  const doneSteps  = isCustomLength
    ? [ceiling !== null, length !== null].filter(Boolean).length
    : [
        ceiling    !== null,
        length     !== null,
        height     !== null,
        connection !== null,
        trackLight !== null,
        ksdColorDone,
        lightColorDone,
      ].filter(Boolean).length;
  const currentStep = Math.min(doneSteps + 1, totalSteps);

  // ── cart handler ─────────────────────────────────────────────────────────────

  const handleAddToCart = () => {
    if (!isComplete || needsQuote) return;

    const connLabel = connectionSpecLabel(connection);

    const lightOpt   = TRACK_LIGHT_OPTIONS.find((o) => o.id === trackLight);
    const lightLabel = trackLight === "none"
      ? "Без светильника"
      : `Трековый светильник ${lightOpt?.label ?? ""}`;

    const ksdColorLabel = ksdColor === "black" ? "Чёрный" : ksdColor === "white" ? "Белый" : "";
    const lightColorLabel = lightSelected && lightColor !== "ral"
      ? ` · Светильник ${lightColor === "black" ? "Чёрный" : "Белый"}`
      : "";

    const size = {
      id: sku,
      label: `${length} мм · ${height} мм · ${connLabel} · ${lightLabel} · КСД ${ksdColorLabel}${lightColorLabel}`,
      dimensions: `${length} мм`,
      connectionDiameter: connLabel,
      priceModifier: lightPrice,
    };

    const product: Product = {
      id: sku,
      name: `КСД ${ceiling === "stretch" ? "НП" : "ГКЛ"} ${length} мм`,
      shortName: sku,
      description: `${ceiling === "stretch" ? "Натяжной потолок" : "ГКЛ"} · ${length} мм · H${height} · ${connLabel} · ${lightLabel}`,
      fullDescription: "",
      basePrice,
      sizes: [size],
      features: [],
      stats: [],
    };

    addItem(product, size);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2500);
  };

  const openQuoteForm = () => {
    const connLabel = connectionSpecLabel(connection);
    const trackLabel = trackLight
      ? TRACK_LIGHT_OPTIONS.find((o) => o.id === trackLight)?.label ?? "—"
      : "—";
    const ksdColorLabel = ksdColor === "ral"
      ? `${ksdRalCode ?? "не выбран"} · ${PAINT_TYPE_OPTIONS.find((o) => o.id === ksdPaintType)?.label ?? "тип не выбран"}`
      : ksdColor === "black"
      ? "Чёрный"
      : ksdColor === "white"
      ? "Белый"
      : "—";
    const lightColorLabel = !lightSelected
      ? "Без светильника"
      : lightColor === "ral"
      ? `${lightRalCode ?? "не выбран"} · ${PAINT_TYPE_OPTIONS.find((o) => o.id === lightPaintType)?.label ?? "тип не выбран"}`
      : lightColor === "black"
      ? "Чёрный"
      : lightColor === "white"
      ? "Белый"
      : "—";

    const collectorInput = inDuctShape === "round"
      ? `Круглый Ø ${inDuctDiam || "—"} мм`
      : inDuctShape === "rect"
      ? `Прямоугольный ${inDuctRectW || "—"} × ${inDuctRectH || "—"} мм`
      : "—";
    const collectorOutput = outDuctSize === "204x60"
      ? "204×60 мм"
      : outDuctSize === "100x60"
      ? "100×60 мм"
      : outDuctSize === "132x32"
      ? "132×32 мм"
      : outDuctSize === "125"
      ? "Ø 125 мм"
      : outDuctSize === "110"
      ? "Ø 110 мм"
      : outDuctSize === "90"
      ? "Ø 90 мм"
      : outDuctSize === "75"
      ? "Ø 75 мм"
      : "—";

    const details: Record<string, string> = {
      "Артикул": sku,
      "Тип потолка": ceiling === "stretch" ? "Натяжной" : ceiling === "gkl" ? "ГКЛ" : "—",
      "Длина КСД": length === "custom" ? "Индивидуальная" : `${length ?? "—"} мм`,
      "Высота КСД": height ? `${height} мм` : "—",
      "Подключение": connLabel,
      "Светильник": trackLight === "none" ? "Не нужен" : `${trackLabel}`,
      "Цвет КСД": ksdColorLabel,
      "Цвет светильника": lightColorLabel,
      "Коллектор": collectorEnabled ? "Да (по запросу)" : "Нет",
      "Коллектор · цвет": collectorEnabled
        ? collectorColor === "black"
          ? "Чёрный"
          : collectorColor === "white"
          ? "Белый"
          : "—"
        : "—",
      "Коллектор · габариты": collectorEnabled
        ? `${collectorLen || "—"} × ${collectorWidth || "—"} × ${collectorHt || "—"} мм`
        : "—",
      "Коллектор · вход": collectorEnabled ? collectorInput : "—",
      "Коллектор · выход": collectorEnabled
        ? `${outDuctCount || "—"} шт., ${collectorOutput}`
        : "—",
      "Итог": needsQuote ? "По запросу" : `${currentPrice.toLocaleString("ru-RU")} ₽`,
      "Режим": configMode === "engineer" ? "Для инженеров" : "Стандарт",
      "Точки крепежа":
        configMode === "engineer" && mountPoints.length > 0
          ? mountPoints.map((mm) => `${mm} мм`).join(", ")
          : "—",
    };

    const payload: ConfiguratorQuotePayload = {
      sku,
      summary: `${details["Тип потолка"]} · ${details["Длина КСД"]} · ${details["Высота КСД"]} · ${details["Подключение"]}`,
      details,
    };

    openOrderFormWithQuote(payload);
  };

  // ── render ───────────────────────────────────────────────────────────────────

  return (
    <section
      className={`py-24 px-4 sm:px-6 lg:px-8 ${dark ? "bg-zinc-950" : "bg-[#fbfbfd]"}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-zinc-950 rounded-3xl border border-zinc-800 overflow-visible">
          <div className="flex flex-col lg:flex-row">

            {/* ── LEFT: steps ─────────────────────────────────────────────── */}
            <div className="flex-1 p-6 sm:p-8 lg:p-10 space-y-10 pb-28 lg:pb-10">

              {/* Режим: стандарт / инженер */}
              <div>
                <p className="text-zinc-600 text-[11px] font-mono tracking-[0.2em] uppercase mb-3">
                  Режим конфигурации
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <OptionTile
                    active={configMode === "standard"}
                    onClick={() => setConfigMode("standard")}
                  >
                    <div className="p-5">
                      <p className="text-white font-semibold text-[15px] tracking-tight mb-1">Стандарт</p>
                      <p className="text-zinc-600 text-xs leading-relaxed">
                        Пошаговый выбор типа, длины и опций — для заказа без 3D-сборки.
                      </p>
                    </div>
                  </OptionTile>
                  <OptionTile
                    active={configMode === "engineer"}
                    onClick={() => setConfigMode("engineer")}
                  >
                    <div className="p-5">
                      <p className="text-white font-semibold text-[15px] tracking-tight mb-1 pr-6">
                        Для инженеров
                      </p>
                      <p className="text-zinc-600 text-xs leading-relaxed">
                        3D-модель и расстановка крепежа по длине — задание на производство.
                      </p>
                    </div>
                  </OptionTile>
                </div>
              </div>

              {configMode === "engineer" && (
                <div className="lg:hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
                  <KsdEngineerViewer
                    lengthMm={typeof length === "number" ? length : null}
                    heightMm={height}
                    mountPoints={mountPoints}
                    onMountPointsChange={setMountPoints}
                  />
                </div>
              )}

              {/* STEP 01 — Тип потолка */}
              <div>
                <StepLabel num="01" text="Тип потолка" done={ceiling !== null} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CEILING_OPTIONS.map((opt) => (
                    <OptionTile
                      key={opt.id}
                      active={ceiling === opt.id}
                      onClick={() => { setCeiling(opt.id); scrollNudge(); }}
                    >
                      <div className="p-5">
                        <p className="text-white font-semibold text-[15px] tracking-tight mb-0.5 pr-7">{opt.label}</p>
                        <p className="text-zinc-600 text-[11px] font-mono mb-3">{opt.sublabel}</p>
                        <p className="text-zinc-600 text-xs leading-relaxed">{opt.desc}</p>
                      </div>
                    </OptionTile>
                  ))}
                </div>
              </div>

              {/* STEP 02 — Длина */}
              <div>
                <StepLabel num="02" text="Длина КСД" done={length !== null} />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {LENGTH_OPTIONS.map((opt) => (
                    <OptionTile
                      key={opt.id}
                      active={length === opt.id}
                      onClick={() => { setLength(opt.id); scrollNudge(); }}
                    >
                      <div className="py-5 px-4 text-center">
                        <p className="text-white font-semibold text-base tracking-tight">{opt.label}</p>
                        <p className="text-zinc-600 text-xs mt-1.5 font-mono">
                          {opt.price.toLocaleString("ru-RU")} ₽
                        </p>
                      </div>
                    </OptionTile>
                  ))}
                </div>
                <OptionTile
                  active={length === "custom"}
                  onClick={() => { setLength("custom"); scrollNudge(); }}
                  className="border-dashed"
                >
                  <div className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                      <Ruler className="w-4 h-4 text-zinc-400" strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-[15px] tracking-tight">Свой размер</p>
                      <p className="text-zinc-600 text-xs mt-0.5">Индивидуальный расчёт — ответим в течение 1 часа</p>
                    </div>
                  </div>
                </OptionTile>
              </div>

              {/* CustomSizeForm slides in when custom length selected */}
              <AnimatePresence>
                {isCustomLength && (
                  <motion.div
                    key="custom-size"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: "spring", damping: 28, stiffness: 260 }}
                  >
                    <CustomSizeForm />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Steps 03–07 + Collector — always visible, optional when custom size */}
              <div>
                    <motion.div
                      key="standard-steps"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-10"
                    >

                      {/* STEP 03 — Высота КСД */}
                      <div>
                        <StepLabel num="03" text="Высота КСД" done={height !== null} optional={isCustomLength} />
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                          {HEIGHT_OPTIONS.map((opt) => (
                            <OptionTile key={opt.id} active={height === opt.id} onClick={() => handleSetHeight(opt.id)}>
                              <div className="py-5 px-4 text-center">
                                <p className="text-white font-semibold text-base tracking-tight">{opt.label}</p>
                              </div>
                            </OptionTile>
                          ))}
                        </div>
                      </div>

                      {/* STEP 04 — Способ подключения */}
                      <div>
                        <StepLabel num="04" text="Способ подключения" done={connection !== null} optional={isCustomLength} />
                        <AnimatePresence>
                          {height !== null && getConnectionRestrictionHint(height) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="flex items-start gap-2.5 mb-4 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/50">
                                <Lock className="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5" strokeWidth={1.75} />
                                <p className="text-zinc-500 text-xs leading-relaxed">
                                  {getConnectionRestrictionHint(height)}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                          {CONNECTION_OPTIONS.map((opt) => {
                            const isAvailable = availableConnections.has(opt.id);
                            return (
                              <OptionTile
                                key={opt.id}
                                active={connection === opt.id}
                                disabled={!isAvailable}
                                onClick={() => { setConnection(opt.id); scrollNudge(); }}
                                className="h-full"
                              >
                                <div className="p-4 sm:p-5 flex flex-col h-full">
                                  <div className="h-7 flex items-center mb-3">
                                    {opt.badge && (
                                      <span className="px-2 py-0.5 bg-zinc-700/70 text-zinc-300 text-[10px] font-medium rounded-full border border-zinc-600/50">
                                        {opt.badge}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-center h-12 mb-4 text-zinc-500">
                                    <DuctIcon shape={opt.shape} />
                                  </div>
                                  <p className="text-white font-semibold text-[11px] sm:text-xs md:text-sm leading-tight text-center break-words whitespace-normal">
                                    {opt.label}
                                  </p>
                                  <p className="text-zinc-600 text-[10px] md:text-xs mt-0.5 font-mono text-center">{opt.spec}</p>
                                </div>
                              </OptionTile>
                            );
                          })}
                        </div>
                        {height !== null && (
                          <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
                            <p className="text-zinc-500 text-[11px] font-mono uppercase tracking-wider">
                              Виды воздуховодов
                            </p>
                            <ul className="space-y-2.5">
                              {CONNECTION_OPTIONS.filter((opt) => availableConnections.has(opt.id)).map((opt) => (
                                <li key={opt.id} className="text-xs leading-relaxed">
                                  <span className="text-zinc-300 font-medium">{opt.spec}</span>
                                  <span className="text-zinc-600"> — </span>
                                  <span className="text-zinc-500">{opt.description}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* STEP 05 — Трековый светильник */}
                      <div>
                        <StepLabel num="05" text="Трековый светильник" done={trackLight !== null} optional={isCustomLength} />
                        <div className="flex items-start gap-2.5 mb-4 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/50">
                          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" strokeWidth={1.75} />
                          <p className="text-zinc-500 text-xs leading-relaxed">
                            Магнитный трековый светильник фиксируется на встроенном шинопроводе без сверления — можно переставлять в любое место.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {TRACK_LIGHT_OPTIONS.map((opt) => (
                            <OptionTile
                              key={opt.id}
                              active={trackLight === opt.id}
                              onClick={() => {
                                setTrackLight(opt.id);
                                if (opt.id === "none") {
                                  setLightColor(null);
                                  setLightPaintType(null);
                                  setLightRalCode(null);
                                }
                                scrollNudge();
                              }}
                            >
                              <div className="py-5 px-3 text-center flex flex-col items-center gap-1.5">
                                {opt.id !== "none" && (
                                  <Lightbulb className={`w-5 h-5 mb-0.5 transition-colors ${trackLight === opt.id ? "text-amber-400" : "text-zinc-600"}`} strokeWidth={1.75} />
                                )}
                                <p className="text-white font-semibold text-sm tracking-tight leading-tight">{opt.label}</p>
                                <p className="text-xs font-mono mt-0.5 text-zinc-600">
                                  {opt.price === 0 ? "0 ₽" : `${opt.price.toLocaleString("ru-RU")} ₽`}
                                </p>
                              </div>
                            </OptionTile>
                          ))}
                        </div>
                      </div>

                      {/* STEP 06 — Цвет КСД */}
                      <div>
                        <StepLabel num="06" text="Цвет КСД" done={ksdColorDone} optional={isCustomLength} />
                        <ColorPickerStep
                          value={ksdColor}
                          paintType={ksdPaintType}
                          ralCode={ksdRalCode}
                          onChange={(v) => { setKsdColor(v); if (v !== "ral") { setKsdPaintType(null); setKsdRalCode(null); } }}
                          onPaintTypeChange={setKsdPaintType}
                          onRalChange={setKsdRalCode}
                        />
                      </div>

                      {/* STEP 07 — Цвет светильника (conditional) */}
                      <AnimatePresence>
                        {lightSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div>
                              <StepLabel num="07" text="Цвет светильника" done={lightColorDone} optional={isCustomLength} />
                              <ColorPickerStep
                                value={lightColor}
                                paintType={lightPaintType}
                                ralCode={lightRalCode}
                                onChange={(v) => { setLightColor(v); if (v !== "ral") { setLightPaintType(null); setLightRalCode(null); } }}
                                onPaintTypeChange={setLightPaintType}
                                onRalChange={setLightRalCode}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* ── COLLECTOR ──────────────────────────────────────── */}
                      <div>
                        {/* Divider */}
                        <div className="h-px bg-zinc-800 mb-8" />

                        {/* Toggle header */}
                        <button
                          type="button"
                          onClick={() => {
                            setCollectorEnabled((e) => !e);
                            if (collectorEnabled) {
                              setCollectorColor(null);
                              setCollectorLen("");
                              setCollectorWidth("");
                              setCollectorHt("");
                              setInDuctShape(null);
                              setInDuctDiam("");
                              setInDuctRectH("");
                              setInDuctRectW("");
                              setOutDuctCount("");
                              setOutDuctSize(null);
                            }
                          }}
                          className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-200 will-change-[box-shadow] ${
                            collectorEnabled
                              ? "bg-zinc-800 border-cyan-400/40 shadow-glow ring-1 ring-cyan-400/25"
                              : "bg-zinc-900 border-zinc-800 hover:border-zinc-600 hover:shadow-glow"
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                              collectorEnabled ? "bg-zinc-700 border-zinc-600" : "bg-zinc-800 border-zinc-700"
                            }`}>
                              <Box className="w-4 h-4 text-zinc-400" strokeWidth={1.75} />
                            </div>
                            <div className="text-left">
                              <p className="text-white font-semibold text-[15px] tracking-tight">Коллектор</p>
                              <p className="text-zinc-600 text-xs mt-0.5">
                                {collectorEnabled ? "Включён в заказ · цена по запросу" : "Опционально — добавить в заказ"}
                              </p>
                            </div>
                          </div>
                          {/* Toggle switch */}
                          <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                            collectorEnabled
                              ? "bg-cyan-500/70 shadow-[0_0_10px_rgba(0,210,255,0.45)]"
                              : "bg-zinc-800 border border-zinc-700"
                          }`}>
                            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${
                              collectorEnabled ? "left-[calc(100%-22px)]" : "left-0.5"
                            }`} />
                          </div>
                        </button>

                        {/* Collector form — animated expand */}
                        <AnimatePresence>
                          {collectorEnabled && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.28 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-6">

                                {/* Collector colour */}
                                <div>
                                  <p className={`${labelCls} mb-3`}>Цвет коллектора</p>
                                  <div className="grid grid-cols-2 gap-3">
                                    {COLOR_OPTIONS.map((opt) => (
                                      <OptionTile key={opt.id} active={collectorColor === opt.id}
                                        onClick={() => setCollectorColor(opt.id)}>
                                        <div className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3.5">
                                          <div className="w-7 h-7 rounded-full shrink-0 border"
                                            style={{ background: opt.hex, borderColor: opt.id === "white" ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.1)" }} />
                                          <p className="text-white font-semibold text-sm">{opt.label}</p>
                                        </div>
                                      </OptionTile>
                                    ))}
                                  </div>
                                </div>

                                {/* Dimensions */}
                                <div>
                                  <p className={`${labelCls} mb-3`}>Габариты, мм</p>
                                  <div className="grid grid-cols-3 gap-3">
                                    <div className="flex flex-col gap-1.5">
                                      <label className={labelCls}>Длина</label>
                                      <input type="number" min="0" value={collectorLen}
                                        onChange={(e) => setCollectorLen(e.target.value)}
                                        placeholder="мм" className={inputCls} />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <label className={labelCls}>Ширина</label>
                                      <input type="number" min="0" value={collectorWidth}
                                        onChange={(e) => setCollectorWidth(e.target.value)}
                                        placeholder="мм" className={inputCls} />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <label className={labelCls}>Высота</label>
                                      <input type="number" min="0" value={collectorHt}
                                        onChange={(e) => setCollectorHt(e.target.value)}
                                        placeholder="мм" className={inputCls} />
                                    </div>
                                  </div>
                                </div>

                                {/* Input duct */}
                                <div>
                                  <p className={`${labelCls} mb-3`}>Входной воздуховод</p>
                                  {/* Shape selector */}
                                  <div className="grid grid-cols-2 gap-3 mb-3">
                                    {(["round", "rect"] as InDuctShape[]).map((sh) => (
                                      <button
                                        key={sh}
                                        type="button"
                                        onClick={() => { setInDuctShape(sh); setInDuctDiam(""); setInDuctRectH(""); setInDuctRectW(""); }}
                                        className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200 will-change-[box-shadow] flex items-center justify-center gap-2 ${
                                          inDuctShape === sh
                                            ? "bg-zinc-800 border-cyan-400/40 text-white shadow-glow ring-1 ring-cyan-400/25"
                                            : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 hover:shadow-glow"
                                        }`}
                                      >
                                        {sh === "round" ? (
                                          <>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                                              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                                            </svg>
                                            <span className="text-[11px] sm:text-sm leading-tight">Круглое</span>
                                          </>
                                        ) : (
                                          <>
                                            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" className="shrink-0">
                                              <rect x="1" y="1" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                                            </svg>
                                            <span className="sm:hidden text-[11px] leading-tight">Прямоуг.</span>
                                            <span className="hidden sm:inline text-sm leading-tight">Прямоугольное</span>
                                          </>
                                        )}
                                      </button>
                                    ))}
                                  </div>

                                  {/* Conditional fields */}
                                  <AnimatePresence>
                                    {inDuctShape === "round" && (
                                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                        <div className="flex flex-col gap-1.5">
                                          <label className={labelCls}>Диаметр, мм</label>
                                          <input type="number" min="0" value={inDuctDiam}
                                            onChange={(e) => setInDuctDiam(e.target.value)}
                                            placeholder="напр. 200" className={inputCls} />
                                        </div>
                                      </motion.div>
                                    )}
                                    {inDuctShape === "rect" && (
                                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                        <div className="grid grid-cols-2 gap-3">
                                          <div className="flex flex-col gap-1.5">
                                            <label className={labelCls}>Высота, мм</label>
                                            <input type="number" min="0" value={inDuctRectH}
                                              onChange={(e) => setInDuctRectH(e.target.value)}
                                              placeholder="мм" className={inputCls} />
                                          </div>
                                          <div className="flex flex-col gap-1.5">
                                            <label className={labelCls}>Ширина, мм</label>
                                            <input type="number" min="0" value={inDuctRectW}
                                              onChange={(e) => setInDuctRectW(e.target.value)}
                                              placeholder="мм" className={inputCls} />
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>

                                {/* Output ducts */}
                                <div>
                                  <p className={`${labelCls} mb-3`}>Выходные воздуховоды</p>
                                  <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div className="flex flex-col gap-1.5">
                                      <label className={labelCls}>Количество</label>
                                      <input type="number" min="1" max="20" value={outDuctCount}
                                        onChange={(e) => setOutDuctCount(e.target.value)}
                                        placeholder="шт." className={inputCls} />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <label className={labelCls}>Сечение</label>
                                      {/* Styled select via relative wrapper */}
                                      <div className="relative">
                                        <select
                                          value={outDuctSize ?? ""}
                                          onChange={(e) => setOutDuctSize(e.target.value as OutDuctSize || null)}
                                          className={`${inputCls} pr-8 appearance-none cursor-pointer`}
                                        >
                                          <option value="" disabled>Выбрать…</option>
                                          <option value="75">Ø 75 мм</option>
                                          <option value="90">Ø 90 мм</option>
                                          <option value="110">Ø 110 мм</option>
                                          <option value="125">Ø 125 мм</option>
                                          <option value="100x60">100 × 60 мм</option>
                                          <option value="132x32">132 × 32 мм</option>
                                          <option value="204x60">204 × 60 мм</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" strokeWidth={2} />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Info notice */}
                                <div className="flex items-start gap-2.5 pt-1 border-t border-zinc-800">
                                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0 mt-1.5" />
                                  <p className="text-zinc-600 text-[11px] leading-relaxed">
                                    Стоимость коллектора рассчитывается индивидуально — цена будет указана в коммерческом предложении.
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                    </motion.div>
              </div>

            </div>

            {/* ── RIGHT: sticky price panel / 3D ───────────────────────────── */}
            <div className="hidden lg:block w-80 xl:w-96 shrink-0 border-l border-zinc-800">
              <div className="sticky top-20 p-6 xl:p-8 min-h-[320px]">
                {configMode === "engineer" ? (
                  <KsdEngineerViewer
                    lengthMm={typeof length === "number" ? length : null}
                    heightMm={height}
                    mountPoints={mountPoints}
                    onMountPointsChange={setMountPoints}
                  />
                ) : null}
                <div className={configMode === "engineer" ? "mt-6 pt-6 border-t border-zinc-800" : ""}>
                  <PricePanelContent
                    sku={sku}
                    currentPrice={currentPrice}
                    basePrice={basePrice}
                    lightPrice={lightPrice}
                    needsQuote={needsQuote}
                    isComplete={isComplete}
                    added={added}
                    onAdd={handleAddToCart}
                    onOpenCustomForm={openQuoteForm}
                    componentsHref={PATHS.catalog}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guarantee badge */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ type: "spring", damping: 28, stiffness: 140, delay: 0.1 }}
        className="mt-6 flex items-center justify-center"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-zinc-800 bg-zinc-900/60">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2.5} />
          <span className="text-zinc-300 text-sm font-medium tracking-wide">
            Гарантия <span className="text-white font-bold">{WARRANTY_YEARS} лет</span> на все изделия
          </span>
        </div>
      </motion.div>

      {/* ── Idle Interceptor — fires whenever user is in the configurator ── */}
      <IdleInterceptor
        active={ceiling !== null}
        idleMs={12_000}
      />

      {/* ── MOBILE: sticky bottom bar ─────────────────────────────────────────── */}
      <AnimatePresence>
        {ceiling !== null && (
          <motion.div
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-zinc-950/80 border-t border-zinc-800 px-4 pt-3 pb-4"
          >
            <div className="flex items-center gap-3 max-w-lg mx-auto">
              {/* Left side: progress + price */}
              <div className="flex-1 min-w-0">
                {/* Step progress */}
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-zinc-600 text-[9px] font-mono tracking-[0.18em] uppercase shrink-0">
                    Шаг {currentStep} из {totalSteps}
                  </p>
                  <div className="flex-1 h-px bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-cyan-500/70 rounded-full"
                      initial={false}
                      animate={{ width: `${(doneSteps / totalSteps) * 100}%` }}
                      transition={{ type: "spring", damping: 28, stiffness: 200 }}
                    />
                  </div>
                </div>
                {/* Price */}
                <AnimatePresence mode="wait">
                  {needsQuote ? (
                    <motion.span key="quote" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-white text-base font-semibold">По запросу</motion.span>
                  ) : currentPrice > 0 ? (
                    <motion.span key={currentPrice}
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                      transition={{ type: "spring", damping: 28, stiffness: 280 }}
                      className="block text-white text-xl font-semibold tracking-tighter leading-tight">
                      {currentPrice.toLocaleString("ru-RU")} ₽
                    </motion.span>
                  ) : (
                    <span className="text-zinc-700 text-xs">Выберите параметры</span>
                  )}
                </AnimatePresence>
                <p className="text-zinc-700 text-[10px] leading-tight mt-1.5">
                  *{" "}
                  <a
                    href={PATHS.catalog}
                    className="text-cyan-400/80 hover:text-cyan-300 underline-offset-2 hover:underline"
                  >
                    перейти к подбору компонентов
                  </a>
                  *
                </p>
              </div>

              {/* Right side: CTA button */}
              <AnimatePresence mode="wait">
                {needsQuote ? (
                  <motion.div key="request"
                    initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                    className="shrink-0">
                    <button type="button" onClick={openQuoteForm}
                      className="flex items-center gap-2 px-5 py-3 bg-white text-zinc-950 rounded-2xl text-sm font-semibold hover:shadow-glow-strong will-change-[box-shadow] transition-all duration-200">
                      <Ruler className="w-3.5 h-3.5" strokeWidth={2} />
                      Рассчитать
                    </button>
                  </motion.div>
                ) : (
                  <motion.button key="add" onClick={handleAddToCart} disabled={!isComplete}
                    initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold shrink-0 will-change-[box-shadow] transition-all duration-200 ${
                      isComplete ? "bg-white text-zinc-950 hover:shadow-glow-strong" : "bg-zinc-900 text-zinc-600 border border-zinc-800"
                    }`}>
                    {added ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : <ShoppingCart className="w-3.5 h-3.5" strokeWidth={2} />}
                    {added ? "Добавлено" : "В корзину"}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
