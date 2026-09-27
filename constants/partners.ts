export type Partner = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  website: string;
  phone?: string;
  phoneTel?: string;
  email?: string;
  address?: string;
  services?: readonly string[];
  /** Ссылки на каталог, BIM, сертификаты и т.п. */
  resources?: readonly { label: string; href: string }[];
  /** Внешняя ссылка на каталог партнёра */
  catalogUrl?: string;
};

export const PARTNERS: readonly Partner[] = [
  {
    id: "formfactor",
    name: "Формфактор",
    tagline: "Аддитивное производство и промышленный дизайн",
    description:
      "Цех серийной 3D-печати в Санкт-Петербурге. Партнёр СТП-КОТОВ по прототипированию, мелкосерийному производству деталей и инженерной поддержке — от сканирования и моделирования до готовых изделий.",
    logo: "/images/partners/formfactor.svg",
    website: "https://formfactor.spb.ru/",
    phone: "+7 (921) 322-24-87",
    phoneTel: "+79213222487",
    email: "mail@formfactor.spb.ru",
    address: "Санкт-Петербург, Фермское шоссе, 40",
    services: [
      "Серийная 3D-печать",
      "3D-сканирование",
      "Реверс-инжиниринг",
      "Промышленный дизайн",
    ],
  },
  {
    id: "fliben",
    name: "Fliben",
    tagline: "Системы вентиляции для дома и квартир",
    description:
      "Крупный производитель и интегратор современных систем вентиляции. Партнёр СТП-КОТОВ по комплексным решениям микроклимата — от проектирования и подбора оборудования до монтажа и пусконаладки на объекте.",
    logo: "/images/partners/fliben.svg",
    website: "https://fliben.ru/",
    phone: "8 800 550-16-52",
    phoneTel: "+78005501652",
    email: "info@fliben.ru",
    address: "Екатеринбург, ул. Павла Шаманова, 5/5",
    services: [
      "Гибкие воздуховоды",
      "Коллекторы Flat DN 75",
      "Воздуховоды Slim и Thermo Duct",
      "Приточно-вытяжные установки",
      "Проектирование и консалтинг",
    ],
    catalogUrl: "https://fliben.ru/catalog",
    resources: [
      { label: "Каталог на fliben.ru", href: "https://fliben.ru/catalog" },
      { label: "Сертификаты", href: "/certificates" },
      { label: "Партнёрская программа", href: "https://fliben.ru/partnership" },
    ],
  },
  {
    id: "magnetic",
    name: "Magnetic Light",
    tagline: "Магнитные трековые системы освещения",
    description:
      "Проектирование и поставка осветительных систем на магнитных шинопроводах. Партнёр СТП-КОТОВ по свету в связке с КСД и потолочными решениями — от светодизайна и комплектации до монтажа.",
    logo: "/images/partners/magnetic-black.svg",
    website: "https://magneticlight.ru/",
    phone: "+7 (921) 939-50-08",
    phoneTel: "+79219395008",
    email: "magnetic.light@ya.ru",
    address: "Санкт-Петербург",
    services: [
      "Магнитные треки и светильники",
      "Светодизайн и расчёт освещения",
      "Управление DALI / KNX",
      "Монтаж света и натяжных потолков",
    ],
    resources: [
      { label: "Сайт Magnetic Light", href: "https://magneticlight.ru/" },
      { label: "Каталог", href: "https://magneticlight.ru/catalog/" },
    ],
  },
] as const;
