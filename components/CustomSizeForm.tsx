"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Phone, Send, CheckCircle2, Ruler, X } from "lucide-react";
import {
  fileToAttachmentFields,
  MAX_ATTACHMENT_BYTES,
  submitTelegramJson,
} from "@/lib/submitTelegram";
import { formatPhoneRu, isPhoneCompleteRu } from "@/lib/phone";
import FormPrivacyNote from "@/components/FormPrivacyNote";

interface CustomSizeFormProps {
  onClose?: () => void;
}

export default function CustomSizeForm({ onClose }: CustomSizeFormProps) {
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      setPhone("");
      return;
    }
    setPhone(formatPhoneRu(raw));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0] ?? null;
    setFileError("");
    if (next && next.size > MAX_ATTACHMENT_BYTES) {
      setFile(null);
      setFileError("Файл не должен превышать 5 МБ");
      return;
    }
    setFile(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneCompleteRu(phone)) return;

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
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
            <Ruler className="w-4 h-4 text-zinc-400" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-white font-semibold text-[15px] tracking-tight">Индивидуальный размер</p>
            <p className="text-zinc-600 text-xs mt-0.5">Прикрепите чертёж или эскиз — рассчитаем за 1 час</p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть форму"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 py-6 text-center"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-400" strokeWidth={1.5} />
            <p className="text-white font-semibold">Заявка отправлена</p>
            <p className="text-zinc-500 text-sm max-w-xs">Инженер свяжется с вами в течение часа.</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="custom-size-phone" className="text-zinc-600 text-[11px] font-mono tracking-[0.18em] uppercase mb-2 block">
                Телефон <span className="text-white">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" strokeWidth={1.75} />
                <input
                  id="custom-size-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  onFocus={() => {
                    if (!phone) setPhone("+7 ");
                  }}
                  placeholder="+7 (___) ___-__-__"
                  maxLength={18}
                  className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl pl-10 pr-4 py-3.5 text-white text-[15px] placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-600 text-[11px] font-mono tracking-[0.18em] uppercase mb-2 block">
                Чертёж / эскиз (необязательно)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-dashed border-zinc-700 bg-zinc-800/40 text-zinc-400 text-sm hover:border-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <Upload className="w-4 h-4" strokeWidth={1.75} />
                {file ? file.name : "Прикрепить файл (до 5 МБ)"}
              </button>
              {fileError && <p className="text-red-400 text-xs mt-1.5">{fileError}</p>}
            </div>

            {status === "error" && (
              <p className="text-red-400 text-sm">Не удалось отправить — попробуйте ещё раз.</p>
            )}

            <div className="space-y-3 pt-1">
              <button
                type="submit"
                disabled={status === "loading" || !isPhoneCompleteRu(phone)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-zinc-950 rounded-xl text-[15px] font-semibold hover:bg-zinc-100 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" strokeWidth={2} />
                {status === "loading" ? "Отправляем…" : "Отправить на расчёт"}
              </button>
              <FormPrivacyNote />
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
