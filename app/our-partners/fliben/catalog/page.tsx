import { redirect } from "next/navigation";
import { PATHS } from "@/constants/brand";

/** Старый URL каталога партнёра → раздел «Наши партнёры». */
export default function FlibenCatalogLegacyRedirect() {
  redirect(PATHS.ourPartners);
}
