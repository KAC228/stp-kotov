import Footer from "@/components/Footer";
import CertificatesClient from "@/components/CertificatesClient";
import { BRAND_NAME } from "@/constants/brand";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: `Сертификаты | ${BRAND_NAME}`,
  description:
    "Сертификаты и свидетельства на материалы и оборудование партнёров. Просмотр документов прямо на сайте.",
  path: "/certificates",
});

export default function CertificatesPage() {
  return (
    <>
      <CertificatesClient />
      <Footer />
    </>
  );
}
