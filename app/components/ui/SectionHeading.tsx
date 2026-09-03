"use client";

import type { ReactNode } from "react";
import MonoLabel from "./MonoLabel";
import Hairline from "./Hairline";
import LayerText from "./LayerText";
import Reveal from "./Reveal";

export type SectionHeadingProps = {
  /** "01" */
  index?: string;
  /** "Servicios" */
  eyebrow: string;
  /** string → LayerText por palabra; ReactNode → tal cual */
  title: ReactNode;
  lead?: string;
  /** id del h2, para el aria-labelledby de la sección */
  titleId?: string;
  align?: "left" | "center";
  /** slot derecho en md+ (p. ej. un Button ghost) */
  action?: ReactNode;
  className?: string;
};

/**
 * Cabecera unificada de sección: fila mono `01 / SERVICIOS` + Hairline animada,
 * h2.t-h2 con LayerText, lead con Reveal (.15s) y slot de acción a la derecha en md+.
 */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  titleId,
  align = "left",
  action,
  className = "",
}: SectionHeadingProps) {
  const center = align === "center";
  return (
    <div
      className={`${center ? "text-center" : ""} ${className}`}
      style={{ marginBottom: "clamp(3rem, 2rem + 3vw, 5.5rem)" }}
    >
      <div className={`mb-6 flex items-center gap-4 ${center ? "justify-center" : ""}`}>
        <MonoLabel>
          {index ? `${index} / ` : ""}
          {eyebrow}
        </MonoLabel>
        <Hairline animate className={center ? "max-w-24" : "flex-1"} />
      </div>

      <div className={`md:flex md:items-end md:justify-between md:gap-8 ${center ? "md:flex-col md:items-center" : ""}`}>
        <div className={center ? "flex flex-col items-center" : ""}>
          <h2 id={titleId} className="t-h2 text-white">
            {typeof title === "string" ? <LayerText lines={[title]} by="word" /> : title}
          </h2>
          {lead && (
            <Reveal delay={0.15}>
              <p className={`t-lead mt-5 ${center ? "mx-auto" : ""}`}>{lead}</p>
            </Reveal>
          )}
        </div>
        {action && <div className="mt-6 shrink-0 md:mt-0">{action}</div>}
      </div>
    </div>
  );
}
