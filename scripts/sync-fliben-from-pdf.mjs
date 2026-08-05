/**
 * Синхронизация data/fliben-products.json из прайс-листа PDF (05_-_Fliben_01.05.26__.pdf).
 * Запуск: node scripts/sync-fliben-from-pdf.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

async function extractPdfText(filePath) {
  const { PDFParse } = await import("pdf-parse");
  const buffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  return result.text;
}

function parseProducts(text) {
  const items = [];
  let buf = "";
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || /^Дата|^Цена|^NEW|^Система|^Наименование/.test(t)) continue;
    if (/^\d{5}\s/.test(t)) {
      if (buf) items.push(buf);
      buf = t;
    } else if (buf) {
      buf += ` ${t}`;
    }
  }
  if (buf) items.push(buf);

  const products = [];
  for (const raw of items) {
    const m = raw.match(/^(\d{5})\s+(.+?)\s+([\d\s]+)\s*₽/);
    if (!m) continue;
    const title = m[2].replace(/,\s*FLIBEN.*$/i, "").replace(/\s+/g, " ").trim();
    products.push({
      sku: m[1],
      title,
      priceRub: Number(m[3].replace(/\s/g, "")),
    });
  }

  const seen = new Set();
  return products.filter((p) => {
    if (seen.has(p.sku)) return false;
    seen.add(p.sku);
    return true;
  });
}

async function main() {
  const pdfPath = path.join(root, "public/files/fliben/05_-_Fliben_01.05.26__.pdf");
  const dataPath = path.join(root, "data/fliben-products.json");
  const text = await extractPdfText(pdfPath);
  const parsed = parseProducts(text);

  let existing = [];
  if (fs.existsSync(dataPath)) {
    existing = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  }
  const bySku = Object.fromEntries(existing.map((p) => [p.sku, p]));
  const PLACEHOLDER = "/images/partners/fliben.svg";

  const out = parsed.map((p) => {
    const old = bySku[p.sku];
    return {
      title: p.title,
      priceRub: p.priceRub,
      sku: p.sku,
      href: old?.href?.includes("tproduct/") ? old.href : "https://fliben.ru/",
      image: old?.image && !old.image.startsWith("/") ? old.image : PLACEHOLDER,
    };
  });

  fs.writeFileSync(dataPath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
  console.log(`Synced ${out.length} products from PDF`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
