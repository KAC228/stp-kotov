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
      className="ksd-cookie-banner fixed inset-0 z-[200] flex items-center justify-center p-4 pointer-events-none"
      role="dialog"
      aria-label="Уведомление о файлах cookie"
    >
      <div
        className="ksd-cookie-panel pointer-events-auto w-full max-w-md flex items-center gap-3 px-3.5 py-2.5 rounded-xl border backdrop-blur-md"
        style={{
          background: "rgba(24,24,27,0.94)",
          borderColor: "rgba(63,63,70,0.8)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.04) inset, 0 12px 40px rgba(0,0,0,0.55)",
        }}
      >
        <div className="shrink-0 w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center">
          <Cookie className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.75} />
        </div>
        <p className="ksd-cookie-text flex-1 min-w-0 text-zinc-400 text-[12px] leading-snug">
          Cookie и Метрика — только с согласия.{" "}
          <Link
            href={PATHS.cookies}
            className="ksd-cookie-link text-zinc-300 underline underline-offset-2 decoration-zinc-600 hover:text-white transition-colors"
          >
            Политика
          </Link>
        </p>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={reject}
            className="px-3 py-1.5 rounded-lg text-[12px] font-medium border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 active:scale-95 transition-all duration-150"
          >
            Нет
          </button>
          <button
            type="button"
            onClick={accept}
            className="px-3.5 py-1.5 bg-white text-zinc-950 rounded-lg text-[12px] font-semibold hover:bg-zinc-100 active:scale-95 transition-all duration-150"
          >
            ОК
          </button>
        </div>
      </div>
    </div>
  );
}
