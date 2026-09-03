"use client";

import { motion } from "framer-motion";
import { EASE } from "./motion";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

export type StepperProps = {
  steps: string[];
  /** 0-based */
  current: number;
  /** Solo se invoca para pasos completados (i < current). */
  onStepClick?: (i: number) => void;
  className?: string;
};

/**
 * Track de 2px --line-1 con relleno blanco al 70% animado a ((current+1)/steps.length)*100%
 * en 420 ms EASE.quart, más "Paso N de M · <nombre>" en mono. Pasos completados clickeables.
 * role="progressbar" con aria-valuenow/min/max. Reduced-motion: el relleno salta sin transición.
 */
export default function Stepper({ steps, current, onStepClick, className = "" }: StepperProps) {
  const reduced = useReducedMotionSafe();
  const total = steps.length;
  const progress = total > 0 ? (current + 1) / total : 0;

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="font-mono-tech text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--tx-4)" }}>
          Paso {current + 1} de {total}
          <span aria-hidden="true"> · </span>
          <span style={{ color: "var(--tx-2)" }}>{steps[current]}</span>
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Paso ${current + 1} de ${total}: ${steps[current] ?? ""}`}
        className="relative h-[2px] w-full overflow-hidden rounded-full"
        style={{ background: "var(--line-1)" }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 w-full rounded-full"
          style={{ background: "rgba(255,255,255,0.7)", transformOrigin: "0% 50%" }}
          initial={false}
          animate={{ scaleX: progress }}
          transition={reduced ? { duration: 0 } : { duration: 0.42, ease: EASE.quart }}
        />
      </div>

      <ol className="mt-3 flex justify-between gap-2 p-0" style={{ listStyle: "none" }}>
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          const color = active ? "#fff" : done ? "var(--tx-2)" : "var(--tx-5)";
          const label = `${String(i + 1).padStart(2, "0")} ${s}`;
          return (
            <li key={s} className="font-mono-tech min-w-0 text-[11px] uppercase tracking-[0.14em]">
              {done && onStepClick ? (
                <button
                  type="button"
                  onClick={() => onStepClick(i)}
                  className="cursor-pointer truncate transition-colors duration-[160ms] hover:text-white"
                  style={{ color }}
                >
                  {label}
                </button>
              ) : (
                <span className="block truncate" style={{ color }} aria-current={active ? "step" : undefined}>
                  {label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
