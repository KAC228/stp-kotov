#!/usr/bin/env node
/**
 * Аватар и обложка VK для СТП-КОТОВ.
 * Обложка 1590×400 — официальный размер ВК; контент в центральной safe-зоне
 * (~1000×360), чтобы читалось и на ПК, и на телефоне.
 *
 * Запуск: node scripts/generate-vk-assets.mjs
 */

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/images/social");
const LOGO_PATH = resolve(ROOT, "public/images/logo.svg");

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  const alt = resolve(ROOT, "../../Костромской Лен/node_modules/sharp");
  sharp = (await import(pathToFileURL(alt).href)).default;
}

mkdirSync(OUT_DIR, { recursive: true });

const logoInner = readFileSync(LOGO_PATH, "utf8")
  .replace(/fill="rgba\(0,0,0,1\)"/g, 'fill="#ffffff"')
  .replace(/<\/?svg[^>]*>/g, "");

/** Аватар 1080×1080 — крупный логотип по центру */
function avatarSvg(size) {
  const pad = Math.round(size * 0.16);
  const logoSize = size - pad * 2;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="ag" cx="50%" cy="40%" r="72%">
      <stop offset="0%" stop-color="#222228"/>
      <stop offset="100%" stop-color="#09090b"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#ag)"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.46}" fill="none" stroke="#3f3f46" stroke-width="3"/>
  <g transform="translate(${pad}, ${pad}) scale(${logoSize / 747})">
    ${logoInner}
  </g>
</svg>`;
}

/**
 * Обложка ВК: 1590×400.
 * Safe-зона для мобилки: примерно x=295..1295 (центр ~1000px).
 * Логотип + текст строго по центру.
 */
function coverSvg(w = 1590, h = 400) {
  const logoH = 168;
  const logoW = Math.round((logoH * 747) / 684);
  const gap = 36;
  const title = "СТП-КОТОВ";
  // приблизительная ширина блока текста + лого
  const textBlockW = 420;
  const totalW = logoW + gap + textBlockW;
  const startX = Math.round((w - totalW) / 2);
  const logoY = Math.round((h - logoH) / 2);
  const titleY = Math.round(h * 0.42);
  const subY = Math.round(h * 0.58);
  const metaY = Math.round(h * 0.76);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#141418"/>
      <stop offset="50%" stop-color="#0a0a0c"/>
      <stop offset="100%" stop-color="#111116"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" stroke-opacity="0.035" stroke-width="1"/>
    </pattern>
    <linearGradient id="fadeL" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#09090b"/>
      <stop offset="100%" stop-color="#09090b" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="fadeR" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0%" stop-color="#09090b"/>
      <stop offset="100%" stop-color="#09090b" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#grid)"/>
  <!-- боковые зоны (обрезаются на телефоне) — только декор -->
  <rect width="220" height="${h}" fill="url(#fadeL)" opacity="0.5"/>
  <rect x="${w - 220}" width="220" height="${h}" fill="url(#fadeR)" opacity="0.5"/>
  <rect x="0" y="${h - 3}" width="${w}" height="3" fill="#ffffff" fill-opacity="0.14"/>

  <!-- safe zone content -->
  <g transform="translate(${startX}, ${logoY}) scale(${logoW / 747})">
    ${logoInner}
  </g>
  <text x="${startX + logoW + gap}" y="${titleY}" fill="#ffffff"
    font-family="Arial, Helvetica, sans-serif" font-size="54" font-weight="800"
    letter-spacing="-1.5">${title}</text>
  <text x="${startX + logoW + gap}" y="${subY}" fill="#a1a1aa"
    font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">
    Скрытые теневые потоки · КСД
  </text>
  <text x="${startX + logoW + gap}" y="${metaY}" fill="#e4e4e7"
    font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="600">
    Гарантия 25 лет · стп-котов.рф
  </text>
</svg>`;
}

const avatarPath = resolve(OUT_DIR, "vk-avatar.png");
const coverPath = resolve(OUT_DIR, "vk-cover.jpg");
const ogPath = resolve(ROOT, "public/images/og-image.jpg");

await sharp(Buffer.from(avatarSvg(1080)))
  .png({ compressionLevel: 9 })
  .toFile(avatarPath);

await sharp(Buffer.from(coverSvg(1590, 400)))
  .jpeg({ quality: 93, mozjpeg: true })
  .toFile(coverPath);

await sharp(Buffer.from(coverSvg(1200, 630)))
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(ogPath);

writeFileSync(
  resolve(OUT_DIR, "manifest.json"),
  JSON.stringify(
    {
      avatar: "public/images/social/vk-avatar.png",
      cover: "public/images/social/vk-cover.jpg",
      coverSize: "1590x400",
      og: "public/images/og-image.jpg",
      generatedAt: new Date().toISOString(),
    },
    null,
    2,
  ),
);

console.log("Создано:");
console.log(" ", avatarPath);
console.log(" ", coverPath, "(1590×400, safe-зона по центру)");
console.log(" ", ogPath);
