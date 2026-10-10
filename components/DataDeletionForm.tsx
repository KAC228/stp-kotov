"use client";

import { useState } from "react";
import { Check, Loader2, Trash2 } from "lucide-react";
import { formatPhoneRuInput, isPhoneCompleteRu } from "@/lib/phone";
import { submitLeadJson } from "@/lib/submitLead";
import FormConsent from "@/components/FormConsent";

type Status = "idle" | "loading" | "success" | "error";

/**
 * Запрос на удаление / уничтожение персональных данных (п. 20 чеклиста / ст. 14–21 ФЗ-152).
 */
export default function DataDeletionForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [pdConsent, setPdConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const inputBase =
    "w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3.5 text-white text-[15px] placeholder-zinc-500 focus:outline-none focus-visible:border-cyan-400/50 focus-visible:ring-2 focus-visible:ring-cyan-400/30 transition-colors";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !pdConsent) return;
    if (phone && !isPhoneCompleteRu(phone)) return;
    setStatus("loading");
    try {
      const res = await submitLeadJson({
        type: "Запрос на удаление персональных данных",
        name: name.trim() || "Не указано",
        email: email.trim(),
        phone: phone.trim() || "Не указан",
        question: details.trim() || "Прошу удалить / уничтожить мои персональные данные.",
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-8 text-center">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
          <Check className="w-6 h-6 text-emerald-400" strokeWidth={2} />
        </div>
        <p className="text-white font-medium mb-2">Запрос отправлен</p>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto">
          Мы рассмотрим обращение и уничтожим или обезличим данные в срок до 30 дней,
          если иное не требуется законом или договором.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 space-y-4"
      aria-labelledby="data-deletion-title"
    >
      <div className="flex items-start gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
          <Trash2 className="w-4 h-4 text-zinc-400" strokeWidth={1.75} />
        </div>
        <div>
          <h3 id="data-deletion-title" className="text-white font-semibold tracking-tight">
            Запрос на удаление данных
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed mt-1">
            Укажите email или телефон, с которых оставляли заявку — так мы найдём ваши данные.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="del-name" className="text-zinc-400 text-xs font-mono tracking-[0.15em] uppercase">
            Имя
          </label>
          <input
            id="del-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Как к вам обращаться"
            className={inputBase}
            autoComplete="name"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="del-email" className="text-zinc-400 text-xs font-mono tracking-[0.15em] uppercase">
            Email *
          </label>
          <input
            id="del-email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.ru"
            className={inputBase}
            autoComplete="email"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="del-phone" className="text-zinc-400 text-xs font-mono tracking-[0.15em] uppercase">
          Телефон
        </label>
        <input
          id="del-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(formatPhoneRuInput(phone, e.target.value))}
          onFocus={() => {
            if (!phone) setPhone("+7 ");
          }}
          placeholder="+7 (___) ___-__-__"
          maxLength={18}
          className={inputBase}
          autoComplete="tel"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="del-details" className="text-zinc-400 text-xs font-mono tracking-[0.15em] uppercase">
          Комментарий
        </label>
        <textarea
          id="del-details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={3}
          placeholder="Номер заказа, дата обращения — по возможности"
          className={`${inputBase} resize-none`}
        />
      </div>

      {status === "error" && (
        <p className="text-red-400 text-sm" role="alert">
          Не удалось отправить запрос. Напишите на info@stp-kotov.ru или попробуйте ещё раз.
        </p>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-4 pt-1">
        <FormConsent
          pdConsent={pdConsent}
          onPdConsentChange={setPdConsent}
          className="max-w-[340px]"
        />
        <button
          type="submit"
          disabled={status === "loading" || !pdConsent}
          className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-zinc-950 rounded-full text-[15px] font-semibold hover:bg-zinc-100 disabled:opacity-60 transition-colors"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Отправляем…
            </>
          ) : (
            "Отправить запрос"
          )}
        </button>
      </div>
    </form>
  );
}
