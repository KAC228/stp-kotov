/** Единое форматирование российского номера для полей ввода */

export function formatPhoneRu(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  let normalized = digits;

  if (normalized.startsWith("8")) normalized = `7${normalized.slice(1)}`;
  if (!normalized.startsWith("7")) normalized = `7${normalized}`;
  normalized = normalized.slice(0, 11);

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
  if (out === "+7") out = "+7 ";
  return out;
}

export function isPhoneCompleteRu(value: string): boolean {
  return value.replace(/\D/g, "").length >= 11;
}
