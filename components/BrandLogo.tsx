/**
 * Логотип СТП-КОТОВ — геометрическая голова кота.
 * Использует готовый SVG-файл из /public/images/logo.svg.
 * Автоматически инвертируется на тёмном фоне (dark=true по умолчанию).
 */
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  /** Инвертировать для тёмного фона (по умолчанию true) */
  dark?: boolean;
  /** Высота в пикселях */
  height?: number;
  /** Ширина в пикселях (по умолчанию = height) */
  width?: number;
}

export default function BrandLogo({
  className = "",
  dark = true,
  height = 32,
  width,
}: BrandLogoProps) {
  const w = width ?? height;
  return (
    <Image
      src="/images/logo.svg"
      alt="Логотип СТП-КОТОВ"
      width={w}
      height={height}
      className={className}
      style={dark ? { filter: "invert(1) brightness(1.1)" } : undefined}
      priority
    />
  );
}
