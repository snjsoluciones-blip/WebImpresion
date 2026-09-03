import type { CSSProperties } from "react";

export type LayerLinesProps = {
  /** Separación entre capas en px (default 7). */
  spacing?: number;
  /** Opacidad de cada línea (default .05, tope sugerido .06). */
  opacity?: number;
  /** Máscara vertical que desvanece arriba y abajo (default true). */
  fade?: boolean;
  className?: string;
};

/**
 * Fondo decorativo de capas FDM. Absoluto, inset-0, aria-hidden, pointer-events:none.
 * El padre debe ser `position: relative`. Server component.
 */
export default function LayerLines({ spacing = 7, opacity = 0.05, fade = true, className = "" }: LayerLinesProps) {
  const style = {
    "--layer-sp": `${spacing}px`,
    "--layer-o": String(opacity),
  } as CSSProperties;
  return (
    <div
      aria-hidden="true"
      className={`layer-lines pointer-events-none absolute inset-0 ${fade ? "" : "layer-lines--nofade"} ${className}`}
      style={style}
    />
  );
}
