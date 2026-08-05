import { redirect } from "next/navigation";
import { PATHS } from "@/constants/brand";

export default function FlibenDocsRedirectPage() {
  redirect(PATHS.certificates);
}
