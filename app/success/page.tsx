"use client";

import { Suspense } from "react";
import SuccessPageClient from "./SuccessPageClient";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 text-sm">
          Проверяем оплату…
        </div>
      }
    >
      <SuccessPageClient />
    </Suspense>
  );
}
