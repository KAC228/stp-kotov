import { NextResponse } from "next/server";

const KEY_LABELS: Record<string, string> = {
  customerType: "Тип клиента",
  orgName: "Организация",
  inn: "ИНН",
  legalAddress: "Юр. адрес",
  address: "Адрес доставки",
  paymentMethod: "Способ оплаты",
  comment: "Комментарий",
  items: "Состав заказа",
  total: "Сумма заказа",
  dims: "Нужный размер",
  company: "Компания",
  message: "Сообщение",
  role: "Роль",
  question: "Вопрос",
  sku: "Артикул",
  quoteSku: "Артикул конфигурации",
  quoteSummary: "Краткая конфигурация",
  quoteDetails: "Параметры конфигуратора",
};

const PAYMENT_LABELS: Record<string, string> = {
  card: "Банковская карта",
  sbp: "СБП / QR-код",
  mirpay: "Mir Pay / СБПэй",
  invoice: "Счёт (безналичный расчёт)",
};

const CUSTOMER_LABELS: Record<string, string> = {
  individual: "Физическое лицо",
  legal: "Юридическое лицо",
};

const HEADER_KEYS = new Set([
  "name",
  "username",
  "fio",
  "contactName",
  "phone",
  "tel",
  "telephone",
  "phone_number",
  "type",
  "email",
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

function parseNotifyIds(raw: string | undefined): number[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
}

async function vkCall(
  token: string,
  method: string,
  params: Record<string, string | number>
): Promise<{ response?: unknown; error?: { error_code: number; error_msg: string } }> {
  const body = new URLSearchParams({
    access_token: token,
    v: "5.199",
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ),
  });
  const res = await fetch(`https://api.vk.com/method/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  return res.json();
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_NEXT_VK_API !== "1") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const token = process.env.VK_ACCESS_TOKEN?.trim() ?? "";
  const notifyIds = parseNotifyIds(process.env.VK_NOTIFY_USER_IDS);
  const devMock = process.env.VK_DEV_MOCK === "true";

  const origin = req.headers.get("origin") ?? "";
  const allowedOrigins = new Set(
    (process.env.VK_ALLOWED_ORIGINS ?? "http://localhost:3000,http://127.0.0.1:3000")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
  if (origin && !allowedOrigins.has(origin)) {
    return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  }

  if (devMock && process.env.NODE_ENV === "development") {
    console.info("[vk] VK_DEV_MOCK=true — заявка не отправлена в ВК");
    return NextResponse.json({ success: true, mock: true });
  }

  if (!token || notifyIds.length === 0) {
    console.error("[vk] Missing VK_ACCESS_TOKEN or VK_NOTIFY_USER_IDS");
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
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (data.website) {
    return NextResponse.json({ error: "Invalid form submission" }, { status: 400 });
  }
  delete data.website;
  delete data._fileBase64;
  delete data._fileName;
  delete data._fileMime;

  const name = String(
    data.name ?? data.username ?? data.fio ?? data.contactName ?? "Не указано"
  );
  const phone = String(
    data.phone ?? data.tel ?? data.telephone ?? data.phone_number ?? "Не указан"
  );
  const type = String(data.type ?? "Заявка с сайта");
  const email = String(data.email ?? "");

  let msg = `НОВАЯ ЗАЯВКА — СТП-КОТОВ\n\n`;
  msg += `Клиент: ${name}\n`;
  msg += `Телефон: ${phone}\n`;
  if (email) msg += `Email: ${email}\n`;
  msg += `Форма: ${type}\n`;
  msg += `\n────────────────────\n\n`;
  msg += `ДЕТАЛИ:\n`;

  let details = "";
  for (const [key, raw] of Object.entries(data)) {
    if (HEADER_KEYS.has(key)) continue;
    if (raw === null || raw === undefined || raw === "") continue;

    const label =
      KEY_LABELS[key] ??
      key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

    let value: string;
    if (key === "paymentMethod") value = String(PAYMENT_LABELS[String(raw)] ?? raw);
    else if (key === "customerType") value = String(CUSTOMER_LABELS[String(raw)] ?? raw);
    else if (key === "total") value = `${Number(raw).toLocaleString("ru-RU")} ₽`;
    else value = String(raw).slice(0, 4000);

    details += `• ${label}: ${value}\n`;
  }
  msg += details || "Дополнительных данных нет";

  let sent = false;
  for (const peerId of notifyIds) {
    try {
      const result = await vkCall(token, "messages.send", {
        peer_id: peerId,
        message: msg,
        random_id: Math.floor(Math.random() * 2_000_000_000),
      });
      if (result.response !== undefined && !result.error) {
        sent = true;
      } else {
        console.error("[vk] messages.send error:", result.error);
      }
    } catch (err) {
      console.error("[vk] network error:", err);
    }
  }

  if (!sent) {
    return NextResponse.json(
      {
        error: "VK rejected the message",
        hint: "Включите сообщения сообщества и разрешите переписку с получателем",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
