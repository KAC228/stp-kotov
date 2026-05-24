import type { Metadata } from "next";
import { BRAND_NAME } from "@/constants/brand";
import InstallationClient from "@/components/InstallationClient";

export const metadata: Metadata = {
  title: `Монтаж КСД — профессиональная установка | ${BRAND_NAME}`,
  description:
    "Профессиональный монтаж камер статического давления нашими сертифицированными специалистами. Гарантия сохраняется только при авторизованной установке.",
};

export default function InstallationPage() {
  return <InstallationClient />;
}
