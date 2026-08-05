"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import type { FlibenProduct } from "@/constants/fliben-catalog";
import { useCart } from "@/context/CartContext";
import { flibenToCartProduct, flibenToCartSize } from "@/lib/fliben-cart";

export default function FlibenAddToCartButton({
  product,
  className = "",
  compact = false,
}: {
  product: FlibenProduct;
  className?: string;
  compact?: boolean;
}) {
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem(flibenToCartProduct(product), flibenToCartSize(product));
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ||
        "flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-200 text-sm font-medium hover:bg-zinc-700 transition-colors"
      }
    >
      {added ? (
        <>
          <Check className="w-4 h-4 text-emerald-400" strokeWidth={2} />
          {compact ? "Добавлено" : "В корзине"}
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" strokeWidth={1.75} />
          {compact ? "В корзину" : "В корзину"}
        </>
      )}
    </button>
  );
}
