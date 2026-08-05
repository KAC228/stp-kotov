import type { FlibenProduct } from "@/constants/fliben-catalog";

/**
 * Тестовая позиция для проверки эквайринга T‑Bank (карта от 1 ₽).
 * В проде выключена. Включить на время теста:
 *   NEXT_PUBLIC_TBANK_TEST_SKU=1 npm run build
 */
export const TBANK_TEST_PRODUCT_ENABLED =
  process.env.NEXT_PUBLIC_TBANK_TEST_SKU === "1" ||
  process.env.NEXT_PUBLIC_TBANK_TEST_SKU === "true";

export const TBANK_TEST_PRODUCT: FlibenProduct = {
  uid: "tbank-test-1rub",
  title: "Тестовая оплата T‑Bank (1 ₽)",
  priceRub: 1,
  priceOldRub: null,
  sku: "TEST-1RUB",
  href: "/catalog/test-oplata-tbank-1-rub-TEST-1RUB",
  image: "/images/fliben-catalog/c2d192db42c342.webp",
  images: ["/images/fliben-catalog/c2d192db42c342.webp"],
  category: "accessories",
  storeSections: ["accessories"],
  slug: "test-oplata-tbank-1-rub-TEST-1RUB",
  description:
    "Служебный товар для проверки оплаты картой через T‑Bank. Сумма 1 ₽. Для СБП нужна сумма от 10 ₽.",
  descriptionHtml:
    "<p>Служебный товар для проверки интернет-эквайринга T‑Bank.</p><ul><li>Карта — от 1 ₽</li><li>СБП — от 10 ₽</li></ul>",
  characteristics: [
    { title: "Назначение", value: "Тест оплаты" },
    { title: "Сумма", value: "1 ₽" },
  ],
};
