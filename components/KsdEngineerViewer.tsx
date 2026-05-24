"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Box, Plus, Trash2, RotateCw } from "lucide-react";

const MIN_GAP_MM = 80;
const SNAP_MM = 50;

function snapMm(value: number, maxMm: number): number {
  const snapped = Math.round(value / SNAP_MM) * SNAP_MM;
  return Math.min(maxMm - MIN_GAP_MM, Math.max(MIN_GAP_MM, snapped));
}

interface KsdEngineerViewerProps {
  lengthMm: number | null;
  mountPoints: number[];
  onMountPointsChange: (points: number[]) => void;
}

export default function KsdEngineerViewer({
  lengthMm,
  mountPoints,
  onMountPointsChange,
}: KsdEngineerViewerProps) {
  const [rotation, setRotation] = useState({ x: -12, y: 24 });
  const maxMm = typeof lengthMm === "number" ? lengthMm : 1500;

  const addPoint = () => {
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

  return (
    <div className="flex flex-col h-full min-h-[280px]">
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
        className="relative flex-1 rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden cursor-grab active:cursor-grabbing"
        onPointerMove={onPointerMove}
        style={{ perspective: "900px" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <motion.div
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transformStyle: "preserve-3d",
            }}
            className="relative w-full max-w-[92%]"
          >
            <div
              className="relative mx-auto h-14 rounded-lg border border-zinc-600 bg-gradient-to-b from-zinc-600 to-zinc-800 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
              style={{ width: "100%" }}
            >
              <div className="absolute left-[8%] right-[8%] top-1/2 -translate-y-1/2 h-1 rounded-full bg-cyan-400/50 shadow-[0_0_12px_rgba(0,210,255,0.6)]" />
              {mountPoints.map((mm) => {
                const pct = (mm / maxMm) * 100;
                return (
                  <div
                    key={mm}
                    className="absolute top-0 bottom-0 w-0.5 -translate-x-1/2 bg-amber-400/90 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                    style={{ left: `${pct}%` }}
                    title={`${mm} мм`}
                  />
                );
              })}
            </div>
            <p className="text-center text-zinc-600 text-[10px] font-mono mt-3 tracking-wider">
              {typeof lengthMm === "number" ? `${lengthMm} мм` : "Укажите длину в конфигураторе"}
            </p>
          </motion.div>
        </div>
        <p className="absolute bottom-2 left-0 right-0 text-center text-zinc-700 text-[9px] font-mono flex items-center justify-center gap-1">
          <RotateCw className="w-3 h-3" />
          Вращайте модель, удерживая кнопку мыши
        </p>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-zinc-500 text-xs">Точки крепежа (от торца, мм)</p>
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
            После выбора длины отметьте, на каком расстоянии от торца нужен крепёж. Точная 3D-модель
            с Formfactor подключится позже.
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
