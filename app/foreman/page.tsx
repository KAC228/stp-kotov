import type { Metadata } from "next";
import ForemanClient from "@/components/ForemanClient";
import { BRAND_NAME } from "@/constants/brand";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: `Прораб на площадке — ассистент монтажа | ${BRAND_NAME}`,
  description:
    "Регламент монтажа КСД на объекте: с чего начать и чем закончить. Пошагово для монтажника на площадке.",
  path: "/foreman",
});

export default function ForemanPage() {
  return <ForemanClient />;
}
