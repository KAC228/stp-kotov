import Footer from "@/components/Footer";
import FlibenProductClient from "@/components/FlibenProductClient";
import JsonLd from "@/components/JsonLd";
import { BRAND_NAME } from "@/constants/brand";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/jsonld";
import { buildPageMetadata, clipDescription } from "@/lib/metadata";
import { getAllFlibenProductSlugs, getFlibenProductBySlug } from "@/lib/fliben-products";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllFlibenProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getFlibenProductBySlug(slug);
  if (!product) return { title: BRAND_NAME };

  return buildPageMetadata({
    title: `${product.title} | Каталог ${BRAND_NAME}`,
    description: clipDescription(product.description),
    path: `/catalog/${slug}`,
    image: product.image,
  });
}

export default async function FlibenProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getFlibenProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <JsonLd
        data={productJsonLd({
          title: product.title,
          description: product.description,
          sku: product.sku,
          image: product.image,
          priceRub: product.priceRub,
          slug: product.slug,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Главная", path: "/" },
          { name: "Каталог", path: "/catalog" },
          { name: product.title, path: `/catalog/${product.slug}` },
        ])}
      />
      <FlibenProductClient product={product} />
      <Footer />
    </>
  );
}
