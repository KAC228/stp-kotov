import Footer from "@/components/Footer";
import FlibenCatalogClient from "@/components/FlibenCatalogClient";
import { BRAND_NAME, PATHS } from "@/constants/brand";
import { buildPageMetadata } from "@/lib/metadata";
import { FLIBEN_PRODUCTS } from "@/lib/fliben-products";
import { Suspense } from "react";

export const metadata = buildPageMetadata({
  title: `Каталог | ${BRAND_NAME}`,
  description:
    "Каталог вспомогательного оборудования для систем вентиляции: воздуховоды, коллекторы, установки и комплектующие партнёра Fliben. Цены, артикулы, BIM и сертификаты.",
  path: "/catalog",
});

export default function CatalogPage() {
  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-screen bg-zinc-950 pt-24 flex items-center justify-center text-zinc-500 text-sm">
            Загрузка каталога…
          </div>
        }
      >
        <FlibenCatalogClient
          products={FLIBEN_PRODUCTS}
          backHref={PATHS.home}
          backLabel="На главную"
          title="Каталог"
          subtitle="Вспомогательное оборудование для комплектации систем вентиляции — воздуховоды, коллекторы, установки и аксессуары."
        />
      </Suspense>
      <Footer />
    </>
  );
}
