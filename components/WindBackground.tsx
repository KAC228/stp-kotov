"use client";

import { useEffect, useRef } from "react";

type Vortex = {
  cx: number;
  cy: number;
  strength: number;
  spin: number;
  radius: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
  trail: Array<{ x: number; y: number }>;
};

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeVortices(w: number, h: number, count: number, seed: number): Vortex[] {
  const rnd = mulberry32(seed);
  return Array.from({ length: count }, (_, i) => ({
    cx: w * (0.15 + rnd() * 0.7),
    cy: h * (0.2 + rnd() * 0.6),
    strength: 0.35 + rnd() * 0.55,
    spin: (i % 2 === 0 ? 1 : -1) * (0.8 + rnd() * 0.7),
    radius: Math.min(w, h) * (0.18 + rnd() * 0.28),
  }));
}

function makeParticles(count: number, w: number, h: number, seed: number): Particle[] {
  const rnd = mulberry32(seed + 99);
  return Array.from({ length: count }, () => spawnParticle(rnd, w, h));
}

function spawnParticle(rnd: () => number, w: number, h: number): Particle {
  const maxLife = 180 + rnd() * 220;
  return {
    x: rnd() * w,
    y: rnd() * h,
    vx: (rnd() - 0.5) * 0.4,
    vy: (rnd() - 0.5) * 0.4,
    life: rnd() * maxLife,
    maxLife,
    size: 0.7 + rnd() * 1.6,
    opacity: 0.12 + rnd() * 0.28,
    trail: [],
  };
}

/**
 * Завихрения воздуха на фоне Hero.
 * Тёмная / светлая тема, на мобильных — меньше частиц.
 */
export default function WindBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let vortices: Vortex[] = [];
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;
    let t = 0;
    const rnd = mulberry32(42);

    const isLight = () => document.documentElement.classList.contains("light");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const mobile = w < 640;
      const vortexCount = mobile ? 3 : w < 1024 ? 4 : 5;
      const particleCount = mobile ? 55 : w < 1024 ? 85 : 120;
      vortices = makeVortices(w, h, vortexCount, 17);
      particles = makeParticles(particleCount, w, h, 31);
    };

    const fieldAt = (x: number, y: number, time: number) => {
      let fx = 0.12;
      let fy = Math.sin(x * 0.002 + time * 0.0004) * 0.08;

      for (const v of vortices) {
        const dx = x - v.cx;
        const dy = y - v.cy;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
        const falloff = Math.exp(-((dist / v.radius) ** 2));
        const force = v.strength * falloff;

        // касательная составляющая — завихрение
        fx += (-dy / dist) * force * v.spin;
        fy += (dx / dist) * force * v.spin;
        // лёгкое втягивание к центру
        fx += (-dx / dist) * force * 0.18;
        fy += (-dy / dist) * force * 0.18;
      }

      // медленный дрейф центров
      return { fx, fy };
    };

    const draw = () => {
      if (!running) return;
      t += 1;

      const light = isLight();
      const accentRgb = light ? "14, 165, 233" : "0, 210, 255";
      const baseRgb = light ? "100, 116, 139" : "125, 211, 252";

      ctx.clearRect(0, 0, w, h);

      // медленно двигаем центры вихрей
      if (!prefersReduced) {
        for (let i = 0; i < vortices.length; i++) {
          const v = vortices[i];
          v.cx += Math.sin(t * 0.002 + i * 1.7) * 0.15;
          v.cy += Math.cos(t * 0.0015 + i * 2.1) * 0.12;
        }
      }

      // мягкие спиральные дуги вокруг вихрей
      const arcOpacity = light ? 0.045 : 0.08;
      for (let vi = 0; vi < vortices.length; vi++) {
        const v = vortices[vi];
        for (let ring = 0; ring < 3; ring++) {
          const r = v.radius * (0.35 + ring * 0.28);
          const turns = 1.15 + ring * 0.25;
          const phase = prefersReduced ? vi : t * 0.008 * v.spin + vi + ring;

          ctx.beginPath();
          ctx.strokeStyle = `rgba(${accentRgb}, ${arcOpacity * (1 - ring * 0.25)})`;
          ctx.lineWidth = 1;
          let started = false;
          for (let a = 0; a <= Math.PI * 2 * turns; a += 0.08) {
            const rr = r * (0.85 + 0.15 * Math.sin(a * 2 + phase));
            const ang = a * v.spin + phase * 0.3;
            const px = v.cx + Math.cos(ang) * rr;
            const py = v.cy + Math.sin(ang) * rr;
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else {
              ctx.lineTo(px, py);
            }
          }
          ctx.stroke();
        }
      }

      for (const p of particles) {
        if (!prefersReduced) {
          const { fx, fy } = fieldAt(p.x, p.y, t);
          p.vx = p.vx * 0.92 + fx * 0.55;
          p.vy = p.vy * 0.92 + fy * 0.55;

          // ограничение скорости
          const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (sp > 2.2) {
            p.vx = (p.vx / sp) * 2.2;
            p.vy = (p.vy / sp) * 2.2;
          }

          p.x += p.vx;
          p.y += p.vy;
          p.life += 1;

          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 14) p.trail.shift();

          if (
            p.life > p.maxLife ||
            p.x < -40 ||
            p.x > w + 40 ||
            p.y < -40 ||
            p.y > h + 40
          ) {
            Object.assign(p, spawnParticle(rnd, w, h));
            p.trail = [];
          }
        }

        const lifeFade = 1 - Math.abs(p.life / p.maxLife - 0.5) * 1.4;
        const alpha = Math.max(0, p.opacity * lifeFade * (light ? 0.65 : 1));
        if (alpha < 0.01) continue;

        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          for (let i = 0; i < p.trail.length; i++) {
            const pt = p.trail[i];
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          const head = p.trail[p.trail.length - 1];
          const tail = p.trail[0];
          const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
          grad.addColorStop(0, `rgba(${baseRgb}, 0)`);
          grad.addColorStop(0.55, `rgba(${accentRgb}, ${alpha * 0.7})`);
          grad.addColorStop(1, `rgba(${accentRgb}, ${alpha})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = p.size;
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    // стартовый clear
    ctx.clearRect(0, 0, w, h);
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onTheme = () => {
      ctx.clearRect(0, 0, w, h);
      resize();
    };
    window.addEventListener("ksd-theme-change", onTheme);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("ksd-theme-change", onTheme);
    };
  }, []);

  return (
    <div aria-hidden="true" className="wind-field pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="wind-field-canvas absolute inset-0 h-full w-full" />
    </div>
  );
}
