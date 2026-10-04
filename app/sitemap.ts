import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/brand";
import { getAllArticleSlugs } from "@/lib/fliben-content";

export const dynamic = "force-static";

/** Совпадает с canonical в HTML: Next отдаёт хост в punycode. */
const SITE_ORIGIN = new URL(SITE_URL).origin;

/** Основные разделы — без дублей и служебных страниц */
const STATIC_PAGES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.85 },
  { path: "/articles", changeFrequency: "weekly", priority: 0.8 },
  { path: "/installation", changeFrequency: "monthly", priority: 0.75 },
  { path: "/foreman", changeFrequency: "monthly", priority: 0.8 },
  { path: "/partnership", changeFrequency: "monthly", priority: 0.7 },
  { path: "/our-partners", changeFrequency: "monthly", priority: 0.65 },
  { path: "/certificates", changeFrequency: "monthly", priority: 0.65 },
  { path: "/delivery-payment", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contacts", changeFrequency: "monthly", priority: 0.7 },
  { path: "/team", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Только YYYY-MM-DD. Google отклоняет lastmod с миллисекундами (…T08:18:57.094Z).
  const lastModified = new Date().toISOString().slice(0, 10);

  const staticPages = STATIC_PAGES.map(({ path, changeFrequency, priority }) => ({
    url: path === "" ? SITE_ORIGIN : `${SITE_ORIGIN}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  const articlePages = getAllArticleSlugs().map((slug) => ({
    url: `${SITE_ORIGIN}/articles/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticPages, ...articlePages];
}
