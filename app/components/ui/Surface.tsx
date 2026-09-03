"use client";

import { useCallback, useEffect, useRef, type ElementType, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { usePointerFine } from "./usePointerFine";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

export type SurfaceProps = {
  children: ReactNode;
  as?: ElementType;
  /** Si se pasa, la superficie es un <a>. */
  href?: string;
  /** Spotlight radial que sigue al cursor (default true; solo con puntero fino). */
  spotlight?: boolean;
  /** Marcas de esquina estilo plano técnico. */
  corners?: boolean;
  padding?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
};

const PAD: Record<NonNullable<SurfaceProps["padding"]>, string> = {
  sm: "p-5",
  md: "p-6 md:p-7",
  lg: "p-6 md:p-9",
};

const CORNER = "pointer-events-none absolute h-[10px] w-[10px] border-white/15";

/**
 * Tarjeta-material: gradiente #141414→#0e0e0e, borde --line-1 con canto superior --line-2,
 * radio --r-md. Hover (puntero fino + motion normal): se hunde/levanta 2px, borde --line-3,
 * spotlight de 340px via --mx/--my (throttle rAF). Press: scale(.985).
 * Reduced-motion / touch: solo cambia el color del borde.
 */
export default function Surface({
  children,
  as,
  href,
  spotlight = true,
  corners = false,
  padding = "md",
  className = "",
  onClick,
}: SurfaceProps) {
  const fine = usePointerFine();
  const reduced = useReducedMotionSafe();
  const interactive = fine && !reduced;
  const ref = useRef<HTMLElement | null>(null);
  const raf = useRef<number>(0);
  const last = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!interactive || !spotlight) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      last.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = 0;
        el.style.setProperty("--mx", `${last.current.x}px`);
        el.style.setProperty("--my", `${last.current.y}px`);
      });
    },
    [interactive, spotlight]
  );

  useEffect(() => {
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const Tag: ElementType = href ? "a" : (as ?? "div");

  return (
    <Tag
      ref={ref}
      href={href}
      onClick={onClick}
      onPointerMove={interactive && spotlight ? onPointerMove : undefined}
      data-interactive={interactive ? "true" : "static"}
      className={`snj-surface ${PAD[padding]} ${className}`}
    >
      {spotlight && interactive && <span aria-hidden="true" className="snj-surface__spot" />}
      {corners && (
        <>
          <span aria-hidden="true" className={`${CORNER} left-2 top-2 border-l border-t`} />
          <span aria-hidden="true" className={`${CORNER} right-2 top-2 border-r border-t`} />
          <span aria-hidden="true" className={`${CORNER} bottom-2 left-2 border-b border-l`} />
          <span aria-hidden="true" className={`${CORNER} bottom-2 right-2 border-b border-r`} />
        </>
      )}
      <div className="relative flex h-full flex-col">{children}</div>
    </Tag>
  );
}
