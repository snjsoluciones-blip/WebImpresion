"use client";

import type { ReactNode } from "react";
import Section from "./ui/Section";
import SectionHeading from "./ui/SectionHeading";
import Surface from "./ui/Surface";
import Button from "./ui/Button";
import Reveal from "./ui/Reveal";
import Stagger from "./ui/Stagger";
import { useQuote } from "./ui/quote-context";
import { useReducedMotionSafe } from "./ui/useReducedMotionSafe";

/* ------------------------------------------------------------------------ */
/* Iconos: trazo fino sobre grilla de 48×48.                                 */
/* ------------------------------------------------------------------------ */

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
      <path vectorEffect="non-scaling-stroke" d="M19 6h10v7H19z" />
      <path vectorEffect="non-scaling-stroke" d="M19 13l3 5h4l3-5" />
      <path vectorEffect="non-scaling-stroke" d="M24 18v3" />
      <path vectorEffect="non-scaling-stroke" d="M11 21h13v4H11z" />
      <path vectorEffect="non-scaling-stroke" d="M11 27h26v4H11z" />
      <path vectorEffect="non-scaling-stroke" d="M11 33h26v4H11z" />
      <path vectorEffect="non-scaling-stroke" strokeOpacity={0.5} d="M7 41h34" />
    </svg>
  );
}

/** Cubo en perspectiva con arista oculta punteada: la pieza modelada. */
function CubeIcon() {
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
      <path vectorEffect="non-scaling-stroke" d="M24 6l15 8.5v17L24 40 9 31.5v-17z" />
      <path vectorEffect="non-scaling-stroke" d="M9 14.5L24 23l15-8.5M24 23v17" />
      <path vectorEffect="non-scaling-stroke" strokeOpacity={0.5} strokeDasharray="2 2" d="M24 6v17" />
    </svg>
  );
}

/** Cubo de vidrio que gira solo (CSS 3D): decoración de la tarjeta de modelado. */
function SpinCube() {
  return (
    <div aria-hidden="true" className="snj-cube-wrap pointer-events-none absolute right-7 top-7 hidden lg:block">
      <div className="snj-cube">
        {["f", "b", "r", "l", "t", "u"].map((face) => (
          <span key={face} className={`snj-cube__face snj-cube__face--${face}`} />
        ))}
      </div>
    </div>
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

function IconTile({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-[color:var(--tx-4)] transition-colors duration-[240ms] group-hover:text-[color:var(--tx-1)]"
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
/* Datos. `value` coincide EXACTAMENTE con SERVICE_VALUES del formulario.    */
/* ------------------------------------------------------------------------ */

type Service = {
  slug: string;
  value: "Solo impresión" | "Modelado + impresión";
  title: string;
  description: string;
  formats?: readonly string[];
  cta: string;
  icon: ReactNode;
};

const services: readonly Service[] = [
  {
    slug: "solo-impresion",
    value: "Solo impresión",
    title: "Solo impresión",
    description: "¿Ya tenés el archivo 3D? Lo imprimimos.",
    formats: ["STL", "3MF"],
    cta: "Quiero imprimir",
    icon: <LayersIcon />,
  },
  {
    slug: "modelado-impresion",
    value: "Modelado + impresión",
    title: "Modelado + impresión",
    description: "¿Tenés una idea, un boceto o una pieza rota? La modelamos y la imprimimos.",
    cta: "Quiero que la modelen",
    icon: <CubeIcon />,
  },
];

/* ------------------------------------------------------------------------ */
/* Tarjeta                                                                   */
/* ------------------------------------------------------------------------ */

function ServiceCard({ service }: { service: Service }) {
  const reduced = useReducedMotionSafe();
  const { setPreset } = useQuote();
  const titleId = `servicio-${service.slug}-title`;

  // Pre-selecciona el servicio en el formulario y baja a #contacto. El href="#contacto"
  // queda como fallback sin JS.
  const handleSelect = () => {
    setPreset({ servicio: service.value });
    document
      .getElementById("contacto")
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <Surface as="article" spotlight padding="lg" className="group h-full w-full">
      {service.value === "Modelado + impresión" && <SpinCube />}
      <div className="flex h-full flex-col justify-between gap-10">
        <div className="flex flex-col gap-4">
          <IconTile>{service.icon}</IconTile>
          <h3 id={titleId} className="t-h3 text-balance text-white">
            {service.title}
          </h3>
          <p className="t-body text-pretty" style={{ color: "var(--tx-2)" }}>
            {service.description}
          </p>
          {service.formats && (
            <ul className="m-0 flex list-none gap-2 p-0" aria-label="Formatos de archivo aceptados">
              {service.formats.map((f) => (
                <li
                  key={f}
                  className="rounded-full border px-3 py-1 text-xs font-medium"
                  style={{ borderColor: "var(--line-2)", color: "var(--tx-2)" }}
                >
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button
          variant="primary"
          size="md"
          href="#contacto"
          onClick={handleSelect}
          icon={<ArrowIcon />}
          aria-describedby={titleId}
          className="self-start"
        >
          {service.cta}
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
        lead="Imprimimos tu archivo o lo modelamos desde cero."
      />

      <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {services.map((service) => (
          <Reveal key={service.slug} className="flex">
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </Stagger>
    </Section>
  );
}
