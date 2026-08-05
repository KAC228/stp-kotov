import { BRAND_NAME } from "@/constants/brand";
import InstallationClient from "@/components/InstallationClient";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: `Монтаж КСД — профессиональная установка | ${BRAND_NAME}`,
  description:
    "Профессиональный монтаж камер статического давления нашими сертифицированными специалистами. Гарантия сохраняется только при авторизованной установке.",
  path: "/installation",
});

export default function InstallationPage() {
  return <InstallationClient />;
}
