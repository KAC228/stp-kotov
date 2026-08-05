"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
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
    localStorage.setItem(STORAGE_KEY, "true");
    window.dispatchEvent(new Event("ksd-cookie-consent"));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="ksd-cookie-banner fixed bottom-6 left-1/2 z-[200] w-[calc(100%-2rem)] max-w-lg"
      role="dialog"
      aria-label="Уведомление о файлах cookie"
    >
      <div
        className="ksd-cookie-panel flex flex-col sm:flex-row items-start sm:items-center gap-4 px-5 py-4 rounded-2xl border backdrop-blur-md"
        style={{
          background: "rgba(24,24,27,0.92)",
          borderColor: "rgba(63,63,70,0.8)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.04) inset, 0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        <div className="shrink-0 w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center">
          <Cookie className="w-4 h-4 text-zinc-400" strokeWidth={1.75} />
        </div>

        <p className="ksd-cookie-text flex-1 text-zinc-400 text-[13px] leading-relaxed">
          Мы используем файлы cookie и Яндекс Метрику для улучшения работы сайта.
          Оставаясь на сайте, вы соглашаетесь с нашей{" "}
          <Link
            href="/privacy"
            className="ksd-cookie-link text-zinc-300 underline underline-offset-2 decoration-zinc-600 hover:text-white hover:decoration-zinc-400 transition-colors"
          >
            Политикой конфиденциальности
          </Link>
          .
        </p>

        <button
          type="button"
          onClick={accept}
          className="shrink-0 px-5 py-2.5 bg-white text-zinc-950 rounded-xl text-[13px] font-semibold hover:bg-zinc-100 active:scale-95 transition-all duration-150"
        >
          Принять
        </button>
      </div>
    </div>
  );
}
