"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Box, Plus, Trash2, RotateCw } from "lucide-react";

const MIN_GAP_MM = 80;
const SNAP_MM = 50;
/** Глубина корпуса в потолок (сторона C), мм — для схемы до точной модели */
const DEFAULT_DEPTH_MM = 60;

function snapMm(value: number, maxMm: number): number {
  const snapped = Math.round(value / SNAP_MM) * SNAP_MM;
  return Math.min(maxMm - MIN_GAP_MM, Math.max(MIN_GAP_MM, snapped));
}

function DimArrow({
  label,
  valueMm,
  className = "",
  horizontal = true,
}: {
  label: string;
  valueMm: number | null;
  className?: string;
  horizontal?: boolean;
}) {
  const dim = valueMm !== null ? `${valueMm} мм` : "—";
  if (horizontal) {
    return (
      <div className={`flex flex-col items-center gap-0.5 ${className}`}>
        <span className="text-cyan-400/90 text-[10px] font-bold font-mono">{label}</span>
        <div className="flex items-center gap-1 w-full">
          <span className="text-amber-400 text-[8px]">◀</span>
          <div className="flex-1 h-px bg-amber-400/70 relative">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-zinc-400 whitespace-nowrap">
              {dim}
            </span>
          </div>
          <span className="text-amber-400 text-[8px]">▶</span>
        </div>
      </div>
    );
  }
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-amber-400 text-[8px]">▲</span>
        <div className="w-px flex-1 min-h-[36px] bg-amber-400/70 relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-zinc-400 whitespace-nowrap [writing-mode:vertical-rl] rotate-180">
            {dim}
          </span>
        </div>
        <span className="text-amber-400 text-[8px]">▼</span>
      </div>
      <span className="text-cyan-400/90 text-[10px] font-bold font-mono">{label}</span>
    </div>
  );
}

interface KsdEngineerViewerProps {
  lengthMm: number | null;
  heightMm: number | null;
  depthMm?: number;
  mountPoints: number[];
  onMountPointsChange: (points: number[]) => void;
}

export default function KsdEngineerViewer({
  lengthMm,
  heightMm,
  depthMm = DEFAULT_DEPTH_MM,
  mountPoints,
  onMountPointsChange,
}: KsdEngineerViewerProps) {
  const [rotation, setRotation] = useState({ x: -18, y: 28 });
  const maxMm = typeof lengthMm === "number" ? lengthMm : null;
  const hMm = heightMm ?? 105;

  const addPoint = () => {
    if (maxMm === null) return;
    const candidate = snapMm(maxMm / 2, maxMm);
    if (mountPoints.includes(candidate)) return;
    onMountPointsChange([...mountPoints, candidate].sort((a, b) => a - b));
  };

  const removePoint = (mm: number) => {
    onMountPointsChange(mountPoints.filter((p) => p !== mm));
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    setRotation((r) => ({
      x: Math.max(-40, Math.min(10, r.x + e.movementY * 0.25)),
      y: r.y + e.movementX * 0.35,
    }));
  };

  const displayLength = maxMm ?? 1500;
  const lengthScale = Math.min(1, 220 / displayLength);
  const boxW = Math.max(120, displayLength * lengthScale * 0.14);
  const boxH = Math.max(28, hMm * 0.38);
  const boxD = Math.max(18, depthMm * 0.35);

  return (
    <div className="flex flex-col h-full min-h-[300px]">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />
          <p className="text-white text-sm font-semibold tracking-tight">3D-модель КСД</p>
        </div>
        <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-wider">
          Режим инженера
        </p>
      </div>

      <div
        className="relative flex-1 rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden cursor-grab active:cursor-grabbing min-h-[200px]"
        onPointerMove={onPointerMove}
        style={{ perspective: "1000px" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center p-4 pt-6 pb-8">
          <div className="relative" style={{ width: boxW + 48, height: boxH + boxD + 56 }}>
            {/* Размер B — высота */}
            <DimArrow
              label="B"
              valueMm={heightMm}
              horizontal={false}
              className="absolute left-0 top-6 bottom-12"
            />

            {/* Размер A — длина */}
            <DimArrow
              label="A"
              valueMm={lengthMm}
              horizontal
              className="absolute left-10 right-4 bottom-0"
            />

            {/* Размер C — глубина */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
              <span className="text-cyan-400/90 text-[10px] font-bold font-mono">C</span>
              <span className="text-[9px] font-mono text-zinc-400">{depthMm} мм</span>
              <span className="text-amber-400 text-[10px]">↘</span>
            </div>

            <motion.div
              className="absolute left-10 top-4"
              style={{
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transformStyle: "preserve-3d",
                width: boxW,
                height: boxH,
              }}
            >
              {/* Сторона A — фасад (длина × высота) */}
              <div
                className="absolute inset-0 rounded-sm border-2 border-cyan-400/50 bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center"
                style={{ transform: `translateZ(${boxD / 2}px)` }}
              >
                <span className="text-cyan-300/80 text-xl font-black font-mono">A</span>
                <div className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 h-0.5 bg-cyan-400/40 rounded-full" />
              {maxMm !== null && mountPoints.map((mm) => {
                const pct = (mm / maxMm) * 100;
                  return (
                    <div
                      key={mm}
                      className="absolute top-0 bottom-0 w-0.5 -translate-x-1/2 bg-amber-400 z-10"
                      style={{ left: `${pct}%` }}
                      title={`${mm} мм от торца`}
                    />
                  );
                })}
              </div>

              {/* Сторона B — верх */}
              <div
                className="absolute left-0 right-0 border border-zinc-600 bg-zinc-800/90 flex items-center justify-center"
                style={{
                  height: boxD,
                  top: 0,
                  transformOrigin: "top center",
                  transform: `rotateX(-90deg) translateZ(0px)`,
                }}
              >
                <span className="text-zinc-500 text-sm font-bold font-mono">B</span>
              </div>

              {/* Сторона C — бок (глубина) */}
              <div
                className="absolute top-0 bottom-0 border border-zinc-600 bg-zinc-800/80 flex items-center justify-center"
                style={{
                  width: boxD,
                  right: 0,
                  transformOrigin: "right center",
                  transform: `rotateY(90deg) translateZ(0px)`,
                }}
              >
                <span className="text-zinc-500 text-sm font-bold font-mono">C</span>
              </div>
            </motion.div>
          </div>
        </div>

        <p className="absolute bottom-2 left-0 right-0 text-center text-zinc-700 text-[9px] font-mono flex items-center justify-center gap-1">
          <RotateCw className="w-3 h-3" />
          A — длина · B — высота · C — глубина · вращение мышью
        </p>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {(
          [
            ["A", "Длина", lengthMm],
            ["B", "Высота", heightMm],
            ["C", "Глубина", depthMm],
          ] as const
        ).map(([side, name, val]) => (
          <div
            key={side}
            className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-2 py-1.5"
          >
            <p className="text-cyan-400 text-[10px] font-bold font-mono">{side}</p>
            <p className="text-zinc-600 text-[8px] uppercase tracking-wide">{name}</p>
            <p className="text-zinc-300 text-[11px] font-mono mt-0.5">
              {val !== null ? `${val} мм` : "—"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-zinc-500 text-xs">Крепёж по оси A (от торца, мм)</p>
          <button
            type="button"
            onClick={addPoint}
            disabled={lengthMm === null}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-800 border border-zinc-700 text-zinc-300 hover:border-cyan-400/40 disabled:opacity-40"
          >
            <Plus className="w-3 h-3" />
            Добавить
          </button>
        </div>
        {mountPoints.length === 0 ? (
          <p className="text-zinc-700 text-xs leading-relaxed">
            Укажите длину и высоту в конфигураторе — размеры A/B/C появятся на схеме. Точная
            GLB-модель подключится после скана Formfactor.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {mountPoints.map((mm) => (
              <li
                key={mm}
                className="inline-flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono"
              >
                {mm} мм
                <button
                  type="button"
                  onClick={() => removePoint(mm)}
                  className="p-1 rounded hover:bg-zinc-700 text-zinc-500 hover:text-red-400"
                  aria-label={`Удалить точку ${mm} мм`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
