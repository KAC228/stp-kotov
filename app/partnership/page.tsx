import type { Metadata } from "next";
import { BRAND_NAME } from "@/constants/brand";
import PartnershipClient from "@/components/PartnershipClient";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: `Партнёрство и дилерство | ${BRAND_NAME}`,
  description:
    "Станьте официальным партнёром или дилером СТП-КОТОВ. Эксклюзивная территория продаж, маркетинговая поддержка и приоритетная техподдержка.",
};

export default function PartnershipPage() {
  return (
    <>
      <PartnershipClient />
      <Footer />
    </>
  );
}
