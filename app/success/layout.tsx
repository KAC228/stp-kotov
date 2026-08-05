import { BRAND_NAME } from "@/constants/brand";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: `Оплата | ${BRAND_NAME}`,
  description: "Статус оплаты подтверждается платёжной системой T‑Bank.",
  path: "/success",
  noIndex: true,
});

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
