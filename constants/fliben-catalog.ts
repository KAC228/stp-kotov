export type FlibenCategoryId =
  | "all"
  | "units"
  | "flex75"
  | "flex110"
  | "slim"
  | "thermo"
  | "flat"
  | "collectors"
  | "accessories"
  | "adapters";

/** Разделы магазина Fliben (Tilda storepartuid) → наши фильтры */
export type FlibenStoreSectionId =
  | "units"
  | "flex75"
  | "flex110"
  | "slim"
  | "thermo"
  | "flat"
  | "collectors"
  | "accessories"
  | "adapters"
  | "diffusers"
  | "connectors"
  | "bends"
  | "silencers";

export type FlibenProductCharacteristic = {
  title: string;
  value: string;
};

export type FlibenProduct = {
  title: string;
  priceRub: number;
  priceOldRub?: number | null;
  sku: string;
  href: string;
  image: string;
  images: string[];
  category: FlibenCategoryId;
  /** Разделы fliben.ru, в которых товар числится (может быть несколько). */
  storeSections: FlibenStoreSectionId[];
  slug: string;
  /** Краткое описание для карточек каталога */
  description: string;
  /** Полное HTML-описание с fliben.ru */
  descriptionHtml: string;
  characteristics: FlibenProductCharacteristic[];
  uid?: string;
};

export type FlibenCategory = {
  id: FlibenCategoryId;
  label: string;
  shortLabel?: string;
};

export const FLIBEN_CATEGORIES: readonly FlibenCategory[] = [
  { id: "all", label: "Все позиции" },
  { id: "units", label: "Вентиляционные установки", shortLabel: "Установки" },
  { id: "flex75", label: "Гибкие воздуховоды DN 75", shortLabel: "DN 75" },
  { id: "flex110", label: "Гибкие воздуховоды DN 110", shortLabel: "DN 110" },
  { id: "slim", label: "Плоские воздуховоды Slim", shortLabel: "Slim" },
  { id: "thermo", label: "Бесшумные Termo Duct", shortLabel: "Termo Duct" },
  { id: "flat", label: "Система Flat DN 75", shortLabel: "Flat" },
  { id: "collectors", label: "Коллекторы", shortLabel: "Коллекторы" },
  { id: "adapters", label: "Адаптеры и диффузоры", shortLabel: "Адаптеры" },
  { id: "accessories", label: "Комплектующие", shortLabel: "Комплектующие" },
] as const;

export const FLIBEN_CATALOG_SOURCE = "https://fliben.ru/catalog" as const;

/**
 * ID разделов Tilda Store на fliben.ru.
 * Счётчики фильтров на сайте производителя берутся отсюда, а не из URL карточки.
 */
export const FLIBEN_STORE_SECTION_UIDS: Record<FlibenStoreSectionId, string> = {
  units: "859213350062",
  slim: "940124927902",
  thermo: "290181633572",
  flex75: "659999996092",
  flex110: "549204591122",
  flat: "276413894102",
  collectors: "258717992042",
  accessories: "367103182842",
  adapters: "764840203352",
  diffusers: "639637837152",
  connectors: "365733573482",
  bends: "268839319402",
  silencers: "575672003522",
};

/** Разделы каталога fliben.ru → наши фильтры (fallback по URL) */
const FLIBEN_PATH_CATEGORY: Record<string, Exclude<FlibenCategoryId, "all" | "adapters">> = {
  "ventilyacionnye-ustanovki": "units",
  "gibkie-vozdukhovody-dn75": "flex75",
  "gibkie-vozdukhovody-dn100": "flex110",
  "ploskie-vozdukhovody-slim": "slim",
  "besshumnye-vozdukhovody-termo-duct": "thermo",
  "sistema-flat-dn75": "flat",
  "kollektory-dlya-ventilyacii": "collectors",
  komplektuyushchie: "accessories",
};

const PRIMARY_SECTION_PRIORITY: readonly FlibenStoreSectionId[] = [
  "units",
  "thermo",
  "slim",
  "flat",
  "flex75",
  "flex110",
  "collectors",
  "adapters",
  "diffusers",
  "accessories",
  "connectors",
  "bends",
  "silencers",
] as const;

export function flibenCatalogPathSegment(href: string): string | null {
  try {
    const parts = new URL(href).pathname.split("/").filter(Boolean);
    // /catalog/{section}/tproduct/...
    if (parts[0] === "catalog" && parts[1] && parts[1] !== "tproduct") return parts[1];
  } catch {
    /* ignore */
  }
  return null;
}

function inferCategoryFromTitle(title: string): Exclude<FlibenCategoryId, "all"> {
  const t = title.toLowerCase();

  if (t.includes("termo duct") || t.includes("thermo duct")) return "thermo";
  if (
    t.includes("slim") ||
    t.includes("132/30") ||
    t.includes("132/32") ||
    t.includes("плоск") ||
    t.includes("внутриполь") ||
    t.includes("панель") ||
    t.includes("распределительная коробка")
  ) {
    return "slim";
  }
  if (t.includes("flat") || t.includes("пластиков")) return "flat";
  if (t.includes("установк") || t.includes("r-650") || t.includes("komfovent") || t.includes("systemair")) {
    return "units";
  }
  if (t.includes("коллектор") || t.includes("распределитель")) return "collectors";
  if (t.includes("адаптер") || t.includes("диффузор")) return "adapters";
  if (t.includes("dn 110") || t.includes("dn110") || t.includes("110/97")) return "flex110";
  if (
    /клипса|кольцо|нож|коннектор|отвод|муфта|тройник|клапан|заглушка|пластина|фиксатор|хомут|переходник|шумоглуш|фильтр|решётк/.test(
      t,
    )
  ) {
    return "accessories";
  }
  if (t.includes("гибк") || t.includes("dn 75") || t.includes("dn75") || t.includes("75/63")) {
    return "flex75";
  }

  return "accessories";
}

function sectionToCategory(section: FlibenStoreSectionId): Exclude<FlibenCategoryId, "all"> {
  if (section === "diffusers") return "adapters";
  if (section === "connectors" || section === "bends" || section === "silencers") {
    return "accessories";
  }
  return section;
}

/** Основная категория карточки по разделам Fliben (товар может быть в нескольких). */
export function primaryCategoryFromStoreSections(
  sections: readonly FlibenStoreSectionId[],
): Exclude<FlibenCategoryId, "all"> | null {
  if (!sections.length) return null;
  const set = new Set(sections);
  for (const section of PRIMARY_SECTION_PRIORITY) {
    if (set.has(section)) return sectionToCategory(section);
  }
  return null;
}

/**
 * Категория товара: разделы магазина Fliben → URL → эвристика по названию.
 */
export function inferFlibenCategory(
  title: string,
  href?: string,
  storeSections?: readonly FlibenStoreSectionId[],
): Exclude<FlibenCategoryId, "all"> {
  const fromSections = primaryCategoryFromStoreSections(storeSections ?? []);
  if (fromSections) return fromSections;

  if (href) {
    const segment = flibenCatalogPathSegment(href);
    if (segment && FLIBEN_PATH_CATEGORY[segment]) {
      return FLIBEN_PATH_CATEGORY[segment];
    }
  }
  return inferCategoryFromTitle(title);
}

function hasSection(
  product: Pick<FlibenProduct, "storeSections">,
  section: FlibenStoreSectionId,
): boolean {
  return product.storeSections?.includes(section) ?? false;
}

/**
 * Фильтры каталога как на fliben.ru: позиция может входить в несколько разделов
 * (например DN 75 + комплектующие).
 */
export function matchesFlibenCategory(
  product: Pick<FlibenProduct, "title" | "category" | "storeSections">,
  category: FlibenCategoryId,
): boolean {
  if (category === "all") return true;

  const sections = product.storeSections ?? [];
  if (sections.length > 0) {
    if (category === "adapters") {
      return hasSection(product, "adapters") || hasSection(product, "diffusers");
    }
    if (category === "accessories") {
      return hasSection(product, "accessories");
    }
    return hasSection(product, category as FlibenStoreSectionId);
  }

  // Fallback без storeSections (старые данные)
  if (category === "adapters") {
    return /адаптер|диффузор/i.test(product.title);
  }
  if (category === "collectors") {
    return (
      product.category === "collectors" ||
      /коллектор|распределитель/i.test(product.title)
    );
  }
  return product.category === category;
}

export function formatRub(price: number): string {
  return `${price.toLocaleString("ru-RU")} ₽`;
}

/** Превью для карточек каталога (локальные файлы — как есть, CDN — ресайз) */
export function flibenCardImage(url: string): string {
  if (!url || url.startsWith("/")) return url;
  return url
    .replace("/resizeb/x20/", "/resize/400x400/-/format/webp/")
    .replace("/resize/480x480/", "/resize/400x400/-/format/webp/");
}
