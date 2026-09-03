"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  Button,
  EASE,
  Hairline,
  MonoLabel,
  Reveal,
  Section,
  SectionHeading,
  Stagger,
  Surface,
  Tag,
  VIEWPORT,
  WhatsAppIcon,
  useQuote,
  useReducedMotionSafe,
} from "./ui";

/* =========================================================================
   Contenido real — intacto (nombre, tagline, descripción, usos y props).
   Los valores de `name` coinciden con los <option> del formulario.
   ========================================================================= */

type MaterialName = "PLA" | "PETG" | "ABS" | "TPU";

type Material = {
  name: MaterialName;
  tagline: string;
  description: string;
  idealFor: string;
  props: string[];
};

const materials: Material[] = [
  {
    name: "PLA",
    tagline: "El todoterreno",
    description:
      "El material más versátil y económico. Excelente nivel de detalle y terminación superficial.",
    idealFor: "Prototipos, maquetas, piezas decorativas, trofeos.",
    props: ["Detalle alto", "Hasta ~55°C", "Uso interior"],
  },
  {
    name: "PETG",
    tagline: "Resistente y confiable",
    description:
      "Buena resistencia mecánica y química. Tolera humedad y golpes sin volverse frágil.",
    idealFor: "Repuestos funcionales, soportes, piezas de uso diario.",
    props: ["Resistente", "Hasta ~75°C", "Apto exterior"],
  },
  {
    name: "ABS",
    tagline: "Para exigencia térmica",
    description:
      "Soporta impacto y temperaturas altas. El clásico de las piezas técnicas y automotrices.",
    idealFor: "Piezas de auto y moto, carcasas, repuestos cerca de motores.",
    props: ["Muy resistente", "Hasta ~95°C", "Apto exterior"],
  },
  {
    name: "TPU",
    tagline: "El flexible",
    description:
      "Elástico como la goma y muy resistente a la abrasión. Absorbe impactos y vibraciones.",
    idealFor: "Juntas, fundas, ruedas, protectores, bujes.",
    props: ["Flexible", "Antigolpes", "Antiabrasión"],
  },
];

const WHATSAPP_NUMBER = "541161256413";
const ADVICE_MESSAGE =
  "Hola SNJ Soluciones! 👋 Tengo una pieza para imprimir y no sé qué material conviene. ¿Me asesoran?";
const ADVICE_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(ADVICE_MESSAGE)}`;

/* =========================================================================
   Datos DERIVADOS de lo ya publicado (no se inventa nada)
   ========================================================================= */

/** Lee la temperatura publicada en `props` ("Hasta ~55°C" → 55). TPU no publica dato → null. */
function maxTempOf(material: Material): number | null {
  for (const p of material.props) {
    const m = /(\d+)\s*°C/.exec(p);
    if (m) return Number(m[1]);
  }
  return null;
}

/** Textura monocromática por material, ≤4% de opacidad, dibujada por CSS. */
const TEXTURE: Record<MaterialName, CSSProperties> = {
  // líneas de capa finas (detalle alto)
  PLA: {
    backgroundImage:
      "repeating-linear-gradient(180deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 2px)",
  },
  // líneas de capa más gruesas
  PETG: {
    backgroundImage:
      "repeating-linear-gradient(180deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 5px)",
  },
  // trama cruzada a 45°
  ABS: {
    backgroundImage:
      "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 9px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 9px)",
  },
  // ondas (elasticidad)
  TPU: {
    backgroundImage:
      "repeating-radial-gradient(circle at 100% 0%, rgba(255,255,255,0.04) 0 1px, transparent 1px 12px)",
  },
};
const TEXTURE_MASK = "linear-gradient(180deg, #000 15%, transparent 92%)";

type Cell =
  | { kind: "dots"; filled: 0 | 1 | 2 | 3; label: string }
  | { kind: "text"; text: string }
  | { kind: "none" };

const dots = (filled: 0 | 1 | 2 | 3, label: string): Cell => ({ kind: "dots", filled, label });
const text = (t: string): Cell => ({ kind: "text", text: t });
const NONE: Cell = { kind: "none" };

function tempCell(name: MaterialName): Cell {
  const material = materials.find((m) => m.name === name);
  const t = material ? maxTempOf(material) : null;
  return t === null ? NONE : text(`~${t} °C`);
}

function idealCell(name: MaterialName): Cell {
  const material = materials.find((m) => m.name === name);
  return material ? text(material.idealFor) : NONE;
}

type CompareRow = { label: string; cells: Record<MaterialName, Cell> };

/**
 * Cada celda sale de los `props` / `idealFor` de arriba:
 *  - Resistencia: PETG "Resistente", ABS "Muy resistente", TPU "Antigolpes"; PLA no publica dato → "—".
 *  - Exterior: PLA "Uso interior", PETG/ABS "Apto exterior"; TPU no lo publica.
 *  - Flexibilidad: TPU "Flexible / elástico como la goma"; los otros tres son rígidos.
 *  - Detalle: PLA "Detalle alto"; los demás no lo publican.
 */
const COMPARE_ROWS: CompareRow[] = [
  {
    label: "Resistencia mecánica",
    cells: {
      PLA: NONE,
      PETG: dots(2, "Resistente"),
      ABS: dots(3, "Muy resistente"),
      TPU: dots(2, "Antigolpes y antiabrasión"),
    },
  },
  {
    label: "Temperatura máxima",
    cells: { PLA: tempCell("PLA"), PETG: tempCell("PETG"), ABS: tempCell("ABS"), TPU: tempCell("TPU") },
  },
  {
    label: "Apto exterior",
    cells: { PLA: text("Solo interior"), PETG: text("Sí"), ABS: text("Sí"), TPU: NONE },
  },
  {
    label: "Flexibilidad",
    cells: {
      PLA: dots(0, "Rígido"),
      PETG: dots(0, "Rígido"),
      ABS: dots(0, "Rígido"),
      TPU: dots(3, "Flexible, elástico como la goma"),
    },
  },
  {
    label: "Nivel de detalle",
    cells: { PLA: dots(3, "Alto"), PETG: NONE, ABS: NONE, TPU: NONE },
  },
  {
    label: "Ideal para",
    cells: { PLA: idealCell("PLA"), PETG: idealCell("PETG"), ABS: idealCell("ABS"), TPU: idealCell("TPU") },
  },
];

/* =========================================================================
   Piezas locales
   ========================================================================= */

const MONO_LABEL = "font-mono-tech text-[11px] uppercase leading-none tracking-[0.16em]";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      className="h-3.5 w-3.5"
      aria-hidden="true"
      focusable="false"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

// Onda senoidal: primer arco explícito y el resto por reflexión (T) cada 6 unidades.
const WAVE_D = `M0 4 Q3 0 6 4 ${Array.from({ length: 19 }, (_, i) => `T${12 + i * 6} 4`).join(" ")}`;

/** Barra de 3px con relleno proporcional a la temperatura publicada (55/75/95 → %). */
function TempBar({ pct, reduced }: { pct: number; reduced: boolean }) {
  const fill: CSSProperties = { width: `${pct}%`, background: "#fff" };
  return (
    <div
      className="h-[3px] w-full overflow-hidden rounded-full"
      style={{ background: "rgba(255,255,255,0.08)" }}
    >
      {reduced ? (
        <div className="h-full rounded-full" style={fill} />
      ) : (
        <motion.div
          className="h-full origin-left rounded-full"
          style={fill}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.9, ease: EASE.expo }}
        />
      )}
    </div>
  );
}

/** TPU no publica temperatura: en su lugar, una línea ondulada que representa flexibilidad. */
function WaveLine({ reduced }: { reduced: boolean }) {
  const common = {
    d: WAVE_D,
    fill: "none",
    stroke: "rgba(255,255,255,0.7)",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    vectorEffect: "non-scaling-stroke",
  };
  return (
    <svg viewBox="0 0 120 8" preserveAspectRatio="none" className="h-2 w-full" focusable="false">
      {reduced ? (
        <path {...common} />
      ) : (
        <motion.path
          {...common}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.9, ease: EASE.expo }}
        />
      )}
    </svg>
  );
}

function TempMeter({ material }: { material: Material }) {
  const reduced = useReducedMotionSafe();
  const temp = maxTempOf(material);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className={MONO_LABEL} style={{ color: "var(--tx-5)" }}>
          {temp === null ? "Flexibilidad" : "Temp. máx."}
        </span>
        <span className="font-mono-tech text-[12px] leading-none" style={{ color: "var(--tx-2)" }}>
          {temp === null ? "Elástico" : `~${temp} °C`}
        </span>
      </div>
      <div aria-hidden="true" className="mt-2.5 flex h-2 items-center">
        {temp === null ? <WaveLine reduced={reduced} /> : <TempBar pct={temp} reduced={reduced} />}
      </div>
    </div>
  );
}

function MaterialCard({
  material,
  index,
  onQuote,
}: {
  material: Material;
  index: number;
  onQuote: (name: MaterialName) => void;
}) {
  return (
    <Surface spotlight padding="md" className="w-full">
      {/* Textura de material a sangre: -inset = padding de Surface (p-6 / md:p-7). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 md:-inset-7"
        style={{ ...TEXTURE[material.name], WebkitMaskImage: TEXTURE_MASK, maskImage: TEXTURE_MASK }}
      />

      <div className="relative flex flex-1 flex-col gap-5">
        <div aria-hidden="true" className="flex items-center justify-between gap-3">
          <MonoLabel>{`M-0${index + 1}`}</MonoLabel>
          <Hairline className="flex-1" />
        </div>

        <div>
          <h3 className="font-display text-[1.75rem] leading-none font-bold tracking-[-0.03em] text-white">
            {material.name}
          </h3>
          <p className={`${MONO_LABEL} mt-2.5`} style={{ color: "var(--tx-4)" }}>
            {material.tagline}
          </p>
        </div>

        <TempMeter material={material} />

        <p className="text-[0.9375rem] leading-[1.6]" style={{ color: "var(--tx-3)" }}>
          {material.description}
        </p>

        <div>
          <span className={`${MONO_LABEL} block`} style={{ color: "var(--tx-5)" }}>
            Ideal para
          </span>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--tx-3)" }}>
            {material.idealFor}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {material.props.map((prop) => (
            <Tag key={prop}>{prop}</Tag>
          ))}
        </div>

        <div className="mt-auto pt-1">
          <Hairline className="mb-2" />
          <Button
            variant="ghost"
            size="sm"
            href="#contacto"
            onClick={() => onQuote(material.name)}
            icon={<ArrowIcon />}
            className="-ml-1"
          >
            Cotizar en {material.name}
          </Button>
        </div>
      </div>
    </Surface>
  );
}

function DotScale({ filled, label }: { filled: number; label: string }) {
  return (
    <>
      <span aria-hidden="true" className="inline-flex items-center gap-[5px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-[5px] w-[5px] rounded-full"
            style={i < filled ? { background: "#fff" } : { boxShadow: "inset 0 0 0 1px var(--line-3)" }}
          />
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </>
  );
}

function CellContent({ cell }: { cell: Cell }) {
  if (cell.kind === "dots") return <DotScale filled={cell.filled} label={cell.label} />;
  if (cell.kind === "text") return <>{cell.text}</>;
  return (
    <>
      <span aria-hidden="true" style={{ color: "var(--tx-5)" }}>
        —
      </span>
      <span className="sr-only">Sin dato publicado</span>
    </>
  );
}

// Primera columna pegada a la izquierda. Bajo md el scroller sangra hasta el borde del viewport,
// así que se pega en --gutter y una sombra sólida tapa la franja del gutter por la que pasan las celdas.
const STICKY_COL =
  "sticky left-[var(--gutter)] z-[1] md:left-0 [box-shadow:calc(-1*var(--gutter))_0_0_0_var(--srf-1)] md:[box-shadow:none]";
const CELL_BORDER: CSSProperties = { borderTop: "1px solid var(--line-1)" };
// Tinte de fila en hover: la fila escribe --row-tint y lo leen las celdas y la columna fija
// (que necesita fondo opaco para el sticky, por eso lo apila sobre --srf-1).
const ROW_HOVER = "group hover:[--row-tint:rgba(255,255,255,0.025)]";
const STICKY_BG = "linear-gradient(var(--row-tint, transparent), var(--row-tint, transparent)), var(--srf-1)";
const CELL_TINT: CSSProperties = {
  background: "var(--row-tint, transparent)",
  transition: "background-color var(--dur-1) var(--ease-mech)",
};

function CompareTable() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [scrollable, setScrollable] = useState(false);
  const [atEnd, setAtEnd] = useState(true);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const measure = () => {
      const max = el.scrollWidth - el.clientWidth;
      setScrollable(max > 1);
      setAtEnd(el.scrollLeft >= max - 1);
    };
    el.addEventListener("scroll", measure, { passive: true });
    let ro: ResizeObserver | null = null;
    let raf = 0;
    if (typeof ResizeObserver !== "undefined") {
      // ResizeObserver dispara una vez al observar: mide el estado inicial sin setState síncrono.
      ro = new ResizeObserver(measure);
      ro.observe(el);
    } else {
      raf = requestAnimationFrame(measure);
      window.addEventListener("resize", measure);
    }
    return () => {
      el.removeEventListener("scroll", measure);
      if (ro) ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const showFade = scrollable && !atEnd;

  return (
    <Reveal className="mt-16 md:mt-20">
      <div className="mb-6 flex items-center gap-4">
        <MonoLabel>Ficha comparativa</MonoLabel>
        <Hairline className="flex-1" />
      </div>

      <div className="relative -mx-[var(--gutter)] md:mx-0">
        {/* Región desplazable: alcanzable con teclado solo cuando de verdad hay scroll. */}
        <div
          ref={scrollerRef}
          role="region"
          aria-labelledby="materiales-comparativa"
          tabIndex={scrollable ? 0 : undefined}
          className="scrollbar-hair overflow-x-auto px-[var(--gutter)] pb-2 md:px-0"
        >
          <table className="w-full min-w-[640px] table-fixed border-separate border-spacing-0">
            <caption id="materiales-comparativa" className="sr-only">
              Comparativa de materiales
            </caption>
            <colgroup>
              <col style={{ width: "26%" }} />
              <col style={{ width: "18.5%" }} />
              <col style={{ width: "18.5%" }} />
              <col style={{ width: "18.5%" }} />
              <col style={{ width: "18.5%" }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className={`${STICKY_COL} pb-4 pl-0 pr-4 text-left`} style={{ background: "var(--srf-1)" }}>
                  <span className="sr-only">Propiedad</span>
                </th>
                {materials.map((m) => (
                  <th
                    key={m.name}
                    scope="col"
                    className="px-3 pb-4 text-left align-bottom font-display text-base font-bold tracking-[-0.02em] text-white"
                  >
                    {m.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.label} className={ROW_HOVER}>
                  <th
                    scope="row"
                    className={`${STICKY_COL} ${MONO_LABEL} py-4 pl-0 pr-4 text-left align-top font-normal leading-normal`}
                    style={{ ...CELL_BORDER, background: STICKY_BG, color: "var(--tx-3)" }}
                  >
                    {row.label}
                  </th>
                  {materials.map((m) => {
                    const cell = row.cells[m.name];
                    const longText = row.label === "Ideal para";
                    return (
                      <td
                        key={m.name}
                        className={`px-3 py-4 align-top text-sm ${longText ? "leading-relaxed" : "leading-none"}`}
                        style={{ ...CELL_BORDER, ...CELL_TINT, color: longText ? "var(--tx-3)" : "var(--tx-2)" }}
                      >
                        <CellContent cell={cell} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Desvanecido derecho: solo mientras haya más tabla por deslizar. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16"
          style={{
            background: "linear-gradient(90deg, transparent, var(--srf-1))",
            opacity: showFade ? 1 : 0,
            transition: "opacity var(--dur-2) var(--ease-mech)",
          }}
        />
      </div>

      <p
        aria-hidden="true"
        className={`${MONO_LABEL} mt-3 md:hidden`}
        style={{
          color: "var(--tx-5)",
          opacity: showFade ? 1 : 0,
          transition: "opacity var(--dur-2) var(--ease-mech)",
        }}
      >
        Deslizá para comparar →
      </p>
    </Reveal>
  );
}

function AdviceStrip() {
  return (
    <Reveal className="mt-16 md:mt-20">
      <Hairline />
      <div className="flex flex-col gap-4 pt-8 md:flex-row md:items-center md:justify-between md:gap-10 md:pt-10">
        <p className="t-h3 max-w-[34ch]" style={{ color: "var(--tx-2)" }}>
          ¿No sabés cuál conviene para tu pieza?{" "}
          <a
            href="#contacto"
            className="text-white underline decoration-1 decoration-white/30 underline-offset-[6px] transition-[text-decoration-color] duration-[var(--dur-1)] ease-[var(--ease-mech)] hover:decoration-white focus-visible:decoration-white"
          >
            Contanos qué necesitás
          </a>{" "}
          y te asesoramos sin compromiso.
        </p>
        <Button
          variant="whatsapp"
          external
          href={ADVICE_URL}
          icon={<WhatsAppIcon className="h-5 w-5" />}
          iconPosition="left"
          className="w-full md:w-auto md:shrink-0"
        >
          Consultar por WhatsApp
        </Button>
      </div>
    </Reveal>
  );
}

/* =========================================================================
   Sección
   ========================================================================= */

export default function Materials() {
  const reduced = useReducedMotionSafe();
  const { setPreset } = useQuote();

  // Pre-selecciona el material en el formulario y baja a #contacto.
  // El href="#contacto" del botón queda como fallback sin JS.
  const quote = useCallback(
    (name: MaterialName) => {
      setPreset({ material: name });
      document
        .getElementById("contacto")
        ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
    },
    [reduced, setPreset]
  );

  return (
    <Section id="materiales" tone="base" labelledBy="materiales-title">
      <SectionHeading
        index="04"
        eyebrow="Materiales"
        titleId="materiales-title"
        title="El material correcto para cada pieza"
        lead="Cuatro filamentos que cubren desde una maqueta hasta un repuesto que trabaja al lado de un motor. Si no sabés cuál va, lo definimos con vos."
      />

      <Stagger className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {materials.map((material, i) => (
          <Reveal key={material.name} className="flex">
            <MaterialCard material={material} index={i} onQuote={quote} />
          </Reveal>
        ))}
      </Stagger>

      <CompareTable />
      <AdviceStrip />
    </Section>
  );
}
