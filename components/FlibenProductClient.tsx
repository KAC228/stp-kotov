"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
  FLIBEN_CATEGORIES,
  formatRub,
  flibenCardImage,
  type FlibenProduct,
} from "@/constants/fliben-catalog";
import { FLIBEN_PARTNER_NOTE } from "@/constants/fliben-docs";
import { getSystemForCategory } from "@/constants/fliben-systems";
import { PATHS, FLIBEN_CATALOG_URL } from "@/constants/brand";
import FlibenAddToCartButton from "@/components/FlibenAddToCartButton";
import { CatalogProductPhoto } from "@/components/SitePhoto";

function resolveImg(src: string, large = false) {
  if (!src || src.startsWith("/")) return src;
  const resized = flibenCardImage(src);
  return large ? resized.replace("400x400", "800x800") : resized;
}

/** Описания поставщика считаются данными, а не доверенным HTML. */
function descriptionToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function ProductGallery({
  images,
  title,
  skipResize,
}: {
  images: string[];
  title: string;
  skipResize?: boolean;
}) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  if (!main) return null;

  return (
    <div className="space-y-3">
      <CatalogProductPhoto
        src={main}
        alt={title}
        frameClassName="rounded-2xl border border-zinc-800 aspect-square"
        large
        skipResize={skipResize}
        priority
      />
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative shrink-0 w-16 h-16 rounded-xl border overflow-hidden transition-colors ${
                i === active ? "border-cyan-400/50 ring-1 ring-cyan-400/30" : "border-zinc-800 hover:border-zinc-600"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={skipResize ? src : resolveImg(src)}
                alt=""
                className="absolute inset-0 w-full h-full object-contain p-1 site-photo-thumb"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FlibenProductClient({ product }: { product: FlibenProduct }) {
  const categoryLabel =
    FLIBEN_CATEGORIES.find((c) => c.id === product.category)?.label ?? "Каталог";
  const system = getSystemForCategory(product.category);
  const fullDescription = descriptionToText(product.descriptionHtml);
  const hasFullDescription = fullDescription.length > 0;

  return (
    <div className="min-h-screen bg-zinc-950 pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-14">
        <Link
          href={FLIBEN_CATALOG_URL}
          className="inline-flex items-center gap-2 text-zinc-500 text-sm hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          Каталог
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          <ProductGallery
            images={product.images}
            title={product.title}
            skipResize={product.sku === "60101"}
          />

          <div>
            <p className="text-zinc-600 text-[11px] font-mono tracking-wider mb-2">
              Арт. {product.sku} · {categoryLabel}
            </p>
            <h1 className="text-white font-semibold tracking-tight text-2xl sm:text-3xl lg:text-4xl leading-tight">
              {product.title}
            </h1>

            <div className="flex flex-wrap items-baseline gap-3 mt-6">
              <p className="text-white text-3xl font-semibold">{formatRub(product.priceRub)}</p>
              {product.priceOldRub != null && product.priceOldRub > product.priceRub && (
                <p className="text-zinc-600 text-lg line-through">{formatRub(product.priceOldRub)}</p>
              )}
            </div>
            <p className="text-zinc-500 text-sm mt-2">
              Цена с сайта производителя. Итоговая стоимость комплекта — по запросу.
            </p>

            {!hasFullDescription && (
              <p className="text-zinc-400 text-base leading-relaxed mt-6">{product.description}</p>
            )}

            {hasFullDescription && (
              <p className="text-zinc-400 text-base leading-relaxed mt-6 whitespace-pre-line">
                {fullDescription}
              </p>
            )}

            {product.characteristics.length > 0 && (
              <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                <p className="px-5 py-3 text-zinc-300 text-sm font-medium border-b border-zinc-800">
                  Характеристики
                </p>
                <dl className="divide-y divide-zinc-800">
                  {product.characteristics.map((row) => (
                    <div key={row.title} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-1 px-5 py-3">
                      <dt className="text-zinc-500 text-sm">{row.title}</dt>
                      <dd className="text-zinc-300 text-sm">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {system && !hasFullDescription && (
              <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                <p className="text-zinc-300 text-sm font-medium mb-2">{system.title}</p>
                <p className="text-zinc-500 text-sm leading-relaxed">{system.description}</p>
                <ul className="mt-3 space-y-1">
                  {system.highlights.map((h) => (
                    <li key={h} className="text-zinc-600 text-xs">· {h}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <FlibenAddToCartButton
                product={product}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-100 transition-colors"
              />
              <Link
                href={PATHS.certificates}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-zinc-700 text-zinc-300 text-sm hover:border-zinc-500 hover:text-white transition-colors"
              >
                Сертификаты
              </Link>
            </div>

            <p className="text-zinc-600 text-xs leading-relaxed mt-8">{FLIBEN_PARTNER_NOTE}</p>

            <a
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-zinc-600 text-xs mt-4 hover:text-zinc-400 transition-colors"
            >
              Источник данных: fliben.ru
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
