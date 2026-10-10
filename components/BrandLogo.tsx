/**
 * Словесный логотип СТП-КОТОВ (серебристый wordmark, прозрачный фон).
 */
import Image from "next/image";
import { sitePath } from "@/lib/site-path";

interface BrandLogoProps {
  className?: string;
  /** true = серебро на тёмном фоне; false = тёмный wordmark на светлом */
  dark?: boolean;
  height?: number;
  width?: number;
  /** Растянуть по ширине контейнера (height: auto) */
  fluid?: boolean;
}

const ASPECT = 659 / 77;

export default function BrandLogo({
  className = "",
  dark = true,
  height = 28,
  width,
  fluid = false,
}: BrandLogoProps) {
  const h = height;
  const w = width ?? Math.round(h * ASPECT);
  const src = dark
    ? sitePath("/images/logo-wordmark-silver.png")
    : sitePath("/images/logo-wordmark-dark.png");

  return (
    <Image
      src={src}
      alt="Логотип СТП-КОТОВ"
      width={w}
      height={h}
      className={`ksd-logo-wordmark max-w-full ${className}`.trim()}
      style={
        fluid
          ? { width: "100%", height: "auto" }
          : { height: h, width: "auto" }
      }
      priority
    />
  );
}
