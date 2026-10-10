"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState, useEffect, useRef, useCallback, CSSProperties, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "@/components/BrandLogo";
import AirflowAnimation from "@/components/AirflowAnimation";
import PaymentTicker from "@/components/PaymentTicker";
import { BRAND_NAME, CONTACTS, HEADER_NAV, MAIN_NAV } from "@/constants/brand";
import { sitePath } from "@/lib/site-path";

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
    <a href={sitePath(href)} className={className} onClick={onClick}>
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

// ─── scrollable desktop nav ───────────────────────────────────────────────────

function DesktopNav({ navLinkCls }: { navLinkCls: string }) {
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

  const arrowEnabledCls =
    "border-cyan-300/85 bg-cyan-300/24 text-cyan-100 shadow-[0_0_22px_rgba(255,90,120,0.65)] hover:bg-cyan-300/34 hover:border-cyan-300/95 hover:text-white hover:shadow-[0_0_32px_rgba(255,90,120,0.82)]";

  const arrowIdleCls = "border-zinc-600/70 bg-zinc-900/60 text-zinc-600 opacity-50";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerStyle: CSSProperties = {
    background: scrolled ? DARK_BG_SCROLLED : DARK_BG_TOP,
    borderBottom: "1px solid rgba(63,63,70,0.7)",
    boxShadow: scrolled
      ? "0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)"
      : "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)",
    backdropFilter: scrolled ? "blur(24px) saturate(200%)" : "blur(10px) saturate(150%)",
    WebkitBackdropFilter: scrolled ? "blur(24px) saturate(200%)" : "blur(10px) saturate(150%)",
  };

  const navLinkCls =
    "text-zinc-400 text-sm xl:text-[15px] font-medium tracking-wide whitespace-nowrap hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,90,120,0.85)] transition-all duration-200";

  const iconCls =
    "relative text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,90,120,0.85)] transition-all duration-200";

  const sheenBg =
    "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 70%, transparent 100%)";

  return (
    <header
      className="ksd-header fixed top-0 left-0 right-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-400"
      style={headerStyle}
    >
      <PaymentTicker />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: sheenBg }}
      />

      <div className="max-w-[92rem] mx-auto px-5 sm:px-7 lg:px-9 xl:px-10 pt-2 pb-2.5 relative z-20">
        <div className="flex items-center justify-between min-h-[2.75rem] lg:min-h-[3rem] lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-x-8 xl:gap-x-12 2xl:gap-x-14">

          <Link
            href="/"
            className="flex items-center group shrink-0 min-w-0 max-w-[48vw] sm:max-w-[14rem] lg:max-w-[16rem] mr-3 lg:mr-0"
            aria-label={BRAND_NAME}
          >
            <BrandLogo
              height={22}
              dark
              className="opacity-95 group-hover:opacity-100 transition-opacity duration-200"
            />
          </Link>

          <DesktopNav navLinkCls={navLinkCls} />

          <div className="flex items-center justify-end gap-3.5 sm:gap-5 shrink-0 pl-3">
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
                  className="text-zinc-300 text-base hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,90,120,0.8)] transition-all duration-200 py-0.5"
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
