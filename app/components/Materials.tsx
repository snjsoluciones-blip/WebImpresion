"use client";

import { useCallback, type CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  Button,
  EASE,
  Reveal,
  Section,
  SectionHeading,
  Stagger,
  Surface,
  Tag,
  VIEWPORT,
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
  onQuote,
}: {
  material: Material;
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
        <div>
          <h3 className="font-display text-[1.75rem] leading-none font-bold tracking-[-0.03em] text-white">
            {material.name}
          </h3>
          <p className={`${MONO_LABEL} mt-2.5`} style={{ color: "var(--tx-4)" }}>
            {material.tagline}
          </p>
        </div>

        <TempMeter material={material} />

        <div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--tx-3)" }}>
            {material.idealFor}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {material.props.map((prop) => (
            <Tag key={prop}>{prop}</Tag>
          ))}
        </div>

        <div className="mt-auto pt-1">
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
        index="03"
        eyebrow="Materiales"
        titleId="materiales-title"
        title="El material correcto para cada pieza"
        lead="Si no sabés cuál va, lo definimos con vos."
      />

      <Stagger className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {materials.map((material) => (
          <Reveal key={material.name} className="flex">
            <MaterialCard material={material} onQuote={quote} />
          </Reveal>
        ))}
      </Stagger>

    </Section>
  );
}
