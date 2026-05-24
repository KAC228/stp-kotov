import type { Metadata } from "next";
import PrivacyContent from "@/components/PrivacyContent";

export const metadata: Metadata = {
  title: "Политика конфиденциальности | СТП-КОТОВ",
  description:
    "Политика в отношении обработки персональных данных ИП Пырсов А.Ю. (СТП-КОТОВ). Порядок сбора, хранения и защиты данных пользователей сайта стп-котов.рф.",
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
