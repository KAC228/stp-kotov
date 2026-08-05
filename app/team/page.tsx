import TeamPageClient from "@/components/TeamPageClient";
import { BRAND_NAME } from "@/constants/brand";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: `Команда | ${BRAND_NAME}`,
  description:
    "Ключевые фигуры команды: специалисты, которые отвечают за проектирование, производство и клиентский сервис.",
  path: "/team",
});

export default function TeamPage() {
  return <TeamPageClient />;
}
