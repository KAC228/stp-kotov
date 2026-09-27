"use client";

const MESSAGE =
  "Онлайн-оплата: для перехода на страницу банка используйте Яндекс Браузер или установите российские корневые сертификаты (ГОСТ TLS) — иначе форма оплаты может не открыться.";

export default function PaymentTicker() {
  return (
    <div
      className="ksd-payment-ticker relative overflow-hidden border-b border-amber-500/20 bg-amber-950/90 text-amber-100"
      role="marquee"
      aria-live="polite"
      aria-label={MESSAGE}
    >
      <div className="ksd-payment-ticker-track flex w-max items-center gap-8 py-2 text-[11px] sm:text-xs leading-snug whitespace-nowrap">
        <span className="px-4 sm:px-6">{MESSAGE}</span>
        <span className="px-4 sm:px-6" aria-hidden>
          {MESSAGE}
        </span>
      </div>
    </div>
  );
}
