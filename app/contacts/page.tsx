import { BRAND_NAME } from "@/constants/brand";
import ContactsClient from "@/components/ContactsClient";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: `Контакты | ${BRAND_NAME}`,
  description:
    "Свяжитесь с нами по телефону, электронной почте или задайте вопрос напрямую инженеру. Адрес, реквизиты и режим работы.",
  path: "/contacts",
});

export default function ContactsPage() {
  return <ContactsClient />;
}
