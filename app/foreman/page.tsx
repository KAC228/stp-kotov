import type { Metadata } from "next";
import ForemanClient from "@/components/ForemanClient";
import { BRAND_NAME } from "@/constants/brand";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: `Прораб на площадке — ассистент монтажа | ${BRAND_NAME}`,
  description:
    "Ассистент для монтажа КСД на объекте: высота камеры, врезка, потолок, крепёж и какой документ открыть. Ответы из базы правил, без выдуманных пунктов СП и ГОСТ.",
  path: "/foreman",
});

export default function ForemanPage() {
  return <ForemanClient />;
}
