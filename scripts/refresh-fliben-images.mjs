/**
 * Принудительная перекачка фото в fliben-catalog-v2 → безопасная замена папки.
 * Обработка: только rotate + webp (без масок и правок пикселей).
 * storeSections из текущего JSON сохраняются.
 *
 * Запуск: node scripts/refresh-fliben-images.mjs
 */
import { createHash } from "node:crypto";
import {
  mkdirSync,
  writeFileSync,
  rmSync,
  renameSync,
  existsSync,
  readdirSync,
  readFileSync,
  cpSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { processCatalogProductImage } from "./lib/process-catalog-image.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OLD = join(ROOT, "public", "images", "fliben-catalog");
const NEW = join(ROOT, "public", "images", "fliben-catalog-v2");
const OUT_JSON = join(ROOT, "data", "fliben-products.json");

const UA = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/json, text/html, image/*",
  Referer: "https://fliben.ru/catalog",
};

function hashUrl(url) {
  return createHash("sha1").update(url).digest("hex").slice(0, 14);
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

function stripHtml(html) {
  return String(html ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildExcerpt(descr, textHtml) {
  const fromDescr = stripHtml(descr);
  if (fromDescr) return fromDescr.length > 280 ? `${fromDescr.slice(0, 277)}…` : fromDescr;
  const plain = stripHtml(textHtml);
  if (!plain) return "";
  return plain.length > 280 ? `${plain.slice(0, 277)}…` : plain;
}

function loadPrevStoreSections() {
  /** @type {Map<string, string[]>} */
  const map = new Map();
  if (!existsSync(OUT_JSON)) return map;
  try {
    const prev = JSON.parse(readFileSync(OUT_JSON, "utf8"));
    for (const p of prev) {
      if (p?.uid && Array.isArray(p.storeSections) && p.storeSections.length) {
        map.set(String(p.uid), p.storeSections);
      }
    }
  } catch {
    /* ignore */
  }
  return map;
}

function safeSwapFolders() {
  const newFiles = existsSync(NEW) ? readdirSync(NEW).filter((f) => f.endsWith(".webp")) : [];
  if (newFiles.length < 50) {
    throw new Error(
      `Отказ замены: в v2 только ${newFiles.length} webp (нужно ≥50). Старая папка не тронута.`,
    );
  }

  const bak = `${OLD}-bak`;
  if (existsSync(bak)) rmSync(bak, { recursive: true, force: true });

  if (existsSync(OLD)) {
    try {
      renameSync(OLD, bak);
    } catch {
      // OneDrive иногда блокирует rename — копируем в bak и чистим OLD
      cpSync(OLD, bak, { recursive: true });
      rmSync(OLD, { recursive: true, force: true });
    }
  }

  try {
    renameSync(NEW, OLD);
  } catch (err) {
    // откат
    if (existsSync(bak) && !existsSync(OLD)) {
      try {
        renameSync(bak, OLD);
      } catch {
        cpSync(bak, OLD, { recursive: true });
      }
    }
    throw err;
  }

  try {
    if (existsSync(bak)) rmSync(bak, { recursive: true, force: true });
  } catch {
    console.warn("Не удалось удалить bak (OneDrive) — можно удалить вручную:", bak);
  }
}

async function main() {
  if (existsSync(NEW)) rmSync(NEW, { recursive: true, force: true });
  mkdirSync(NEW, { recursive: true });

  const prevSections = loadPrevStoreSections();
  console.log("Читаем каталог…");
  const html = await (await fetch("https://fliben.ru/catalog", { headers: UA })).text();
  const storepart = html.match(/storepart:'(\d+)'/)?.[1];
  const recid = html.match(/recid:'(\d+)'/)?.[1];
  if (!storepart || !recid) throw new Error("storepart/recid not found");

  const params = new URLSearchParams({ storepartuid: storepart, recid, size: "300" });
  const data = await (
    await fetch(`https://store.tildacdn.com/api/getproductslist/?${params}`, { headers: UA })
  ).json();

  const raw = data.products ?? [];
  const cache = new Map();
  const products = [];
  const seen = new Set();
  let failCount = 0;

  console.log(`Товаров: ${raw.length}. Качаем фото (без масок)…`);

  for (let i = 0; i < raw.length; i++) {
    const item = raw[i];
    const uid = String(item.uid ?? "");
    if (!uid || seen.has(uid)) continue;
    seen.add(uid);

    const remoteImages = parseGalleryAll(item.gallery);
    const images = [];
    for (const url of remoteImages) {
      if (cache.has(url)) {
        images.push(cache.get(url));
        continue;
      }
      const name = `${hashUrl(url)}.webp`;
      const disk = join(NEW, name);
      const pub = `/images/fliben-catalog/${name}`;
      try {
        const res = await fetch(url, { headers: UA, redirect: "follow" });
        if (!res.ok) {
          console.warn("skip", url, res.status);
          failCount++;
          continue;
        }
        const buf = Buffer.from(await res.arrayBuffer());
        const processed = await processCatalogProductImage(buf);
        writeFileSync(disk, processed);
        cache.set(url, pub);
        images.push(pub);
      } catch (err) {
        failCount++;
        console.warn("fail", url.slice(0, 60), err.message);
      }
    }

    if (!images.length) continue;

    const priceOldRub = parsePrice(item.priceold);
    const descriptionHtml = String(item.text ?? "").trim();
    const href = item.url?.startsWith("http") ? item.url : `https://fliben.ru${item.url ?? "/catalog"}`;
    const sku = String(item.sku ?? "").trim() || `FL-${item.uid}`;

    products.push({
      uid,
      title: String(item.title ?? "").trim(),
      priceRub: parsePrice(item.price),
      priceOldRub: priceOldRub > 0 ? priceOldRub : null,
      sku,
      href,
      image: images[0],
      images,
      excerpt: buildExcerpt(item.descr, descriptionHtml),
      descriptionHtml,
      characteristics: Array.isArray(item.characteristics)
        ? item.characteristics
            .map((c) => ({
              title: String(c?.title ?? "").trim(),
              value: String(c?.value ?? "").trim(),
            }))
            .filter((c) => c.title && c.value)
        : [],
      storeSections: prevSections.get(uid) ?? [],
    });

    if ((i + 1) % 20 === 0 || i + 1 === raw.length) {
      console.log(`  ${i + 1}/${raw.length}, files=${cache.size}, fails=${failCount}`);
    }
  }

  if (products.length < 80) {
    throw new Error(`Слишком мало товаров (${products.length}) — JSON и папку не трогаем.`);
  }

  products.sort((a, b) => a.sku.localeCompare(b.sku, "ru", { numeric: true }));

  // сначала фото, потом JSON
  safeSwapFolders();
  writeFileSync(OUT_JSON, `${JSON.stringify(products, null, 2)}\n`, "utf8");

  console.log(`Готово: ${products.length} товаров, ${cache.size} фото, fails=${failCount}`);
  for (const sku of ["60117", "70113", "60700", "70112"]) {
    const u = products.find((p) => p.sku === sku);
    console.log(`${sku} →`, u?.image);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
