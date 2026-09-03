"use client";

import { useCallback, useRef, type PointerEvent as ReactPointerEvent, type ReactElement } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePointerFine } from "./usePointerFine";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

export type MagneticButtonProps = {
  children: ReactElement;
  /** Proporción del desplazamiento del cursor que sigue el hijo (default .25). */
  strength?: number;
  /** Radio en px dentro del cual actúa; el desplazamiento máximo es radius * strength (default 90). */
  radius?: number;
  disabled?: boolean;
  /** Clase del wrapper (p. ej. "flex w-full" para hijos a ancho completo). */
  className?: string;
};

/**
 * Desplaza a CUALQUIER hijo hacia el cursor con useSpring({stiffness:220,damping:22}); vuelve a 0 al salir.
 * Solo en los dos CTA del hero, el botón flotante de WhatsApp y el logo del header (y Button magnetic).
 * Reduced-motion / (pointer:coarse): devuelve el hijo sin envolver.
 */
export default function MagneticButton({
  children,
  strength = 0.25,
  radius = 90,
  disabled = false,
  className = "",
}: MagneticButtonProps) {
  const fine = usePointerFine();
  const reduced = useReducedMotionSafe();
  const active = fine && !reduced && !disabled;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 22 });
  const sy = useSpring(y, { stiffness: 220, damping: 22 });
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const cx = Math.max(-radius, Math.min(radius, dx));
      const cy = Math.max(-radius, Math.min(radius, dy));
      x.set(cx * strength);
      y.set(cy * strength);
    },
    [radius, strength, x, y]
  );

  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  if (!active) return children;

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={className || "inline-flex"}
    >
      {children}
    </motion.div>
  );
}
