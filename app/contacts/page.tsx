import type { Metadata } from "next";
import { BRAND_NAME } from "@/constants/brand";
import ContactsClient from "@/components/ContactsClient";

export const metadata: Metadata = {
  title: `Контакты | ${BRAND_NAME}`,
  description:
    "Свяжитесь с нами по телефону, электронной почте или задайте вопрос напрямую инженеру. Адрес, реквизиты и режим работы СТП-КОТОВ.",
};

export default function ContactsPage() {
  return <ContactsClient />;
}
