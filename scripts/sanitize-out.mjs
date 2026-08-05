import fs from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "out");

for (const secretName of ["send.config.php", "pay.config.php"]) {
  const secretPath = path.join(outDir, secretName);
  if (fs.existsSync(secretPath)) {
    fs.rmSync(secretPath, { force: true });
    console.log(`Removed out/${secretName} so secrets are not published.`);
  }
}

/** Только полный дубль каталога — статьи/проекты живут в fliben-scraped */
const skipImageDirs = ["fliben-catalog-r2"];
for (const name of skipImageDirs) {
  const dir = path.join(outDir, "images", name);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Removed out/images/${name}`);
  }
}

/** Тяжёлые исходники PNG в scraped не нужны — на сайте webp/jpg */
const scraped = path.join(outDir, "images", "fliben-scraped");
if (fs.existsSync(scraped)) {
  let removed = 0;
  for (const file of fs.readdirSync(scraped)) {
    if (file.toLowerCase().endsWith(".png")) {
      fs.rmSync(path.join(scraped, file), { force: true });
      removed++;
    }
  }
  if (removed) console.log(`Removed ${removed} PNG from out/images/fliben-scraped`);
}
