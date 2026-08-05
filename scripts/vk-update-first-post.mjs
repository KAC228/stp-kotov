#!/usr/bin/env node
/**
 * Обновить закреплённый первый пост — упор на патент и преимущества.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ENV_PATH = resolve(ROOT, ".env.local");
const LINEN = resolve(ROOT, "../../Костромской Лен");
const PROFILE = resolve(LINEN, "scripts/data/vk-browser-profile");
const API = "5.199";
const OWNER_ID = -240134142;
const POST_ID = 6;

const MESSAGE = `СТП-КОТОВ — КСД, которые делают по-другому

Мы производим камеры статического давления нового поколения. Не «ещё одна коробка под потолок», а запатентованная система, заточенная под реальный монтаж и чистый результат.

Почему выбирают нас:

🔹 Запатентованная система крепежа
Монтаж быстрый и без перекосов: шаблон, разметка, сборка по принципу конструктора — без лишних замеров «на глаз». Это наше собственное решение, которого нет у типовых камер.

🔹 Единая цена — 50 000 ₽ за погонный метр
Тип потолка и врезки уже включены. Без сюрпризов «за сложность».

🔹 Гарантия 25 лет
Ответственность производителя на весь срок эксплуатации. Каждое изделие — с серийным номером.

🔹 Универсальность под любой потолок
Натяжной, ГКЛ, сложные конструкции — одна логика монтажа.

🔹 Встроенный шинопровод и магнитный свет
Равномерный поток воздуха + освещение без сверления и лишнего хаоса на объекте.

🔹 Монтаж «из коробки»
IP44, точная геометрия, дроссель на каждом подводе, уровень нивелира на корпусе — всё продумано до установки.

Мы делаем КСД так, чтобы воздух работал на архитектуру, а не ломал её.

Конфигуратор и заявка → стп-котов.рф
☎ +7 (800) 555-00-00`;

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

async function getUserToken() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    ({ chromium } = await import(
      pathToFileURL(resolve(LINEN, "node_modules/playwright/index.mjs")).href
    ));
  }
  const context = await chromium.launchPersistentContext(PROFILE, {
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

async function main() {
  const env = loadEnv(ENV_PATH);
  try {
    await vkCall(env.VK_ACCESS_TOKEN, "wall.edit", {
      owner_id: OWNER_ID,
      post_id: POST_ID,
      message: MESSAGE,
    });
    console.log("Обновлено ключом сообщества");
  } catch (e) {
    console.log("Групповой ключ не подошёл:", e.message);
    const userToken = await getUserToken();
    if (!userToken) throw new Error("Нет user token");
    await vkCall(userToken, "wall.edit", {
      owner_id: OWNER_ID,
      post_id: POST_ID,
      message: MESSAGE,
    });
    console.log("Обновлено пользовательским токеном");
  }

  // убедиться, что закреп на месте
  try {
    const userToken = await getUserToken();
    await vkCall(userToken, "wall.pin", { owner_id: OWNER_ID, post_id: POST_ID });
    console.log("Закреп подтверждён");
  } catch (e) {
    console.log("pin:", e.message);
  }

  console.log("https://vk.com/wall-240134142_6");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
