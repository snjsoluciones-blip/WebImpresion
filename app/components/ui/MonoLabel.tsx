import type { ElementType, ReactNode } from "react";

export type MonoLabelProps = {
  children: ReactNode;
  tone?: "dim" | "bright";
  /** Hairline de 24px a la izquierda. */
  rule?: boolean;
  as?: ElementType;
  className?: string;
};

/**
 * Rótulo técnico: mono 11px, uppercase, tracking .18em.
 * Base de todos los eyebrows, índices y unidades. Server component.
 */
export default function MonoLabel({
  children,
  tone = "dim",
  rule = false,
  as: Tag = "span",
  className = "",
}: MonoLabelProps) {
  return (
    <Tag
      className={`font-mono-tech inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] leading-none ${className}`}
      style={{ color: tone === "bright" ? "var(--tx-2)" : "var(--tx-5)" }}
    >
      {rule && (
        <span
          aria-hidden="true"
          className="inline-block h-px w-6 shrink-0"
          style={{ background: "var(--line-3)" }}
        />
      )}
      {children}
    </Tag>
  );
}
