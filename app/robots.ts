import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/brand";

export const dynamic = "force-static";

/** ASCII-хост (punycode). В robots.txt кириллица ломается: файл отдаётся как text/plain без charset. */
const SITE_ORIGIN = new URL(SITE_URL).origin;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/success", "/api/", "/send.php", "/pay.php", "/pay-status.php", "/tbank-notify.php"],
      },
      {
        userAgent: "Yandex",
        allow: "/",
        disallow: ["/success", "/api/", "/send.php", "/pay.php", "/pay-status.php", "/tbank-notify.php"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/success", "/api/", "/send.php", "/pay.php", "/pay-status.php", "/tbank-notify.php"],
      },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
