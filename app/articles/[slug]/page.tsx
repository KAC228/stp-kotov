import Footer from "@/components/Footer";
import ArticleDetailClient from "@/components/ArticleDetailClient";
import JsonLd from "@/components/JsonLd";
import { BRAND_NAME } from "@/constants/brand";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { buildPageMetadata, clipDescription } from "@/lib/metadata";
import { getAllSiteArticleSlugs, getSiteArticleBySlug } from "@/lib/site-articles";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSiteArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = getSiteArticleBySlug(slug);
  if (!article) return { title: BRAND_NAME };

  return buildPageMetadata({
    title: `${article.title} | ${BRAND_NAME}`,
    description: clipDescription(article.thesis || article.title),
    path: `/articles/${slug}`,
    ogType: "article",
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getSiteArticleBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          excerpt: article.thesis,
          slug: article.slug,
          image: null,
          publishedAt: null,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Главная", path: "/" },
          { name: "Статьи", path: "/articles" },
          { name: article.title, path: `/articles/${article.slug}` },
        ])}
      />
      <ArticleDetailClient article={article} />
      <Footer />
    </>
  );
}
