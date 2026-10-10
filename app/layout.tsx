import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Header";
import AppShellOverlays from "@/components/AppShellOverlays";
import CookieBanner from "@/components/CookieBanner";
import YandexMetrika from "@/components/YandexMetrika";
import { BRAND_NAME, HERO_TAGLINE, SITE_URL, WARRANTY_YEARS } from "@/constants/brand";
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
    `Камеры статического давления СТП-КОТОВ — ${HERO_TAGLINE}. Заводская гарантия ${WARRANTY_YEARS} лет при сертифицированном монтаже.`,
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
      `${HERO_TAGLINE}. Заводская гарантия ${WARRANTY_YEARS} лет при сертифицированном монтаже.`,
    url: SITE_URL,
    siteName: BRAND_NAME,
    locale: "ru_RU",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} — Скрытые теневые потоки`,
    description: `Камеры статического давления. Заводская гарантия ${WARRANTY_YEARS} лет при сертифицированном монтаже.`,
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

// Светлая тема отключена — сбрасываем legacy localStorage и класс .light
const themeInitScript = `(function(){try{document.documentElement.classList.remove('light');if(localStorage.getItem('ksd-theme')==='light')localStorage.setItem('ksd-theme','dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <JsonLd data={siteJsonLd()} />
      </head>
      <body
        className={`${inter.className} antialiased bg-zinc-950 text-white`}
        style={{ overflowX: "clip" }}
      >
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
