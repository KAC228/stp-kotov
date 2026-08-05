import Footer from "@/components/Footer";
import ArticlesClient from "@/components/ArticlesClient";
import { BRAND_NAME } from "@/constants/brand";
import { buildPageMetadata } from "@/lib/metadata";
import { FLIBEN_ARTICLES } from "@/lib/fliben-content";

export const metadata = buildPageMetadata({
  title: `Статьи | ${BRAND_NAME}`,
  description: "Где применять вентиляцию: статьи и практические материалы для проектировщиков и монтажников.",
  path: "/articles",
});

export default function ArticlesPage() {
  return (
    <>
      <ArticlesClient articles={FLIBEN_ARTICLES} />
      <Footer />
    </>
  );
}
