import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Header";
import AppShellOverlays from "@/components/AppShellOverlays";
import CookieBanner from "@/components/CookieBanner";
import YandexMetrika from "@/components/YandexMetrika";
import { BRAND_NAME, PRICE_PER_METER_RUB, SITE_URL, WARRANTY_YEARS } from "@/constants/brand";
import { sitePath } from "@/lib/site-path";
import { OG_IMAGE } from "@/lib/metadata";
import { siteJsonLd } from "@/lib/jsonld";
import JsonLd from "@/components/JsonLd";

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  display: "swap",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${BRAND_NAME} — Скрытые теневые потоки`,
  description:
    `Камеры статического давления нового поколения. Единая цена ${PRICE_PER_METER_RUB.toLocaleString("ru-RU")} ₽ за погонный метр. Гарантия ${WARRANTY_YEARS} лет. Тип потолка и врезки включены в стоимость.`,
  keywords:
    `КСД, камера статического давления, СТП-КОТОВ, стп-котов, натяжной потолок, ГКЛ, ${BRAND_NAME}, шинопровод, вентиляция, гарантия ${WARRANTY_YEARS} лет, Fliben`,
  applicationName: BRAND_NAME,
  authors: [{ name: BRAND_NAME, url: SITE_URL }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  category: "business",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  icons: {
    icon: [{ url: sitePath("/images/logo.svg"), type: "image/svg+xml" }],
    apple: sitePath("/images/logo.svg"),
    shortcut: sitePath("/images/logo.svg"),
  },
  manifest: sitePath("/manifest.webmanifest"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: BRAND_NAME,
  },
  other: {
    "theme-color": "#09090b",
  },
  openGraph: {
    title: `${BRAND_NAME} — Скрытые теневые потоки`,
    description:
      `Единая цена ${PRICE_PER_METER_RUB.toLocaleString("ru-RU")} ₽ за метр. Гарантия ${WARRANTY_YEARS} лет. Тип потолка и врезки уже включены в стоимость. Монтаж из коробки.`,
    url: SITE_URL,
    siteName: BRAND_NAME,
    locale: "ru_RU",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} — Скрытые теневые потоки`,
    description: `Камеры статического давления. Гарантия ${WARRANTY_YEARS} лет.`,
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// ── FOUC-prevention script ──────────────────────────────────────────────────────
// Runs synchronously before the browser paints — applies saved theme class
// to <html> so there is no flash of wrong theme on page load.
const themeInitScript = `(function(){try{var t=localStorage.getItem('ksd-theme');if(t==='light')document.documentElement.classList.add('light');}catch(e){}})();`;

// Enables smooth CSS transitions only after the first client-side paint,
// preventing any transition animation on initial page load.
const themeReadyScript = `(function(){requestAnimationFrame(function(){requestAnimationFrame(function(){document.documentElement.classList.add('theme-ready');});});})();`;

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
        <JsonLd data={siteJsonLd()} />
      </head>
      <body
        className={`${inter.className} antialiased bg-zinc-950 text-white`}
        style={{ overflowX: "clip" }}
      >
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
            <YandexMetrika />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
