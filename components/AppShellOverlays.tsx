"use client";

import dynamic from "next/dynamic";

const CartSlider = dynamic(() => import("@/components/CartSlider"), { ssr: false });
const OrderForm = dynamic(() => import("@/components/OrderForm"), { ssr: false });

/** Корзина и форма заказа подгружаются после гидрации — меньше JS на первом кадре */
export default function AppShellOverlays() {
  return (
    <>
      <CartSlider />
      <OrderForm />
    </>
  );
}
