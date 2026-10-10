"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { PATHS } from "@/constants/brand";

/** localStorage: "accepted" | "rejected" (legacy "true" тоже считается принятием) */
export const COOKIE_CONSENT_KEY = "cookie_consent";

export function hasAcceptedCookies(): boolean {
  if (typeof window === "undefined") return false;
  const v = localStorage.getItem(COOKIE_CONSENT_KEY);
  return v === "accepted" || v === "true";
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(COOKIE_CONSENT_KEY)) return;
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) setVisible(true);
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    window.dispatchEvent(new Event("ksd-cookie-consent"));
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    window.dispatchEvent(new Event("ksd-cookie-consent"));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="ksd-cookie-banner fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-2rem)] max-w-lg"
      role="dialog"
      aria-label="Уведомление о файлах cookie"
    >
      <div
        className="ksd-cookie-panel flex flex-col gap-4 px-5 py-4 rounded-2xl border backdrop-blur-md"
        style={{
          background: "rgba(24,24,27,0.92)",
          borderColor: "rgba(63,63,70,0.8)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.04) inset, 0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center">
            <Cookie className="w-4 h-4 text-zinc-400" strokeWidth={1.75} />
          </div>
          <p className="ksd-cookie-text flex-1 text-zinc-400 text-[13px] leading-relaxed">
            Мы используем необходимые cookie для работы сайта. Аналитика
            «Яндекс.Метрика» (включая запись сессий — вебвизор) включается{" "}
            <span className="text-zinc-300">только после вашего согласия</span>.
            Подробнее — в{" "}
            <Link
              href={PATHS.cookies}
              className="ksd-cookie-link text-zinc-300 underline underline-offset-2 decoration-zinc-600 hover:text-white hover:decoration-zinc-400 transition-colors"
            >
              политике cookie
            </Link>
            {" "}и{" "}
            <Link
              href={PATHS.privacy}
              className="ksd-cookie-link text-zinc-300 underline underline-offset-2 decoration-zinc-600 hover:text-white hover:decoration-zinc-400 transition-colors"
            >
              политике конфиденциальности
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <button
            type="button"
            onClick={reject}
            className="shrink-0 px-5 py-2.5 rounded-xl text-[13px] font-medium border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 active:scale-95 transition-all duration-150"
          >
            Отклонить
          </button>
          <button
            type="button"
            onClick={accept}
            className="shrink-0 px-5 py-2.5 bg-white text-zinc-950 rounded-xl text-[13px] font-semibold hover:bg-zinc-100 active:scale-95 transition-all duration-150"
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
