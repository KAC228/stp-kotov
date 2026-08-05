/**
 * Синхронизация data/fliben-products.json с каталогом fliben.ru (Tilda Store API).
 * Загружает: название, артикул, цену, фото (локально), описание, характеристики.
 * Запуск: npm run sync:fliben-catalog
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { processCatalogProductImage } from "./lib/process-catalog-image.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "data", "fliben-products.json");
const IMAGES_DIR = join(ROOT, "public", "images", "fliben-catalog");
const PLACEHOLDER = "/images/partners/fliben.svg";

const UA = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/json, text/html, image/*",
  "Accept-Language": "ru-RU,ru;q=0.9",
  Referer: "https://fliben.ru/catalog",
};

/** url → /images/fliben-catalog/{hash}.webp */
const imageCache = new Map();

function stripHtml(html) {
  return String(html ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseGalleryAll(gallery) {
  if (!gallery) return [];
  try {
    const arr = typeof gallery === "string" ? JSON.parse(gallery) : gallery;
    return (arr ?? []).map((x) => x?.img).filter(Boolean);
  } catch {
    return [];
  }
}

function parsePrice(price) {
  const n = Number.parseFloat(String(price ?? "").replace(",", "."));
  return Number.isFinite(n) ? Math.round(n) : 0;
}

function buildExcerpt(descr, textHtml) {
  const fromDescr = stripHtml(descr);
  if (fromDescr) return fromDescr.length > 280 ? `${fromDescr.slice(0, 277)}…` : fromDescr;
  const plain = stripHtml(textHtml);
  if (!plain) return "";
  return plain.length > 280 ? `${plain.slice(0, 277)}…` : plain;
}

function parseCharacteristics(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((c) => ({
      title: String(c?.title ?? "").trim(),
      value: String(c?.value ?? "").trim(),
    }))
    .filter((c) => c.title && c.value);
}

function hashUrl(url) {
  return createHash("sha1").update(url).digest("hex").slice(0, 14);
}

function localPathFor(url) {
  return `/images/fliben-catalog/${hashUrl(url)}.webp`;
}

async function downloadImage(url, { force = false } = {}) {
  if (!url || url.startsWith("/")) return url || PLACEHOLDER;
  if (imageCache.has(url)) return imageCache.get(url);

  const localPublic = localPathFor(url);
  const diskPath = join(IMAGES_DIR, `${hashUrl(url)}.webp`);

  if (!force && existsSync(diskPath)) {
    imageCache.set(url, localPublic);
    return localPublic;
  }

  try {
    const res = await fetch(url, { headers: UA, redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const processed = await processCatalogProductImage(buf);
    writeFileSync(diskPath, processed);
    imageCache.set(url, localPublic);
    return localPublic;
  } catch (err) {
    console.warn(`  ⚠ фото не скачано: ${url.slice(0, 72)}… (${err.message})`);
    return url;
  }
}

async function localizeImages(urls, opts = {}) {
  const out = [];
  for (const url of urls) {
    out.push(await downloadImage(url, opts));
  }
  return out.length ? out : [PLACEHOLDER];
}

async function fetchCatalogIds() {
  const res = await fetch("https://fliben.ru/catalog", { headers: UA });
  if (!res.ok) throw new Error(`fliben.ru/catalog → ${res.status}`);
  const html = await res.text();
  const storepart = html.match(/storepart:'(\d+)'/)?.[1];
  const recid = html.match(/recid:'(\d+)'/)?.[1];
  if (!storepart || !recid) {
    throw new Error("Не удалось найти storepart/recid на странице каталога");
  }
  return { storepart, recid };
}

async function fetchAllProducts(storepart, recid) {
  const params = new URLSearchParams({
    storepartuid: storepart,
    recid,
    size: "300",
  });
  const url = `https://store.tildacdn.com/api/getproductslist/?${params}`;
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`Tilda catalog API → ${res.status}`);
  return res.json();
}

/** Разделы фильтров fliben.ru (как в UI производителя). */
const STORE_SECTIONS = {
  units: "859213350062",
  slim: "940124927902",
  thermo: "290181633572",
  flex75: "659999996092",
  flex110: "549204591122",
  flat: "276413894102",
  collectors: "258717992042",
  accessories: "367103182842",
  adapters: "764840203352",
  diffusers: "639637837152",
  connectors: "365733573482",
  bends: "268839319402",
  silencers: "575672003522",
};

/** uid → список разделов магазина (товар может быть в нескольких). */
async function fetchStoreSectionMembership(recid) {
  const membership = new Map();

  for (const [section, storepartuid] of Object.entries(STORE_SECTIONS)) {
    const params = new URLSearchParams({
      storepartuid,
      recid,
      size: "300",
    });
    const url = `https://store.tildacdn.com/api/getproductslist/?${params}`;
    const res = await fetch(url, { headers: UA });
    if (!res.ok) throw new Error(`Tilda section ${section} → ${res.status}`);
    const data = await res.json();
    const products = data.products ?? [];
    console.log(`  раздел ${section}: ${products.length}`);
    for (const item of products) {
      const uid = String(item.uid ?? "");
      if (!uid) continue;
      if (!membership.has(uid)) membership.set(uid, []);
      const list = membership.get(uid);
      if (!list.includes(section)) list.push(section);
    }
  }

  return membership;
}

function mapProduct(raw) {
  const remoteImages = parseGalleryAll(raw.gallery);
  const href = raw.url?.startsWith("http") ? raw.url : `https://fliben.ru${raw.url ?? "/catalog"}`;
  const sku = String(raw.sku ?? "").trim() || `FL-${raw.uid}`;
  const priceOldRub = parsePrice(raw.priceold);
  const descriptionHtml = String(raw.text ?? "").trim();
  const excerpt = buildExcerpt(raw.descr, descriptionHtml);

  return {
    uid: String(raw.uid ?? ""),
    title: String(raw.title ?? "").trim(),
    priceRub: parsePrice(raw.price),
    priceOldRub: priceOldRub > 0 ? priceOldRub : null,
    sku,
    href,
    remoteImages,
    excerpt,
    descriptionHtml,
    characteristics: parseCharacteristics(raw.characteristics),
  };
}

async function main() {
  mkdirSync(IMAGES_DIR, { recursive: true });
  const force = process.env.FLIBEN_FORCE_IMAGES === "1";

  console.log("Читаем ID каталога с fliben.ru…");
  const { storepart, recid } = await fetchCatalogIds();
  console.log(`  storepart=${storepart}, recid=${recid}`);

  console.log("Загружаем товары…");
  const data = await fetchAllProducts(storepart, recid);
  const raw = data.products ?? [];
  console.log(`  получено: ${raw.length}`);

  console.log("Собираем членство в разделах фильтров Fliben…");
  const sectionMembership = await fetchStoreSectionMembership(recid);

  const seen = new Set();
  const mapped = [];
  for (const item of raw) {
    const uid = String(item.uid ?? "");
    if (!uid || seen.has(uid)) continue;
    const product = mapProduct(item);
    if (!product.title) continue;
    product.storeSections = sectionMembership.get(uid) ?? [];
    seen.add(uid);
    mapped.push(product);
  }

  console.log(
    force
      ? "Скачиваем фото заново (FLIBEN_FORCE_IMAGES=1)…"
      : "Скачиваем фото в public/images/fliben-catalog/…",
  );
  const products = [];
  let downloaded = 0;
  let cached = 0;

  for (let i = 0; i < mapped.length; i++) {
    const p = mapped[i];
    const before = imageCache.size;
    const images = await localizeImages(p.remoteImages.length ? p.remoteImages : [], { force });
    if (imageCache.size > before) downloaded += imageCache.size - before;
    else cached++;

    products.push({
      uid: p.uid,
      title: p.title,
      priceRub: p.priceRub,
      priceOldRub: p.priceOldRub,
      sku: p.sku,
      href: p.href,
      image: images[0] ?? PLACEHOLDER,
      images,
      excerpt: p.excerpt,
      descriptionHtml: p.descriptionHtml,
      characteristics: p.characteristics,
      storeSections: p.storeSections ?? [],
    });

    if ((i + 1) % 20 === 0 || i + 1 === mapped.length) {
      console.log(`  ${i + 1}/${mapped.length}`);
    }
  }

  products.sort((a, b) => a.sku.localeCompare(b.sku, "ru", { numeric: true }));

  writeFileSync(OUT, `${JSON.stringify(products, null, 2)}\n`, "utf8");
  console.log(`\nЗаписано ${products.length} товаров → ${OUT}`);
  console.log(`  уникальных фото: ${imageCache.size} (новых загрузок ~${downloaded}, кэш-пропусков ~${cached})`);

  const local = products.filter((p) => p.image.startsWith("/images/fliben-catalog/")).length;
  const noDesc = products.filter((p) => !p.descriptionHtml && !p.excerpt).length;
  const withChars = products.filter((p) => p.characteristics.length > 0).length;
  console.log(`  локальных фото: ${local}/${products.length}, без описания: ${noDesc}, с характеристиками: ${withChars}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
