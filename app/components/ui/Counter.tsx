"use client";

import { useEffect, useRef } from "react";
import { animate } from "framer-motion";
import { EASE } from "./motion";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

export type CounterProps = {
  value: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  /** Segundos (default 1.2). */
  duration?: number;
  decimals?: number;
  className?: string;
};

/**
 * Interpola al entrar 40% en viewport (una sola vez) con animate() de framer-motion, EASE.expo, 1200 ms.
 * El valor final SIEMPRE está en el HTML inicial (SEO / sin JS); el JS solo lo reemplaza para animar.
 * Solo se instancia con números reales: 500, 6, 4, 4, 3.
 * Reduced-motion: muestra el valor final sin animar.
 */
export default function Counter({
  value,
  from = 0,
  prefix = "",
  suffix = "",
  duration = 1.2,
  decimals = 0,
  className = "",
}: CounterProps) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLSpanElement | null>(null);
  const done = useRef(false);

  useEffect(() => {
    if (reduced || done.current) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let controls: { stop: () => void } | null = null;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return;
        done.current = true;
        io.disconnect();
        controls = animate(from, value, {
          duration,
          ease: EASE.expo,
          onUpdate: (v) => {
            el.textContent = v.toFixed(decimals);
          },
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (controls) controls.stop();
      el.textContent = value.toFixed(decimals);
    };
  }, [reduced, from, value, duration, decimals]);

  return (
    <span className={`font-display tabular-nums ${className}`}>
      {prefix}
      <span ref={ref}>{value.toFixed(decimals)}</span>
      {suffix}
    </span>
  );
}
