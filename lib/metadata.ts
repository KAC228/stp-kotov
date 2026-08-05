import type { Metadata } from "next";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";

export const OG_IMAGE = {
  url: "/images/og-image.jpg",
  width: 1200,
  height: 630,
  alt: `${BRAND_NAME} — камеры статического давления`,
} as const;

type PageMetaInput = {
  title: string;
  description: string;
  /** Путь страницы, например `/contacts` */
  path: string;
  /** Не индексировать (служебные / дубли) */
  noIndex?: boolean;
  /** Open Graph type */
  ogType?: "website" | "article";
  /** Абсолютный URL картинки для OG (иначе общий OG_IMAGE) */
  image?: string;
};

/** Обрезает description до комфортной длины для сниппетов. */
export function clipDescription(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const sliced = clean.slice(0, max - 1);
  const cut = sliced.lastIndexOf(" ");
  return `${(cut > 80 ? sliced.slice(0, cut) : sliced).trim()}…`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  noIndex = false,
  ogType = "website",
  image,
}: PageMetaInput): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const desc = clipDescription(description);
  const ogImage = image
    ? { url: image, width: 1200, height: 630, alt: title }
    : OG_IMAGE;

  return {
    title,
    description: desc,
    alternates: {
      canonical: url,
      languages: {
        "ru-RU": url,
        ru: url,
      },
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
    openGraph: {
      title,
      description: desc,
      url,
      siteName: BRAND_NAME,
      locale: "ru_RU",
      type: ogType,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [typeof ogImage.url === "string" ? ogImage.url : OG_IMAGE.url],
    },
  };
}
