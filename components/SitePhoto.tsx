import Image from "next/image";
import { flibenCardImage } from "@/constants/fliben-catalog";
import { sitePath } from "@/lib/site-path";

/** Единые классы теней для всех фото на сайте (каталог + блоки). */
export const SITE_PHOTO_PRODUCT_IMG = "site-photo site-photo--product";
export const SITE_PHOTO_COVER_IMG = "site-photo site-photo--cover";
export const SITE_PHOTO_FRAME_PRODUCT = "site-photo-frame site-photo-frame--product";
export const SITE_PHOTO_FRAME_COVER = "site-photo-frame site-photo-frame--cover";

function resolveCatalogSrc(src: string, large = false, skipResize = false): string {
  if (!src || src.startsWith("/")) return src;
  if (skipResize) return src;
  const resized = flibenCardImage(src);
  return large ? resized.replace("400x400", "800x800") : resized;
}

/** Превью товара Fliben: object-contain + тень (каталог, карточка товара). */
export function CatalogProductPhoto({
  src,
  alt,
  frameClassName = "",
  large = false,
  skipResize = false,
  priority = false,
}: {
  src: string;
  alt: string;
  frameClassName?: string;
  large?: boolean;
  /** Арт. 60101 — без CDN-ресайза (иначе артефакт «свечения»). */
  skipResize?: boolean;
  priority?: boolean;
}) {
  const url = resolveCatalogSrc(src, large, skipResize);

  return (
    <div className={`${SITE_PHOTO_FRAME_PRODUCT} ${frameClassName}`.trim()}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={sitePath(url)}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`${SITE_PHOTO_PRODUCT_IMG} absolute inset-0 w-full h-full object-contain p-4 sm:p-5`}
      />
    </div>
  );
}

/** Обложка блока: проекты, статьи, готовые решения. */
export function CoverPhoto({
  src,
  alt,
  aspectClass = "aspect-[16/10]",
  frameClassName = "",
  imageClassName = "",
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  aspectClass?: string;
  frameClassName?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={`${SITE_PHOTO_FRAME_COVER} relative overflow-hidden ${aspectClass} ${frameClassName}`.trim()}>
      <Image
        src={sitePath(src)}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`${SITE_PHOTO_COVER_IMG} object-cover ${imageClassName}`.trim()}
      />
    </div>
  );
}

/** Фоновое фото карточки (системные решения) — те же тени, что у CoverPhoto. */
export function BackdropCoverPhoto({
  src,
  alt = "",
  imageClassName = "",
}: {
  src: string;
  alt?: string;
  imageClassName?: string;
}) {
  return (
    <div
      className="site-photo-frame site-photo-frame--cover absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden={alt === ""}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={sitePath(src)}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`site-photo site-photo--cover absolute inset-0 w-full h-full object-cover ${imageClassName}`.trim()}
      />
    </div>
  );
}
