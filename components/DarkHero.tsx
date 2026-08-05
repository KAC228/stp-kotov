import DarkHeroContent from "@/components/DarkHeroContent";
import DarkHeroEffects from "@/components/DarkHeroEffects";
import WindBackground from "@/components/WindBackground";

export default function DarkHero() {
  return (
    <section className="light-mesh-top relative min-h-screen flex flex-col items-center justify-center text-center px-6 bg-zinc-950 overflow-hidden">
      <WindBackground />

      {/* Лёгкая сетка поверх звёзд — почти незаметная */}
      <div
        data-hero-grid
        className="hero-grid-lines absolute inset-0 opacity-[0.035] z-[1]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          backgroundAttachment: "fixed",
        }}
      />

      <DarkHeroEffects />

      <div
        data-hero-vignette
        className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,transparent_0%,rgba(9,10,15,0.72)_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 z-[1]"
        style={{
          width: "90%",
          height: "2px",
          background:
            "linear-gradient(to right, transparent, rgba(161,161,170,0.20) 25%, rgba(255,255,255,0.09) 50%, rgba(161,161,170,0.20) 75%, transparent)",
          filter: "blur(1px)",
        }}
      />

      <div className="relative z-10 w-full">
        <DarkHeroContent />
      </div>
    </section>
  );
}
