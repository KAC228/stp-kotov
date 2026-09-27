import type { FlibenProduct } from "@/constants/fliben-catalog";

/**
 * Тестовая позиция для проверки эквайринга T‑Bank (карта + СБП).
 * В проде выключена. Включить на время теста:
 *   NEXT_PUBLIC_TBANK_TEST_SKU=1 npm run build
 */
export const TBANK_TEST_PRODUCT_ENABLED =
  process.env.NEXT_PUBLIC_TBANK_TEST_SKU === "1" ||
  process.env.NEXT_PUBLIC_TBANK_TEST_SKU === "true";

export const TBANK_TEST_PRODUCT: FlibenProduct = {
  uid: "tbank-test-11rub",
  title: "Тестовая оплата T‑Bank (11 ₽)",
  priceRub: 11,
  priceOldRub: null,
  sku: "TEST-11RUB",
  href: "/catalog/test-oplata-tbank-11-rub-TEST-11RUB",
  image: "/images/fliben-catalog/c2d192db42c342.webp",
  images: ["/images/fliben-catalog/c2d192db42c342.webp"],
  category: "accessories",
  storeSections: ["accessories"],
  slug: "test-oplata-tbank-11-rub-TEST-11RUB",
  description:
    "Служебный товар для проверки оплаты картой и СБП через T‑Bank. Сумма 11 ₽ (СБП от 10 ₽).",
  descriptionHtml:
    "<p>Служебный товар для проверки интернет-эквайринга T‑Bank.</p><ul><li>Карта и СБП</li><li>Сумма 11 ₽</li></ul>",
  characteristics: [
    { title: "Назначение", value: "Тест оплаты" },
    { title: "Сумма", value: "11 ₽" },
  ],
};
