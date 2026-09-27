export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

function resolveSendUrl(): string {
  if (typeof window === "undefined") return "/send.php";
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return "/api/vk";
  return "/send.php";
}

/** Отправка заявки: localhost → /api/vk, прод → /send.php (ВК). */
export async function submitLeadJson(
  payload: Record<string, unknown>
): Promise<Response> {
  return fetch(resolveSendUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Ловушка для простых ботов: настоящее приложение никогда не заполняет поле.
    body: JSON.stringify({ ...payload, website: "" }),
  });
}

function resolvePayUrl(): string {
  if (typeof window === "undefined") return "/pay.php";
  return "/pay.php";
}

/** Init T‑Bank → PaymentURL (карта / СБП на форме банка). */
export async function submitPayInit(
  payload: Record<string, unknown>
): Promise<Response> {
  return fetch(resolvePayUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, website: "" }),
  });
}

/** Редирект только на хосты платёжной формы T‑Bank / Tinkoff. */
export function isAllowedTbankPaymentUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase();
    if (
      host === "securepay.tinkoff.ru" ||
      host === "securepay.tbank.ru" ||
      host === "pay.tbank.ru" ||
      host === "pay.tinkoff.ru" ||
      host === "www.tinkoff.ru" ||
      host === "www.tbank.ru"
    ) {
      return true;
    }
    return /(^|\.)tinkoff\.ru$|(^|\.)tbank\.ru$/.test(host);
  } catch {
    return false;
  }
}

/** Кодирует файл в base64 для передачи в JSON (PHP: send.php → вложение ВК). */
export async function fileToAttachmentFields(file: File): Promise<{
  _fileBase64: string;
  _fileName: string;
  _fileMime: string;
}> {
  if (file.size > MAX_ATTACHMENT_BYTES) {
    throw new Error("FILE_TOO_LARGE");
  }

  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return {
    _fileBase64: btoa(binary),
    _fileName: file.name || "attachment.bin",
    _fileMime: file.type || "application/octet-stream",
  };
}
