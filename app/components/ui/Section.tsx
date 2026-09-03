import type { CSSProperties, ReactNode } from "react";

export type SectionProps = {
  id?: string;
  children: ReactNode;
  tone?: "base" | "raised" | "deep";
  labelledBy?: string;
  /** Sin contenedor .shell: el contenido va a sangre (el implementador arma su propio .shell adentro). */
  bleed?: boolean;
  className?: string;
  style?: CSSProperties;
};

const TONE: Record<NonNullable<SectionProps["tone"]>, string> = {
  base: "var(--srf-1)",
  raised: "var(--srf-3)",
  deep: "var(--srf-2)",
};

/** Server component. <section> con id preservado, padding-block var(--pad-y) y contenedor .shell. */
export default function Section({
  id,
  children,
  tone = "base",
  labelledBy,
  bleed = false,
  className = "",
  style,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative ${className}`}
      style={{ paddingBlock: "var(--pad-y)", background: TONE[tone], ...style }}
    >
      {bleed ? children : <div className="shell">{children}</div>}
    </section>
  );
}
