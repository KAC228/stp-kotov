import type { FlibenProduct } from "@/constants/fliben-catalog";
import type { Product, ProductSize } from "@/types";

/** Преобразование позиции каталога Fliben в формат корзины сайта */
export function flibenToCartProduct(item: FlibenProduct): Product {
  const sizeId = `fliben-${item.sku}`;

  return {
    id: sizeId,
    name: item.title,
    shortName: `Fliben · арт. ${item.sku}`,
    description: item.description,
    fullDescription: item.descriptionHtml || item.description,
    basePrice: item.priceRub,
    sizes: [
      {
        id: sizeId,
        label: item.title,
        dimensions: `арт. ${item.sku}`,
        connectionDiameter: "Fliben",
        priceModifier: 0,
      },
    ],
    features: [],
    stats: [],
    badge: "Fliben",
  };
}

export function flibenToCartSize(item: FlibenProduct): ProductSize {
  const sizeId = `fliben-${item.sku}`;
  return {
    id: sizeId,
    label: item.title,
    dimensions: `арт. ${item.sku}`,
    connectionDiameter: "Fliben",
    priceModifier: 0,
  };
}
