import Link from "next/link";
import { Wind } from "lucide-react";
import { SITE_DOMAIN } from "@/constants/brand";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-5">
      <div className="text-center max-w-lg">

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-zinc-800 bg-zinc-900 mb-8">
          <Wind className="w-7 h-7 text-zinc-400" strokeWidth={1.5} />
        </div>

        {/* Big 404 */}
        <p
          className="text-zinc-800 font-black select-none leading-none mb-6"
          style={{ fontSize: "clamp(6rem, 22vw, 12rem)", fontFamily: "var(--font-brand)" }}
          aria-hidden="true"
        >
          404
        </p>

        {/* Heading */}
        <h1
          className="text-white font-semibold tracking-tighter leading-tight mb-4"
          style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)" }}
        >
          Кажется, вы потерялись.
        </h1>

        {/* Subtext */}
        <p className="text-zinc-500 text-[15px] leading-relaxed mb-10 max-w-sm mx-auto">
          Но не переживайте — наши камеры статического давления всегда направляют потоки точно в цель.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-100 active:scale-95 transition-all duration-200"
        >
          Вернуться на главную
        </Link>

        {/* Divider hint */}
        <p className="mt-10 text-zinc-700 text-[11px] font-mono tracking-[0.2em] uppercase">
          {SITE_DOMAIN}
        </p>
      </div>
    </div>
  );
}
