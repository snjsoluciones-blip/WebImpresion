"use client";

import { useEffect, useRef, useState } from "react";
import s from "./LuigiEgg.module.css";
import Nonno from "./LuigiNonno";

// Easter egg de /luigi: el nonno Luigi (personaje propio de SNJ) entra, le da una pitada
// al cigarrillo y larga una nube de humo que tapa la web. Se va solo o tocando la pantalla.

type Fase = "pre" | "entra" | "pitada" | "humo" | "sale" | "fin";

type Puff = { x: number; y: number; vx: number; vy: number; r: number; gr: number; a: number; da: number };

const TIEMPOS: [Fase, number][] = [
  ["entra", 60],
  ["pitada", 1500],
  ["humo", 3000],
  ["sale", 6600],
  ["fin", 7900],
];

export default function LuigiEgg() {
  const [fase, setFase] = useState<Fase>("pre");
  const faseRef = useRef<Fase>("pre");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timers = useRef<number[]>([]);

  const irA = (f: Fase) => {
    faseRef.current = f;
    setFase(f);
  };

  useEffect(() => {
    timers.current = TIEMPOS.map(([f, t]) => window.setTimeout(() => irA(f), t));
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const cerrar = () => {
    if (faseRef.current === "sale" || faseRef.current === "fin") return;
    timers.current.forEach(clearTimeout);
    irA("sale");
    timers.current = [window.setTimeout(() => irA("fin"), 1300)];
  };

  // Humo dibujado en canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pocoMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const ajustar = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    ajustar();
    window.addEventListener("resize", ajustar);

    // Bocanada suave pre-dibujada
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 128;
    const sc = sprite.getContext("2d")!;
    const g = sc.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(228,228,232,1)");
    g.addColorStop(0.45, "rgba(210,210,216,0.55)");
    g.addColorStop(1, "rgba(200,200,206,0)");
    sc.fillStyle = g;
    sc.fillRect(0, 0, 128, 128);

    const puffs: Puff[] = [];
    const centro = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };

    let frame = 0;
    let raf = 0;
    const escala = Math.min(window.innerWidth, window.innerHeight) / 700;

    const loop = () => {
      frame++;
      const f = faseRef.current;
      if (f === "fin") return;

      // Hilo de humo de la brasa
      if ((f === "entra" || f === "pitada" || f === "humo") && frame % 3 === 0) {
        const b = centro("luigi-brasa");
        if (b) {
          puffs.push({
            x: b.x,
            y: b.y - 4,
            vx: Math.sin(frame / 14) * 0.35,
            vy: -1.1 - Math.random() * 0.5,
            r: 5 * escala,
            gr: 0.22 * escala,
            a: 0.22,
            da: 0.0035,
          });
        }
      }

      // La gran bocanada
      if (f === "humo") {
        const m = centro("luigi-boca");
        if (m) {
          const cuantos = pocoMovimiento ? 2 : 7;
          for (let i = 0; i < cuantos; i++) {
            const ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.7;
            const vel = (2 + Math.random() * 7) * escala;
            puffs.push({
              x: m.x,
              y: m.y,
              vx: Math.cos(ang) * vel,
              vy: Math.sin(ang) * vel * 0.8,
              r: (14 + Math.random() * 18) * escala,
              gr: (1.4 + Math.random() * 2.6) * escala,
              a: 0.34 + Math.random() * 0.18,
              da: 0.0026 + Math.random() * 0.0016,
            });
          }
        }
      }

      if (puffs.length > 900) puffs.splice(0, puffs.length - 900);

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const salida = f === "sale";
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.975;
        p.vy = p.vy * 0.975 - 0.03;
        p.r += p.gr;
        p.gr *= 0.995;
        p.a -= salida ? p.da * 5 : p.da;
        if (p.a <= 0) {
          puffs.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.a;
        ctx.drawImage(sprite, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", ajustar);
    };
  }, []);

  if (fase === "fin") return null;

  return (
    <div className={s.root} data-fase={fase} onClick={cerrar} role="presentation">
      <div className={s.fondo} />

      <div className={s.nonno} aria-hidden="true">
        <Nonno />
      </div>

      <canvas ref={canvasRef} className={s.humo} />

      <div className={s.pill} role="status">
        Ciao, sono Luigi
        <small>tocá para seguir</small>
      </div>
    </div>
  );
}
