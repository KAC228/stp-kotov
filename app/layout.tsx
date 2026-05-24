import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Header";
import AppShellOverlays from "@/components/AppShellOverlays";
import CookieBanner from "@/components/CookieBanner";
import { SITE_URL } from "@/constants/brand";

const inter = Inter({
  subsets: ["cyrillic"],
  display: "swap",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "СТП-КОТОВ — Скрытые теневые потоки",
  description:
    "Камеры статического давления нового поколения. Единая цена 50 000 ₽ за погонный метр. Гарантия 25 лет. Тип потолка и врезки включены в стоимость.",
  keywords:
    "КСД, камера статического давления, натяжной потолок, ГКЛ, СТП-КОТОВ, шинопровод, вентиляция, гарантия 25 лет",
  icons: {
    icon: [{ url: "/images/logo.svg", type: "image/svg+xml" }],
    apple: "/images/logo.svg",
    shortcut: "/images/logo.svg",
  },
  openGraph: {
    title: "СТП-КОТОВ — Скрытые теневые потоки",
    description:
      "Единая цена 50 000 ₽ за метр. Гарантия 25 лет. Тип потолка и врезки уже включены в стоимость. Монтаж из коробки.",
    url: SITE_URL,
    siteName: "СТП-КОТОВ",
    locale: "ru_RU",
    type: "website",
    images: [{ url: "/images/logo.svg", width: 747, height: 684, alt: "Логотип СТП-КОТОВ" }],
  },
  twitter: {
    card: "summary",
    title: "СТП-КОТОВ — Скрытые теневые потоки",
    description: "Камеры статического давления. Гарантия 25 лет.",
    images: ["/images/logo.svg"],
  },
};

// ── FOUC-prevention script ──────────────────────────────────────────────────────
// Runs synchronously before the browser paints — applies saved theme class
// to <html> so there is no flash of wrong theme on page load.
const themeInitScript = `(function(){try{var t=localStorage.getItem('ksd-theme');if(t==='light')document.documentElement.classList.add('light');}catch(e){}})();`;

// Enables smooth CSS transitions only after the first client-side paint,
// preventing any transition animation on initial page load.
const themeReadyScript = `(function(){requestAnimationFrame(function(){requestAnimationFrame(function(){document.documentElement.classList.add('theme-ready');});});})();`;

const YM_COUNTER_ID = 109058765;
const yandexMetrikaInit = `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${YM_COUNTER_ID},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true,ecommerce:"dataLayer"});`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: the "light" / "theme-ready" classes are applied
    // client-side (localStorage) so the attribute will differ between SSR and
    // the first client render — this tells React to ignore the mismatch.
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Theme init — must execute before first paint to prevent FOUC */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${inter.className} antialiased bg-zinc-950 text-white`}
        style={{ overflowX: "clip" }}
      >
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<div><img src="https://mc.yandex.ru/watch/${YM_COUNTER_ID}" style="position:absolute;left:-9999px;" alt="" /></div>`,
          }}
        />
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: yandexMetrikaInit }}
        />
        {/* Enables smooth colour transitions after the initial paint */}
        <script dangerouslySetInnerHTML={{ __html: themeReadyScript }} />

        <ThemeProvider>
          <CartProvider>
            <a href="#main-content" className="ksd-skip-link">
              К содержимому
            </a>
            <Header />
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
            <AppShellOverlays />
            <CookieBanner />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
