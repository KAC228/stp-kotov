import { NextResponse } from "next/server";

/** Escape characters that break Telegram HTML parse mode */
function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const KEY_LABELS: Record<string, string> = {
  customerType:  "Тип клиента",
  orgName:       "Организация",
  inn:           "ИНН",
  legalAddress:  "Юр. адрес",
  address:       "Адрес доставки",
  paymentMethod: "Способ оплаты",
  comment:       "Комментарий",
  items:         "Состав заказа",
  total:         "Сумма заказа",
  dims:          "Нужный размер",
  company:       "Компания",
  message:       "Сообщение",
  role:          "Роль",
  question:      "Вопрос",
  sku:           "Артикул",
  quoteSku:      "Артикул конфигурации",
  quoteSummary:  "Краткая конфигурация",
  quoteDetails:  "Параметры конфигуратора",
};

const PAYMENT_LABELS: Record<string, string> = {
  card:    "Банковская карта",
  sbp:     "СБП / QR-код",
  mirpay:  "Mir Pay / СБПэй",
  invoice: "Счёт (безналичный расчёт)",
};

const CUSTOMER_LABELS: Record<string, string> = {
  individual: "Физическое лицо",
  legal:      "Юридическое лицо",
};

const HEADER_KEYS = new Set([
  "name", "username", "fio", "contactName",
  "phone", "tel", "telephone", "phone_number",
  "type", "email",
]);

const RATE_WINDOW_MS = 15_000;
const lastPostByIp = new Map<string, number>();

function clientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function isTooFrequent(ip: string): boolean {
  const now = Date.now();
  const prev = lastPostByIp.get(ip) ?? 0;
  if (now - prev < RATE_WINDOW_MS) return true;
  lastPostByIp.set(ip, now);
  if (lastPostByIp.size > 2000) {
    for (const [key, t] of lastPostByIp) {
      if (now - t > RATE_WINDOW_MS * 4) lastPostByIp.delete(key);
    }
  }
  return false;
}

export async function POST(req: Request) {
  // На статическом хостинге этот route не деплоится; защита на случай Node-сервера.
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_NEXT_TELEGRAM_API !== "1") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId   = process.env.TELEGRAM_CHAT_ID;
  const devMock  = process.env.TELEGRAM_DEV_MOCK === "true";

  const origin = req.headers.get("origin") ?? "";
  const allowedOrigins = new Set(
    (process.env.TELEGRAM_ALLOWED_ORIGINS ?? "http://localhost:3000,http://127.0.0.1:3000")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
  // Пустой Origin (same-origin) ок; чужой Origin — нет
  if (origin && !allowedOrigins.has(origin)) {
    return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  }

  if (devMock && process.env.NODE_ENV === "development") {
    console.info("[telegram] TELEGRAM_DEV_MOCK=true — заявка не отправлена в Telegram");
    return NextResponse.json({ success: true, mock: true });
  }

  if (!botToken || !chatId) {
    console.error("[telegram] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return NextResponse.json(
      { error: "Server misconfigured: missing env vars" },
      { status: 500 }
    );
  }

  const ip = clientIp(req);
  if (isTooFrequent(ip)) {
    return NextResponse.json(
      { error: "Слишком частые запросы. Подождите несколько секунд." },
      { status: 429 }
    );
  }

  let data: Record<string, unknown>;
  let attachedFile: File | null = null;

  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    let fd: FormData;
    try {
      fd = await req.formData();
    } catch {
      return NextResponse.json({ error: "Invalid multipart body" }, { status: 400 });
    }
    data = {};
    for (const [key, val] of fd.entries()) {
      if (val instanceof File && val.size > 0) {
        if (val.size > 5 * 1024 * 1024) {
          return NextResponse.json({ error: "File too large" }, { status: 413 });
        }
        const allowed = new Set([
          "application/pdf",
          "image/jpeg",
          "image/png",
          "image/webp",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]);
        if (val.type && !allowed.has(val.type)) {
          return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
        }
        attachedFile = val;
      } else {
        data[key] = val;
      }
    }
  } else {
    try {
      data = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
  }

  if (data.website) {
    return NextResponse.json({ error: "Invalid form submission" }, { status: 400 });
  }
  delete data.website;

  const name  = esc(data.name ?? data.username ?? data.fio ?? data.contactName ?? "Не указано");
  const phone = esc(data.phone ?? data.tel ?? data.telephone ?? data.phone_number ?? "Не указан");
  const type  = esc(data.type ?? "Заявка с сайта");
  const email = esc(data.email ?? "");

  let msg = `🔥 <b>НОВАЯ ЗАЯВКА!</b>\n\n`;
  msg += `<b>👤 Клиент:</b> ${name}\n`;
  msg += `<b>📞 Телефон:</b> <code>${phone}</code>\n`;
  if (email) msg += `<b>📧 Email:</b> ${email}\n`;
  msg += `<b>📂 Форма:</b> ${type}\n`;
  msg += `\n────────────────────\n\n`;
  msg += `📝 <b>ДЕТАЛИ:</b>\n`;

  let details = "";
  for (const [key, raw] of Object.entries(data)) {
    if (HEADER_KEYS.has(key)) continue;
    if (raw === null || raw === undefined || raw === "") continue;

    const label = KEY_LABELS[key]
      ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

    let value: string;
    if (key === "paymentMethod")    value = esc(PAYMENT_LABELS[String(raw)] ?? raw);
    else if (key === "customerType") value = esc(CUSTOMER_LABELS[String(raw)] ?? raw);
    else if (key === "total")        value = `${Number(raw).toLocaleString("ru-RU")} ₽`;
    else                             value = esc(String(raw).slice(0, 4000));

    details += `• <b>${esc(label)}:</b> ${value}\n`;
  }

  msg += details || "<i>Дополнительных данных нет</i>";

  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  let tgRes: Response;
  try {
    tgRes = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id:    chatId,
        text:       msg,
        parse_mode: "HTML",
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "Network error reaching Telegram" },
      { status: 502 }
    );
  }

  if (!tgRes.ok) {
    return NextResponse.json(
      { error: "Telegram rejected the message" },
      { status: 502 }
    );
  }

  if (attachedFile) {
    try {
      const docFd = new FormData();
      docFd.append("chat_id", chatId);
      docFd.append("document", attachedFile, attachedFile.name);
      docFd.append("caption", `📎 Реквизиты: ${esc(attachedFile.name)}`);
      await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
        method: "POST",
        body: docFd,
      });
    } catch (docErr) {
      console.error("[telegram] Failed to send document:", docErr);
    }
  }

  return NextResponse.json({ success: true });
}
