"use client";

import type { ReactNode } from "react";
import Section from "./ui/Section";
import SectionHeading from "./ui/SectionHeading";
import Surface from "./ui/Surface";
import Button from "./ui/Button";
import MonoLabel from "./ui/MonoLabel";
import Hairline from "./ui/Hairline";
import Tag from "./ui/Tag";
import Reveal from "./ui/Reveal";
import Stagger from "./ui/Stagger";
import { SERVICE_VALUES, useQuote } from "./ui/quote-context";
import { useReducedMotionSafe } from "./ui/useReducedMotionSafe";

/* ------------------------------------------------------------------------ */
/* Iconografía técnica: 1px sobre grilla de 48×48, trazo que no escala.      */
/* ------------------------------------------------------------------------ */

// 44px dentro del tile de 48px (1px de borde por lado): el trazo sigue siendo 1px real.
const ICON_SVG = "h-11 w-11";

/** Wireframe isométrico de un cubo con los vértices marcados por cuadraditos de 3px. */
function CubeIcon() {
  // Hexágono: T(24,10) UR(36,17) LR(36,31) B(24,38) LL(12,31) UL(12,17). Vértice frontal C(24,24).
  const vertices: [number, number][] = [
    [24, 10],
    [36, 17],
    [36, 31],
    [24, 38],
    [12, 31],
    [12, 17],
    [24, 24],
  ];
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
      {/* aristas visibles */}
      <path vectorEffect="non-scaling-stroke" d="M24 10 36 17 36 31 24 38 12 31 12 17Z" />
      <path vectorEffect="non-scaling-stroke" d="M24 24 12 17M24 24 36 17M24 24 24 38" />
      {/* aristas ocultas (wireframe) */}
      <path
        vectorEffect="non-scaling-stroke"
        strokeOpacity={0.45}
        strokeDasharray="2 2"
        d="M24 24 24 10M24 24 12 31M24 24 36 31"
      />
      {/* vértices */}
      {vertices.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x - 1.5} y={y - 1.5} width={3} height={3} fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
}

/** Tres capas apiladas con la boquilla depositando la superior. */
function LayersIcon() {
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
      {/* boquilla: cuerpo + punta + filamento */}
      <path vectorEffect="non-scaling-stroke" d="M19 6h10v7H19z" />
      <path vectorEffect="non-scaling-stroke" d="M19 13l3 5h4l3-5" />
      <path vectorEffect="non-scaling-stroke" d="M24 18v3" />
      {/* capa superior, en curso (llega hasta la boquilla) */}
      <path vectorEffect="non-scaling-stroke" d="M11 21h13v4H11z" />
      {/* capas terminadas */}
      <path vectorEffect="non-scaling-stroke" d="M11 27h26v4H11z" />
      <path vectorEffect="non-scaling-stroke" d="M11 33h26v4H11z" />
      {/* cama */}
      <path vectorEffect="non-scaling-stroke" strokeOpacity={0.5} d="M7 41h34" />
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      width={12}
      height={12}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      className="shrink-0"
      aria-hidden="true"
      focusable="false"
    >
      <rect x={0.5} y={0.5} width={11} height={11} rx={2} strokeOpacity={0.5} />
      <path strokeLinecap="square" d="M3 6.2l2.2 2.2L9 4.2" />
    </svg>
  );
}

/** Tile de 48×48: fondo --srf-4, borde --line-2, radio 12px. Color --tx-5 → --tx-2 en hover (240 ms). */
function IconTile({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-[color:var(--tx-5)] transition-colors duration-[240ms] group-hover:text-[color:var(--tx-2)]"
      style={{
        background: "var(--srf-4)",
        borderColor: "var(--line-2)",
        transitionTimingFunction: "var(--ease-mech)",
      }}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------------ */
/* Datos. Los 4 textos de cada servicio se conservan palabra por palabra.     */
/* `title` coincide EXACTAMENTE con los value de los <option> del formulario. */
/* ------------------------------------------------------------------------ */

type ServiceValue = (typeof SERVICE_VALUES)[number];

type Service = {
  index: string;
  slug: string;
  title: ServiceValue;
  description: string;
  detail: string;
  badge: string | null;
  /** "Qué necesitamos de vos": derivado del detail y de los campos del formulario. */
  needs: readonly string[];
  icon: ReactNode;
  /** Columnas en lg (grid de 12): la más popular ocupa 7, la otra 5. */
  span: string;
};

const services: readonly Service[] = [
  {
    index: "S-01",
    slug: "modelado-impresion",
    title: "Modelado + Impresión",
    description: "¿Tenés una idea? Nosotros la modelamos en 3D y la imprimimos.",
    detail:
      "Desde el concepto hasta la pieza física. Trabajamos con vos para dar forma a tu idea con precisión profesional.",
    badge: "Más popular",
    needs: ["Descripción o croquis", "Medidas aproximadas", "Para qué la vas a usar"],
    icon: <CubeIcon />,
    span: "lg:col-span-7",
  },
  {
    index: "S-02",
    slug: "solo-impresion",
    title: "Solo Impresión",
    description: "¿Ya tenés el modelo? Solo necesitamos el archivo y lo imprimimos.",
    detail:
      "Envianos tu archivo STL o STEP y nos encargamos de la impresión con los mejores materiales disponibles.",
    badge: null,
    needs: ["Archivo STL o STEP", "Material deseado", "Cantidad"],
    icon: <LayersIcon />,
    span: "lg:col-span-5",
  },
];

/* ------------------------------------------------------------------------ */
/* Tarjeta                                                                   */
/* ------------------------------------------------------------------------ */

function ServiceCard({ service }: { service: Service }) {
  const { setPreset } = useQuote();
  const reduced = useReducedMotionSafe();
  const titleId = `servicio-${service.slug}-title`;
  const needsId = `servicio-${service.slug}-necesitamos`;

  // Pre-selecciona el servicio en el formulario y baja a #contacto.
  // El href="#contacto" del Button queda como fallback sin JS (y como navegación nativa
  // al hash: actualiza la URL y mueve el punto de partida del foco a la sección).
  const handleSelect = () => {
    setPreset({ servicio: service.title });
    document
      .getElementById("contacto")
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    // w-full + el Reveal padre en `flex`: la ficha estira a la altura de la fila en md/lg.
    <Surface as="article" spotlight corners padding="lg" className="group w-full min-h-[380px]">
      {/* (a) cabecera: índice mono + badge en flujo · tile con ícono */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <MonoLabel>{service.index}</MonoLabel>
          {service.badge && <Tag tone="solid">{service.badge}</Tag>}
        </div>
        <IconTile>{service.icon}</IconTile>
      </div>

      <Hairline className="my-6" />

      {/* (b) cuerpo */}
      <div className="flex flex-col gap-3">
        <h3 id={titleId} className="t-h3 text-balance text-white">
          {service.title}
        </h3>
        <p className="t-body text-pretty" style={{ color: "var(--tx-2)" }}>
          {service.description}
        </p>
        <p className="text-pretty text-sm leading-relaxed" style={{ color: "var(--tx-3)" }}>
          {service.detail}
        </p>
      </div>

      {/* Qué necesitamos de vos */}
      <Hairline className="mt-6" />
      <div className="pt-5">
        <p id={needsId}>
          <MonoLabel>Qué necesitamos de vos</MonoLabel>
        </p>
        <ul
          aria-labelledby={needsId}
          className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] gap-x-6 gap-y-2"
        >
          {service.needs.map((need) => (
            <li
              key={need}
              className="font-mono-tech flex items-center gap-2 text-[12px] leading-snug"
              style={{ color: "var(--tx-3)" }}
            >
              <span style={{ color: "var(--tx-4)" }} className="flex">
                <CheckIcon />
              </span>
              {need}
            </li>
          ))}
        </ul>
      </div>

      {/* (c) pie: CTA que pre-selecciona el servicio */}
      <div className="mt-auto pt-6">
        <Hairline className="mb-4" />
        {/* aria-describedby → h3: los dos links dicen lo mismo; así cada uno queda asociado a su servicio. */}
        <Button
          variant="ghost"
          size="sm"
          href="#contacto"
          onClick={handleSelect}
          icon={<ArrowIcon />}
          aria-describedby={titleId}
        >
          Solicitar este servicio
        </Button>
      </div>
    </Surface>
  );
}

/* ------------------------------------------------------------------------ */
/* Sección                                                                   */
/* ------------------------------------------------------------------------ */

export default function Services() {
  return (
    <Section id="servicios" tone="base" labelledBy="servicios-title">
      <SectionHeading
        index="01"
        eyebrow="Servicios"
        titleId="servicios-title"
        title="¿Qué necesitás?"
        lead="Dos formas de trabajar con nosotros, según en qué punto estés. En las dos, la pieza sale del taller lista para usar."
        action={
          <Button variant="ghost" href="#contacto" icon={<ArrowIcon />}>
            Contar mi proyecto
          </Button>
        }
      />

      {/* mobile: apiladas gap 16 · md: 50/50 gap 20 · lg: grid de 12 → 7/5. Stagger de hermanos (70 ms). */}
      <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-12">
        {services.map((service) => (
          <Reveal key={service.slug} className={`flex ${service.span}`}>
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </Stagger>
    </Section>
  );
}
