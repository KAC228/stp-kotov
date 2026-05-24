import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/brand";

export const dynamic = "force-static";

const PATHS = [
  "",
  "/installation",
  "/partnership",
  "/delivery-payment",
  "/contacts",
  "/team",
  "/privacy",
  "/terms",
  "/success",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : 0.7,
  }));
}
