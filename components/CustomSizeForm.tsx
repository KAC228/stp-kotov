"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Phone, Send, CheckCircle2, Ruler, X } from "lucide-react";
import { fileToAttachmentFields, submitTelegramJson } from "@/lib/submitTelegram";

// ─── phone helpers (same logic as OrderForm) ──────────────────────────────────

function formatPhoneRu(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const d =
    digits.startsWith("7") || digits.startsWith("8") ? digits.slice(1) : digits;
  const p = d.slice(0, 10);
  let result = "+7";
  if (p.length > 0) result += ` (${p.slice(0, 3)}`;
  if (p.length >= 4) result += `) ${p.slice(3, 6)}`;
  if (p.length >= 7) result += `-${p.slice(6, 8)}`;
  if (p.length >= 9) result += `-${p.slice(8, 10)}`;
  return result;
}

function isPhoneComplete(phone: string): boolean {
  return phone.replace(/\D/g, "").length === 11;
}

// ─── component ────────────────────────────────────────────────────────────────

interface CustomSizeFormProps {
  onClose?: () => void;
}

export default function CustomSizeForm({ onClose }: CustomSizeFormProps) {
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") { setPhone(""); return; }
    setPhone(formatPhoneRu(raw));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneComplete(phone)) return;

    setStatus("loading");

    try {
      const body: Record<string, unknown> = {
        type: "Свой размер КСД",
        phone,
      };
      if (file) Object.assign(body, await fileToAttachmentFields(file));

      const res = await submitTelegramJson(body);
      if (!res.ok) throw new Error("Server error");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <motion.div
      key="custom-size-form"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ type: "spring", damping: 26, stiffness: 280 }}
      className="mt-4 max-h-[85vh] overflow-y-auto overflow-x-hidden rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/60 p-5 space-y-4 [scrollbar-gutter:stable]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
            <Ruler className="w-4 h-4 text-zinc-400" strokeWidth={1.75} />
          </div>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Загрузите план или чертёж, и мы рассчитаем стоимость&nbsp;индивидуального размера.
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/80 transition-colors shrink-0 mt-0.5"
            aria-label="Закрыть"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" strokeWidth={2} />
            <p className="text-emerald-300 text-sm font-medium">
              Принято! Ответим в течение 1 часа.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* File upload */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg,.heic"
                onChange={handleFileChange}
                className="hidden"
                id="custom-size-file"
              />
              <label
                htmlFor="custom-size-file"
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  file
                    ? "border-cyan-400/40 bg-zinc-800 text-zinc-300"
                    : "border-zinc-700 bg-zinc-900 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400"
                }`}
              >
                <Upload className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                <span className="text-xs truncate min-w-0">
                  {file ? file.name : "Загрузить план / чертёж (PDF, DWG, PNG…)"}
                </span>
              </label>
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none"
                strokeWidth={1.75}
              />
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+7 (___) ___-__-__"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-zinc-700 outline-none transition-all duration-200 focus:border-zinc-600"
              />
            </div>

            {status === "error" && (
              <p className="text-red-400 text-xs">
                Ошибка при отправке. Попробуйте ещё раз.
              </p>
            )}

            <button
              type="submit"
              disabled={!isPhoneComplete(phone) || status === "loading"}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 will-change-[box-shadow] ${
                isPhoneComplete(phone)
                  ? "bg-white text-zinc-950 hover:bg-zinc-100 hover:shadow-glow-strong"
                  : "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700"
              }`}
            >
              <Send className="w-3.5 h-3.5" strokeWidth={2} />
              {status === "loading" ? "Отправка…" : "Рассчитать стоимость"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
