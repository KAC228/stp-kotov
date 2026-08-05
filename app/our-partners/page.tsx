import OurPartnersClient from "@/components/OurPartnersClient";
import Footer from "@/components/Footer";
import { BRAND_NAME } from "@/constants/brand";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: `Наши партнёры | ${BRAND_NAME}`,
  description:
    "Партнёры СТП-КОТОВ: проверенные компании для производства, проектирования и сопровождения объектов. Контакты и сайты.",
  path: "/our-partners",
});

export default function OurPartnersPage() {
  return (
    <>
      <OurPartnersClient />
      <Footer />
    </>
  );
}
