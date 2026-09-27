/** Единое форматирование российского номера для полей ввода */

function digitsOnly(raw: string): string {
  return raw.replace(/\D/g, "");
}

function normalizeRuDigits(digits: string): string {
  let normalized = digits;
  if (normalized.startsWith("8")) normalized = `7${normalized.slice(1)}`;
  if (normalized !== "" && !normalized.startsWith("7")) normalized = `7${normalized}`;
  return normalized.slice(0, 11);
}

/** Собрать маску +7 (XXX) XXX-XX-XX из цифр. Пустая строка / только «7» → "+7 ". */
export function formatPhoneRu(raw: string): string {
  const normalized = normalizeRuDigits(digitsOnly(raw));
  if (normalized === "" || normalized === "7") return "+7 ";

  const rest = normalized.slice(1);
  const p1 = rest.slice(0, 3);
  const p2 = rest.slice(3, 6);
  const p3 = rest.slice(6, 8);
  const p4 = rest.slice(8, 10);

  let out = "+7";
  if (p1) out += ` (${p1}`;
  if (p1.length === 3) out += ")";
  if (p2) out += ` ${p2}`;
  if (p3) out += `-${p3}`;
  if (p4) out += `-${p4}`;
  return out;
}

/**
 * onChange с учётом Backspace по скобкам/пробелам/дефисам маски.
 * Если стёрли только символ маски (число цифр не изменилось) — удаляем последнюю цифру.
 */
export function formatPhoneRuInput(prevFormatted: string, nextRaw: string): string {
  const trimmed = nextRaw.trim();
  // Полная очистка поля
  if (trimmed === "" || trimmed === "+" || trimmed === "+7") {
    return "+7 ";
  }

  const prevDigits = normalizeRuDigits(digitsOnly(prevFormatted));
  const nextDigits = normalizeRuDigits(digitsOnly(nextRaw));

  // Backspace/Delete попал в скобку, пробел или дефис — цифр столько же, строка короче
  if (
    nextDigits.length === prevDigits.length &&
    nextRaw.length < prevFormatted.length &&
    prevDigits.length > 1
  ) {
    return formatPhoneRu(prevDigits.slice(0, -1));
  }

  return formatPhoneRu(nextDigits);
}

export function isPhoneCompleteRu(value: string): boolean {
  return digitsOnly(value).length >= 11;
}
