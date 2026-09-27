"use client";

import Link from "next/link";
import { PATHS } from "@/constants/brand";

type FormConsentProps = {
  pdConsent: boolean;
  onPdConsentChange: (v: boolean) => void;
  /** Для заказа/оплаты — принятие оферты */
  offerConsent?: boolean;
  onOfferConsentChange?: (v: boolean) => void;
  requireOffer?: boolean;
  className?: string;
};

/**
 * Явное согласие на обработку ПДн (чекбокс).
 * Для оформления заказа — дополнительно принятие публичной оферты.
 */
export default function FormConsent({
  pdConsent,
  onPdConsentChange,
  offerConsent = false,
  onOfferConsentChange,
  requireOffer = false,
  className = "",
}: FormConsentProps) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      <label className="flex items-start gap-2.5 cursor-pointer group">
        <input
          type="checkbox"
          checked={pdConsent}
          onChange={(e) => onPdConsentChange(e.target.checked)}
          required
          className="mt-0.5 shrink-0 w-4 h-4 rounded border-zinc-600 bg-zinc-900 text-cyan-400 focus:ring-cyan-400/40 focus:ring-offset-0 cursor-pointer"
        />
        <span className="text-zinc-500 text-xs leading-relaxed group-hover:text-zinc-400 transition-colors">
          Согласен(на) на обработку персональных данных в соответствии с{" "}
          <Link
            href={PATHS.privacy}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 underline underline-offset-2 hover:text-zinc-200 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            политикой конфиденциальности
          </Link>
          . Данные заявки передаются в сообщество ВКонтакте для обработки обращения.
        </span>
      </label>

      {requireOffer && onOfferConsentChange && (
        <label className="flex items-start gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={offerConsent}
            onChange={(e) => onOfferConsentChange(e.target.checked)}
            required
            className="mt-0.5 shrink-0 w-4 h-4 rounded border-zinc-600 bg-zinc-900 text-cyan-400 focus:ring-cyan-400/40 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-zinc-500 text-xs leading-relaxed group-hover:text-zinc-400 transition-colors">
            Ознакомлен(а) и принимаю условия{" "}
            <Link
              href={PATHS.terms}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 underline underline-offset-2 hover:text-zinc-200 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              публичной оферты
            </Link>
            .
          </span>
        </label>
      )}
    </div>
  );
}
