"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PATHS } from "@/constants/brand";

const spring = { type: "spring" as const, damping: 32, stiffness: 280 };

export default function CartSlider() {
  const {
    state,
    closeCart,
    removeItem,
    updateQuantity,
    totalPrice,
    openOrderForm,
  } = useCart();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!state.isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [state.isOpen, closeCart]);

  const handleCheckout = () => {
    closeCart();
    openOrderForm();
  };

  const itemCount = state.items.reduce((s, i) => s + i.quantity, 0);
  const hasKsdItems = state.items.some((i) => !i.product.id.startsWith("fliben-"));

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={closeCart}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Корзина"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={spring}
            className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-[#fbfbfd] border-l border-[#d2d2d7] z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#d2d2d7]">
              <h2 className="text-[#1d1d1f] font-semibold text-[17px] tracking-tight">
                Корзина
                {itemCount > 0 && (
                  <span className="ml-2 text-[#86868b] font-normal">
                    {itemCount}
                  </span>
                )}
              </h2>
              <button
                ref={closeBtnRef}
                onClick={closeCart}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#f5f5f7] text-[#86868b] hover:text-[#1d1d1f] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d1d1f]"
                aria-label="Закрыть корзину"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <AnimatePresence initial={false}>
                {state.items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full py-24 text-center px-8"
                  >
                    <p className="text-[#1d1d1f] text-lg font-medium tracking-tight mb-2">
                      Корзина пуста
                    </p>
                    <p className="text-[#86868b] text-sm mb-8">
                      Соберите конфигурацию КСД на главной странице
                    </p>
                    <Link
                      href={PATHS.configurator}
                      onClick={closeCart}
                      className="inline-block px-6 py-2.5 bg-[#f5f5f7] text-[#1d1d1f] rounded-full text-sm font-medium hover:bg-[#e8e8ed] transition-colors duration-200"
                    >
                      Открыть конфигуратор
                    </Link>
                  </motion.div>
                ) : (
                  <motion.ul
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="divide-y divide-[#d2d2d7]"
                  >
                    {state.items.map((item) => {
                      const unitPrice =
                        item.product.basePrice + item.selectedSize.priceModifier;
                      return (
                        <motion.li
                          key={`${item.product.id}-${item.selectedSize.id}`}
                          layout
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 16 }}
                          transition={{ type: "spring", damping: 28, stiffness: 260 }}
                          className="px-8 py-6"
                        >
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <p className="text-[#1d1d1f] font-medium text-[15px] tracking-tight leading-snug">
                                {item.product.shortName}
                              </p>
                              <p className="text-[#86868b] text-sm mt-0.5">
                                {item.selectedSize.dimensions}
                                {!item.product.id.startsWith("fliben-") &&
                                  ` · ${item.selectedSize.connectionDiameter}`}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                removeItem(item.product.id, item.selectedSize.id)
                              }
                              className="text-[#86868b] hover:text-[#1d1d1f] transition-colors duration-200 mt-0.5 flex-shrink-0"
                              aria-label="Удалить"
                            >
                              <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-0 border border-[#d2d2d7] rounded-full overflow-hidden">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.selectedSize.id,
                                    item.quantity - 1
                                  )
                                }
                                className="w-9 h-9 flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] hover:drop-shadow-[0_0_6px_rgba(255,90,120,0.6)] transition-all duration-200"
                              >
                                <Minus className="w-3 h-3" strokeWidth={2} />
                              </button>
                              <span className="w-8 text-center text-[#1d1d1f] text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.selectedSize.id,
                                    item.quantity + 1
                                  )
                                }
                                className="w-9 h-9 flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] hover:drop-shadow-[0_0_6px_rgba(255,90,120,0.6)] transition-all duration-200"
                              >
                                <Plus className="w-3 h-3" strokeWidth={2} />
                              </button>
                            </div>

                            <p className="text-[#1d1d1f] font-semibold tracking-tight">
                              {unitPrice > 0
                                ? `${(unitPrice * item.quantity).toLocaleString("ru-RU")} ₽`
                                : "по запросу"}
                            </p>
                          </div>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {state.items.length > 0 && (
              <div className="border-t border-[#d2d2d7] px-8 py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#86868b] text-sm">
                    Итого ({itemCount} шт.)
                  </span>
                  <span className="text-[#1d1d1f] text-2xl font-semibold tracking-tighter">
                    {totalPrice > 0
                      ? `${totalPrice.toLocaleString("ru-RU")} ₽`
                      : "по запросу"}
                  </span>
                </div>
                {hasKsdItems ? (
                  <p className="text-[#86868b] text-xs">
                    Стоимость комплекта / КСД уточняется при оформлении заказа.
                  </p>
                ) : (
                  <p className="text-[#86868b] text-xs">
                    Позиции Fliben — по прайс-листу партнёра. Итог уточняется при оформлении.
                  </p>
                )}
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1d1d1f] text-[#fbfbfd] rounded-full text-[15px] font-medium hover:bg-[#3a3a3c] hover:shadow-glow-strong will-change-[box-shadow] transition-all duration-200"
                >
                  Оформить заказ
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </button>
                <Link
                  href={PATHS.delivery}
                  onClick={closeCart}
                  className="flex items-center justify-center gap-1 text-[#86868b] text-xs hover:text-[#1d1d1f] transition-colors duration-200"
                >
                  Все способы оплаты →
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
