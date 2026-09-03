// Cinta de capacidades (spec §44): franja de 56px entre TrustStrip y Services, con Hairline abajo.
// Solo tipos de pieza que ya fabricamos: ningún nombre de cliente, ninguna cifra inventada.
// Server component: <Marquee> (cliente) hace el trabajo; acá no hay hooks ni eventos.
import { Hairline, Marquee } from "./ui";

/** Ocho tipos de pieza reales, en el orden de la spec. */
const CAPABILITIES: readonly string[] = [
  "Trofeos",
  "Soportes de telemetría",
  "Llaveros personalizados",
  "Prototipos",
  "Repuestos",
  "Piezas técnicas",
  "Series cortas",
  "Modelado 3D",
];

/**
 * Tipografía del ítem: mono 12px (--fs-mono-lg), uppercase, tracking .2em, --tx-5.
 * Bajo el cursor pasa a --tx-2 en 160ms (--dur-1) con --ease-mech. En Tailwind 4 `hover:` ya viene
 * gateado por `@media (hover: hover)`, así que en (pointer: coarse) el efecto directamente no existe.
 */
const ITEM_TEXT =
  "font-mono-tech text-[length:var(--fs-mono-lg)] uppercase leading-none tracking-[0.2em] text-[color:var(--tx-5)] transition-colors duration-[160ms] ease-[var(--ease-mech)] hover:text-[color:var(--tx-2)]";

/**
 * Cinta CSS pura (cero JS por frame): 44s por vuelta, máscara lateral, copia duplicada aria-hidden,
 * pausa en hover y fuera del viewport. Es la única pieza con movimiento perpetuo además del cromo
 * del hero y la barra de progreso.
 *
 * Reduced-motion: <Marquee> queda estático mostrando la primera mitad, pero en mobile eso recorta
 * la lista (8 ítems no entran en 375px). Para no perder ni un dato se oculta la cinta
 * (motion-reduce:hidden) y en su lugar se muestra una lista estática que envuelve
 * (hidden → motion-reduce:flex). Es CSS puro: no depende de hidratación ni genera mismatch.
 */
export default function CapabilitiesMarquee() {
  return (
    <div className="relative" style={{ background: "var(--srf-1)" }}>
      {/* Contexto para lectores de pantalla: la cinta es texto real, no decoración. */}
      <p className="sr-only">Piezas que fabricamos:</p>

      {/* Cinta en movimiento. h-14 (56px) en cada ítem: define la altura de la franja y hace que
          el área de hover cubra la altura completa, no solo la caja del texto. */}
      <Marquee
        items={[...CAPABILITIES]}
        speed={44}
        pauseOnHover
        className="motion-reduce:hidden"
        itemClassName={`h-14 ${ITEM_TEXT}`}
      />

      {/* Fallback estático para prefers-reduced-motion: los 8 ítems, envolviendo, sin animación.
          role="list" explícito: Safari descarta la semántica de lista con list-style:none. */}
      <ul
        role="list"
        className="shell m-0 hidden min-h-14 list-none flex-wrap items-center justify-center gap-x-6 gap-y-3 py-5 motion-reduce:flex"
      >
        {CAPABILITIES.map((item, i) => (
          <li key={item} className="flex items-center whitespace-nowrap">
            <span className={ITEM_TEXT}>{item}</span>
            {/* Separador: punto de 3px, igual al de la cinta. Decorativo. */}
            {i < CAPABILITIES.length - 1 && (
              <span
                aria-hidden="true"
                className="ml-6 inline-block h-[3px] w-[3px] rounded-full"
                style={{ background: "var(--tx-5)" }}
              />
            )}
          </li>
        ))}
      </ul>

      {/* Hairline inferior a sangre (aria-hidden dentro de Hairline). La superior la aporta TrustStrip. */}
      <Hairline className="absolute bottom-0 left-0" />
    </div>
  );
}
