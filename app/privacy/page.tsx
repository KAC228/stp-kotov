import PrivacyContent from "@/components/PrivacyContent";
import { BRAND_NAME } from "@/constants/brand";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: `Политика конфиденциальности | ${BRAND_NAME}`,
  description:
    "Политика в отношении обработки персональных данных. Порядок сбора, хранения и защиты данных пользователей сайта стп-котов.рф.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <PrivacyContent />;
}
