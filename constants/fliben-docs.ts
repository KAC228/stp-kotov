export type FlibenDocCategory = "catalog" | "certificate" | "technical" | "price";

export type FlibenDoc = {
  id: string;
  title: string;
  description: string;
  /** PDF на сайте — если есть */
  file?: string;
  /** Страницы документа картинками (когда PDF нет или нужен быстрый просмотр) */
  previewImages?: readonly string[];
  category: FlibenDocCategory;
  sizeMb: number;
};

export const FLIBEN_DOC_CATEGORIES: Record<
  FlibenDocCategory,
  { label: string; shortLabel: string }
> = {
  catalog: { label: "Каталоги", shortLabel: "Каталоги" },
  certificate: { label: "Сертификаты", shortLabel: "Сертификаты" },
  technical: { label: "Технические характеристики", shortLabel: "Тех. характеристики" },
  price: { label: "Прайс-листы", shortLabel: "Прайсы" },
};

/** PDF-материалы партнёра — хостятся на сайте СТП-КОТОВ */
export const FLIBEN_DOCS: readonly FlibenDoc[] = [
  {
    id: "catalog-light",
    title: "Каталог FLIBEN (light)",
    description:
      "Общий каталог систем вентиляции Fliben: воздуховоды, коллекторы, установки и комплектующие.",
    file: "/files/fliben/03_FLIBEN_Catalogue_light_.pdf",
    category: "catalog",
    sizeMb: 5.0,
  },
  {
    id: "catalog-sh500",
    title: "FLIBEN SH / 500 — каталог",
    description: "Каталог серии SH / 500 с описанием состава систем и типовых решений.",
    file: "/files/fliben/01_FLIBEN_SH___500_-_.pdf",
    category: "catalog",
    sizeMb: 5.6,
  },
  {
    id: "catalog-equipment",
    title: "Каталог вентиляционного оборудования FLIBEN",
    description: "Оборудование и комплектующие для приточно-вытяжных систем.",
    file: "/files/fliben/08_FLIBEN.pdf",
    category: "catalog",
    sizeMb: 1.2,
  },
  {
    id: "r-650-v",
    title: "Fliben R-650-V — описание установки",
    description: "Приточно-вытяжная установка R-650-V: характеристики, комплектация, монтаж.",
    file: "/files/fliben/02_Fliben_R-650-V_1_.pdf",
    category: "technical",
    sizeMb: 0.8,
  },
  {
    id: "thermoduct",
    title: "Termo Duct 125–250 — технические характеристики",
    description: "Бесшумные воздуховоды Termo Duct: габариты, акустика, область применения.",
    file: "/files/fliben/07_._ThermoDuct_125-250_.pdf",
    category: "technical",
    sizeMb: 0.7,
  },
  {
    id: "company-profile",
    title: "Fliben — о компании и продукции",
    description: "Профиль производителя, линейки продуктов и ключевые преимущества систем.",
    file: "/files/fliben/04_Fliben__.pdf",
    category: "catalog",
    sizeMb: 0.5,
  },
  {
    id: "isega-tuv",
    title: "Сертификаты ISEGA (TÜV)",
    description:
      "Сертификаты безопасности материалов для систем вентиляции жилых помещений.",
    file: "/files/fliben/06_ISEGA-_TUV_.pdf",
    category: "certificate",
    sizeMb: 1.4,
  },
  {
    id: "price-2026",
    title: "Прайс-лист Fliben (01.05.2026)",
    description: "Актуальные цены на продукцию партнёра. Для заказа через СТП-КОТОВ — уточняйте у менеджера.",
    file: "/files/fliben/05_-_Fliben_01.05.26__.pdf",
    category: "price",
    sizeMb: 0.5,
  },
] as const;

/** Только для страницы сертификатов — сканы без PDF */
export const FLIBEN_CERTIFICATE_SCANS: readonly FlibenDoc[] = [
  {
    id: "expert-opinion",
    title: "Экспертное заключение",
    description:
      "Заключение по безопасности и применимости материалов в системах вентиляции.",
    previewImages: [
      "/images/certificates/expert-opinion-1.png",
      "/images/certificates/expert-opinion-2.png",
      "/images/certificates/expert-opinion-3.png",
    ],
    category: "certificate",
    sizeMb: 0,
  },
];

export const FLIBEN_CERTIFICATE_DOCS: readonly FlibenDoc[] = [
  ...FLIBEN_DOCS.filter((doc) => doc.category === "certificate"),
  ...FLIBEN_CERTIFICATE_SCANS,
];

export const FLIBEN_PARTNER_NOTE =
  "СТП-КОТОВ — официальный партнёр Fliben. Материалы, каталоги и документы размещены на нашем сайте для удобства проектировщиков и монтажников. Подбор, комплектация и интеграция с КСД выполняются инженерами СТП-КОТОВ." as const;
