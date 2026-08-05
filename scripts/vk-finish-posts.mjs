#!/usr/bin/env node
/**
 * Закрепить пост #6 + создать отложенные (без дубля первого поста).
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
const GROUP_ID = 240134142;
const FIRST_POST_ID = 6;

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
  if (data.error) throw new Error(`${method}: ${data.error.error_code} ${data.error.error_msg}`);
  return data.response;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function scheduleSlots(count, hourMoscow = 11) {
  const slots = [];
  let day = new Date(Date.now() + 24 * 3600 * 1000);
  let weekdayIndex = 0;
  while (slots.length < count) {
    const msk = new Date(day.getTime() + 3 * 3600 * 1000);
    const y = msk.getUTCFullYear();
    const mo = msk.getUTCMonth();
    const d = msk.getUTCDate();
    const dow = new Date(Date.UTC(y, mo, d)).getUTCDay();
    if (dow !== 0 && dow !== 6) {
      if (weekdayIndex % 2 === 0) {
        const unix = Math.floor(Date.UTC(y, mo, d, hourMoscow - 3, 0, 0) / 1000);
        if (unix * 1000 > Date.now() + 60000) slots.push(unix);
      }
      weekdayIndex += 1;
    }
    day = new Date(day.getTime() + 24 * 3600 * 1000);
  }
  return slots;
}

function fmtMsk(unix) {
  return new Date(unix * 1000).toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const SCHEDULED = [
  {
    title: "Что такое КСД",
    text: `Что такое КСД простыми словами?

Камера статического давления — это скрытый «распределитель» воздуха в потолке.
Вместо громоздких воздуховодов — аккуратные теневые щели и врезки, которые работают на архитектуру помещения, а не против неё.

СТП-КОТОВ делает КСД для:
• натяжных потолков
• ГКЛ и сложных потолочных конструкций
• жилых и коммерческих объектов

Рассчитать под ваш объект → стп-котов.рф
☎ +7 (800) 555-00-00`,
  },
  {
    title: "Цена 50 000",
    text: `50 000 ₽/м — что входит в цену?

Единая стоимость КСД от СТП-КОТОВ уже включает:
✓ тип потолка (натяжной, ГКЛ и др.)
✓ врезки и узлы под ваш проект
✓ комплект для монтажа «из коробки»

Без сюрпризов «за сложный потолок» — цена фиксируется на этапе расчёта.

Конфигуратор → стп-котов.рф
☎ +7 (800) 555-00-00`,
  },
  {
    title: "Гарантия 25 лет",
    text: `Гарантия 25 лет — на что распространяется?

Мы отвечаем за качество КСД на весь срок эксплуатации системы.
Это обязательство производителя, а не маркетинговая фраза.

Скоро начнём публиковать реальные объекты: монтаж, узлы, кейсы до/после.

Заявка инженеру → стп-котов.рф/contacts
☎ +7 (800) 555-00-00`,
  },
  {
    title: "До/после",
    text: `Формат, который будем вести здесь постоянно: до / после.

До — потолок и узлы до установки КСД.
После — тот же ракурс, когда система уже работает.

Если у вас есть объект с фото — присылайте в сообщения сообщества или на стп-котов.рф.
Соберём аккуратный кейс без лишней воды.

☎ +7 (800) 555-00-00`,
  },
  {
    title: "Конфигуратор",
    text: `Как быстро прикинуть КСД под объект?

1. Откройте конфигуратор на стп-котов.рф
2. Укажите тип потолка и метраж
3. Получите ориентир по комплектации и стоимости

Дальше инженер уточнит узлы и врезки под ваш проект.

Конфигуратор → стп-котов.рф
☎ +7 (800) 555-00-00`,
  },
  {
    title: "Для кого",
    text: `Для кого СТП-КОТОВ?

• Дизайнеры и архитекторы — скрытая вентиляция без ущерба для потолка
• Монтажные бригады — понятный комплект «из коробки»
• Заказчики — единая цена и гарантия 25 лет

Пишите в сообщения сообщества — подскажем, подходит ли КСД под ваш объект.

стп-котов.рф
☎ +7 (800) 555-00-00`,
  },
];

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
  const groupToken = env.VK_ACCESS_TOKEN;
  if (!groupToken) throw new Error("VK_ACCESS_TOKEN не задан");
  const owner_id = -GROUP_ID;

  console.log("Закрепляем пост", FIRST_POST_ID, "…");
  const userToken = await getUserToken();
  if (!userToken) throw new Error("Нет user token");
  await vkCall(userToken, "wall.pin", { owner_id, post_id: FIRST_POST_ID });
  console.log("Закреплён");

  const slots = scheduleSlots(SCHEDULED.length, 11);
  console.log("\nОтложенные:");
  for (let i = 0; i < SCHEDULED.length; i++) {
    await sleep(900);
    const res = await vkCall(groupToken, "wall.post", {
      owner_id,
      from_group: 1,
      message: SCHEDULED[i].text,
      publish_date: slots[i],
    });
    console.log(
      `  #${i + 1} «${SCHEDULED[i].title}» → ${fmtMsk(slots[i])} МСК (id ${res.post_id})`,
    );
  }
  console.log("\nhttps://vk.com/stp_kotov");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
