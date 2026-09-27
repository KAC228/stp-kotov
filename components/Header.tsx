"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect, useSyncExternalStore, useRef, useCallback, CSSProperties, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "@/components/BrandLogo";
import AirflowAnimation from "@/components/AirflowAnimation";
import PaymentTicker from "@/components/PaymentTicker";
import { BRAND_NAME, CONTACTS, HEADER_NAV, MAIN_NAV } from "@/constants/brand";

/** На static export (nginx/reg.ru) client-side переход через next/link ломается — полная загрузка страницы. */
function HeaderNavLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const isHash = href.includes("#");
  if (isHash) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

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
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

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

// ─── scrollable desktop nav ───────────────────────────────────────────────────

function DesktopNav({ navLinkCls, isDark }: { navLinkCls: string; isDark: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const overflow = max > 4;
    setHasOverflow(overflow);
    setCanScrollLeft(overflow && el.scrollLeft > 4);
    setCanScrollRight(overflow && el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  const scrollByDir = (dir: -1 | 1) => {
    scrollRef.current?.scrollBy({ left: dir * 180, behavior: "smooth" });
  };

  const arrowEnabledCls = isDark
    ? "border-cyan-300/85 bg-cyan-300/24 text-cyan-100 shadow-[0_0_22px_rgba(0,210,255,0.65)] hover:bg-cyan-300/34 hover:border-cyan-300/95 hover:text-white hover:shadow-[0_0_32px_rgba(0,210,255,0.82)]"
    : "border-cyan-500/75 bg-cyan-500/20 text-cyan-700 shadow-[0_0_18px_rgba(0,210,255,0.35)] hover:bg-cyan-500/28 hover:border-cyan-600/90 hover:text-cyan-900 hover:shadow-[0_0_26px_rgba(0,210,255,0.55)]";

  const arrowIdleCls = isDark
    ? "border-zinc-600/70 bg-zinc-900/60 text-zinc-600 opacity-50"
    : "border-zinc-400/70 bg-white/50 text-zinc-500 opacity-50";

  const arrowHiddenCls = "opacity-0 pointer-events-none w-0 min-w-0 px-0 border-0 overflow-hidden";

  return (
    <div className="hidden lg:flex items-center min-w-0 flex-1 justify-center gap-1.5 px-1 relative z-20">
      <button
        type="button"
        aria-label="Прокрутить меню влево"
        onClick={() => scrollByDir(-1)}
        disabled={!canScrollLeft}
        className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-200 ${
          !hasOverflow ? arrowHiddenCls : canScrollLeft ? arrowEnabledCls : arrowIdleCls
        }`}
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={2} />
      </button>

      <div
        ref={scrollRef}
        className="relative min-w-0 flex-1 overflow-x-auto scrollbar-none [mask-image:linear-gradient(90deg,transparent,black_20px,black_calc(100%-20px),transparent)]"
      >
        <nav className="relative z-10 flex items-center justify-start w-max min-w-full gap-x-5 xl:gap-x-6 2xl:gap-x-7 px-2">
          {HEADER_NAV.map(({ href, label }) => (
            <HeaderNavLink
              key={href + label}
              href={href}
              className={`${navLinkCls} relative z-10 px-1 py-1.5 whitespace-nowrap`}
            >
              {label}
            </HeaderNavLink>
          ))}
        </nav>
      </div>

      <button
        type="button"
        aria-label="Прокрутить меню вправо"
        onClick={() => scrollByDir(1)}
        disabled={!canScrollRight}
        className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-200 ${
          !hasOverflow ? arrowHiddenCls : canScrollRight ? arrowEnabledCls : arrowIdleCls
        }`}
      >
        <ChevronRight className="w-4 h-4" strokeWidth={2} />
      </button>
    </div>
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
    ? "text-zinc-400 text-sm xl:text-[15px] font-medium tracking-wide whitespace-nowrap hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,210,255,0.85)] transition-all duration-200"
    : "text-zinc-700 text-sm xl:text-[15px] font-semibold tracking-wide whitespace-nowrap hover:text-zinc-950 hover:drop-shadow-[0_0_8px_rgba(0,210,255,0.85)] transition-all duration-200";

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
      <PaymentTicker />
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
      <div className="max-w-[92rem] mx-auto px-5 sm:px-7 lg:px-9 xl:px-10 pt-2.5 pb-3 relative z-20">
        <div className="flex items-center justify-between min-h-[3rem] lg:min-h-[3.25rem] lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-x-8 xl:gap-x-12 2xl:gap-x-14">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 lg:gap-2.5 group shrink-0 min-w-0 max-w-[46vw] sm:max-w-none mr-3 lg:mr-0"
            style={{ fontFamily: "var(--font-brand)" }}
          >
            <span className={`flex h-9 w-9 lg:h-10 lg:w-10 shrink-0 items-center justify-center rounded-lg border will-change-[box-shadow] transition-all duration-200 ${logoIconCls}`}>
              <BrandLogo height={26} dark={isDark} />
            </span>
            <span className={`font-black tracking-tighter text-sm lg:text-base truncate transition-colors duration-200 ${logoTextCls}`}>
              {BRAND_NAME}
            </span>
          </Link>

          {/* Desktop nav — горизонтальная прокрутка со стрелками */}
          <DesktopNav navLinkCls={navLinkCls} isDark={isDark} />

          {/* Right-side controls */}
          <div className="flex items-center justify-end gap-3.5 sm:gap-5 shrink-0 pl-3">
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

            {/* Hamburger — планшеты и ноутбуки до xl */}
            <button
              type="button"
              className={`lg:hidden transition-all duration-200 ${iconCls}`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Меню"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
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
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", damping: 32, stiffness: 280 }}
            className="lg:hidden overflow-hidden border-t border-zinc-700/50"
            style={{ background: "linear-gradient(to bottom, #1c1c1e, #0d0d0f)" }}
          >
            <nav className="px-10 py-10 flex flex-col gap-7">
              {MAIN_NAV.map(({ href, label }) => (
                <HeaderNavLink
                  key={href + label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="text-zinc-300 text-base hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,210,255,0.8)] transition-all duration-200 py-0.5"
                >
                  {label}
                </HeaderNavLink>
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
