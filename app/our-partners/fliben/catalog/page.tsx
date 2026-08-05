import { redirect } from "next/navigation";
import { PATHS } from "@/constants/brand";

/** Старый URL каталога партнёра → канонический /catalog (без дублей в поиске). */
export default function FlibenCatalogLegacyRedirect() {
  redirect(PATHS.catalog);
}
