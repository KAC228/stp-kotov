import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PATHS } from "@/constants/brand";

export default function PlaceholderSectionPage({
  title,
  description,
  ctaHref = PATHS.contacts,
  ctaLabel = "Контакты",
}: {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 pt-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-10 lg:py-14">
        <Link
          href={PATHS.home}
          className="inline-flex items-center gap-2 text-zinc-500 text-sm hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          На главную
        </Link>
        <h1 className="text-white font-semibold tracking-tight text-3xl sm:text-4xl mb-4">{title}</h1>
        <p className="text-zinc-400 text-base leading-relaxed mb-8">{description}</p>
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-zinc-700 text-zinc-300 text-sm hover:border-cyan-400/40 hover:text-white transition-colors"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
