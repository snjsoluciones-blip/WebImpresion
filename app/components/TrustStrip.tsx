import { Fragment } from "react";
import { Counter, Hairline } from "./ui";

// Franja de datos reales bajo el hero (spec §42-43).
// Server component: la única isla cliente es <Counter>, que interpola el número al entrar 40 % en
// viewport (1200 ms, EASE.expo) y con reduced-motion muestra el valor final sin animar.
// El valor final SIEMPRE viaja en el HTML server-rendered (SEO / sin JS): Counter lo imprime tal cual
// y el JS solo lo reemplaza para animarlo.

type Fact = {
  value: number;
  label: string;
  note: string;
};

// Solo hechos ya publicados en la web. Ninguna cifra inventada.
const FACTS: readonly Fact[] = [
  { value: 500, label: "Llaveros en una tanda", note: "MC Racing · menos de una semana" },
  { value: 4, label: "Materiales técnicos", note: "PLA · PETG · ABS · TPU" },
  { value: 4, label: "Pasos del proceso", note: "De la idea a la pieza" },
  { value: 3, label: "Socios", note: "Modelado e impresión propios" },
];

// Números: Space Grotesk 700 (font-display de Counter + font-bold), tabular-nums, cromo estático.
const NUMBER_SIZE = "clamp(2rem, 1.4rem + 2vw, 3rem)";

// Padding de celda. Mobile: 20px (spec §43). En md+ el padding horizontal es el "canal" entre
// divisores; la primera y la última celda lo pierden hacia afuera para alinear con el .shell.
// Ojo: pl-0/pr-0 se repiten por breakpoint porque `lg:px-8` se emite después de `md:pl-0`
// y lo pisaría a partir de 1024px.
const CELL_PAD = "p-5 md:px-6 md:py-2 lg:px-8";
const CELL_FIRST = "md:pl-0 lg:pl-0";
const CELL_LAST = "md:pr-0 lg:pr-0";

export default function TrustStrip() {
  return (
    <section aria-label="Datos del taller" className="relative" style={{ background: "var(--srf-2)" }}>
      {/* A sangre: las hairlines van fuera del .shell y cruzan todo el viewport (con fade en los bordes). */}
      <Hairline />

      <div className="shell py-10 md:py-14">
        {/* role="list" explícito: Safari descarta la semántica de lista con list-style:none. */}
        <ul role="list" className="m-0 grid list-none grid-cols-2 p-0 md:grid-cols-4">
          {FACTS.map((fact, i) => {
            const isFirst = i === 0;
            const isLast = i === FACTS.length - 1;
            // En mobile (2×2) solo las celdas de la 2.ª columna llevan divisor vertical;
            // en md+ lo llevan todas menos la primera.
            const dividerClass = i % 2 === 0 ? "hidden md:block" : "";

            return (
              <Fragment key={fact.label}>
                {/* Divisor horizontal único entre las dos filas del 2×2 en mobile (desaparece en md+).
                    Es una sola línea continua, independiente de la altura que tome cada fila. */}
                {i === 2 && (
                  <li aria-hidden="true" className="col-span-2 md:hidden">
                    <Hairline />
                  </li>
                )}

                <li
                  className={`relative min-w-0 ${CELL_PAD} ${isFirst ? CELL_FIRST : ""} ${isLast ? CELL_LAST : ""}`}
                >
                  {/* Divisores verticales (aria-hidden dentro de Hairline). Ocupan toda la altura de la
                      celda: como la grilla estira las filas, todos los divisores miden lo mismo. */}
                  {!isFirst && (
                    <Hairline orientation="v" className={`absolute inset-y-0 left-0 ${dividerClass}`} />
                  )}

                  <div className="leading-none tracking-[-0.03em]" style={{ fontSize: NUMBER_SIZE }}>
                    {/* inline-block: el gradiente cromo se mapea al ancho del número, no al de la celda. */}
                    <Counter value={fact.value} className="chrome inline-block font-bold" />
                  </div>

                  {/* Rótulo esencial (dos celdas muestran "4": el label es lo que las distingue),
                      por eso va en --tx-3 (piso de contraste 4.5:1) y no en --tx-5 decorativo. */}
                  <p
                    className="font-mono-tech mt-3 text-[11px] uppercase leading-snug tracking-[0.18em] text-balance"
                    style={{ color: "var(--tx-3)" }}
                  >
                    {fact.label}
                  </p>

                  {/* Nota secundaria: 12px, --tx-4 (texto informativo secundario). */}
                  <p className="mt-1.5 text-[12px] leading-snug text-pretty" style={{ color: "var(--tx-4)" }}>
                    {fact.note}
                  </p>
                </li>
              </Fragment>
            );
          })}
        </ul>
      </div>

      <Hairline />
    </section>
  );
}
