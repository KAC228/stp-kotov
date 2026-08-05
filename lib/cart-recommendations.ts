import type { FlibenProduct } from "@/constants/fliben-catalog";
import { FLIBEN_PRODUCTS } from "@/lib/fliben-products";
import type { CartItem } from "@/types";

export type CartRecContext =
  | "ksd"
  | "dn75"
  | "dn110"
  | "thermo"
  | "slim"
  | "flat"
  | "collectors"
  | "units"
  | "default";

export type CartRecommendationResult = {
  context: CartRecContext;
  subtitle: string;
  products: FlibenProduct[];
};

/** Якорные SKU по системам — реальные позиции из каталога Fliben. */
const POOLS: Record<Exclude<CartRecContext, "default" | "ksd">, string[]> = {
  dn75: ["60700", "60101", "60117"],
  dn110: ["70700", "70115", "70112"],
  thermo: ["FL-213295183642", "60140", "FL-591074581842"],
  slim: ["50101", "50100", "50106"],
  flat: ["30101", "60700", "60117"],
  collectors: ["60700", "60117", "60101"],
  units: ["30101", "60700", "60117"],
};

const SUBTITLES: Record<CartRecContext, string> = {
  ksd: "Для типовых подключений КСД",
  dn75: "К системе DN 75",
  dn110: "К системе DN 110",
  thermo: "К системе Termo Duct",
  slim: "К плоской системе Slim",
  flat: "К системе Flat DN 75",
  collectors: "К коллектору",
  units: "Старт распределительной сети",
  default: "Часто берут вместе",
};

const bySku = new Map(FLIBEN_PRODUCTS.map((p) => [p.sku, p]));

function cartSkus(items: CartItem[]): Set<string> {
  const skus = new Set<string>();
  for (const item of items) {
    const id = item.product.id;
    if (id.startsWith("fliben-")) {
      skus.add(id.slice("fliben-".length));
    }
  }
  return skus;
}

function textBlob(item: CartItem): string {
  return [
    item.product.id,
    item.product.name,
    item.product.shortName,
    item.product.description,
    item.selectedSize.connectionDiameter,
    item.selectedSize.dimensions,
    item.selectedSize.label,
  ]
    .join(" ")
    .toLowerCase();
}

function detectContext(items: CartItem[]): CartRecContext {
  const hasKsd = items.some((i) => !i.product.id.startsWith("fliben-"));
  const blobs = items.map(textBlob);
  const all = blobs.join(" ");

  if (/dn\s*110|110\/97|flex110/.test(all)) return "dn110";
  if (/termo\s*duct|thermo\s*duct/.test(all)) return "thermo";
  if (/slim|132\/32|внутриполь/.test(all)) return "slim";
  if (/\bflat\b|пластиков/.test(all)) return "flat";
  if (/установк|r-650|fliben-60001/.test(all)) return "units";
  if (/коллектор|распределитель/.test(all)) return "collectors";
  if (hasKsd) return "ksd";
  if (/dn\s*75|75\/63|flex75/.test(all)) return "dn75";
  return "default";
}

function poolFor(context: CartRecContext): string[] {
  if (context === "ksd" || context === "default") return POOLS.dn75;
  return POOLS[context];
}

/**
 * До 3 рекомендаций из каталога Fliben по составу корзины.
 * Уже добавленные SKU исключаются.
 */
export function getCartRecommendations(
  items: CartItem[],
  limit = 3
): CartRecommendationResult {
  if (items.length === 0) {
    return { context: "default", subtitle: SUBTITLES.default, products: [] };
  }

  const context = detectContext(items);
  const inCart = cartSkus(items);
  const products: FlibenProduct[] = [];

  for (const sku of poolFor(context)) {
    if (inCart.has(sku)) continue;
    const product = bySku.get(sku);
    if (!product) continue;
    products.push(product);
    if (products.length >= limit) break;
  }

  return {
    context,
    subtitle: SUBTITLES[context],
    products,
  };
}
