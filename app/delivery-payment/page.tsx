import { BRAND_NAME } from "@/constants/brand";
import DeliveryPaymentClient from "@/components/DeliveryPaymentClient";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: `Доставка и оплата | ${BRAND_NAME}`,
  description:
    "Доставка КСД по всей России и СНГ. Оплата в формате 100% предоплаты: картой, через СБП или по счёту для юрлиц и ИП через эквайринг Т-Банк.",
  path: "/delivery-payment",
});

export default function DeliveryPaymentPage() {
  return <DeliveryPaymentClient />;
}
