/** Ключ sessionStorage: PaymentId после Init, до редиректа на T‑Bank. */
export const TBANK_PAYMENT_ID_KEY = "ksd_tbank_payment_id";
export const TBANK_ORDER_ID_KEY = "ksd_tbank_order_id";

export function rememberTbankPayment(paymentId: string, orderId?: string | null) {
  try {
    const id = paymentId.trim();
    if (!/^\d{1,20}$/.test(id)) return;
    sessionStorage.setItem(TBANK_PAYMENT_ID_KEY, id);
    if (orderId) sessionStorage.setItem(TBANK_ORDER_ID_KEY, String(orderId));
  } catch {
    /* private mode / blocked storage */
  }
}

export function readRememberedTbankPaymentId(): string {
  try {
    const id = (sessionStorage.getItem(TBANK_PAYMENT_ID_KEY) ?? "").trim();
    return /^\d{1,20}$/.test(id) ? id : "";
  } catch {
    return "";
  }
}

export function clearRememberedTbankPayment() {
  try {
    sessionStorage.removeItem(TBANK_PAYMENT_ID_KEY);
    sessionStorage.removeItem(TBANK_ORDER_ID_KEY);
  } catch {
    /* ignore */
  }
}
