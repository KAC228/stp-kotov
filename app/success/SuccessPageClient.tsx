"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, XCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import {
  clearRememberedTbankPayment,
  readRememberedTbankPaymentId,
} from "@/lib/tbank-session";

const spring = { type: "spring" as const, damping: 24, stiffness: 160 };

type VerifyState =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "paid"; orderId?: string | null; amountRub?: number | null }
  | { kind: "unpaid"; status?: string | null }
  | { kind: "error" };

function pickPaymentId(search: URLSearchParams): string {
  const fromUrl = (
    search.get("PaymentId") ||
    search.get("paymentId") ||
    search.get("Paymentid") ||
    ""
  ).trim();
  if (/^\d{1,20}$/.test(fromUrl)) return fromUrl;
  return readRememberedTbankPaymentId();
}

async function fetchPayStatus(paymentId: string, attempt = 0): Promise<{
  ok: boolean;
  paid?: boolean;
  status?: string;
  orderId?: string;
  amountRub?: number;
}> {
  const res = await fetch(
    `/pay-status.php?PaymentId=${encodeURIComponent(paymentId)}`,
    { cache: "no-store" },
  );
  // 502/504/сеть — короткие ретраи (банк иногда отвечает медленно)
  if ((res.status >= 500 || res.status === 429) && attempt < 3) {
    await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    return fetchPayStatus(paymentId, attempt + 1);
  }
  const data = (await res.json().catch(() => null)) as {
    ok?: boolean;
    paid?: boolean;
    status?: string;
    orderId?: string;
    amountRub?: number;
  } | null;
  if (!res.ok || !data) {
    return { ok: false };
  }
  return {
    ok: Boolean(data.ok),
    paid: data.paid,
    status: data.status,
    orderId: data.orderId,
    amountRub: data.amountRub,
  };
}

export default function SuccessPageClient() {
  const { clearCart } = useCart();
  const search = useSearchParams();
  const paymentId = useMemo(() => pickPaymentId(search), [search]);

  const [state, setState] = useState<VerifyState>({ kind: "loading" });

  useEffect(() => {
    if (!paymentId) {
      setState({ kind: "missing" });
      return;
    }
    if (!/^\d{1,20}$/.test(paymentId)) {
      setState({ kind: "error" });
      return;
    }

    // Подтянуть PaymentId в адресную строку, если пришли только из sessionStorage
    try {
      const url = new URL(window.location.href);
      if (!url.searchParams.get("PaymentId")) {
        url.searchParams.set("PaymentId", paymentId);
        window.history.replaceState({}, "", url.toString());
      }
    } catch {
      /* ignore */
    }

    let cancelled = false;
    const run = async () => {
      try {
        const data = await fetchPayStatus(paymentId);
        if (cancelled) return;
        if (!data.ok) {
          setState({ kind: "error" });
          return;
        }
        if (data.paid) {
          clearCart();
          clearRememberedTbankPayment();
          setState({
            kind: "paid",
            orderId: data.orderId,
            amountRub: data.amountRub,
          });
          return;
        }
        setState({ kind: "unpaid", status: data.status ?? null });
      } catch {
        if (!cancelled) setState({ kind: "error" });
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [paymentId, clearCart]);

  if (state.kind === "loading") {
    return (
      <Shell>
        <Loader2 className="w-12 h-12 text-zinc-500 animate-spin mx-auto mb-6" />
        <h1 className="text-white text-2xl font-semibold tracking-tight mb-3">Проверяем оплату…</h1>
        <p className="text-zinc-500 text-sm">Статус запрашивается у платёжной системы T‑Bank.</p>
      </Shell>
    );
  }

  if (state.kind === "paid") {
    return (
      <Shell>
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...spring, delay: 0.05 }}
          className="inline-flex items-center justify-center mb-8"
        >
          <div className="relative">
            <motion.span
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.7, opacity: 0 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
              className="absolute inset-0 rounded-full bg-emerald-500/20"
            />
            <CheckCircle className="w-20 h-20 text-emerald-400 relative z-10" strokeWidth={1.5} />
          </div>
        </motion.div>
        <h1
          className="text-white font-semibold tracking-tighter leading-tight mb-4"
          style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)" }}
        >
          Оплата подтверждена
        </h1>
        <p className="text-zinc-400 text-[15px] leading-relaxed mb-6 max-w-sm mx-auto">
          Платёж подтверждён T‑Bank. Фискальный чек отправит онлайн-касса на email из заказа.
        </p>
        {(state.orderId || state.amountRub != null) && (
          <p className="text-zinc-600 text-xs font-mono mb-8">
            {state.orderId ? `Заказ ${state.orderId}` : null}
            {state.orderId && state.amountRub != null ? " · " : null}
            {state.amountRub != null ? `${state.amountRub.toLocaleString("ru-RU")} ₽` : null}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {["✓ Подтверждено банком", "✓ Чек на email"].map((chip) => (
            <span
              key={chip}
              className="px-4 py-1.5 rounded-full border border-emerald-800/50 bg-emerald-950/30 text-emerald-300 text-xs font-medium"
            >
              {chip}
            </span>
          ))}
        </div>
        <HomeLink />
      </Shell>
    );
  }

  if (state.kind === "unpaid") {
    return (
      <Shell>
        <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-6" strokeWidth={1.5} />
        <h1 className="text-white text-2xl font-semibold tracking-tight mb-3">Оплата не подтверждена</h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          Банк ещё не подтвердил платёж
          {state.status ? ` (статус: ${state.status})` : ""}. Если списание прошло — подождите минуту и обновите
          страницу.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-100 active:scale-95 transition-all duration-200 mb-4"
        >
          Обновить статус
        </button>
        <div>
          <HomeLink />
        </div>
      </Shell>
    );
  }

  if (state.kind === "missing") {
    return (
      <Shell>
        <XCircle className="w-16 h-16 text-zinc-600 mx-auto mb-6" strokeWidth={1.5} />
        <h1 className="text-white text-2xl font-semibold tracking-tight mb-3">Нет данных платежа</h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          Не удалось получить номер платежа после возврата из банка. Если деньги списались — чек придёт на email, а
          заказ мы увидим по уведомлению банка. Напишите нам в контакты, если чека нет.
        </p>
        <HomeLink />
      </Shell>
    );
  }

  return (
    <Shell>
      <XCircle className="w-16 h-16 text-red-400 mx-auto mb-6" strokeWidth={1.5} />
      <h1 className="text-white text-2xl font-semibold tracking-tight mb-3">Не удалось проверить оплату</h1>
      <p className="text-zinc-400 text-sm mb-8">
        Связь с банком временно недоступна (иногда бывает 504). Подождите и нажмите «Обновить статус» — если деньги
        списались, статус станет «подтверждена».
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-100 active:scale-95 transition-all duration-200 mb-4"
      >
        Обновить статус
      </button>
      <div>
        <HomeLink />
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-5">
      <div className="text-center max-w-lg w-full">
        {children}
        <p className="mt-10 text-zinc-700 text-[11px] font-mono tracking-[0.2em] uppercase">
          стп-котов.рф · КСД нового поколения
        </p>
      </div>
    </div>
  );
}

function HomeLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-100 active:scale-95 transition-all duration-200"
    >
      Вернуться на сайт
    </Link>
  );
}
