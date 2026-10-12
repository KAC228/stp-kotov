"use client";

import { useMemo, useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import {
  CATALOG_KITS,
  KIT_CATEGORY_LABELS,
  type CatalogKit,
  type KitCategoryId,
  type KitLineDef,
  resolveKitLines,
} from "@/constants/catalog-kits";
import { useCart } from "@/context/CartContext";
import { kitLineToCart } from "@/lib/kit-cart";

const GRID_ORDER: KitCategoryId[] = [
  "terminals",
  "air",
  "monoblock",
  "fastening",
  "fittings",
  "lighting",
  "automation",
];

function groupByCategory(lines: KitLineDef[]) {
  const map = new Map<KitCategoryId, KitLineDef[]>();
  for (const line of lines) {
    const list = map.get(line.category) ?? [];
    list.push(line);
    map.set(line.category, list);
  }
  return GRID_ORDER.filter((id) => map.has(id)).map((id) => ({
    id,
    label: KIT_CATEGORY_LABELS[id],
    lines: map.get(id)!,
  }));
}

function KitCard({ kit }: { kit: CatalogKit }) {
  const { addItem, openCart } = useCart();
  const [ksdOptionId, setKsdOptionId] = useState(kit.ksdOptions[0]?.id ?? "a");
  const [added, setAdded] = useState(false);

  const displayLines = useMemo(
    () => resolveKitLines(kit, ksdOptionId),
    [kit, ksdOptionId]
  );
  const groups = useMemo(() => groupByCategory(displayLines), [displayLines]);
  const lineCount = displayLines.reduce((s, l) => s + l.quantity, 0);

  const handleBuy = () => {
    for (const line of displayLines) {
      const { product, size, quantity } = kitLineToCart(line, kit.id);
      addItem(product, size, quantity);
    }
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <article className="rounded-3xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
      <header className="px-6 sm:px-8 pt-7 pb-5 border-b border-zinc-800/80">
        <p className="ksd-shimmer-text text-[11px] font-mono tracking-[0.22em] uppercase mb-2 font-medium">
          Готовый комплект
        </p>
        <h2
          className="text-white font-semibold tracking-tight"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
        >
          {kit.title}{" "}
          <span className="ksd-shimmer-text--accent font-medium">
            {kit.areaLabel}
          </span>
        </h2>
        <p className="text-zinc-500 text-sm mt-2 max-w-2xl leading-relaxed">
          {kit.tagline}
        </p>
      </header>

      <div className="px-6 sm:px-8 py-5 border-b border-zinc-800/80 flex flex-wrap items-center gap-3">
        <span className="text-zinc-500 text-xs uppercase tracking-wider">
          Оконечные блоки
        </span>
        <div className="flex flex-wrap gap-2">
          {kit.ksdOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setKsdOptionId(opt.id)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                ksdOptionId === opt.id
                  ? "border-cyan-400/50 bg-cyan-950/40 text-cyan-200"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <span className="text-zinc-600 text-xs">или</span>
      </div>

      <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {groups.map((group) => {
          const span =
            group.id === "lighting"
              ? "sm:col-span-2 lg:col-span-2"
              : group.id === "terminals"
                ? "sm:col-span-2 lg:col-span-1"
                : "";
          return (
            <div
              key={group.id}
              className={`relative rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 sm:p-5 ${span}`}
            >
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[rgba(255,90,120,0.35)] to-transparent" />
              <p className="ksd-shimmer-text text-[10px] font-mono tracking-[0.18em] uppercase mb-3 font-medium">
                {group.label}
              </p>
              <ul className="space-y-2.5">
                {group.lines.map((line) => (
                  <li key={line.sku} className="text-[14px] leading-snug">
                    <span className="text-zinc-200">{line.name}</span>
                    <span className="text-cyan-400/80 font-medium ml-1.5">
                      ×{line.quantity}
                    </span>
                    {line.note ? (
                      <span className="block text-zinc-600 text-xs mt-0.5">
                        {line.note}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <footer className="px-6 sm:px-8 py-5 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-zinc-500 text-sm">
          В корзину уйдёт{" "}
          <span className="text-zinc-300 font-medium">{lineCount} поз.</span>
          {" · "}
          цена комплекта — скоро
        </p>
        <button
          type="button"
          onClick={handleBuy}
          className="ksd-shimmer inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-100 transition-colors"
        >
          {added ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" strokeWidth={2.25} />
              Добавлено
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" strokeWidth={1.75} />
              Купить комплект
            </>
          )}
        </button>
      </footer>
    </article>
  );
}

export default function CatalogKitsClient() {
  return (
    <div className="space-y-8">
      {CATALOG_KITS.map((kit) => (
        <KitCard key={kit.id} kit={kit} />
      ))}
    </div>
  );
}
