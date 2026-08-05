import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/brand";

export const dynamic = "force-static";

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
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
