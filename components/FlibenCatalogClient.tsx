"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  Search,
} from "lucide-react";
import {
  FLIBEN_CATALOG_SOURCE,
  FLIBEN_CATEGORIES,
  formatRub,
  type FlibenCategoryId,
  type FlibenProduct,
} from "@/constants/fliben-catalog";
import { filterFlibenProducts } from "@/lib/fliben-products";
import { PATHS, FLIBEN_CATALOG_URL } from "@/constants/brand";
import { sitePath } from "@/lib/site-path";
import FlibenAddToCartButton from "@/components/FlibenAddToCartButton";
import { CatalogProductPhoto } from "@/components/SitePhoto";

type SortKey = "default" | "price-asc" | "price-desc" | "name";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "default", label: "Порядок: как в каталоге" },
  { value: "price-asc", label: "Цена: по возрастанию" },
  { value: "price-desc", label: "Цена: по убыванию" },
  { value: "name", label: "Название: А—Я" },
];

const CATALOG_TOOLBAR_INPUT =
  "w-full bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-cyan-400/15 transition-[border-color,box-shadow] duration-200";

function isFlibenCategoryId(value: string | null): value is FlibenCategoryId {
  return value != null && FLIBEN_CATEGORIES.some((category) => category.id === value);
}

function CatalogSortSelect({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (value: SortKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`${CATALOG_TOOLBAR_INPUT} flex items-center justify-between gap-3 px-4 py-3 text-left text-zinc-300 hover:border-zinc-700`}
      >
        <span className="truncate">{current.label}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-zinc-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          strokeWidth={1.75}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Сортировка каталога"
          className="absolute z-30 left-0 right-0 top-[calc(100%+0.5rem)] overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-[0_16px_48px_rgba(0,0,0,0.55)] py-1.5"
        >
          {SORT_OPTIONS.map((opt) => {
            const selected = opt.value === value;
            return (
              <li key={opt.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    selected
                      ? "bg-cyan-400/10 text-cyan-300"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function sortProducts(items: FlibenProduct[], sort: SortKey): FlibenProduct[] {
  const copy = [...items];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.priceRub - b.priceRub);
    case "price-desc":
      return copy.sort((a, b) => b.priceRub - a.priceRub);
    case "name":
      return copy.sort((a, b) => a.title.localeCompare(b.title, "ru"));
    default:
      return copy;
  }
}

export default function FlibenCatalogClient({
  products,
  backHref = PATHS.ourPartners,
  backLabel = "Наши партнёры",
  title = "Каталог Fliben",
  subtitle = "Системы вентиляции для дома и квартир: воздуховоды, коллекторы, установки и комплектующие. Цены и артикулы — как на сайте производителя.",
}: {
  products: FlibenProduct[];
  backHref?: string;
  backLabel?: string;
  title?: string;
  subtitle?: string;
}) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("cat");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FlibenCategoryId>(() =>
    isFlibenCategoryId(initialCategory) ? initialCategory : "all",
  );
  const [sort, setSort] = useState<SortKey>("default");

  const filtered = useMemo(
    () => sortProducts(filterFlibenProducts(products, query, category), sort),
    [products, query, category, sort]
  );

  /** Счётчики = сколько реально покажем при выборе фильтра (с учётом поиска). */
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<FlibenCategoryId, number>> = {};
    for (const cat of FLIBEN_CATEGORIES) {
      counts[cat.id] = filterFlibenProducts(products, query, cat.id).length;
    }
    return counts;
  }, [products, query]);

  return (
    <div className="min-h-screen bg-zinc-950 pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 lg:py-8 border-b border-zinc-800">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-zinc-500 text-sm hover:text-white transition-colors mb-5"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          {backLabel}
        </Link>
        <h1 className="text-white font-semibold tracking-tight text-2xl sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        <p className="text-zinc-500 text-sm sm:text-base leading-relaxed mt-3 max-w-3xl">
          {subtitle}
        </p>
        <p className="text-zinc-600 text-xs mt-2 leading-relaxed">
          *{" "}
          <a
            href={sitePath(PATHS.configurator)}
            className="text-cyan-400/80 hover:text-cyan-300 underline-offset-2 hover:underline"
          >
            перейти к выбору КСД
          </a>
          *
        </p>
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-10">
        <div className="flex flex-col gap-3 mb-6 lg:flex-row lg:items-center lg:gap-4">
          <div className="relative w-full min-w-0 lg:flex-1 lg:max-w-xl">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none"
              strokeWidth={1.75}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по названию или артикулу…"
              className={`${CATALOG_TOOLBAR_INPUT} pl-11 pr-4 py-3`}
            />
          </div>
          <div className="w-full lg:w-72 lg:shrink-0">
            <CatalogSortSelect value={sort} onChange={setSort} />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-thin">
          {FLIBEN_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] ?? 0;
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  active
                    ? "bg-cyan-400/10 border-cyan-400/40 text-cyan-300"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                }`}
              >
                {cat.shortLabel ?? cat.label}
                <span className="ml-1.5 text-xs opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-16 text-center">
            <p className="text-zinc-400">Ничего не найдено. Попробуйте другой запрос или категорию.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            {filtered.map((product) => (
              <motion.article
                key={product.uid ?? product.slug}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.35)] hover:border-cyan-400/30 hover:shadow-[0_16px_40px_rgba(0,0,0,0.45),0_0_24px_rgba(255,90,120,0.08)] transition-[box-shadow,border-color] duration-300 flex flex-col"
              >
                <Link
                  href={FLIBEN_CATALOG_URL}
                  className="block relative overflow-hidden"
                >
                  <CatalogProductPhoto
                    src={product.image}
                    alt={product.title}
                    frameClassName="aspect-[4/3]"
                    skipResize={product.sku === "60101"}
                  />
                </Link>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-zinc-600 text-[11px] font-mono tracking-wider mb-1">
                    Арт. {product.sku}
                  </p>
                  <h2 className="text-white text-[15px] font-medium leading-snug line-clamp-3 mb-2">
                    {product.title}
                  </h2>
                  <p className="text-zinc-600 text-xs leading-relaxed line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  <p className="text-white text-xl font-semibold tracking-tight mt-auto mb-4">
                    {formatRub(product.priceRub)}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link
                      href={FLIBEN_CATALOG_URL}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-sm hover:border-zinc-500 hover:text-white transition-colors"
                    >
                      Подробнее
                    </Link>
                    <FlibenAddToCartButton product={product} />
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        <p className="text-zinc-600 text-xs mt-10 leading-relaxed">
          Актуализация ассортимента —{" "}
          <a
            href={FLIBEN_CATALOG_SOURCE}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400/80 hover:text-cyan-300 underline-offset-2 hover:underline"
          >
            fliben.ru
          </a>
          . Заказ и комплектация с КСД — через СТП-КОТОВ.
        </p>
      </section>
    </div>
  );
}
