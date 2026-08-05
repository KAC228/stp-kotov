import Footer from "@/components/Footer";
import TypicalProjectsClient from "@/components/TypicalProjectsClient";
import { BRAND_NAME } from "@/constants/brand";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: `Типовые проекты | ${BRAND_NAME}`,
  description: "Типовые проекты вентиляции 100, 150 и 200 м² — расчёт, комплектация, тарифы и заявка на сайте СТП-КОТОВ.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <TypicalProjectsClient />
      <Footer />
    </>
  );
}
