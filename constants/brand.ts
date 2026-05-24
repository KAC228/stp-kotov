/**
 * Единый источник бренда и контактов СТП-КОТОВ.
 */
export const BRAND_NAME = "СТП-КОТОВ" as const;

export const SLOGAN =
  "Скрытые теневые потоки: там, где воздух становится искусством." as const;

/** Цена КСД: 50 000 ₽ за 1 погонный метр (тип потолка и врезки не увеличивают цену) */
export const PRICE_PER_METER_RUB = 50_000;

/** Гарантийный срок */
export const WARRANTY_YEARS = 25;

export const CONTACTS = {
  phoneDisplay: "+7 (800) 555-00-00",
  phoneTel: "+78005550000",
  email: "info@stp-kotov.ru",
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
  telegram: "https://t.me/stp_kotov",
  whatsapp: "https://wa.me/78005550000",
} as const;

export const PATHS = {
  home: "/",
  configurator: "/#configurator",
  contactsEngineer: "/contacts#engineer",
  installation: "/installation",
  partnership: "/partnership",
  delivery: "/delivery-payment",
  team: "/team",
  contacts: "/contacts",
  privacy: "/privacy",
  terms: "/terms",
} as const;

export type NavItem = { href: string; label: string; external?: boolean };

export const MAIN_NAV: NavItem[] = [
  { href: PATHS.configurator, label: "Каталог" },
  { href: PATHS.installation, label: "Монтаж" },
  { href: PATHS.partnership, label: "Партнёрство" },
  { href: PATHS.team, label: "Команда" },
  { href: PATHS.delivery, label: "Доставка и Оплата" },
  { href: PATHS.contacts, label: "Контакты" },
];
