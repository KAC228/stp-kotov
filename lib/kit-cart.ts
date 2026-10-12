import type { KitLineDef } from "@/constants/catalog-kits";
import type { Product, ProductSize } from "@/types";

/** Позиция комплекта → Product/Size для корзины (цены позже) */
export function kitLineToCart(
  line: KitLineDef,
  kitId: string
): { product: Product; size: ProductSize; quantity: number } {
  const id = `kit-${kitId}-${line.sku}`;
  const size: ProductSize = {
    id: `${id}-size`,
    label: line.shortName,
    dimensions: line.dimensions ?? line.shortName,
    connectionDiameter: "комплект",
    priceModifier: 0,
  };

  const product: Product = {
    id,
    name: line.name,
    shortName: line.shortName,
    description: line.note ?? "Позиция комплекта СТП-КОТОВ",
    fullDescription: line.note ?? line.name,
    basePrice: 0,
    sizes: [size],
    features: [],
    stats: [],
    badge: "Комплект",
  };

  return { product, size, quantity: line.quantity };
}
