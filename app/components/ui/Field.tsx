"use client";

import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import MonoLabel from "./MonoLabel";

export type FieldProps = {
  id: string;
  label: string;
  /** "01" → label "01 NOMBRE" */
  index?: string;
  required?: boolean;
  hint?: string;
  error?: string | null;
  counter?: { current: number; max: number };
  /** El input/textarea/select. Se le inyectan id, aria-invalid y aria-describedby. */
  children: ReactNode;
  className?: string;
};

type InjectedProps = {
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

/**
 * Envoltura de campo: label MonoLabel con índice, obligatorio como punto de 4px + sr-only
 * "(obligatorio)" (nunca asterisco rojo), hint 12px --tx-5, error 12px rgba(255,255,255,.75)
 * con ícono de aviso, aria-invalid + aria-describedby cableados, contador current/max.
 */
export default function Field({ id, label, index, required, hint, error, counter, children, className = "" }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  const child = isValidElement(children)
    ? cloneElement(children as ReactElement<InjectedProps>, {
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })
    : children;

  const hot = counter ? counter.current / counter.max >= 0.85 : false;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="inline-flex items-center gap-2">
          <MonoLabel tone="dim">
            {index ? `${index} ` : ""}
            {label}
          </MonoLabel>
          {required && (
            <>
              <span
                aria-hidden="true"
                className="inline-block h-1 w-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.4)" }}
              />
              <span className="sr-only">(obligatorio)</span>
            </>
          )}
        </label>
        {counter && (
          <span
            className="font-mono-tech text-[11px] tabular-nums transition-colors duration-[160ms]"
            style={{ color: hot ? "var(--tx-2)" : "var(--tx-5)" }}
            aria-live="polite"
          >
            {counter.current}/{counter.max}
          </span>
        )}
      </div>

      {child}

      {error ? (
        <p id={errorId} role="alert" className="m-0 flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.25} aria-hidden="true">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 4.5v4M8 11v.5" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="m-0 text-xs" style={{ color: "var(--tx-5)" }}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
