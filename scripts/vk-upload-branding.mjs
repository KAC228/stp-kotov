#!/usr/bin/env node
/**
 * Загрузка аватара и обложки в vk.com/stp_kotov.
 * Обложка — через ключ сообщества (VK_ACCESS_TOKEN).
 * Аватар — через сохранённую сессию браузера (ключ группы не умеет photos.getOwnerPhotoUploadServer).
 *
 * Запуск из ksd-site: node scripts/vk-upload-branding.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ENV_PATH = resolve(ROOT, ".env.local");
const AVATAR = resolve(ROOT, "public/images/social/vk-avatar.png");
const COVER = resolve(ROOT, "public/images/social/vk-cover.jpg");
const LINEN_ROOT = resolve(ROOT, "../../Костромской Лен");
const PROFILE_DIR = resolve(LINEN_ROOT, "scripts/data/vk-browser-profile");
const API = "5.199";

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    return await import(
      pathToFileURL(resolve(LINEN_ROOT, "node_modules/playwright/index.mjs")).href
    );
  }
}

function loadEnv(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}

async function vkCall(token, method, params = {}) {
  const body = new URLSearchParams({
    access_token: token,
    v: API,
    ...Object.fromEntries(
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, String(v)]),
    ),
  });
  const res = await fetch(`https://api.vk.com/method/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(`${method}: ${data.error.error_code} ${data.error.error_msg}`);
  }
  return data.response;
}

async function uploadCover(token, groupId, filePath) {
  const server = await vkCall(token, "photos.getOwnerCoverPhotoUploadServer", {
    group_id: groupId,
    crop_x: 0,
    crop_y: 0,
    crop_x2: 1590,
    crop_y2: 400,
  });
  const form = new FormData();
  form.append("photo", new Blob([readFileSync(filePath)], { type: "image/jpeg" }), "cover.jpg");
  const uploaded = await (await fetch(server.upload_url, { method: "POST", body: form })).json();
  if (!uploaded?.hash) throw new Error("cover upload failed: " + JSON.stringify(uploaded));
  return vkCall(token, "photos.saveOwnerCoverPhoto", {
    group_id: groupId,
    server: uploaded.server,
    photo: uploaded.photo,
    hash: uploaded.hash,
  });
}

async function getUserTokenFromBrowser() {
  if (!existsSync(PROFILE_DIR)) {
    throw new Error("Нет профиля браузера VK: " + PROFILE_DIR);
  }
  const { chromium } = await loadPlaywright();
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: true,
    locale: "ru-RU",
  });
  const page = context.pages()[0] ?? (await context.newPage());
  await page.goto("https://vk.com/feed", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2000);
  const token = await page.evaluate(() => {
    try {
      for (const k of Object.keys(localStorage)) {
        const v = localStorage.getItem(k);
        if (v && /access_token/i.test(k) && v.length > 20) return v;
      }
      for (const k of Object.keys(localStorage)) {
        try {
          const p = JSON.parse(localStorage.getItem(k) || "");
          if (p?.access_token) return p.access_token;
        } catch {
          /* ignore */
        }
      }
    } catch {
      /* ignore */
    }
    return null;
  });
  await context.close();
  return token;
}

async function uploadAvatar(userToken, groupId, filePath) {
  const server = await vkCall(userToken, "photos.getOwnerPhotoUploadServer", {
    owner_id: -Math.abs(groupId),
  });
  const form = new FormData();
  form.append("photo", new Blob([readFileSync(filePath)], { type: "image/png" }), "avatar.png");
  const uploaded = await (await fetch(server.upload_url, { method: "POST", body: form })).json();
  if (!uploaded?.hash) throw new Error("avatar upload failed: " + JSON.stringify(uploaded));
  return vkCall(userToken, "photos.saveOwnerPhoto", {
    server: uploaded.server,
    photo: uploaded.photo,
    hash: uploaded.hash,
  });
}

async function main() {
  const env = loadEnv(ENV_PATH);
  const groupToken = env.VK_ACCESS_TOKEN;
  const groupId = Number(env.VK_GROUP_ID || 240134142);

  if (!groupToken) throw new Error("VK_ACCESS_TOKEN не задан в .env.local");
  if (!existsSync(COVER) || !existsSync(AVATAR)) {
    throw new Error("Сначала: node scripts/generate-vk-assets.mjs");
  }

  console.log("Обложка 1590×400…");
  await uploadCover(groupToken, groupId, COVER);
  console.log("Обложка: OK");

  console.log("Аватар (через пользовательскую сессию)…");
  const userToken = await getUserTokenFromBrowser();
  if (!userToken) throw new Error("Не найден user token в профиле браузера — войдите в VK");
  await uploadAvatar(userToken, groupId, AVATAR);
  console.log("Аватар: OK");

  console.log("\nГотово: https://vk.com/stp_kotov");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
