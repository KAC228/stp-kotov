"use client";

/** Бегущая строка услуг — дословно из ТЗ «корректировка 777» */
const SERVICES = [
  "Проектирование",
  "Монтаж",
  "Пусконаладочные работы",
  "Производство",
  "Продажа",
  "Аудит",
] as const;

const MESSAGE = SERVICES.join("     ·     ");

export default function PaymentTicker() {
  return (
    <div
      className="ksd-payment-ticker relative overflow-hidden border-b border-zinc-700/40 bg-zinc-900/95 text-zinc-300"
      role="marquee"
      aria-live="polite"
      aria-label={SERVICES.join(", ")}
    >
      <div className="ksd-payment-ticker-track flex w-max items-center gap-8 py-2 text-[11px] sm:text-xs leading-snug whitespace-nowrap tracking-wide uppercase font-mono">
        <span className="px-4 sm:px-6">{MESSAGE}</span>
        <span className="px-4 sm:px-6" aria-hidden>
          {MESSAGE}
        </span>
      </div>
    </div>
  );
}
