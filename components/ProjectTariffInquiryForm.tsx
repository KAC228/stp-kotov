"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { formatPhoneRu, isPhoneCompleteRu } from "@/lib/phone";
import { submitTelegramJson } from "@/lib/submitTelegram";
import FormPrivacyNote from "@/components/FormPrivacyNote";
import { formatRub } from "@/lib/fliben-content";

type Status = "idle" | "loading" | "success" | "error";

export default function ProjectTariffInquiryForm({
  areaSqm,
  projectTitle,
  tariffName,
  priceRub,
}: {
  areaSqm: number;
  projectTitle: string;
  tariffName: string;
  priceRub: number | null;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const inputClass =
    "w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneCompleteRu(phone)) return;
    setStatus("loading");
    try {
      const res = await submitTelegramJson({
        type: "Заявка на типовой проект",
        project: projectTitle,
        area: `${areaSqm} м²`,
        tariff: tariffName,
        price: formatRub(priceRub),
        name: name || "Не указано",
        phone,
        comment: comment || "",
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
        <Check className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
        <p className="text-white font-medium mb-1">Заявка отправлена</p>
        <p className="text-zinc-400 text-sm">Инженер свяжется с вами для уточнения деталей.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputClass}
      />
      <input
        type="tel"
        placeholder="+7 (___) ___-__-__"
        value={phone}
        onChange={(e) => setPhone(formatPhoneRu(e.target.value))}
        className={inputClass}
        required
      />
      <textarea
        placeholder="Комментарий (необязательно)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        className={`${inputClass} resize-none`}
      />
      {status === "error" && (
        <p className="text-red-400 text-sm">Не удалось отправить. Попробуйте позже или позвоните нам.</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-100 text-sm font-medium hover:bg-cyan-500/25 transition-colors disabled:opacity-60"
      >
        {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Отправить заявку"}
      </button>
      <FormPrivacyNote />
    </form>
  );
}
