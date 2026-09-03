"use client";

import { useCallback, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { usePointerFine } from "./usePointerFine";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

export type TiltCardProps = {
  children: ReactNode;
  /** Grados máximos (default 5; a 8 el texto se desenfoca). */
  max?: number;
  /** Capa radial blanca al 6% que sigue al cursor. */
  glare?: boolean;
  className?: string;
};

/**
 * perspective 1000px + rotateX/rotateY hasta ±max con useSpring({stiffness:180,damping:22}).
 * Uso restringido a los marcos de media de la galería.
 * Reduced-motion / touch: no monta listeners; renderiza el hijo tal cual.
 */
export default function TiltCard({ children, max = 5, glare = false, className = "" }: TiltCardProps) {
  const fine = usePointerFine();
  const reduced = useReducedMotionSafe();
  const active = fine && !reduced;

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 180, damping: 22 });
  const sry = useSpring(ry, { stiffness: 180, damping: 22 });
  const glareBg = useMotionTemplate`radial-gradient(60% 50% at ${gx}% ${gy}%, rgba(255,255,255,0.06), transparent 70%)`;
  const ref = useRef<HTMLDivElement | null>(null);
  const raf = useRef(0);

  const onMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = 0;
        ry.set((px - 0.5) * 2 * max);
        rx.set(-(py - 0.5) * 2 * max);
        gx.set(px * 100);
        gy.set(py * 100);
      });
    },
    [max, rx, ry, gx, gy]
  );

  const onLeave = useCallback(() => {
    if (raf.current) {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    }
    rx.set(0);
    ry.set(0);
  }, [rx, ry]);

  if (!active) return <div className={className}>{children}</div>;

  return (
    <div className={className} style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d", willChange: "transform" }}
        className="relative h-full w-full"
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: glareBg }}
          />
        )}
      </motion.div>
    </div>
  );
}
