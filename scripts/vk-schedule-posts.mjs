#!/usr/bin/env node
/**
 * Первый пост + отложенные публикации для vk.com/stp_kotov
 * Запуск: node scripts/vk-schedule-posts.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ENV_PATH = resolve(ROOT, ".env.local");
const API = "5.199";

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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Unix timestamps: ближайшие будние дни в hourMoscow МСК, каждый 2-й (≈3 раза/нед) */
function scheduleSlots(count, hourMoscow = 11) {
  const slots = [];
  const MSK_OFFSET = 3 * 3600 * 1000;
  // старт: завтра
  let day = new Date(Date.now() + 24 * 3600 * 1000);
  let weekdayIndex = 0;

  while (slots.length < count) {
    const msk = new Date(day.getTime() + MSK_OFFSET);
    // нормализуем к календарному дню МСК
    const y = msk.getUTCFullYear();
    const mo = msk.getUTCMonth();
    const d = msk.getUTCDate();
    const dow = new Date(Date.UTC(y, mo, d)).getUTCDay();

    if (dow !== 0 && dow !== 6) {
      if (weekdayIndex % 2 === 0) {
        // 11:00 МСК = 08:00 UTC
        const unix = Math.floor(Date.UTC(y, mo, d, hourMoscow - 3, 0, 0) / 1000);
        if (unix * 1000 > Date.now() + 60000) {
          slots.push(unix);
        }
      }
      weekdayIndex += 1;
    }
    day = new Date(day.getTime() + 24 * 3600 * 1000);
  }
  return slots;
}

const FIRST_POST = `СТП-КОТОВ — КСД, которые делают по-другому

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

async function main() {
  const env = loadEnv(ENV_PATH);
  const token = env.VK_ACCESS_TOKEN;
  const groupId = Number(env.VK_GROUP_ID || 240134142);
  if (!token) throw new Error("VK_ACCESS_TOKEN не задан");

  const owner_id = -Math.abs(groupId);

  // 1) Первый пост — сразу
  console.log("Публикуем первый пост…");
  const first = await vkCall(token, "wall.post", {
    owner_id,
    from_group: 1,
    message: FIRST_POST,
  });
  console.log("Первый пост id:", first.post_id);

  await sleep(800);
  await vkCall(token, "wall.pin", {
    owner_id,
    post_id: first.post_id,
  });
  console.log("Закреплён");

  // 2) Отложенные — ~3 раза в неделю, 11:00 МСК
  const slots = scheduleSlots(SCHEDULED.length, 11);

  console.log("\nОтложенные посты:");
  for (let i = 0; i < SCHEDULED.length; i++) {
    const item = SCHEDULED[i];
    const publish_date = slots[i];
    await sleep(900);
    const res = await vkCall(token, "wall.post", {
      owner_id,
      from_group: 1,
      message: item.text,
      publish_date,
    });
    console.log(
      `  #${i + 1} «${item.title}» → ${fmtMsk(publish_date)} МСК (post_id ${res.post_id})`,
    );
  }

  console.log("\nГотово: https://vk.com/stp_kotov");
  console.log("Отложенные: Управление → Материалы → Отложенные");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
