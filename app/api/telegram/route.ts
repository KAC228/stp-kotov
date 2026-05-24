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
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId   = process.env.TELEGRAM_CHAT_ID;

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
    else                             value = esc(raw);

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
  } catch (networkErr) {
    return NextResponse.json(
      { error: "Network error reaching Telegram", detail: String(networkErr) },
      { status: 502 }
    );
  }

  if (!tgRes.ok) {
    const body = await tgRes.text().catch(() => "");
    return NextResponse.json(
      { error: "Telegram rejected the message", status: tgRes.status, detail: body },
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
