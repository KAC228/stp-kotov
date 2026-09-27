"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Send, CheckCircle2, Wrench, Minus, MessageCircle } from "lucide-react";
import { formatPhoneRuInput, isPhoneCompleteRu } from "@/lib/phone";
import { submitLeadJson } from "@/lib/submitLead";
import FormConsent from "@/components/FormConsent";

// ─── component ────────────────────────────────────────────────────────────────

interface IdleInterceptorProps {
  active: boolean;
  idleMs?: number;
}

export default function IdleInterceptor({
  active,
  idleMs = 12_000,
}: IdleInterceptorProps) {
  const [visible, setVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorHint, setErrorHint] = useState("");
  const [pdConsent, setPdConsent] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissedRef = useRef(false);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!active || dismissedRef.current || visible) return;
    timerRef.current = setTimeout(() => setVisible(true), idleMs);
  }, [active, idleMs, visible]);

  useEffect(() => {
    if (!active) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    resetTimer();
    window.addEventListener("click", resetTimer);
    window.addEventListener("touchstart", resetTimer);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, [active, resetTimer]);

  useEffect(() => {
    if (status !== "success") return;
    const t = setTimeout(() => {
      setVisible(false);
      setIsMinimized(false);
      dismissedRef.current = true;
    }, 3_000);
    return () => clearTimeout(t);
  }, [status]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (visible && !isMinimized) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [visible, isMinimized]);

  const dismiss = () => {
    setVisible(false);
    setIsMinimized(false);
    dismissedRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const minimize = () => setIsMinimized(true);
  const restore = () => setIsMinimized(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneCompleteRu(phone) || !pdConsent) return;
    setStatus("loading");
    setErrorHint("");
    try {
      const res = await submitLeadJson({
        type: "Помощь инженера (конфигуратор)",
        phone,
        message:
          "Пользователь затруднился с выбором в конфигураторе. Просит инженера перезвонить.",
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        if (data?.error?.includes("Network error") || data?.error?.includes("VK")) {
          setErrorHint("Сервис заявок недоступен с этого подключения. На сервере сайта обычно работает.");
        }
        throw new Error();
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      {/* ── Full modal (centered overlay) ────────────────────────────────────── */}
      <AnimatePresence>
        {visible && !isMinimized && (
          /* Backdrop — click outside closes */
          <motion.div
            key="idle-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={dismiss}
          >
            {/* Panel — click inside does NOT close */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative w-full max-w-sm bg-zinc-900 border border-zinc-700/80 rounded-2xl p-5 shadow-2xl shadow-black/80 max-h-[90dvh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-cyan-400/10 pointer-events-none" />

              {/* Header actions */}
              <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-10">
                <button
                  type="button"
                  onClick={minimize}
                  aria-label="Свернуть"
                  className="text-zinc-600 hover:text-zinc-400 transition-colors p-0.5"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  aria-label="Закрыть"
                  className="text-zinc-600 hover:text-zinc-400 transition-colors p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 py-2 pr-14"
                  >
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" strokeWidth={2} />
                    <p className="text-white font-medium text-sm leading-snug">
                      ✅ Принято, сейчас наберём
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4 pr-14">
                      <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                        <Wrench className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm leading-snug mb-1">
                          Сложно определиться с деталями?
                        </p>
                        <p className="text-zinc-500 text-xs leading-relaxed">
                          Оставьте номер — наш инженер сам подберёт конфигурацию
                          под ваш проект.
                        </p>
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="relative">
                        <Phone
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none"
                          strokeWidth={1.75}
                        />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            setPhone(formatPhoneRuInput(phone, e.target.value));
                          }}
                          placeholder="+7 (___) ___-__-__"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-zinc-700 outline-none transition-all duration-200 focus:border-zinc-600"
                        />
                      </div>

                      {status === "error" && (
                        <p className="text-red-400 text-xs">
                          {errorHint || "Ошибка при отправке. Попробуйте ещё раз."}
                        </p>
                      )}

                      <FormConsent pdConsent={pdConsent} onPdConsentChange={setPdConsent} />

                      <button
                        type="submit"
                        disabled={!isPhoneCompleteRu(phone) || !pdConsent || status === "loading"}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 will-change-[box-shadow] ${
                          isPhoneCompleteRu(phone) && pdConsent
                            ? "bg-white text-zinc-950 hover:bg-zinc-100 hover:shadow-glow-strong"
                            : "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700"
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" strokeWidth={2} />
                        {status === "loading" ? "Отправка…" : "Отправить инженеру"}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Minimised bubble ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {visible && isMinimized && (
          <motion.button
            key="idle-bubble"
            type="button"
            onClick={restore}
            aria-label="Открыть помощь инженера"
            initial={{ opacity: 0, scale: 0.6, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 16 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="fixed z-[200] bottom-24 lg:bottom-5 right-5 w-14 h-14 rounded-full bg-zinc-900 border border-zinc-700/80 shadow-2xl shadow-black/70 flex items-center justify-center text-cyan-400 hover:border-cyan-400/50 hover:shadow-[0_0_24px_rgba(0,210,255,0.35)] transition-[border-color,box-shadow] duration-200"
          >
            <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-cyan-400 pointer-events-none" />
            <MessageCircle className="w-6 h-6 relative z-10" strokeWidth={1.75} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
