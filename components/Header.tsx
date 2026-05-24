"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, Sun, Moon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "@/components/BrandLogo";
import AirflowAnimation from "@/components/AirflowAnimation";
import { BRAND_NAME, CONTACTS, MAIN_NAV } from "@/constants/brand";

// ─── surface definitions ───────────────────────────────────────────────────────
//
// DARK  → near-black, ultra-minimal. Cyan airflow pops against dark.
// LIGHT → brushed silver aluminium (raw hex — immune to CSS-var inversion).

const DARK_BG_SCROLLED =
  "linear-gradient(to bottom, #18181b 0%, #0d0d0f 100%)";
const DARK_BG_TOP =
  "linear-gradient(to bottom, rgba(24,24,27,0.82) 0%, rgba(13,13,15,0.90) 100%)";

const LIGHT_BG_SCROLLED =
  "linear-gradient(to bottom, #f8f8f9 0%, #e8e8eb 40%, #d8d8db 100%)";
const LIGHT_BG_TOP =
  "linear-gradient(to bottom, rgba(248,248,249,0.88) 0%, rgba(232,232,235,0.93) 40%, rgba(216,216,219,0.96) 100%)";

// ─── theme toggle ─────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isDark = theme === "dark";
  const btnCls = isDark
    ? "border-zinc-700 bg-zinc-800/70 text-zinc-400 hover:border-cyan-400/50 hover:text-white"
    : "border-zinc-400 bg-white/60 text-zinc-600 hover:border-cyan-400/60 hover:text-zinc-900";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      className={`relative flex items-center justify-center w-8 h-8 rounded-xl border will-change-[box-shadow] hover:shadow-[0_0_18px_rgba(0,210,255,0.55)] transition-all duration-200 ${btnCls}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted ? (
          <motion.div
            key={theme}
            initial={{ opacity: 0, rotate: -60, scale: 0.4 }}
            animate={{ opacity: 1, rotate: 0,   scale: 1   }}
            exit={{    opacity: 0, rotate:  60, scale: 0.4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {isDark
              ? <Sun  className="w-[15px] h-[15px]" strokeWidth={1.75} />
              : <Moon className="w-[15px] h-[15px]" strokeWidth={1.75} />
            }
          </motion.div>
        ) : (
          <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 0 }}>
            <Sun className="w-[15px] h-[15px]" strokeWidth={1.75} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

// ─── header ───────────────────────────────────────────────────────────────────

export default function Header() {
  const { totalItems, openCart } = useCart();
  const { theme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);

  const isDark = theme === "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── inline style — surface varies by theme + scroll ────────────────────────

  const headerStyle: CSSProperties = {
    background: isDark
      ? (scrolled ? DARK_BG_SCROLLED  : DARK_BG_TOP)
      : (scrolled ? LIGHT_BG_SCROLLED : LIGHT_BG_TOP),

    // Slot gap: solid line + deep inset shadow = physical depth illusion
    borderBottom: isDark ? "8px solid #000000" : "8px solid #71717a",
    boxShadow: isDark
      ? (scrolled
          ? "inset 0 -15px 30px rgba(0,0,0,0.80), inset 0 1px 0 rgba(255,255,255,0.04)"
          : "inset 0 -10px 22px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.03)")
      : (scrolled
          ? "inset 0 -15px 30px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.92)"
          : "inset 0 -10px 22px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.80)"),

    backdropFilter:       scrolled ? "blur(24px) saturate(200%)" : "blur(10px) saturate(150%)",
    WebkitBackdropFilter: scrolled ? "blur(24px) saturate(200%)" : "blur(10px) saturate(150%)",
  };

  // ── per-theme text / icon colour strings ────────────────────────────────────
  const navLinkCls = isDark
    ? "text-zinc-400 text-[13px] font-medium hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,210,255,0.85)] transition-all duration-200"
    : "text-zinc-700 text-[13px] font-semibold hover:text-zinc-950 hover:drop-shadow-[0_0_8px_rgba(0,210,255,0.85)] transition-all duration-200";

  const iconCls = isDark
    ? "relative text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,210,255,0.85)] transition-all duration-200"
    : "relative text-zinc-600 hover:text-zinc-950 hover:drop-shadow-[0_0_8px_rgba(0,210,255,0.85)] transition-all duration-200";

  const logoIconCls = isDark
    ? "border-zinc-700 bg-zinc-900/70 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_rgba(0,210,255,0.40)]"
    : "border-zinc-400 bg-white/60 group-hover:border-cyan-400/60 group-hover:shadow-[0_0_20px_rgba(0,210,255,0.45)]";

  const logoTextCls = isDark
    ? "text-white group-hover:text-zinc-300"
    : "text-zinc-900 group-hover:text-zinc-700";

  // ── top-edge sheen ──────────────────────────────────────────────────────────
  const sheenBg = isDark
    ? "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 70%, transparent 100%)"
    : "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.60) 20%, rgba(255,255,255,0.96) 50%, rgba(255,255,255,0.60) 80%, transparent 100%)";

  return (
    // ksd-header overrides all --color-zinc-* to dark-mode values, ensuring
    // that text classes like text-zinc-700 produce readable dark text on the
    // silver surface in light mode (a no-op in dark mode).
    <header
      className="ksd-header fixed top-0 left-0 right-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-400"
      style={headerStyle}
    >
      {/* Top-edge sheen — "light hitting the upper rim" */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: sheenBg }}
      />

      {/* Brushed-metal texture lines — light mode only */}
      {!isDark && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom,transparent,transparent 3px,rgba(0,0,0,0.025) 3px,rgba(0,0,0,0.025) 4px)",
            opacity: 0.55,
          }}
        />
      )}

      {/* pt-3/pb-4 balance: top edge sheen + bottom slot shadow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-4">
        {/*
          Mobile (< md): simple flex justify-between — logo left, controls right.
          Desktop (≥ md): 3-column grid — logo | nav centred | controls right.
          Switching between layouts avoids the broken 1fr-0-1fr split on mobile
          when the middle nav column is hidden.
        */}
        <div className="flex items-center justify-between h-16 md:grid md:grid-cols-[1fr_auto_1fr]">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 group min-w-0"
            style={{ fontFamily: "var(--font-brand)" }}
          >
            <span className={`flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl border will-change-[box-shadow] transition-all duration-200 ${logoIconCls}`}>
              <BrandLogo height={36} dark={isDark} />
            </span>
            <span className={`font-black tracking-tighter text-base sm:text-lg truncate transition-colors duration-200 ${logoTextCls}`}>
              {BRAND_NAME}
            </span>
          </Link>

          {/* Desktop nav — sits in the auto-width centre column */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7">
            {MAIN_NAV.map(({ href, label }) => (
              <Link key={href + label} href={href} className={navLinkCls}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Right-side controls — end of third grid column on desktop, shrink-0 on mobile */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
            <ThemeToggle />

            {/* Cart */}
            <button onClick={openCart} className={iconCls} aria-label="Корзина">
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.75} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-cyan-400 text-zinc-950 text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile hamburger */}
            <button
              className={`md:hidden transition-all duration-200 ${iconCls}`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Меню"
            >
              {mobileOpen
                ? <X    className="w-[18px] h-[18px]" strokeWidth={1.75} />
                : <Menu className="w-[18px] h-[18px]" strokeWidth={1.75} />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — always dark interior for legibility */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", damping: 32, stiffness: 280 }}
            className="md:hidden overflow-hidden border-t border-zinc-700/50"
            style={{ background: "linear-gradient(to bottom, #1c1c1e, #0d0d0f)" }}
          >
            <nav className="px-6 py-6 flex flex-col gap-5">
              {MAIN_NAV.map(({ href, label }) => (
                <Link
                  key={href + label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="text-zinc-300 text-base hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,210,255,0.8)] transition-all duration-200 py-0.5"
                >
                  {label}
                </Link>
              ))}
              <div className="pt-4 border-t border-zinc-700/50">
                <a
                  href={`tel:${CONTACTS.phoneTel}`}
                  className="text-zinc-500 text-sm hover:text-white transition-colors"
                >
                  {CONTACTS.phoneDisplay}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cold-air stream — always visible, pours from the black slot */}
      <AirflowAnimation />
    </header>
  );
}
