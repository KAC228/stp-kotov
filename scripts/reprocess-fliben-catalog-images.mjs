/**
 * ⚠ НЕ ЗАПУСКАТЬ без нужды.
 * Раньше агрессивные маски портили GREEN LINE и клипсы.
 * Сейчас processCatalogProductImage — только rotate+webp (без масок).
 * Для свежих фото: node scripts/refresh-fliben-images.mjs
 *
 * Запуск: node scripts/reprocess-fliben-catalog-images.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { processCatalogProductImage } from "./lib/process-catalog-image.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, "..", "public", "images", "fliben-catalog");

async function main() {
  const files = readdirSync(DIR).filter((f) => f.endsWith(".webp"));
  console.log(`Переобработка ${files.length} файлов…`);
  let changed = 0;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = join(DIR, file);
    const before = readFileSync(path);
    const after = await processCatalogProductImage(before);
    if (after.length !== before.length || Buffer.compare(before, after) !== 0) {
      writeFileSync(path, after);
      changed++;
    }
    if ((i + 1) % 20 === 0 || i + 1 === files.length) {
      console.log(`  ${i + 1}/${files.length} (изменено ${changed})`);
    }
  }
  console.log(`Готово: изменено ${changed} из ${files.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
