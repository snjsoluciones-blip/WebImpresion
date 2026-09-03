"use client";

import type { ReactNode } from "react";
import MagneticButton from "./MagneticButton";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

export type ButtonProps = {
  variant?: "primary" | "outline" | "ghost" | "whatsapp";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  /** Seguimiento del puntero (máx. 6px), solo con puntero fino. */
  magnetic?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  full?: boolean;
  disabled?: boolean;
  /** target=_blank + rel + aviso sr-only "(abre en una pestaña nueva)". */
  external?: boolean;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  id?: string;
};

/**
 * EL único botón de la web. <a> si hay href, si no <button>.
 * primary: gradiente blanco + sheen en hover · outline: borde --line-2→--line-3 · ghost: --tx-4→#fff
 * con flecha que avanza 3px · whatsapp: --wa→--wa-hover (único uso del verde).
 * Alturas 40/48/56 (min-height 44 garantizado). Radio --r-full. Foco visible anillo blanco.
 * Reduced-motion: sin sheen ni magnetismo; se conserva el cambio de color.
 */
export default function Button({
  variant = "primary",
  size = "md",
  href,
  onClick,
  type = "button",
  magnetic = false,
  icon,
  iconPosition = "right",
  full = false,
  disabled = false,
  external = false,
  children,
  className = "",
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  id,
}: ButtonProps) {
  const reduced = useReducedMotionSafe();
  const cls = `snj-btn snj-btn--${variant} snj-btn--${size} ${full ? "snj-btn--full" : ""} ${className}`;
  const withSheen = !reduced && (variant === "primary" || variant === "whatsapp");

  const iconEl = icon ? (
    <span aria-hidden="true" className={`snj-btn__icon snj-btn__icon--${iconPosition}`}>
      {icon}
    </span>
  ) : null;

  const inner = (
    <>
      {withSheen && <span aria-hidden="true" className="snj-btn__sheen" />}
      {iconPosition === "left" && iconEl}
      <span className="relative">{children}</span>
      {external && <span className="sr-only"> (abre en una pestaña nueva)</span>}
      {iconPosition === "right" && iconEl}
    </>
  );

  const el = href ? (
    <a
      id={id}
      href={disabled ? undefined : href}
      onClick={disabled ? undefined : onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled ? "true" : undefined}
      className={cls}
    >
      {inner}
    </a>
  ) : (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={cls}
    >
      {inner}
    </button>
  );

  if (!magnetic || disabled) return el;
  // radius 40 × strength .15 = 6px máximo
  return (
    <MagneticButton strength={0.15} radius={40} className={full ? "flex w-full" : "inline-flex"}>
      {el}
    </MagneticButton>
  );
}
