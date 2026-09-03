import { Hairline, Reveal, STAGGER, Section, SectionHeading } from "./ui";

/* =========================================================================
   Contenido real: los 3 socios de SNJ Soluciones.
   Sin fotos, sin cargos ni años inventados, sin bios: nombre + una línea
   neutra y verdadera. La inicial alimenta el monograma SVG.
   ========================================================================= */

const partners = [
  { name: "Titi", initial: "T" },
  { name: "Nico", initial: "N" },
  { name: "Juan", initial: "J" },
] as const;

const NOTE =
  "Somos un taller chico: no hay call center ni tickets. Escribís por WhatsApp y te contesta uno de nosotros.";

/**
 * Stagger de 90 ms por celda (escalera "líneas") con el tope de 6 de la spec.
 * Cálculo local: `staggerDelay` del barrel tipa `step` como el literal 0.07 (default `as const`),
 * así que no acepta `STAGGER.line` en TS estricto.
 */
const cellDelay = (i: number): number => Math.min(i, STAGGER.max) * STAGGER.line;

/* =========================================================================
   Monograma SVG generado (64×64): disco de metal oscuro con capas FDM,
   anillo de calibración de 12 marcas (las 4 cardinales más largas) y la
   inicial en Space Grotesk 700 a 24px. Todo 1px real: el SVG se dibuja a
   64px, así que las unidades del viewBox son píxeles.
   ========================================================================= */

const CENTER = 32;
const RING_R = 31.5;
const TICK_OUTER = 29;

/** Marcas de calibración: cálculo puro a nivel de módulo (misma salida en SSR y cliente). */
const TICKS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * Math.PI) / 6;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const cardinal = i % 3 === 0;
  const inner = cardinal ? 26 : 27.5;
  return {
    cardinal,
    x1: (CENTER + inner * cos).toFixed(2),
    y1: (CENTER + inner * sin).toFixed(2),
    x2: (CENTER + TICK_OUTER * cos).toFixed(2),
    y2: (CENTER + TICK_OUTER * sin).toFixed(2),
  };
});

function Monogram({ initial }: { initial: string }) {
  // Ids únicos por socio (las iniciales no se repiten): los ids de SVG son globales al documento.
  const key = initial.toLowerCase();
  const discId = `snj-mono-${key}-disc`;
  const layersId = `snj-mono-${key}-layers`;

  return (
    <svg
      viewBox="0 0 64 64"
      width={64}
      height={64}
      className="h-16 w-16 shrink-0"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Mismo gradiente que las superficies: luz cenital sobre canto mecanizado */}
        <linearGradient id={discId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141414" />
          <stop offset="1" stopColor="#0e0e0e" />
        </linearGradient>
        {/* Capas FDM: 1px cada 4px al 5% */}
        <pattern id={layersId} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="1" fill="#ffffff" fillOpacity="0.05" />
        </pattern>
      </defs>

      <circle cx={CENTER} cy={CENTER} r={RING_R} fill={`url(#${discId})`} />
      <circle cx={CENTER} cy={CENTER} r={RING_R} fill={`url(#${layersId})`} />

      <g strokeWidth="1" strokeLinecap="butt">
        {TICKS.map((t) => (
          <line
            key={`${t.x1}-${t.y1}`}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.cardinal ? "var(--line-3)" : "var(--line-2)"}
          />
        ))}
      </g>

      {/* Anillo: borde --line-2 que sube a --line-3 con el hover de la card */}
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RING_R}
        fill="none"
        strokeWidth="1"
        className="stroke-(--line-2) transition-[stroke] duration-(--dur-2) ease-(--ease-mech) group-hover:stroke-(--line-3)"
      />

      {/* Inicial: --tx-2 → --tx-1 en hover. Hereda --font-display del <html> (next/font). */}
      <text
        x={CENTER}
        y={CENTER}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="24"
        fontWeight="700"
        letterSpacing="-0.02em"
        className="font-display fill-(--tx-2) transition-[fill] duration-(--dur-2) ease-(--ease-mech) group-hover:fill-(--tx-1)"
      >
        {initial}
      </text>
    </svg>
  );
}

/* =========================================================================
   Sección #equipo (06). Tres celdas separadas por hairlines (vertical desde
   sm, horizontal apiladas en mobile), stagger de 90 ms. El hover (solo con
   puntero fino, vía @media (hover:hover) de Tailwind) levanta la inicial a
   --tx-1 y desplaza el nombre 6px; el desplazamiento respeta reduced-motion
   (motion-safe) y el color cae en la red de seguridad CSS.
   Server component: no hay hooks ni eventos propios.
   ========================================================================= */

export default function Team() {
  return (
    <Section id="equipo" tone="base" labelledBy="equipo-title">
      <SectionHeading
        index="06"
        eyebrow="Equipo"
        titleId="equipo-title"
        title="Detrás de cada pieza hay tres personas"
        lead="SNJ Soluciones es un taller de tres socios en General Pacheco. Hablás siempre con quien imprime tu pieza."
      />

      {/* role="list" explícito: Safari quita la semántica de lista con list-style:none */}
      <ul role="list" className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-3">
        {partners.map((partner, i) => (
          <Reveal
            key={partner.name}
            as="li"
            delay={cellDelay(i)}
            className="group relative"
          >
            {/* Separadores en el medio del gap (16px → 8px): horizontal en mobile, vertical desde sm */}
            {i > 0 && (
              <>
                <Hairline className="absolute inset-x-0 -top-2 sm:hidden" />
                <Hairline orientation="v" className="absolute inset-y-0 -left-2 hidden sm:block" />
              </>
            )}

            <div
              className={`flex h-full items-center gap-5 py-4 sm:flex-col sm:items-start sm:gap-6 sm:py-2 sm:pr-6 ${
                i > 0 ? "sm:pl-6" : ""
              }`}
            >
              <Monogram initial={partner.initial} />

              <div className="min-w-0">
                <h3 className="t-h3 text-white transition-transform duration-(--dur-2) ease-(--ease-mech) motion-safe:group-hover:translate-x-1.5">
                  {partner.name}
                </h3>
                {/* Contenido real, no rótulo decorativo: piso de contraste --tx-3, sube a --tx-2 en hover */}
                <p className="font-mono-tech mt-2 text-[11px] uppercase leading-[1.7] tracking-[0.18em] text-(--tx-3) transition-colors duration-(--dur-2) ease-(--ease-mech) group-hover:text-(--tx-2)">
                  Socio
                  <span aria-hidden="true"> · </span>
                  <span className="sr-only">, </span>
                  Modelado e impresión
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>

      {/* Nota de cercanía: el argumento de confianza más honesto del negocio */}
      <div className="mt-14 md:mt-20">
        <Hairline />
        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-[52ch] text-center text-sm leading-relaxed text-(--tx-3)">{NOTE}</p>
        </Reveal>
      </div>
    </Section>
  );
}
