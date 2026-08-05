"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  CheckCircle,
  CreditCard,
  QrCode,
  Building2,
  User,
  Paperclip,
  FileText,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  CustomerType,
  IndividualFormData,
  LegalFormData,
  PaymentMethod,
} from "@/types";
import { PATHS, PRICE_PER_METER_RUB } from "@/constants/brand";
import { formatPhoneRu, isPhoneCompleteRu } from "@/lib/phone";
import {
  fileToAttachmentFields,
  MAX_ATTACHMENT_BYTES,
  submitTelegramJson,
  submitPayInit,
  isAllowedTbankPaymentUrl,
} from "@/lib/submitTelegram";
import FormPrivacyNote from "@/components/FormPrivacyNote";

// ─── Animation helpers ────────────────────────────────────────────────────────

const sp = { type: "spring" as const, damping: 30, stiffness: 260 };

const slideIn = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
  transition: sp,
};

// ─── Payment method options ────────────────────────────────────────────────────

type IndividualPayment = Exclude<PaymentMethod, "invoice">;

const INDIVIDUAL_PAYMENTS: Array<{
  id: IndividualPayment;
  icon: React.ElementType;
  label: string;
  sub: string;
}> = [
  { id: "card", icon: CreditCard, label: "Банковская карта", sub: "Visa, Мир, Mastercard" },
  { id: "sbp", icon: QrCode, label: "СБП / QR-код", sub: "Без комиссии, мгновенно · от 10 ₽" },
];

// ─── Reusable field components ────────────────────────────────────────────────

function FieldRow({
  label,
  required,
  children,
  first,
  fieldId,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  first?: boolean;
  fieldId?: string;
}) {
  return (
    <div className={`ksd-field-row py-4 ${first ? "first" : ""}`}>
      <label
        htmlFor={fieldId}
        className="block text-zinc-600 text-[11px] font-mono tracking-[0.18em] uppercase mb-2"
      >
        {label}
        {required && <span className="text-white ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function TextInput({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  maxLength,
  onFocus,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      maxLength={maxLength}
      onFocus={onFocus}
      className="ksd-input w-full bg-transparent text-white text-[15px] placeholder-zinc-700 outline-none border-0"
    />
  );
}

// ─── Payment method pill button ───────────────────────────────────────────────

function PaymentPill<T extends string>({
  id,
  icon: Icon,
  label,
  sub,
  active,
  onSelect,
}: {
  id: T;
  icon: React.ElementType;
  label: string;
  sub: string;
  active: boolean;
  onSelect: (id: T) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 will-change-[box-shadow] ${
        active
          ? "border-cyan-400/40 bg-zinc-800 shadow-glow ring-1 ring-cyan-400/25"
          : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-600 hover:shadow-glow"
      }`}
    >
      <Icon
        className={`w-4 h-4 shrink-0 mt-0.5 transition-colors duration-200 ${
          active ? "text-white" : "text-zinc-500"
        }`}
        strokeWidth={1.75}
      />
      <div className="min-w-0">
        <p
          className={`text-[13px] font-medium leading-tight transition-colors duration-200 ${
            active ? "text-white" : "text-zinc-400"
          }`}
        >
          {label}
        </p>
        <p className="text-zinc-600 text-[11px] leading-snug mt-0.5">{sub}</p>
      </div>
    </button>
  );
}

// ─── Customer type tab ────────────────────────────────────────────────────────

function TypeTab({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-[13px] font-medium transition-all duration-250 ${
        active
          ? "bg-white text-zinc-950 shadow-sm"
          : "text-zinc-500 hover:text-zinc-300"
      }`}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={2} />
      {label}
    </button>
  );
}

// ─── Individual form ──────────────────────────────────────────────────────────

function IndividualForm({
  data,
  onChange,
  paymentMethod,
  onPaymentChange,
}: {
  data: IndividualFormData;
  onChange: (field: keyof IndividualFormData, value: string) => void;
  paymentMethod: IndividualPayment;
  onPaymentChange: (m: IndividualPayment) => void;
}) {
  return (
    <motion.div key="individual" {...slideIn}>
      {/* Payment method */}
      <div className="mb-1">
        <p className="text-zinc-600 text-[11px] font-mono tracking-[0.18em] uppercase mb-3">
          Способ оплаты
        </p>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {INDIVIDUAL_PAYMENTS.map((opt) => (
            <PaymentPill
              key={opt.id}
              id={opt.id}
              icon={opt.icon}
              label={opt.label}
              sub={opt.sub}
              active={paymentMethod === opt.id}
              onSelect={onPaymentChange}
            />
          ))}
        </div>
        <p className="text-zinc-700 text-[11px] leading-relaxed mb-1">
          Реквизиты для перевода вы получите в ответном сообщении от менеджера.
        </p>
      </div>

      <div className="h-px bg-zinc-800 my-1" />

      {/* Contact fields */}
      <FieldRow label="ФИО" required first>
        <TextInput
          name="name"
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Иван Иванов"
          required
        />
      </FieldRow>
      <FieldRow label="Телефон" required>
        <TextInput
          name="phone"
          type="tel"
          value={data.phone}
          onChange={(e) => onChange("phone", formatPhoneRu(e.target.value))}
          onFocus={() => {
            if (!data.phone) onChange("phone", "+7 ");
          }}
          placeholder="+7 (___) ___-__-__"
          maxLength={18}
          required
        />
      </FieldRow>
      <FieldRow label="Email — для фискального чека" required>
        <TextInput
          name="email"
          type="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="ivan@example.ru"
          required
        />
      </FieldRow>
      <FieldRow label="Адрес доставки">
        <TextInput
          name="address"
          value={data.address}
          onChange={(e) => onChange("address", e.target.value)}
          placeholder="Москва, ул. Ленина, д. 1, кв. 5"
        />
      </FieldRow>
      <FieldRow label="Комментарий">
        <textarea
          name="comment"
          value={data.comment ?? ""}
          onChange={(e) => onChange("comment", e.target.value)}
          rows={2}
          placeholder="Срок, особые требования..."
          className="ksd-input w-full bg-transparent text-white text-[15px] placeholder-zinc-700 outline-none border-0 resize-none"
        />
      </FieldRow>
    </motion.div>
  );
}

// ─── Legal entity form ────────────────────────────────────────────────────────

function LegalForm({
  data,
  onChange,
  file,
  onFileChange,
}: {
  data: LegalFormData;
  onChange: (field: keyof LegalFormData, value: string) => void;
  file: File | null;
  onFileChange: (file: File | null) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const fileName = file?.name ?? null;

  return (
    <motion.div key="legal" {...slideIn}>
      {/* Invoice info banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 mb-4">
        <FileText className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" strokeWidth={1.75} />
        <div>
          <p className="text-cyan-300 text-[12px] font-medium leading-snug">
            Безналичный расчёт — выставим счёт
          </p>
          <p className="text-zinc-500 text-[12px] leading-relaxed mt-0.5">
            Полный пакет закрывающих документов: счёт-фактура, накладная, акт.
            Работаем с НДС и без.
          </p>
        </div>
      </div>

      {/* Fields */}
      <FieldRow label="Название организации" required first>
        <TextInput
          name="orgName"
          value={data.orgName}
          onChange={(e) => onChange("orgName", e.target.value)}
          placeholder='ООО "Компания"'
          required
        />
      </FieldRow>
      <FieldRow label="ИНН" required>
        <TextInput
          name="inn"
          value={data.inn}
          onChange={(e) => onChange("inn", e.target.value)}
          placeholder="7700000000"
          maxLength={12}
          required
        />
      </FieldRow>
      <FieldRow label="Юридический адрес" required>
        <TextInput
          name="legalAddress"
          value={data.legalAddress}
          onChange={(e) => onChange("legalAddress", e.target.value)}
          placeholder="117312, Москва, ул. Строителей, д. 1"
          required
        />
      </FieldRow>
      <FieldRow label="Контактное лицо" required>
        <TextInput
          name="contactName"
          value={data.contactName}
          onChange={(e) => onChange("contactName", e.target.value)}
          placeholder="Петр Петров (бухгалтер / менеджер)"
          required
        />
      </FieldRow>
      <FieldRow label="Email для счёта" required>
        <TextInput
          name="email"
          type="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="buh@company.ru"
          required
        />
      </FieldRow>
      <FieldRow label="Телефон">
        <TextInput
          name="phone"
          type="tel"
          value={data.phone}
          onChange={(e) => onChange("phone", formatPhoneRu(e.target.value))}
          onFocus={() => {
            if (!data.phone) onChange("phone", "+7 ");
          }}
          placeholder="+7 (___) ___-__-__"
          maxLength={18}
        />
      </FieldRow>

      {/* Requisites file upload */}
      <div className="py-4 border-t border-zinc-800">
        <p className="text-zinc-600 text-[11px] font-mono tracking-[0.18em] uppercase mb-3">
          Реквизиты файлом — необязательно
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={(e) => {
            const next = e.target.files?.[0] ?? null;
            if (next && next.size > MAX_ATTACHMENT_BYTES) {
              alert("Файл слишком большой. Максимум 5 МБ.");
              e.target.value = "";
              return;
            }
            onFileChange(next);
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
                        className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border text-left transition-all duration-200 will-change-[box-shadow] ${
                            fileName
                              ? "border-cyan-400/40 bg-zinc-800/60 shadow-glow ring-1 ring-cyan-400/25"
                              : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-600 hover:shadow-glow"
                          }`}
        >
          <Paperclip
            className={`w-4 h-4 shrink-0 ${fileName ? "text-zinc-300" : "text-zinc-600"}`}
            strokeWidth={1.75}
          />
          <span
            className={`text-[13px] truncate ${
              fileName ? "text-zinc-300" : "text-zinc-600"
            }`}
          >
            {fileName ?? "Прикрепить карточку организации / реквизиты"}
          </span>
          {fileName && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(null);
                if (fileRef.current) fileRef.current.value = "";
              }}

              className="ml-auto shrink-0 text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          )}
        </button>
        <p className="text-zinc-700 text-[11px] mt-2 leading-relaxed">
          PDF, DOCX, XLSX, JPG — до 5 МБ. Можно отправить позже в ответном письме.
        </p>
      </div>

      <FieldRow label="Комментарий">
        <textarea
          name="comment"
          value={data.comment ?? ""}
          onChange={(e) => onChange("comment", e.target.value)}
          rows={2}
          placeholder="Срок, отсрочка платежа, особые условия..."
          className="ksd-input w-full bg-transparent text-white text-[15px] placeholder-zinc-700 outline-none border-0 resize-none"
        />
      </FieldRow>
    </motion.div>
  );
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const defaultIndividual: IndividualFormData = {
  customerType: "individual",
  name: "",
  phone: "",
  email: "",
  address: "",
  comment: "",
  paymentMethod: "card",
};

const defaultLegal: LegalFormData = {
  customerType: "legal",
  orgName: "",
  inn: "",
  legalAddress: "",
  contactName: "",
  email: "",
  phone: "",
  comment: "",
  paymentMethod: "invoice",
};

// ─── Main form ────────────────────────────────────────────────────────────────

export default function OrderForm() {
  const { state, closeOrderForm, clearCart, totalPrice } = useCart();
  const quoteDraft = state.quoteDraft;

  const [customerType, setCustomerType] = useState<CustomerType>("individual");
  const [individual, setIndividual] = useState<IndividualFormData>(defaultIndividual);
  const [legal, setLegal] = useState<LegalFormData>(defaultLegal);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("Не удалось отправить заявку — попробуйте ещё раз.");

  const isIndividual = customerType === "individual";
  const isQuoteFlow = quoteDraft !== null;

  // --- field change handlers ---

  const handleIndividualChange = (
    field: keyof IndividualFormData,
    value: string
  ) => setIndividual((prev) => ({ ...prev, [field]: value }));

  const handleLegalChange = (field: keyof LegalFormData, value: string) =>
    setLegal((prev) => ({ ...prev, [field]: value }));

  // --- validation ---

  const isValid = isQuoteFlow
    ? individual.name.trim().length > 0 && isPhoneCompleteRu(individual.phone)
    : isIndividual
    ? individual.name.trim().length > 0 && isPhoneCompleteRu(individual.phone) && individual.email.trim().length > 0
    : legal.orgName.trim().length > 0 &&
      legal.inn.trim().length > 0 &&
      legal.legalAddress.trim().length > 0 &&
      legal.contactName.trim().length > 0 &&
      legal.email.trim().length > 0 &&
      (!legal.phone || isPhoneCompleteRu(legal.phone));

  // --- submit ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setStatus("loading");
    setErrorMsg("Не удалось отправить заявку — попробуйте ещё раз.");

    // Flat items string so Telegram shows it inline
    const itemsStr = state.items
      .map((item) => {
        const unit = (item.product.basePrice ?? 0) + (item.selectedSize.priceModifier ?? 0);
        const name = item.product.shortName ?? item.product.name ?? "КСД";
        const dims = item.selectedSize.dimensions ?? "—";
        const qty = item.quantity ?? 1;
        return `${name} (${dims}) x${qty} = ${(unit * qty).toLocaleString("ru-RU")} руб.`;
      })
      .join("; ");

    const cartLines = state.items.map((item) => {
      const unit = (item.product.basePrice ?? 0) + (item.selectedSize.priceModifier ?? 0);
      const skuMatch = item.product.shortName?.match(/арт\.\s*(.+)$/i);
      return {
        name: item.product.name ?? item.product.shortName ?? "Товар",
        sku: skuMatch?.[1]?.trim() ?? item.product.id,
        quantity: item.quantity ?? 1,
        priceRub: unit,
      };
    });

    // Build flat payload — API reads every key dynamically
    const payload = isQuoteFlow
      ? {
          type: "Заявка из конфигуратора (по запросу)",
          name: individual.name,
          phone: individual.phone,
          customerType: "individual",
          quoteSku: quoteDraft.sku,
          quoteSummary: quoteDraft.summary,
          quoteDetails: Object.entries(quoteDraft.details)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n"),
          items: itemsStr || "—",
          comment: individual.comment || "",
          total: state.items.length > 0 ? totalPrice : 0,
        }
      : isIndividual
      ? {
          type: "Заказ с сайта (физлицо)",
          name: individual.name,
          phone: individual.phone,
          email: individual.email,
          customerType: individual.customerType,
          address: individual.address || "не указан",
          paymentMethod: individual.paymentMethod,
          comment: individual.comment || "",
          items: itemsStr || "—",
          total: totalPrice,
        }
      : {
          type: "Заказ с сайта (юрлицо)",
          name: legal.contactName,
          phone: legal.phone,
          email: legal.email,
          customerType: legal.customerType,
          orgName: legal.orgName,
          inn: legal.inn,
          legalAddress: legal.legalAddress,
          paymentMethod: legal.paymentMethod,
          comment: legal.comment || "",
          items: itemsStr || "—",
          total: totalPrice,
        };

    try {
      const wantsOnlinePay =
        !isQuoteFlow && isIndividual && (individual.paymentMethod === "card" || individual.paymentMethod === "sbp");

      if (wantsOnlinePay) {
        if (cartLines.length === 0 || totalPrice < 1) {
          throw new Error("Empty cart");
        }
        if (individual.paymentMethod === "sbp" && totalPrice < 10) {
          throw new Error("SBP_MIN_10");
        }

        const res = await submitPayInit({
          name: individual.name,
          phone: individual.phone,
          email: individual.email,
          address: individual.address || "",
          comment: individual.comment || "",
          paymentMethod: individual.paymentMethod,
          items: cartLines,
        });
        const body = (await res.json().catch(() => null)) as {
          success?: boolean;
          paymentUrl?: string;
          error?: string;
        } | null;
        if (!res.ok || !body?.success || !body.paymentUrl) {
          throw new Error(body?.error || `HTTP ${res.status}`);
        }
        if (!isAllowedTbankPaymentUrl(body.paymentUrl)) {
          throw new Error("Invalid payment URL");
        }
        // Корзину очищаем только после подтверждения банком на /success
        window.location.assign(body.paymentUrl);
        return;
      }

      const body: Record<string, unknown> = { ...payload };
      if (uploadedFile && !isIndividual && !isQuoteFlow) {
        Object.assign(body, await fileToAttachmentFields(uploadedFile));
      }
      const res = await submitTelegramJson(body);
      if (!res.ok) {
        const errBody = await res.text().catch(() => "нет ответа");
        throw new Error(`HTTP ${res.status}: ${errBody}`);
      }
      setStatus("success");
      clearCart();
    } catch (err) {
      if (err instanceof Error && err.message === "SBP_MIN_10") {
        setErrorMsg("Для оплаты через СБП сумма заказа должна быть от 10 ₽ (лимит T‑Bank). Выберите карту или добавьте товары.");
      } else {
        setErrorMsg("Не удалось создать платёж или отправить заявку — попробуйте ещё раз.");
      }
      setStatus("error");
    }
  };

  // --- reset on close ---

  const handleClose = () => {
    closeOrderForm();
    setTimeout(() => {
      setStatus("idle");
      setErrorMsg("Не удалось отправить заявку — попробуйте ещё раз.");
      setIndividual(defaultIndividual);
      setLegal(defaultLegal);
      setUploadedFile(null);
      setCustomerType("individual");
    }, 400);
  };

  // --- button label ---

  const submitLabel = isQuoteFlow
    ? "Отправить заявку"
    : isIndividual
    ? "Перейти к оплате"
    : "Получить счёт";

  return (
    <AnimatePresence>
      {state.isOrderFormOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={sp}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-[520px] mx-auto bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* ── Header ── */}
            <div className="flex items-start justify-between px-7 pt-6 pb-5 border-b border-zinc-800">
              <div>
                <h2 className="text-white font-semibold text-[17px] tracking-tight mb-0.5">
                  Оформить заказ
                </h2>
                <p className="text-zinc-500 text-sm">
                  {isQuoteFlow ? (
                    <>
                      Итого: <span className="text-white font-semibold">По запросу</span>
                    </>
                  ) : (
                    <>
                      Итого:{" "}
                      <span className="text-white font-semibold">
                        {totalPrice.toLocaleString("ru-RU")} ₽
                      </span>
                      <span className="text-zinc-700 text-xs ml-1.5">
                        ({PRICE_PER_METER_RUB.toLocaleString("ru-RU")} ₽/м · без скрытых доплат)
                      </span>
                    </>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Закрыть форму заказа"
                className="mt-0.5 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-colors duration-200"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="px-7 py-5 max-h-[76vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* ── Success state ── */}
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={sp}
                    className="py-10 flex flex-col items-center text-center gap-5"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                      <CheckCircle
                        className="w-7 h-7 text-emerald-400"
                        strokeWidth={1.75}
                      />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg tracking-tight mb-1">
                        {isIndividual ? "Заявка принята" : "Счёт будет выставлен"}
                      </p>
                      <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                        {isIndividual
                          ? "Менеджер свяжется в течение 30 минут и пришлёт реквизиты для оплаты."
                          : "Счёт и закрывающие документы будут отправлены на указанный email в рабочие часы."}
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="px-6 py-2.5 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-full text-sm font-medium hover:border-zinc-500 hover:text-white transition-colors duration-200"
                    >
                      Закрыть
                    </button>
                  </motion.div>
                ) : (
                  /* ── Form state ── */
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                  >
                    {!isQuoteFlow && (
                      <div className="flex gap-1.5 p-1.5 bg-zinc-900 border border-zinc-800 rounded-2xl mb-5">
                        <TypeTab
                          active={isIndividual}
                          icon={User}
                          label="Физическое лицо"
                          onClick={() => setCustomerType("individual")}
                        />
                        <TypeTab
                          active={!isIndividual}
                          icon={Building2}
                          label="Юридическое лицо"
                          onClick={() => setCustomerType("legal")}
                        />
                      </div>
                    )}

                    {isQuoteFlow && quoteDraft && (
                      <div className="mb-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                        <p className="text-zinc-600 text-[11px] font-mono tracking-[0.18em] uppercase mb-1.5">
                          Конфигурация
                        </p>
                        <p className="text-zinc-400 text-sm">{quoteDraft.summary}</p>
                        <p className="text-zinc-700 text-xs mt-1.5">Артикул: {quoteDraft.sku}</p>
                      </div>
                    )}

                    {/* ── Animated form fields ── */}
                    <div className="relative overflow-hidden">
                      <AnimatePresence mode="wait">
                        {isQuoteFlow ? (
                          <motion.div key="quote" {...slideIn}>
                            <FieldRow label="Имя" required first fieldId="name">
                              <TextInput
                                name="name"
                                value={individual.name}
                                onChange={(e) => handleIndividualChange("name", e.target.value)}
                                placeholder="Иван Иванов"
                                required
                              />
                            </FieldRow>
                            <FieldRow label="Телефон" required fieldId="phone">
                              <TextInput
                                name="phone"
                                type="tel"
                                value={individual.phone}
                                onChange={(e) => handleIndividualChange("phone", formatPhoneRu(e.target.value))}
                                onFocus={() => {
                                  if (!individual.phone) handleIndividualChange("phone", "+7 ");
                                }}
                                placeholder="+7 (___) ___-__-__"
                                maxLength={18}
                                required
                              />
                            </FieldRow>
                            <FieldRow label="Комментарий">
                              <textarea
                                name="comment"
                                value={individual.comment ?? ""}
                                onChange={(e) => handleIndividualChange("comment", e.target.value)}
                                rows={2}
                                placeholder="Дополнения к заявке..."
                                className="ksd-input w-full bg-transparent text-white text-[15px] placeholder-zinc-700 outline-none border-0 resize-none"
                              />
                            </FieldRow>
                          </motion.div>
                        ) : isIndividual ? (
                          <IndividualForm
                            key="individual"
                            data={individual}
                            onChange={handleIndividualChange}
                            paymentMethod={
                              individual.paymentMethod as IndividualPayment
                            }
                            onPaymentChange={(m) =>
                              handleIndividualChange("paymentMethod", m)
                            }
                          />
                        ) : (
                          <LegalForm
                            key="legal"
                            data={legal}
                            onChange={handleLegalChange}
                            file={uploadedFile}
                            onFileChange={setUploadedFile}
                          />
                        )}
                      </AnimatePresence>
                    </div>

                    {/* ── Error ── */}
                    <AnimatePresence>
                      {status === "error" && (
                        <motion.p
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-sm text-red-400 pt-2 pb-1"
                        >
                          {errorMsg}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* ── Submit ── */}
                    <div className="pt-4 border-t border-zinc-800 space-y-3 mt-1">
                      <FormPrivacyNote />
                      <motion.button
                        type="submit"
                        disabled={!isValid || status === "loading"}
                        layout
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 rounded-full text-[15px] font-semibold hover:bg-zinc-100 hover:shadow-glow-strong disabled:hover:bg-zinc-800 disabled:hover:shadow-none will-change-[box-shadow] transition-all duration-200"
                      >
                        {status === "loading" ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {isIndividual &&
                            !isQuoteFlow &&
                            (individual.paymentMethod === "card" || individual.paymentMethod === "sbp")
                              ? "Переход к оплате..."
                              : "Отправка..."}
                          </>
                        ) : (
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={submitLabel}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.18 }}
                            >
                              {submitLabel}
                            </motion.span>
                          </AnimatePresence>
                        )}
                      </motion.button>

                      <p className="text-center text-zinc-700 text-xs">
                        Нажимая кнопку, вы соглашаетесь с{" "}
                        <Link
                          href={PATHS.privacy}
                          onClick={handleClose}
                          className="text-zinc-500 underline underline-offset-2 hover:text-zinc-300 transition-colors"
                        >
                          политикой конфиденциальности
                        </Link>
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
