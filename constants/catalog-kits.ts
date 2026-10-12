/**
 * Готовые комплекты СТП-КОТОВ для каталога.
 * Конфигуратор не трогаем — это отдельный путь «один клик → всё в корзину».
 * Цены пока 0: Илья подбьёт позже. Следующие комплекты (300/450) —
 * тот же шаблон, меняются серии моноблока и размер/кол-во КСД.
 */

export type KitCategoryId =
  | "terminals"
  | "air"
  | "monoblock"
  | "fastening"
  | "fittings"
  | "lighting"
  | "automation";

export const KIT_CATEGORY_LABELS: Record<KitCategoryId, string> = {
  terminals: "Оконечные блоки",
  air: "Воздухораспределение",
  monoblock: "Моноблок",
  fastening: "Система крепежа",
  fittings: "Фасонные элементы",
  lighting: "Система освещения",
  automation: "Автоматика",
};

export interface KitLineDef {
  /** Стабильный id позиции в корзине */
  sku: string;
  name: string;
  shortName: string;
  quantity: number;
  category: KitCategoryId;
  dimensions?: string;
  note?: string;
}

export interface KitKsdOption {
  id: string;
  label: string;
  lines: KitLineDef[];
}

export interface CatalogKit {
  id: string;
  title: string;
  areaLabel: string;
  areaMaxM2: number;
  /** Серия моноблока: 150 → дальше 300 / 450 */
  seriesCfm: number;
  tagline: string;
  ksdOptions: KitKsdOption[];
  sharedLines: KitLineDef[];
}

/** Комплект 1 — Метеор 150, до 85 м² (эскиз Ильи) */
export const KIT_01: CatalogKit = {
  id: "kit-01-meteor-150",
  title: "Комплект 1",
  areaLabel: "до 85 м²",
  areaMaxM2: 85,
  seriesCfm: 150,
  tagline:
    "Комплекс СТП-КОТОВ включает все компоненты для монтажа — ничего не нужно докупать. Собственное производство.",
  ksdOptions: [
    {
      id: "a",
      label: "Вариант А",
      lines: [
        {
          sku: "ksd-150-1000-105-gkl-np",
          name: "КСД 150×1000×105 (ГКЛ, НП)",
          shortName: "КСД 1000 НП",
          quantity: 2,
          category: "terminals",
          dimensions: "150×1000×105",
        },
        {
          sku: "ksd-150-500-105-gkl-ip",
          name: "КСД 150×500×105 (ГКЛ, ИП)",
          shortName: "КСД 500 ИП",
          quantity: 2,
          category: "terminals",
          dimensions: "150×500×105",
        },
      ],
    },
    {
      id: "b",
      label: "Вариант Б",
      lines: [
        {
          sku: "ksd-150-1500-105-gkl-np",
          name: "КСД 150×1500×105 (ГКЛ, НП)",
          shortName: "КСД 1500 НП",
          quantity: 2,
          category: "terminals",
          dimensions: "150×1500×105",
        },
        {
          sku: "ksd-mount-kit",
          name: "Комплект крепежа КСД",
          shortName: "Крепёж КСД",
          quantity: 1,
          category: "terminals",
        },
      ],
    },
  ],
  sharedLines: [
    {
      sku: "velvet-duct-75",
      name: "Гибкий воздуховод VELVET ø75",
      shortName: "VELVET ø75",
      quantity: 1,
      category: "air",
      dimensions: "ø75",
    },
    {
      sku: "meteor-150-85",
      name: "СТП-КОТОВ Метеор 150 до 85 м²",
      shortName: "Метеор 150",
      quantity: 1,
      category: "monoblock",
      note: "Моноблок",
    },
    {
      sku: "clip-multi-kit",
      name: "Клипса монтажная многофункциональная — монтажный комплект",
      shortName: "Клипсы",
      quantity: 1,
      category: "fastening",
      note: "1–50 шт в комплекте",
    },
    {
      sku: "shtil-150",
      name: "Шумоглушитель «СТП-КОТОВ ШТИЛЬ 150»",
      shortName: "ШТИЛЬ 150",
      quantity: 2,
      category: "fittings",
    },
    {
      sku: "grille-outdoor",
      name: "Решётки уличные СТП-КОТОВ",
      shortName: "Решётки",
      quantity: 2,
      category: "fittings",
    },
    {
      sku: "lamp-stp-kit",
      name: "Светильник СТП-КОТОВ (монтажный комплект)",
      shortName: "Светильник",
      quantity: 4,
      category: "lighting",
    },
    {
      sku: "remote-automation-kit",
      name: "Пульт (дублёр), провода, торра — 1 комплект",
      shortName: "Автоматика",
      quantity: 1,
      category: "automation",
    },
  ],
};

/** Все комплекты — добавлять сюда по тому же шаблону */
export const CATALOG_KITS: CatalogKit[] = [KIT_01];

export function resolveKitLines(
  kit: CatalogKit,
  ksdOptionId: string
): KitLineDef[] {
  const option =
    kit.ksdOptions.find((o) => o.id === ksdOptionId) ?? kit.ksdOptions[0];
  return [...option.lines, ...kit.sharedLines];
}
