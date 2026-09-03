"use client";

import { createElement, type ComponentType, type ElementType, type ReactNode } from "react";
import { motion, type HTMLMotionProps, type TargetAndTransition } from "framer-motion";
import { DUR, EASE, VIEWPORT } from "./motion";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

export type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  /** Desplazamiento inicial en px (default 24). */
  y?: number;
  /** blur(6px) → 0 (default true). */
  blur?: boolean;
  /** Segundos. */
  delay?: number;
  /** default true */
  once?: boolean;
  className?: string;
};

type MotionDivLike = ComponentType<HTMLMotionProps<"div">>;

// Resolución estable (fuera del render) del componente motion para `as`:
// - tags: el proxy `motion` cachea internamente (motion.div === motion.div)
// - componentes: cache propia por identidad para no recrearlos en cada render
const createdCache = new WeakMap<object, MotionDivLike>();
function motionFor(as: ElementType): MotionDivLike {
  if (typeof as === "string") {
    return (motion as unknown as Record<string, MotionDivLike>)[as];
  }
  const hit = createdCache.get(as);
  if (hit) return hit;
  const created = motion.create(as as ComponentType<Record<string, unknown>>) as unknown as MotionDivLike;
  createdCache.set(as, created);
  return created;
}

/**
 * Reveal canónico: opacity 0→1, translateY(24px)→0, blur(6px)→0, DUR.d4, EASE.expo, VIEWPORT.
 * Reemplaza todos los `motion.div initial/whileInView` sueltos de las secciones.
 * Reduced-motion: renderiza el hijo en su estado final SIN montar motion.
 */
export default function Reveal({
  children,
  as = "div",
  y = 24,
  blur = true,
  delay = 0,
  once = true,
  className = "",
}: RevealProps) {
  const reduced = useReducedMotionSafe();

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const M = motionFor(as);
  const initial: TargetAndTransition = { opacity: 0, y };
  const target: TargetAndTransition = { opacity: 1, y: 0 };
  if (blur) {
    initial.filter = "blur(6px)";
    target.filter = "blur(0px)";
  }

  // createElement (no JSX): M viene de una cache estable, no se crea en cada render.
  return createElement(
    M,
    {
      className,
      initial,
      whileInView: target,
      viewport: { ...VIEWPORT, once },
      transition: { duration: DUR.d4, ease: EASE.expo, delay },
    },
    children
  );
}
