/**
 * Единый источник бренда и контактов СТП-КОТОВ.
 */
export const BRAND_NAME = "СТП-КОТОВ" as const;

export const SLOGAN =
  "Скрытые теневые потоки: там, где воздух становится искусством." as const;

/** Подзаголовок героя — дословно из ТЗ «корректировка 777» */
export const HERO_TAGLINE =
  "камеры статического давления нового поколения, матрица независимых контуров" as const;

/** @deprecated Цена 50 000 ₽/м снята с сайта по ТЗ; оставлено для внутренней совместимости расчётов */
export const PRICE_PER_METER_RUB = 0;

/** Гарантийный срок */
export const WARRANTY_YEARS = 25;

export const CONTACTS = {
  phoneDisplay: "+7 (911) 015-60-02",
  phoneTel: "+79110156002",
  email: "stp-kotov@yandex.ru",
  address: "385768, Россия, Респ. Адыгея, Майкопский р-н, х. Северо-Восточные Сады, ул. Ключевая, д. 3, кв. 2",
  hours: "Пн–Пт, 09:00 – 18:00",
} as const;

export const LEGAL = {
  /** Официальное наименование */
  companyShort: "ИП Пырсов А.Ю.",
  companyFull: "Индивидуальный предприниматель Пырсов Алексей Юрьевич",
  inn: "263411785805",
  /** ОГРНИП (не ОГРН) */
  ogrn: "326010000002149",
  ogrnLabel: "ОГРНИП",
  account: "40802810000009304687",
  bank: "АО «ТБанк»",
  bik: "044525974",
  corr: "30101810145250000974",
  /** КПП у ИП отсутствует */
  kpp: null as null,
} as const;

export const SITE_DOMAIN = "стп-котов.рф" as const;
export const SITE_URL = "https://стп-котов.рф" as const;

export const SOCIAL = {
  vk: "https://vk.com/stp_kotov",
  whatsapp: "https://wa.me/79110156002",
} as const;

/** Каталог Fliben на сайте производителя */
export const FLIBEN_CATALOG_URL = "https://fliben.ru/catalog" as const;

export const PATHS = {
  home: "/",
  configurator: "/#configurator",
  catalog: "/catalog",
  contactsEngineer: "/contacts#engineer",
  installation: "/installation",
  foreman: "/foreman",
  systemSolutions: "/#systems",
  partnership: "/partnership",
  ourPartners: "/our-partners",
  delivery: "/delivery-payment",
  team: "/team",
  contacts: "/contacts",
  articles: "/articles",
  projects: "/projects",
  certificates: "/certificates",
  privacy: "/privacy",
  cookies: "/cookies",
  terms: "/terms",
} as const;

export type NavItem = { href: string; label: string; external?: boolean };

/** Компактное меню в шапке — без переполнения на ноутбуках */
export const HEADER_NAV: NavItem[] = [
  { href: PATHS.configurator, label: "Конфигуратор" },
  { href: PATHS.catalog, label: "Каталог" },
  { href: PATHS.articles, label: "Статьи" },
  { href: PATHS.projects, label: "Типовые проекты" },
  { href: PATHS.systemSolutions, label: "Системные решения" },
  { href: PATHS.installation, label: "Монтаж" },
  { href: PATHS.foreman, label: "Прораб" },
  { href: PATHS.partnership, label: "Партнёрство" },
  { href: PATHS.ourPartners, label: "Наши партнёры" },
  { href: PATHS.team, label: "Команда" },
  { href: PATHS.certificates, label: "Сертификаты" },
  { href: PATHS.contacts, label: "Контакты" },
];

/** Полное меню — мобильная шторка и подвал */
export const MAIN_NAV: NavItem[] = [
  { href: PATHS.configurator, label: "Конфигуратор" },
  { href: PATHS.catalog, label: "Каталог" },
  { href: PATHS.articles, label: "Статьи" },
  { href: PATHS.projects, label: "Типовые проекты" },
  { href: PATHS.systemSolutions, label: "Системные решения" },
  { href: PATHS.installation, label: "Монтаж" },
  { href: PATHS.foreman, label: "Прораб" },
  { href: PATHS.partnership, label: "Партнёрство" },
  { href: PATHS.ourPartners, label: "Наши партнёры" },
  { href: PATHS.certificates, label: "Сертификаты" },
  { href: PATHS.team, label: "Команда" },
  { href: PATHS.delivery, label: "Доставка и оплата" },
  { href: PATHS.contacts, label: "Контакты" },
];
