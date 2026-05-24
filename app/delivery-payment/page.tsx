import type { Metadata } from "next";
import { BRAND_NAME } from "@/constants/brand";
import DeliveryPaymentClient from "@/components/DeliveryPaymentClient";

export const metadata: Metadata = {
  title: `Доставка и оплата | ${BRAND_NAME}`,
  description:
    "Доставка КСД по всей России и СНГ. Оплата в формате 100% предоплаты: картой, через СБП или по счёту для юрлиц и ИП через эквайринг Т-Банк.",
};

export default function DeliveryPaymentPage() {
  return <DeliveryPaymentClient />;
}
