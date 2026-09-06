"use client";

import type { ReactNode } from "react";
import Section from "./ui/Section";
import SectionHeading from "./ui/SectionHeading";
import Surface from "./ui/Surface";
import Button from "./ui/Button";
import MonoLabel from "./ui/MonoLabel";
import Hairline from "./ui/Hairline";
import Reveal from "./ui/Reveal";
import Stagger from "./ui/Stagger";
import { useReducedMotionSafe } from "./ui/useReducedMotionSafe";

/* ------------------------------------------------------------------------ */
/* Iconografía técnica: 1px sobre grilla de 48×48, trazo que no escala.      */
/* ------------------------------------------------------------------------ */

// 44px dentro del tile de 48px (1px de borde por lado): el trazo sigue siendo 1px real.
const ICON_SVG = "h-11 w-11";

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
/* Datos. `title` coincide EXACTAMENTE con el value fijo del campo servicio   */
/* del formulario. Un solo servicio: imprimimos lo que ya está modelado.      */
/* No ofrecemos modelado, en ningún caso.                                    */
/* ------------------------------------------------------------------------ */

type Service = {
  index: string;
  slug: string;
  title: "Solo Impresión";
  description: string;
  detail: string;
  /** "Qué necesitamos de vos": derivado del detail y de los campos del formulario. */
  needs: readonly string[];
  icon: ReactNode;
};

const services: readonly Service[] = [
  {
    index: "S-01",
    slug: "solo-impresion",
    title: "Solo Impresión",
    description: "¿Ya tenés el archivo 3D? Lo imprimimos.",
    detail:
      "Envianos tu archivo STL o STEP y nos encargamos de la impresión con los mejores materiales disponibles. ¿No tenés archivo? Podés conseguir modelos gratis en MakerWorld, Printables o Thingiverse.",
    needs: ["Archivo STL o STEP", "Material deseado", "Cantidad"],
    icon: <LayersIcon />,
  },
];

/* ------------------------------------------------------------------------ */
/* Tarjeta                                                                   */
/* ------------------------------------------------------------------------ */

function ServiceCard({ service }: { service: Service }) {
  const reduced = useReducedMotionSafe();
  const titleId = `servicio-${service.slug}-title`;
  const needsId = `servicio-${service.slug}-necesitamos`;

  // El href="#contacto" del Button queda como fallback sin JS (y como navegación nativa
  // al hash: actualiza la URL y mueve el punto de partida del foco a la sección).
  const handleSelect = () => {
    document
      .getElementById("contacto")
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    // Un solo servicio: panel ancho de dos columnas en vez de una ficha angosta aislada
    // (una card sola en lo que era una grilla de comparación se veía como un hueco vacío).
    <Surface as="article" spotlight corners padding="lg" className="group w-full">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Columna izquierda: índice + ícono, título y descripción */}
        <div className="flex flex-1 flex-col gap-4 lg:max-w-md">
          <div className="flex items-center justify-between gap-3">
            <MonoLabel>{service.index}</MonoLabel>
            <IconTile>{service.icon}</IconTile>
          </div>
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

        <Hairline orientation="v" className="hidden lg:block" />
        <Hairline className="lg:hidden" />

        {/* Columna derecha: qué necesitamos de vos + CTA */}
        <div className="flex flex-1 flex-col justify-between gap-6 lg:max-w-sm">
          <div>
            <p id={needsId}>
              <MonoLabel>Qué necesitamos de vos</MonoLabel>
            </p>
            <ul aria-labelledby={needsId} className="mt-3 flex flex-col gap-2">
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

          {/* aria-describedby → h3: asocia el CTA con el servicio que describe. */}
          <Button
            variant="ghost"
            size="sm"
            href="#contacto"
            onClick={handleSelect}
            icon={<ArrowIcon />}
            aria-describedby={titleId}
            className="self-start"
          >
            Solicitar este servicio
          </Button>
        </div>
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
        lead="Traé tu archivo 3D y lo hacemos."
        action={
          <Button variant="ghost" href="#contacto" icon={<ArrowIcon />}>
            Contar mi proyecto
          </Button>
        }
      />

      <Stagger className="grid grid-cols-1">
        {services.map((service) => (
          <Reveal key={service.slug} className="flex">
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </Stagger>
    </Section>
  );
}
