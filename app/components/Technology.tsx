"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import {
  Button,
  EASE,
  Hairline,
  LayerLines,
  MonoLabel,
  Reveal,
  Section,
  SectionHeading,
  SpecTable,
  STAGGER,
  VIEWPORT,
  staggerDelay,
  useReducedMotionSafe,
  type SpecRow,
} from "./ui";

/* =========================================================================
   03 · Tecnología — Bambu Lab P2S
   Todo lo que se afirma acá deriva de hechos ya publicados en la web:
   500 llaveros en menos de una semana, ABS para piezas de auto y moto,
   modelado 3D propio, 4 materiales, zona de cobertura, respuesta por WhatsApp.
   No se inventa ninguna spec del equipo.
   ========================================================================= */

/* ---------- Íconos de 1px (misma familia que Services: viewBox 48, non-scaling-stroke) ---------- */

// 44px dentro del tile de 48px: el trazo sigue siendo 1px real (igual que en Services).
const ICON_SVG = "h-11 w-11";

function EnclosureIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className={ICON_SVG}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
      focusable="false"
    >
      {/* gabinete cerrado */}
      <rect vectorEffect="non-scaling-stroke" x="9" y="8" width="30" height="32" rx="2" />
      {/* ventana de la cámara */}
      <rect vectorEffect="non-scaling-stroke" x="14" y="14" width="20" height="16" rx="1" />
      {/* cabezal + filamento */}
      <path vectorEffect="non-scaling-stroke" d="M21 14v2.5h6V14" />
      <path vectorEffect="non-scaling-stroke" d="M23 16.5l1 2 1-2" />
      {/* cama */}
      <path vectorEffect="non-scaling-stroke" d="M17 26h14" />
      {/* rejillas */}
      <path vectorEffect="non-scaling-stroke" d="M18 35h4M26 35h4" />
    </svg>
  );
}

function SeriesIcon() {
  const cols = [9, 20, 31];
  const rows = [11, 22];
  return (
    <svg
      viewBox="0 0 48 48"
      className={ICON_SVG}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
      focusable="false"
    >
      {/* seis piezas idénticas */}
      {rows.map((y) =>
        cols.map((x) => (
          <rect key={`${x}-${y}`} vectorEffect="non-scaling-stroke" x={x} y={y} width="8" height="8" rx="1.5" />
        ))
      )}
      {/* cinta de salida */}
      <path vectorEffect="non-scaling-stroke" d="M9 36h30" />
      <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" d="M35 33l4 3-4 3" />
    </svg>
  );
}

function ModelingIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className={ICON_SVG}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
      focusable="false"
    >
      {/* curva bezier con anclas y manijas */}
      <path vectorEffect="non-scaling-stroke" d="M10 36C14 16 30 40 38 12" />
      <path vectorEffect="non-scaling-stroke" d="M10 36l5-13" />
      <path vectorEffect="non-scaling-stroke" d="M38 12l-6 12" />
      <rect vectorEffect="non-scaling-stroke" x="8.5" y="34.5" width="3" height="3" />
      <rect vectorEffect="non-scaling-stroke" x="36.5" y="10.5" width="3" height="3" />
      <circle vectorEffect="non-scaling-stroke" cx="15" cy="23" r="1.5" />
      <circle vectorEffect="non-scaling-stroke" cx="32" cy="24" r="1.5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width={14}
      height={14}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      aria-hidden="true"
      focusable="false"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

/* ---------- Contenido ---------- */

type Capability = { id: string; title: string; body: string; icon: ReactNode };

const CAPABILITIES: Capability[] = [
  {
    id: "camara",
    title: "Cámara cerrada",
    body: "Imprime con la cámara cerrada, así el ABS no sufre warping. Por eso podemos encarar piezas de auto y moto que tienen que aguantar impacto y temperatura.",
    icon: <EnclosureIcon />,
  },
  {
    id: "serie",
    title: "Producción en serie",
    body: "500 llaveros idénticos, con diseño y modelado a medida, terminados en menos de una semana. Cuando la tanda es grande, la consistencia entre piezas no se negocia.",
    icon: <SeriesIcon />,
  },
  {
    id: "modelado",
    title: "Modelado propio",
    body: "Si no tenés el archivo, lo hacemos nosotros. Traés una idea, un boceto o una pieza rota y salimos con el modelo 3D listo para imprimir.",
    icon: <ModelingIcon />,
  },
];

const SPECS: SpecRow[] = [
  { k: "Equipo", v: "Bambu Lab P2S" },
  { k: "Cámara", v: "Cerrada" },
  { k: "Materiales", v: "PLA · PETG · ABS · TPU" },
  { k: "Modelado 3D", v: "Propio, a partir de tu archivo o tu idea" },
  { k: "Serie de referencia", v: "500 llaveros en menos de una semana" },
  { k: "Respuesta", v: "Por WhatsApp" },
];

type Part = { src: string; label: string; alt: string };

// Renders reales de /public/images. connector.png y bracket.png pesan ~7-8 MB:
// van sí o sí por next/image con sizes acotado, quality 70 y lazy. Jamás priority.
const PARTS: Part[] = [
  { src: "/images/gear.png", label: "Engranaje", alt: "Render 3D de un engranaje mecánico, en escala de grises" },
  { src: "/images/connector.png", label: "Conector", alt: "Render 3D de un conector técnico, en escala de grises" },
  { src: "/images/bracket.png", label: "Soporte", alt: "Render 3D de un soporte a medida, en escala de grises" },
];

const PART_SIZES = "(max-width:1024px) 45vw, 22vw";

// Glow de fondo: tope 6% (la regla general es ≤8%).
const GLOW_STYLE = { "--glow-1": "rgba(255,255,255,0.06)" } as CSSProperties;

/* ---------- Subcomponentes ---------- */

function CapabilityColumn({ item, index, reduced }: { item: Capability; index: number; reduced: boolean }) {
  // Cada columna entra con stagger 90 ms (tope 6). Texto: sube 14px con fade (Reveal, sin blur).
  // Hairline inferior: scaleX 0→1 desde la izquierda en 520 ms (timing propio de la spec, por eso es local).
  // (staggerDelay() no acepta otro step: su parámetro quedó inferido como el literal 0.07)
  const delay = Math.min(index, STAGGER.max) * STAGGER.line;

  return (
    <div className="relative flex flex-col md:px-8 md:first:pl-0 md:last:pr-0">
      {index > 0 && <Hairline orientation="v" className="absolute inset-y-0 left-0 hidden md:block" />}

      <Reveal y={14} blur={false} delay={delay} className="flex-1">
        <div className="flex items-start justify-between">
          <span className="inline-flex" style={{ color: "var(--tx-2)" }}>
            {item.icon}
          </span>
          <MonoLabel>{String(index + 1).padStart(2, "0")}</MonoLabel>
        </div>
        <h3 className="t-h3 mt-7 text-white">{item.title}</h3>
        <p className="t-body mt-3 max-w-[40ch]">{item.body}</p>
      </Reveal>

      {reduced ? (
        <div aria-hidden="true" className="hairline mt-8 md:mt-10" />
      ) : (
        <motion.div
          aria-hidden="true"
          className="hairline mt-8 md:mt-10"
          style={{ transformOrigin: "0% 50%" }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.52, ease: EASE.expo, delay }}
        />
      )}
    </div>
  );
}

function PartFigure({ part, index, reduced }: { part: Part; index: number; reduced: boolean }) {
  return (
    <Reveal
      as="li"
      delay={staggerDelay(index)}
      className="w-[calc(50%-0.5rem)] md:w-[calc(50%-0.75rem)] lg:w-auto"
    >
      <figure className="relative m-0">
        {/* halo blanco al 6% debajo de la pieza (queda quieto mientras la pieza flota) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[12%] -bottom-3 h-8 rounded-full"
          style={{
            background: "radial-gradient(50% 60% at 50% 50%, rgba(255,255,255,0.06), transparent 70%)",
            filter: "blur(10px)",
          }}
        />
        <div
          className={`relative overflow-hidden rounded-[var(--r-md)] border ${reduced ? "" : "snj-float"}`}
          style={{
            aspectRatio: "11 / 6",
            borderColor: "var(--line-1)",
            borderTopColor: "var(--line-2)",
            background: "linear-gradient(180deg, #141414, #0e0e0e)",
            animationDelay: reduced ? undefined : `${index * 0.8}s`,
          }}
        >
          <Image
            src={part.src}
            alt={part.alt}
            fill
            sizes={PART_SIZES}
            quality={70}
            loading="lazy"
            className="object-cover"
            style={{ filter: "grayscale(1) brightness(1.1) contrast(1.05)" }}
          />
          <LayerLines opacity={0.04} fade={false} />
        </div>
        <figcaption className="mt-3 flex items-center justify-between gap-3">
          <MonoLabel tone="bright" rule>
            {part.label}
          </MonoLabel>
          <MonoLabel>{String(index + 1).padStart(2, "0")}</MonoLabel>
        </figcaption>
      </figure>
    </Reveal>
  );
}

/* ---------- Sección ---------- */

export default function Technology() {
  const reduced = useReducedMotionSafe();

  return (
    <Section id="tecnologia" tone="deep" labelledBy="tecnologia-title" bleed className="overflow-hidden">
      {/* fondo: capas FDM + glow ≤6% */}
      <LayerLines spacing={9} />
      <div
        aria-hidden="true"
        className="glow-soft pointer-events-none absolute left-1/2 top-[28%] h-[min(60vw,520px)] w-[min(90vw,980px)] -translate-x-1/2"
        style={GLOW_STYLE}
      />

      <div className="shell relative">
        <SectionHeading
          index="03"
          eyebrow="Tecnología"
          titleId="tecnologia-title"
          title="Impresoras Bambu Lab P2S"
          lead="Es el equipo con el que producimos. Cerrado y estable: por eso podemos hacer series cortas sin perder consistencia entre piezas."
        />

        {/* 64 · tres columnas de capacidad con hairlines verticales */}
        <div className="grid gap-10 md:grid-cols-3 md:gap-0">
          {CAPABILITIES.map((item, i) => (
            <CapabilityColumn key={item.id} item={item} index={i} reduced={reduced} />
          ))}
        </div>

        {/* 64 · ficha (solo hechos publicados) + 65 · renders reales */}
        <div className="mt-16 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-4">
            <MonoLabel rule as="h3">
              Ficha · equipo
            </MonoLabel>
            <SpecTable dense rows={SPECS} className="mt-4 max-w-xl lg:max-w-none" />
          </Reveal>

          <div className="lg:col-span-8">
            <MonoLabel rule as="h3">
              Piezas técnicas · renders
            </MonoLabel>
            <ul className="m-0 mt-5 flex list-none flex-wrap justify-center gap-4 p-0 md:gap-6 lg:grid lg:grid-cols-3">
              {PARTS.map((part, i) => (
                <PartFigure key={part.src} part={part} index={i} reduced={reduced} />
              ))}
            </ul>
          </div>
        </div>

        {/* cierre · zona de cobertura */}
        <div className="mt-16 md:mt-20">
          <Hairline />
          <div className="flex flex-col gap-5 pt-6 md:flex-row md:items-center md:justify-between md:gap-8">
            <p className="font-mono-tech m-0 text-[11px] uppercase leading-[1.9] tracking-[0.18em]">
              <span style={{ color: "var(--tx-5)" }}>Zona de trabajo — </span>
              <span style={{ color: "var(--tx-2)" }}>General Pacheco · Tigre · Zona Norte GBA · CABA</span>
            </p>
            <Button variant="ghost" size="sm" href="#contacto" icon={<ArrowIcon />} className="self-start md:self-auto">
              ¿Estás en otra zona? Consultanos
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
