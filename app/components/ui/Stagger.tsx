"use client";

import { Children, cloneElement, isValidElement, type ElementType, type ReactElement, type ReactNode } from "react";
import Reveal from "./Reveal";
import { STAGGER } from "./motion";

export type StaggerProps = {
  children: ReactNode;
  /** Segundos entre hermanos (default 0.07). */
  step?: number;
  /** Delay base en segundos (default 0). */
  start?: number;
  /** Índice tope: a partir de él todos usan el mismo delay (default 5 → tope de 6 elementos). */
  max?: number;
  as?: ElementType;
  className?: string;
  /**
   * Si es true, envuelve cada hijo en <Reveal delay>. Si es false (default), clona el hijo
   * inyectándole la prop `delay` (los hijos deben ser <Reveal>, <LayerText> u otro componente
   * que acepte `delay`; NO elementos DOM crudos).
   */
  wrap?: boolean;
};

/**
 * Inyecta `delay = start + min(i, max) * step` a cada hijo. Garantiza el tope de 6.
 * Reduced-motion: delega en Reveal, que ya no anima.
 */
export default function Stagger({
  children,
  step = STAGGER.sibling,
  start = 0,
  max = STAGGER.max,
  as: Tag = "div",
  className = "",
  wrap = false,
}: StaggerProps) {
  const kids: ReactNode[] = [];
  let i = 0;
  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) {
      kids.push(child);
      continue;
    }
    const delay = start + Math.min(i, max) * step;
    i += 1;
    if (wrap) {
      kids.push(
        <Reveal key={child.key ?? i} delay={delay}>
          {child}
        </Reveal>
      );
      continue;
    }
    const el = child as ReactElement<{ delay?: number }>;
    kids.push(cloneElement(el, { delay: (el.props.delay ?? 0) + delay }));
  }
  return <Tag className={className}>{kids}</Tag>;
}
