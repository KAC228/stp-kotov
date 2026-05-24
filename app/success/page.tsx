"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const spring = { type: "spring" as const, damping: 24, stiffness: 160 };

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-5">
      <div className="text-center max-w-lg w-full">

        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...spring, delay: 0.05 }}
          className="inline-flex items-center justify-center mb-8"
        >
          <div className="relative">
            {/* Outer pulse ring */}
            <motion.span
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.7, opacity: 0 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
              className="absolute inset-0 rounded-full bg-emerald-500/20"
            />
            <CheckCircle
              className="w-20 h-20 text-emerald-400 relative z-10"
              strokeWidth={1.5}
            />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.18 }}
          className="text-white font-semibold tracking-tighter leading-tight mb-4"
          style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)" }}
        >
          Спасибо за заказ!
        </motion.h1>

        {/* Body text */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.26 }}
          className="text-zinc-400 text-[15px] leading-relaxed mb-10 max-w-sm mx-auto"
        >
          Ваша заявка успешно оформлена и передана на производство. Чек и детали заказа отправлены вам. Мы свяжемся с вами в ближайшее время, если потребуются уточнения.
        </motion.p>

        {/* Info chips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.33 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {["✓ Заявка принята", "✓ Чек отправлен", "✓ Менеджер свяжется с вами"].map((chip) => (
            <span
              key={chip}
              className="px-4 py-1.5 rounded-full border border-emerald-800/50 bg-emerald-950/30 text-emerald-300 text-xs font-medium"
            >
              {chip}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.4 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-100 active:scale-95 transition-all duration-200"
          >
            Вернуться на сайт
          </Link>
        </motion.div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-10 text-zinc-700 text-[11px] font-mono tracking-[0.2em] uppercase"
        >
          стп-котов.рф · КСД нового поколения
        </motion.p>
      </div>
    </div>
  );
}
