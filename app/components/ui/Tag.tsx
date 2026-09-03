"use client";

import type { ReactNode } from "react";

export type TagProps = {
  children: ReactNode;
  tone?: "line" | "solid";
  as?: "span" | "button";
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  /** Sólo para as="button" dentro de un role="radiogroup" (el implementador maneja las flechas). */
  role?: "radio" | "button";
  tabIndex?: number;
  "aria-label"?: string;
};

/**
 * Píldora mono 11px uppercase. Como `button` alterna a fondo 10% + borde --line-3 + texto
 * blanco cuando `selected`, con aria-pressed (o aria-checked si role="radio").
 */
export default function Tag({
  children,
  tone = "line",
  as = "span",
  selected = false,
  onClick,
  className = "",
  role,
  tabIndex,
  "aria-label": ariaLabel,
}: TagProps) {
  const base =
    "font-mono-tech inline-flex items-center gap-1.5 whitespace-nowrap rounded-[var(--r-full)] px-[10px] py-1 text-[11px] uppercase leading-none tracking-[0.16em]";
  const style: React.CSSProperties = selected
    ? { background: "rgba(255,255,255,0.10)", border: "1px solid var(--line-3)", color: "#fff" }
    : tone === "solid"
      ? { background: "rgba(255,255,255,0.06)", border: "1px solid transparent", color: "var(--tx-2)" }
      : { background: "transparent", border: "1px solid var(--line-2)", color: "var(--tx-4)" };

  if (as === "button") {
    const isRadio = role === "radio";
    return (
      <button
        type="button"
        onClick={onClick}
        role={isRadio ? "radio" : undefined}
        aria-pressed={isRadio ? undefined : selected}
        aria-checked={isRadio ? selected : undefined}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
        className={`${base} min-h-[36px] cursor-pointer transition-[background-color,border-color,color,transform] duration-[260ms] hover:text-white active:scale-[0.97] ${className}`}
        style={{ ...style, transitionTimingFunction: "var(--ease-soft-spring)" }}
      >
        {children}
      </button>
    );
  }
  return (
    <span className={`${base} ${className}`} style={style} aria-label={ariaLabel}>
      {children}
    </span>
  );
}
