import rawProducts from "@/data/fliben-products.json";
import {
  inferFlibenCategory,
  matchesFlibenCategory,
  type FlibenCategoryId,
  type FlibenProduct,
  type FlibenProductCharacteristic,
  type FlibenStoreSectionId,
} from "@/constants/fliben-catalog";
import { getSystemForCategory } from "@/constants/fliben-systems";
import { TBANK_TEST_PRODUCT, TBANK_TEST_PRODUCT_ENABLED } from "@/constants/tbank-test-product";

type RawProduct = {
  uid?: string;
  title: string;
  priceRub: number;
  priceOldRub?: number | null;
  sku: string;
  href: string;
  image: string;
  images?: string[];
  excerpt?: string;
  descriptionHtml?: string;
  characteristics?: FlibenProductCharacteristic[];
  storeSections?: FlibenStoreSectionId[];
};

function flibenProductBaseSlug(href: string): string | undefined {
  const fromUrl = href.match(/tproduct\/\d+-(.+?)(?:\?|$)/)?.[1];
  return fromUrl;
}

export function flibenProductSlug(href: string, sku: string): string {
  const fromUrl = flibenProductBaseSlug(href);
  if (fromUrl) return `${fromUrl}-${sku}`;
  return `art-${sku}`;
}

function fallbackDescription(title: string, category: FlibenCategoryId): string {
  const system = getSystemForCategory(category);
  if (system) {
    return `${title}. ${system.summary} Продукция официального партнёра Fliben — поставка и подбор через СТП-КОТОВ.`;
  }
  if (category === "adapters") {
    return `${title}. Адаптеры и диффузоры для подключения воздуховодных систем Fliben к решёткам и коллекторам.`;
  }
  return `${title}. Комплектующие систем вентиляции Fliben — консультация и заказ через инженеров СТП-КОТОВ.`;
}

function enrichProduct(raw: RawProduct): FlibenProduct {
  const storeSections = raw.storeSections ?? [];
  const category = inferFlibenCategory(raw.title, raw.href, storeSections);
  const images = raw.images?.length ? raw.images : [raw.image];
  const descriptionHtml = raw.descriptionHtml ?? "";
  const excerpt = raw.excerpt?.trim() ?? "";
  const description = excerpt || fallbackDescription(raw.title, category);

  return {
    uid: raw.uid,
    title: raw.title,
    priceRub: raw.priceRub,
    priceOldRub: raw.priceOldRub ?? null,
    sku: raw.sku,
    href: raw.href,
    image: raw.image,
    images,
    category,
    storeSections,
    slug: flibenProductSlug(raw.href, raw.sku),
    description,
    descriptionHtml,
    characteristics: raw.characteristics ?? [],
  };
}

export const FLIBEN_PRODUCTS: FlibenProduct[] = [
  ...(TBANK_TEST_PRODUCT_ENABLED ? [TBANK_TEST_PRODUCT] : []),
  ...(rawProducts as RawProduct[]).map(enrichProduct),
];

export function getFlibenProductBySlug(slug: string): FlibenProduct | undefined {
  return FLIBEN_PRODUCTS.find((p) => p.slug === slug);
}

export function getAllFlibenProductSlugs(): string[] {
  return FLIBEN_PRODUCTS.map((p) => p.slug);
}

export function filterFlibenProducts(
  products: FlibenProduct[],
  query: string,
  category: FlibenCategoryId
): FlibenProduct[] {
  const q = query.trim().toLowerCase();
  return products.filter((p) => {
    if (!matchesFlibenCategory(p, category)) return false;
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.sku.includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.descriptionHtml.toLowerCase().includes(q)
    );
  });
}
