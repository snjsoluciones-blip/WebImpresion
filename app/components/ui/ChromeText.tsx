"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

export type ChromeTextProps = {
  children: ReactNode;
  as?: ElementType;
  /** Barrido 6s infinito. SOLO en el h1 del hero. Pausado fuera de viewport. */
  sweep?: boolean;
  className?: string;
};

/**
 * Texto cromo (gradiente de blancos/grises con background-clip:text; fallback #fff).
 * Máximo 3 usos en toda la web: h1 del hero (sweep), cabecera de #contacto, wordmark del footer.
 * Reduced-motion: sin sweep, gradiente congelado.
 */
export default function ChromeText({ children, as: Tag = "span", sweep = false, className = "" }: ChromeTextProps) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLElement | null>(null);
  const animated = sweep && !reduced;

  useEffect(() => {
    if (!animated) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.style.animationPlayState = "";
    };
  }, [animated]);

  return (
    <Tag ref={ref} className={`chrome ${animated ? "chrome--sweep" : ""} ${className}`}>
      {children}
    </Tag>
  );
}
