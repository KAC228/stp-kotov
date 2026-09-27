import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/brand";
import { getAllArticleSlugs } from "@/lib/fliben-content";

export const dynamic = "force-static";

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
  const now = new Date();

  const staticPages = STATIC_PAGES.map(({ path, changeFrequency, priority }) => ({
    url: path === "" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const articlePages = getAllArticleSlugs().map((slug) => ({
    url: `${SITE_URL}/articles/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticPages, ...articlePages];
}
