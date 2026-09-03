import type { ReactNode } from "react";

export type SpecRow = { k: string; v: ReactNode };
export type SpecTableProps = { rows: SpecRow[]; dense?: boolean; className?: string };

/**
 * <dl> de dos columnas con puntos guía: clave mono --tx-5, línea punteada que rellena
 * el medio, valor Inter --tx-2 a la derecha. En mobile (<sm) se apila en dos líneas.
 * Es el componente que hace que la web se lea como una hoja de datos. Server component.
 */
export default function SpecTable({ rows, dense = false, className = "" }: SpecTableProps) {
  return (
    <dl className={`m-0 ${className}`}>
      {rows.map((row, i) => (
        <div
          key={`${row.k}-${i}`}
          className={`flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3 ${dense ? "py-2" : "py-3"}`}
        >
          <dt
            className="font-mono-tech shrink-0 text-[11px] uppercase tracking-[0.16em] leading-none sm:leading-normal"
            style={{ color: "var(--tx-5)" }}
          >
            {row.k}
          </dt>
          <span
            aria-hidden="true"
            className="hidden flex-1 self-end sm:block"
            style={{ borderBottom: "1px dotted var(--line-2)", marginBottom: "0.35em" }}
          />
          <dd className="m-0 text-sm sm:text-right" style={{ color: "var(--tx-2)" }}>
            {row.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}
