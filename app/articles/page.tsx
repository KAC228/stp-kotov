import Footer from "@/components/Footer";
import ArticlesClient from "@/components/ArticlesClient";
import { BRAND_NAME } from "@/constants/brand";
import { buildPageMetadata } from "@/lib/metadata";
import { SITE_ARTICLES } from "@/lib/site-articles";

export const metadata = buildPageMetadata({
  title: `Статьи | ${BRAND_NAME}`,
  description: "Статьи СТП-КОТОВ: матрица контуров, КСД, BIM, акустика и инженерный суверенитет.",
  path: "/articles",
});

export default function ArticlesPage() {
  return (
    <>
      <ArticlesClient articles={SITE_ARTICLES} />
      <Footer />
    </>
  );
}
