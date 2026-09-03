"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import {
  Button,
  DUR,
  EASE,
  Hairline,
  MonoLabel,
  Reveal,
  Section,
  SectionHeading,
  WhatsAppIcon,
  staggerDelay,
  useReducedMotionSafe,
} from "./ui";

/**
 * Los 4 pasos. `title` y `desc` se conservan palabra por palabra.
 * `deliverable` es la línea mono "qué recibís", derivada del propio contenido (sin plazos ni precios).
 */
const steps = [
  {
    number: "01",
    title: "Describís tu pieza",
    desc: "Enviás descripción, medidas, material y fotos de referencia",
    deliverable: "Formulario o WhatsApp",
  },
  {
    number: "02",
    title: "Modelamos en 3D",
    desc: "Nuestro equipo crea el modelo digital de tu pieza",
    deliverable: "Modelado 3D propio",
  },
  {
    number: "03",
    title: "Confirmás el diseño",
    desc: "Revisás el modelo antes de imprimir",
    deliverable: "Vista previa antes de imprimir",
  },
  {
    number: "04",
    title: "Imprimimos y enviamos",
    desc: "Imprimimos con alta calidad y te lo enviamos",
    deliverable: "Pieza terminada",
  },
] as const;

// Mismo número y mismo mensaje que el botón flotante de WhatsApp y la MobileActionBar.
const WHATSAPP_URL = `https://wa.me/541161256413?text=${encodeURIComponent(
  "¡Hola! Vengo de la web de SNJ Soluciones y quiero hacer una consulta."
)}`;

/** Color de la línea de progreso y del borde de los nodos ya superados. */
const LIT = "rgba(255,255,255,0.45)";

/** Umbrales por defecto (nodos equidistantes) hasta que se mide el DOM real. */
const DEFAULT_THRESHOLDS: number[] = steps.map((_, i) => i / (steps.length - 1));

/**
 * Posición de `el` relativa a `root` sumando la cadena de offsetParent.
 * A diferencia de getBoundingClientRect, no la afectan los transforms del Reveal.
 */
function offsetWithin(el: HTMLElement, root: HTMLElement): { x: number; y: number } {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/** Cuántos nodos quedan "encendidos" para un progreso dado (el primero apenas arranca, el último casi al final). */
function litCountFor(progress: number, thresholds: number[]): number {
  let n = 0;
  for (let i = 0; i < thresholds.length; i++) {
    const at = i === 0 ? 0.02 : Math.min(thresholds[i] - 0.015, 0.975);
    if (progress >= at) n = i + 1;
  }
  return n;
}

/*
 * Geometría de las líneas. Las variables --tl-* las escribe el efecto de medición sobre el track
 * (centro real del primer y último nodo). Los fallbacks cubren SSR / sin JS, cada uno para su
 * breakpoint: nodo de 44px en mobile (centro 22px) y de 56px en lg (centro 28px; el 4.º nodo de la
 * grilla de 4 columnas con gap 24px queda centrado en 75% + 46px).
 */
const vLine: CSSProperties = {
  left: "calc(var(--tl-x0, 22px) - 0.5px)",
  top: "var(--tl-y0, 22px)",
  bottom: "calc(100% - var(--tl-y1, calc(100% - 22px)))",
};
const hLine: CSSProperties = {
  left: "var(--tl-x0, 28px)",
  right: "calc(100% - var(--tl-x1, calc(75% + 46px)))",
  top: "calc(var(--tl-y0, 28px) - 0.5px)",
};

/**
 * Proceso en 4 pasos. Línea de progreso ligada al scroll con useScroll (sin pin, sin ScrollTrigger,
 * sin altura artificial): guía estática --line-1 + relleno scaleX/scaleY. En <lg es una timeline
 * vertical continua (un único elemento); desde lg, cuatro columnas con la línea horizontal.
 * Los nodos se "encienden" al ser superados por el progreso. Reduced-motion: línea llena, nodos
 * encendidos, sin pulso ni animación ligada al scroll.
 */
export default function HowItWorks() {
  const reduced = useReducedMotionSafe();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const thresholds = useRef<number[]>(DEFAULT_THRESHOLDS);
  const [lit, setLit] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 70%", "end 60%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduced) return;
    setLit(litCountFor(v, thresholds.current));
  });

  // Mide el centro real de cada nodo (relativo al track) para que la línea vaya exactamente del
  // primero al último — sin overshoot bajo el último paso en mobile — y para que los umbrales de
  // encendido coincidan con la posición real de cada nodo aunque los textos midan distinto.
  useLayoutEffect(() => {
    const root = trackRef.current;
    if (!root) return;

    const measure = () => {
      const nodes = nodeRefs.current.filter((n): n is HTMLDivElement => n !== null);
      if (nodes.length < 2) return;
      const pts = nodes.map((n) => {
        const o = offsetWithin(n, root);
        return { x: o.x + n.offsetWidth / 2, y: o.y + n.offsetHeight / 2 };
      });
      const first = pts[0];
      const last = pts[pts.length - 1];
      const horizontal = Math.abs(last.y - first.y) < 1;

      root.style.setProperty("--tl-x0", `${first.x}px`);
      root.style.setProperty("--tl-x1", `${last.x}px`);
      root.style.setProperty("--tl-y0", `${first.y}px`);
      root.style.setProperty("--tl-y1", `${last.y}px`);

      const origin = horizontal ? first.x : first.y;
      const len = (horizontal ? last.x : last.y) - origin;
      thresholds.current = pts.map((p) => (len > 0 ? ((horizontal ? p.x : p.y) - origin) / len : 0));
    };

    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  const litCount = reduced ? steps.length : lit;

  return (
    <Section id="como-funciona" tone="raised" labelledBy="proceso-title">
      <SectionHeading
        index="05"
        eyebrow="Proceso"
        titleId="proceso-title"
        title="De la idea a la pieza, en cuatro pasos"
      />

      <div ref={trackRef} className="relative">
        {/* Timeline vertical (<lg): un único elemento guía + relleno scaleY */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute w-px lg:hidden"
          style={{ ...vLine, background: "var(--line-1)" }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute w-px lg:hidden"
          style={{
            ...vLine,
            background: LIT,
            scaleY: reduced ? 1 : scrollYProgress,
            transformOrigin: "50% 0%",
          }}
        />

        {/* Línea horizontal (lg+): guía + relleno scaleX */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute hidden h-px lg:block"
          style={{ ...hLine, background: "var(--line-1)" }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute hidden h-px lg:block"
          style={{
            ...hLine,
            background: LIT,
            scaleX: reduced ? 1 : scrollYProgress,
            transformOrigin: "0% 50%",
          }}
        />

        {/* role="list" explícito: Safari quita la semántica de lista con list-style:none */}
        <ol role="list" className="flex list-none flex-col gap-8 lg:grid lg:grid-cols-4 lg:gap-6">
          {steps.map((step, i) => {
            const isLit = i < litCount;
            return (
              <Reveal
                key={step.number}
                as="li"
                delay={staggerDelay(i)}
                className="relative flex gap-5 lg:flex-col lg:gap-6"
              >
                {/* Nodo: 44px en mobile, 56px en lg, radio 12px, fondo --srf-4, borde hairline */}
                <div
                  ref={(el) => {
                    nodeRefs.current[i] = el;
                  }}
                  className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl lg:h-14 lg:w-14"
                  style={{
                    background: "var(--srf-4)",
                    border: "1px solid",
                    borderColor: isLit ? LIT : "var(--line-2)",
                    boxShadow: isLit ? "0 0 22px rgba(255,255,255,0.06)" : "0 0 0 rgba(255,255,255,0)",
                    transition:
                      "border-color var(--dur-2) var(--ease-mech), box-shadow var(--dur-3) var(--ease-mech)",
                  }}
                >
                  <span
                    className="font-mono-tech text-xs leading-none"
                    style={{
                      color: isLit ? "#ffffff" : "var(--tx-4)",
                      transition: "color var(--dur-2) var(--ease-mech)",
                    }}
                  >
                    {step.number}
                  </span>
                  {/* Punto de 4px con pulso único al encenderse (scale 0→1.4→1, 420 ms) */}
                  <motion.span
                    aria-hidden="true"
                    className="absolute right-2 top-2 h-1 w-1 rounded-full bg-white"
                    initial={false}
                    animate={
                      reduced
                        ? { scale: 1, opacity: 1 }
                        : isLit
                          ? { scale: [0, 1.4, 1], opacity: 1 }
                          : { scale: 0, opacity: 0 }
                    }
                    transition={{ duration: DUR.d3, ease: EASE.expo }}
                  />
                </div>

                {/* Texto: alineado a la izquierda también en desktop */}
                <div className="min-w-0 pt-2.5 lg:pt-0">
                  <h3 className="font-display text-base font-medium tracking-[-0.01em] text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 max-w-[30ch] text-sm leading-relaxed" style={{ color: "var(--tx-3)" }}>
                    {step.desc}
                  </p>
                  {/* text-sm: el 30ch se resuelve a 14px, igual que la descripción de arriba */}
                  <Hairline className="mt-4 max-w-[30ch] text-sm" />
                  <p
                    className="font-mono-tech mt-3 text-[11px] uppercase leading-none tracking-[0.18em]"
                    style={{
                      color: isLit ? "var(--tx-4)" : "var(--tx-5)",
                      transition: "color var(--dur-2) var(--ease-mech)",
                    }}
                  >
                    <span aria-hidden="true">{step.number} → </span>
                    {step.deliverable}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>

      {/* Cierre del proceso: card horizontal con CTA de WhatsApp */}
      <div style={{ marginTop: "clamp(3rem, 2rem + 3vw, 5rem)" }}>
        <Reveal delay={0.1}>
          <div
            className="relative overflow-hidden rounded-[var(--r-md)]"
            style={{ background: "var(--srf-4)", border: "1px solid var(--line-1)" }}
          >
            <Hairline className="absolute left-0 right-0 top-0" />
            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between md:px-8">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--r-sm)]"
                  style={{
                    background: "var(--srf-3)",
                    border: "1px solid var(--line-2)",
                    color: "var(--tx-2)",
                  }}
                >
                  <WhatsAppIcon className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <MonoLabel as="p">Durante todo el proceso</MonoLabel>
                  <p
                    className="mt-2 max-w-[48ch] text-[15px] leading-relaxed"
                    style={{ color: "var(--tx-2)" }}
                  >
                    Todo el ida y vuelta se hace por WhatsApp — nos escribís, te respondemos.
                  </p>
                </div>
              </div>
              <Button
                variant="whatsapp"
                size="sm"
                external
                href={WHATSAPP_URL}
                icon={<WhatsAppIcon className="h-4 w-4" />}
                iconPosition="left"
                className="w-full shrink-0 sm:w-auto"
              >
                Abrir WhatsApp
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
