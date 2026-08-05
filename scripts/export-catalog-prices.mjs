/**
 * Экспорт sku → priceRub для серверной проверки суммы в pay.php.
 */
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const raw = JSON.parse(readFileSync(join(root, "data", "fliben-products.json"), "utf8"));
const outPath = join(root, "public", "data", "catalog-prices.json");

/** @type {Record<string, number>} */
const prices = {};

for (const p of raw) {
  if (p?.sku && typeof p.priceRub === "number" && p.priceRub >= 0) {
    prices[String(p.sku)] = p.priceRub;
  }
}

// Тестовый SKU только если явно включён при сборке
if (process.env.NEXT_PUBLIC_TBANK_TEST_SKU === "1" || process.env.NEXT_PUBLIC_TBANK_TEST_SKU === "true") {
  prices["TEST-1RUB"] = 1;
}

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify({ updatedAt: new Date().toISOString(), prices }));
console.log(`Wrote ${Object.keys(prices).length} prices → public/data/catalog-prices.json`);
