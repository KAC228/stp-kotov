import { BRAND_NAME } from "@/constants/brand";
import PartnershipClient from "@/components/PartnershipClient";
import Footer from "@/components/Footer";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: `Партнёрство | ${BRAND_NAME}`,
  description:
    "Станьте официальным партнёром СТП-КОТОВ. Эксклюзивная территория продаж, маркетинговая поддержка и приоритетная техподдержка.",
  path: "/partnership",
});

export default function PartnershipPage() {
  return (
    <>
      <PartnershipClient />
      <Footer />
    </>
  );
}
