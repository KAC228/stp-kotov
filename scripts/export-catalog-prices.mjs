/**
 * Экспорт sku → priceRub для серверной проверки суммы в pay.php.
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Подхватить .env.local / .env (как Next), чтобы TEST-SKU совпадал со сборкой */
function loadEnvFile(name) {
  const path = join(root, name);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq <= 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}
loadEnvFile(".env.local");
loadEnvFile(".env");

const raw = JSON.parse(readFileSync(join(root, "data", "fliben-products.json"), "utf8"));
const outPath = join(root, "public", "data", "catalog-prices.json");

/** @type {Record<string, number>} */
const prices = {};

for (const p of raw) {
  if (p?.sku && typeof p.priceRub === "number" && p.priceRub >= 0) {
    prices[String(p.sku)] = p.priceRub;
  }
}

// Тестовый SKU только если явно включён при сборке (11 ₽ — карта и СБП)
if (process.env.NEXT_PUBLIC_TBANK_TEST_SKU === "1" || process.env.NEXT_PUBLIC_TBANK_TEST_SKU === "true") {
  prices["TEST-11RUB"] = 11;
}

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify({ updatedAt: new Date().toISOString(), prices }));
console.log(`Wrote ${Object.keys(prices).length} prices → public/data/catalog-prices.json`);
if (prices["TEST-11RUB"]) console.log("  + TEST-11RUB (тестовая оплата 11 ₽)");
