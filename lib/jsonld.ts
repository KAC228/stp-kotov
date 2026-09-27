import { BRAND_NAME, CONTACTS, LEGAL, SITE_URL, SOCIAL, WARRANTY_YEARS } from "@/constants/brand";

/** Глобальный граф Organization + WebSite + LocalBusiness для поисковиков. */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": `${SITE_URL}/#organization`,
        name: BRAND_NAME,
        legalName: LEGAL.companyFull,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/images/logo.svg`,
        },
        image: `${SITE_URL}/images/og-image.jpg`,
        email: CONTACTS.email,
        telephone: CONTACTS.phoneTel,
        taxID: LEGAL.inn,
        address: {
          "@type": "PostalAddress",
          streetAddress: "ул. Ключевая, д. 3, кв. 2",
          addressLocality: "х. Северо-Восточные Сады",
          addressRegion: "Респ. Адыгея",
          postalCode: "385768",
          addressCountry: "RU",
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
        sameAs: [SOCIAL.vk, SOCIAL.whatsapp],
        areaServed: {
          "@type": "Country",
          name: "Russia",
        },
        priceRange: "₽₽₽",
        description: `Камеры статического давления и комплектация вентиляции. Гарантия ${WARRANTY_YEARS} лет.`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: BRAND_NAME,
        url: SITE_URL,
        inLanguage: "ru-RU",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

export function productJsonLd(product: {
  title: string;
  description: string;
  sku: string;
  image: string;
  priceRub: number;
  slug: string;
}) {
  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `${SITE_URL}${product.image}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    sku: product.sku,
    mpn: product.sku,
    image: [imageUrl],
    brand: {
      "@type": "Brand",
      name: "Fliben",
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/catalog/${product.slug}`,
      priceCurrency: "RUB",
      price: product.priceRub,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: BRAND_NAME,
        url: SITE_URL,
      },
    },
  };
}

export function articleJsonLd(article: {
  title: string;
  excerpt: string;
  slug: string;
  image: string | null;
  publishedAt: string | null;
}) {
  const imageUrl = article.image
    ? article.image.startsWith("http")
      ? article.image
      : `${SITE_URL}${article.image}`
    : `${SITE_URL}/images/og-image.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: [imageUrl],
    datePublished: article.publishedAt ?? undefined,
    dateModified: article.publishedAt ?? undefined,
    mainEntityOfPage: `${SITE_URL}/articles/${article.slug}`,
    author: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: BRAND_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.svg`,
      },
    },
    inLanguage: "ru-RU",
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? SITE_URL : `${SITE_URL}${item.path}`,
    })),
  };
}
