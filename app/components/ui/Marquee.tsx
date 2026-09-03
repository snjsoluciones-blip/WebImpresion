"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

export type MarqueeProps = {
  items: string[];
  /** Segundos por vuelta (default 40). */
  speed?: number;
  direction?: "left" | "right";
  separator?: ReactNode;
  pauseOnHover?: boolean;
  className?: string;
  /** Clase de cada ítem (p. ej. color/hover). */
  itemClassName?: string;
};

/**
 * Cinta CSS pura: track duplicado 2× con `snj-marquee` sobre translate3d (cero JS por frame).
 * Máscara lateral, copia aria-hidden, pausa en hover y fuera de viewport (IntersectionObserver).
 * Reduced-motion: estático, mostrando la primera mitad.
 */
export default function Marquee({
  items,
  speed = 40,
  direction = "left",
  separator,
  pauseOnHover = true,
  className = "",
  itemClassName = "",
}: MarqueeProps) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setPaused(!e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const sep = separator ?? (
    <span aria-hidden="true" className="mx-6 inline-block h-[3px] w-[3px] rounded-full bg-white/30" />
  );

  const renderHalf = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden ? true : undefined}>
      {items.map((item, i) => (
        <Fragment key={`${item}-${i}`}>
          <span className={`inline-flex items-center whitespace-nowrap ${itemClassName}`}>{item}</span>
          {sep}
        </Fragment>
      ))}
    </div>
  );

  const style = { "--speed": `${speed}s` } as CSSProperties;

  return (
    <div
      ref={ref}
      className={`snj-marquee ${className}`}
      data-direction={direction}
      data-pause-hover={pauseOnHover ? "true" : "false"}
      data-paused={paused ? "true" : "false"}
      data-static={reduced ? "true" : "false"}
      style={style}
    >
      <div className="snj-marquee__track">
        {renderHalf(false)}
        {!reduced && renderHalf(true)}
      </div>
    </div>
  );
}
