import { redirect } from "next/navigation";
import { PATHS } from "@/constants/brand";

/** Каталог снят с сайта — Fliben доступен в разделе партнёров. */
export default function CatalogRedirectPage() {
  redirect(PATHS.ourPartners);
}
