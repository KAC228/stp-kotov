/**
 * Обновляет storeSections в data/fliben-products.json по разделам fliben.ru.
 * Без повторной загрузки фото.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "data", "fliben-products.json");

const UA = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/json, text/html",
  "Accept-Language": "ru-RU,ru;q=0.9",
  Referer: "https://fliben.ru/catalog",
};

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

async function fetchCatalogIds() {
  const res = await fetch("https://fliben.ru/catalog", { headers: UA });
  if (!res.ok) throw new Error(`fliben.ru/catalog → ${res.status}`);
  const html = await res.text();
  const storepart = html.match(/storepart:'(\d+)'/)?.[1];
  const recid = html.match(/recid:'(\d+)'/)?.[1];
  if (!storepart || !recid) throw new Error("storepart/recid not found");
  return { storepart, recid };
}

async function fetchSectionMembership(recid) {
  const membership = new Map();
  for (const [section, storepartuid] of Object.entries(STORE_SECTIONS)) {
    const params = new URLSearchParams({ storepartuid, recid, size: "300" });
    const url = `https://store.tildacdn.com/api/getproductslist/?${params}`;
    const res = await fetch(url, { headers: UA });
    if (!res.ok) throw new Error(`section ${section} → ${res.status}`);
    const data = await res.json();
    const products = data.products ?? [];
    console.log(`  ${section}: ${products.length}`);
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

const { recid } = await fetchCatalogIds();
console.log("Читаем разделы Fliben…");
const membership = await fetchSectionMembership(recid);

const products = JSON.parse(readFileSync(OUT, "utf8"));
let withSections = 0;
for (const p of products) {
  const uid = String(p.uid ?? "");
  p.storeSections = membership.get(uid) ?? [];
  if (p.storeSections.length) withSections++;
}

writeFileSync(OUT, `${JSON.stringify(products, null, 2)}\n`, "utf8");

const counts = {};
for (const key of Object.keys(STORE_SECTIONS)) {
  counts[key] = products.filter((p) => p.storeSections?.includes(key)).length;
}
console.log(`\nОбновлено ${products.length} товаров, с разделами: ${withSections}`);
console.log("Счётчики:", counts);
console.log(`Адаптеры+диффузоры: ${products.filter((p) => p.storeSections?.includes("adapters") || p.storeSections?.includes("diffusers")).length}`);
