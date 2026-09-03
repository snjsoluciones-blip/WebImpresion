"use client";

import { useCallback, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "./motion";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

export type AccordionItem = { q: string; a: ReactNode };
export type AccordionProps = {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: number | null;
  className?: string;
};

/**
 * <button aria-expanded aria-controls> + panel role="region" aria-labelledby.
 * Altura animada (height:auto) en 320 ms EASE.quart, contenido con fade de 180 ms desfasado;
 * el panel lleva `contain: layout paint` (ÚNICA animación de height permitida en la web).
 * Ícono: cruz de dos líneas de 1px que rota 45°. Teclado: Enter/Espacio, ↑/↓, Home/End.
 * Reduced-motion: mostrar/ocultar sin animación.
 */
export default function Accordion({ items, allowMultiple = false, defaultOpen = null, className = "" }: AccordionProps) {
  const reduced = useReducedMotionSafe();
  const uid = useId();
  const [open, setOpen] = useState<Set<number>>(() => new Set(defaultOpen === null ? [] : [defaultOpen]));
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const toggle = useCallback(
    (i: number) => {
      setOpen((prev) => {
        const next = new Set(allowMultiple ? prev : []);
        if (prev.has(i)) next.delete(i);
        else next.add(i);
        return next;
      });
    },
    [allowMultiple]
  );

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = items.length;
    let target: number | null = null;
    if (e.key === "ArrowDown") target = (i + 1) % n;
    else if (e.key === "ArrowUp") target = (i - 1 + n) % n;
    else if (e.key === "Home") target = 0;
    else if (e.key === "End") target = n - 1;
    if (target !== null) {
      e.preventDefault();
      buttons.current[target]?.focus();
    }
  };

  return (
    <div className={className}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const btnId = `${uid}-btn-${i}`;
        const panelId = `${uid}-panel-${i}`;
        const content = (
          <div className="max-w-[60ch] pb-6 text-[15px] leading-relaxed" style={{ color: "var(--tx-3)" }}>
            {item.a}
          </div>
        );
        return (
          <div key={i} className="hairline-b" style={{ borderBottom: "1px solid var(--line-1)" }}>
            <h3 className="m-0">
              <button
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="t-h3 flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left transition-colors duration-[160ms]"
                style={{ color: isOpen ? "#fff" : "var(--tx-2)", fontSize: "1.125rem" }}
              >
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  className="relative h-4 w-4 shrink-0 transition-transform duration-[260ms]"
                  style={{
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transitionTimingFunction: "var(--ease-in-out-quart)",
                  }}
                >
                  <span className="absolute left-0 top-1/2 h-px w-full bg-white/60" />
                  <span className="absolute left-1/2 top-0 h-full w-px bg-white/60" />
                </span>
              </button>
            </h3>

            {reduced ? (
              <div id={panelId} role="region" aria-labelledby={btnId} hidden={!isOpen}>
                {content}
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="panel"
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.32, ease: EASE.quart }}
                    style={{ overflow: "hidden", contain: "layout paint" }}
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18, delay: 0.1 }}
                    >
                      {content}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </div>
  );
}
