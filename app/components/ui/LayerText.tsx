"use client";

import { Fragment, type ElementType, type ReactNode } from "react";
import { motion } from "framer-motion";
import { DUR, EASE, STAGGER, VIEWPORT } from "./motion";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

export type LayerTextProps = {
  /** Una entrada por línea. Con by="word" las líneas string se parten por palabra. */
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  /** Segundos. */
  delay?: number;
  by?: "line" | "word";
};

// Las insets negativas dejan aire para ascendentes/descendentes con line-height apretado.
const CLIP_FROM = "inset(125% 0% -25% 0%)";
const CLIP_TO = "inset(-25% 0% -25% 0%)";

/**
 * La firma de la marca: cada unidad (línea o palabra) se "imprime" de abajo hacia arriba
 * con clip-path + translateY(.15em), DUR.d5, EASE.expo. Stagger 90 ms/línea o 45 ms/palabra
 * (tope de 6). El texto sigue siendo texto real. Con by="word" el contenedor lleva aria-label
 * con la frase completa y las partes van aria-hidden.
 * Reduced-motion: fade de 200 ms, sin clip ni transform.
 */
export default function LayerText({
  lines,
  as: Tag = "span",
  className = "",
  lineClassName = "",
  delay = 0,
  by = "line",
}: LayerTextProps) {
  const reduced = useReducedMotionSafe();
  const byWord = by === "word";
  const fullText = byWord
    ? lines.map((l) => (typeof l === "string" || typeof l === "number" ? String(l) : "")).join(" ").trim()
    : undefined;

  // Pre-pasada pura: unidades por línea + offset global (para el stagger por palabra).
  const rows: { units: ReactNode[]; offset: number }[] = [];
  for (let li = 0, off = 0; li < lines.length; li++) {
    const line = lines[li];
    const units: ReactNode[] =
      byWord && typeof line === "string" ? line.split(" ").filter((w) => w.length > 0) : [line];
    rows.push({ units, offset: off });
    off += units.length;
  }

  return (
    <Tag className={className} aria-label={fullText || undefined}>
      {rows.map(({ units, offset }, li) => {
        return (
          <span key={li} className={`block ${lineClassName}`} aria-hidden={byWord ? true : undefined}>
            {units.map((u, wi) => {
              const d = byWord
                ? delay + Math.min(offset + wi, STAGGER.max) * STAGGER.word
                : delay + Math.min(li, STAGGER.max) * STAGGER.line;
              return (
                <Fragment key={wi}>
                  {reduced ? (
                    <motion.span
                      className="inline-block"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={VIEWPORT}
                      transition={{ duration: 0.2 }}
                    >
                      {u}
                    </motion.span>
                  ) : (
                    <motion.span
                      className="inline-block will-change-transform"
                      initial={{ clipPath: CLIP_FROM, y: "0.15em" }}
                      whileInView={{ clipPath: CLIP_TO, y: 0 }}
                      viewport={VIEWPORT}
                      transition={{ duration: DUR.d5, ease: EASE.expo, delay: d }}
                    >
                      {u}
                    </motion.span>
                  )}
                  {wi < units.length - 1 ? " " : null}
                </Fragment>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
