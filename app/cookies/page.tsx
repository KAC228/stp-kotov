import CookiePolicyContent from "@/components/CookiePolicyContent";
import { BRAND_NAME } from "@/constants/brand";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: `Политика cookie | ${BRAND_NAME}`,
  description:
    "Какие файлы cookie использует сайт стп-котов.рф, как управлять согласием и отключить аналитику.",
  path: "/cookies",
});

export default function CookiesPage() {
  return <CookiePolicyContent />;
}
