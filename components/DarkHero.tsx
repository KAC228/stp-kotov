import DarkHeroContent from "@/components/DarkHeroContent";
import DarkHeroEffects from "@/components/DarkHeroEffects";

const gridFixed = { backgroundAttachment: "fixed" as const };

export default function DarkHero() {
  return (
    <section className="light-mesh-top relative min-h-screen flex flex-col items-center justify-center text-center px-6 bg-zinc-950 overflow-hidden">
      <div
        data-hero-grid
        className="hero-grid-lines absolute inset-0 opacity-[0.07]"
        style={{
          ...gridFixed,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      <div
        data-hero-grid
        className="hero-grid-dots absolute inset-0 opacity-[0.04]"
        style={{
          ...gridFixed,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,1) 1.5px, transparent 1.5px)",
          backgroundSize: "72px 72px",
          backgroundPosition: "0 0",
        }}
      />

      <DarkHeroEffects />

      <div
        data-hero-vignette
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,transparent_0%,rgba(9,9,11,0.78)_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: "90%",
          height: "2px",
          background:
            "linear-gradient(to right, transparent, rgba(161,161,170,0.20) 25%, rgba(255,255,255,0.09) 50%, rgba(161,161,170,0.20) 75%, transparent)",
          filter: "blur(1px)",
        }}
      />

      <DarkHeroContent />
    </section>
  );
}
