import articlesData from "@/data/fliben-articles.json";
import typicalData from "@/data/fliben-typical-projects.json";
import guidesData from "@/data/fliben-installation-guides.json";

export type FlibenArticle = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  image: string | null;
  publishedAt: string | null;
};

export type FlibenTariff = {
  id: string;
  name: string;
  priceRub: number | null;
  description: string;
  ctaLabel: string;
  recommended: boolean;
};

export type FlibenTypicalProject = {
  areaSqm: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string | null;
  tariffs: FlibenTariff[];
};

export type FlibenInstallationGuide = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  image: string | null;
};

const PROJECT_DESCRIPTIONS: Record<number, string> = {
  100:
    "Готовое решение для одноэтажного частного дома: расчёт воздухообмена, приток свежего воздуха, вытяжка из технических зон и рекуперация тепла.",
  200:
    "Инженерное решение для двухэтажного дома: расчёт воздухообмена, приток в жилые зоны, вытяжка из технических помещений и рекуперация тепла.",
};

export const FLIBEN_ARTICLES = articlesData as FlibenArticle[];

export const FLIBEN_TYPICAL = {
  intro: typicalData.intro,
  projects: (typicalData.projects as FlibenTypicalProject[]).map((p) => ({
    ...p,
    description: p.description || PROJECT_DESCRIPTIONS[p.areaSqm] || "",
  })),
};

export const FLIBEN_INSTALLATION_GUIDES = guidesData as FlibenInstallationGuide[];

export function getAllArticleSlugs(): string[] {
  return FLIBEN_ARTICLES.map((a) => a.slug);
}

export function getArticleBySlug(slug: string): FlibenArticle | undefined {
  return FLIBEN_ARTICLES.find((a) => a.slug === slug);
}

export function getTypicalProjectBySlug(slug: string): FlibenTypicalProject | undefined {
  return FLIBEN_TYPICAL.projects.find((p) => p.slug === slug);
}

export function formatRub(price: number | null): string {
  if (price == null) return "по запросу";
  return `${price.toLocaleString("ru-RU")} ₽`;
}

export function splitArticleParagraphs(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}
