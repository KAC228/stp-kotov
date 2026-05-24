import type { Metadata } from "next";
import TeamPageClient from "@/components/TeamPageClient";
import { BRAND_NAME } from "@/constants/brand";

export const metadata: Metadata = {
  title: `Команда | ${BRAND_NAME}`,
  description:
    "Ключевые фигуры команды СТП-КОТОВ: специалисты, которые отвечают за проектирование, производство и клиентский сервис.",
};

export default function TeamPage() {
  return <TeamPageClient />;
}
