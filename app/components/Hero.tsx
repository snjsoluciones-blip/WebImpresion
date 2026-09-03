"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Button,
  ChromeText,
  Hairline,
  LayerLines,
  LayerText,
  MagneticButton,
  MonoLabel,
  Reveal,
  SpecTable,
  Stagger,
  Tag,
  useReducedMotionSafe,
} from "./ui";

// Hero "ficha técnica" (spec §33-41): grilla editorial de 12 columnas alineada a la izquierda,
// h1 que se imprime capa por capa (LayerText) con la segunda línea en cromo con barrido
// (el ÚNICO sweep de toda la web), eyebrow mono con las coordenadas reales del JSON-LD,
// ficha lateral con 4 datos reales, video de fondo en grises pausado fuera de viewport
// (no se monta con reduced-motion ni con saveData) e indicador de scroll sin animate-bounce.

/* ---------- Datos reales (mismos que layout.tsx / resto de la web) ---------- */

// Coordenadas del JSON-LD de layout.tsx (latitude -34.4522, longitude -58.6469).
const COORDS = "−34.4522 / −58.6469";

const SPEC_ROWS: { k: string; v: string }[] = [
  { k: "Materiales", v: "PLA · PETG · ABS · TPU" },
  { k: "Equipo", v: "Bambu Lab P2S" },
  { k: "Servicios", v: "Modelado + Impresión" },
  { k: "Zona", v: "Pacheco · Tigre · Zona Norte · CABA" },
];

// Micro-pruebas: solo hechos ya publicados, ninguna promesa de plazo.
const PROOFS = ["Respondemos por WhatsApp", "Impresoras Bambu Lab P2S", "PLA · PETG · ABS · TPU"];

/* ---------- navigator.connection.saveData, SSR-safe y sin setState en efectos ---------- */

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };
const subscribeNoop = () => () => {};
const getSaveData = () => Boolean((navigator as NavigatorWithConnection).connection?.saveData);
const getSaveDataServer = () => false;

/* ---------- Piezas locales ---------- */

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

/**
 * Video de fondo (spec §39). Sin `autoPlay`: arranca por IntersectionObserver cuando la
 * sección está en viewport y se pausa al salir (hoy seguía decodificando en toda la página).
 * Entra con fade a .55 recién cuando hay frame, así nunca "aparece" de golpe sobre el negro.
 */
function HeroVideo({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = ref.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    // React fija `muted` como propiedad; lo reafirmamos para que play() sin gesto sea válido.
    video.muted = true;
    const play = () => {
      const p = video.play();
      if (p !== undefined) p.catch(() => {});
    };

    if (typeof IntersectionObserver === "undefined") {
      play();
      return () => video.pause();
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else video.pause();
      },
      { threshold: 0.05 }
    );
    io.observe(section);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, [sectionRef]);

  return (
    <video
      ref={ref}
      loop
      muted
      playsInline
      preload="metadata"
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden="true"
      tabIndex={-1}
      onLoadedData={() => setReady(true)}
      onPlaying={() => setReady(true)}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
      style={{
        opacity: ready ? 0.55 : 0,
        filter: "grayscale(1) contrast(1.08)",
        transition: "opacity var(--dur-5) var(--ease-out-expo)",
        background: "#0a0a0a",
      }}
    >
      <source src="/videos/hero-bg.mp4" type="video/mp4" />
      Tu navegador no soporta videos de fondo.
    </video>
  );
}

/**
 * Indicador de scroll (spec §41): línea vertical de 1px × 56px en el gutter izquierdo con un
 * segmento blanco de 14px que la recorre (snj-scroll-cue, 2.4s) y el rótulo EXPLORAR en vertical.
 * Se desvanece con el scroll (40→120px) sin re-render: opacity es un MotionValue.
 * Oculto bajo lg (colisionaría con el texto), con max-height:700px y con reduced-motion.
 */
function ScrollCue() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [40, 120], [1, 0]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity, left: "var(--gutter)" }}
      className="pointer-events-none absolute bottom-8 z-20 hidden flex-col items-center gap-3 lg:flex motion-reduce:hidden! [@media(max-height:700px)]:hidden!"
    >
      <span
        className="font-mono-tech text-[10px] uppercase tracking-[0.3em]"
        style={{ writingMode: "vertical-rl", color: "var(--tx-5)" }}
      >
        Explorar
      </span>
      <span className="relative block h-14 w-px overflow-hidden" style={{ background: "var(--line-2)" }}>
        <span className="snj-scroll-cue absolute left-0 top-0 block h-3.5 w-px bg-white" />
      </span>
    </motion.div>
  );
}

/* ---------- Hero ---------- */

export default function Hero() {
  const reduced = useReducedMotionSafe();
  const saveData = useSyncExternalStore(subscribeNoop, getSaveData, getSaveDataServer);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Con reduced-motion o saveData el <video> no se monta en absoluto (spec §39).
  const showVideo = !reduced && !saveData;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden"
      style={{ background: "var(--srf-1)" }}
    >
      {/* ---- Capas de fondo, de atrás hacia adelante (spec §40). Texto en z-20. ---- */}
      {showVideo && <HeroVideo sectionRef={sectionRef} />}

      {/* Capas FDM a pantalla completa */}
      <LayerLines spacing={7} opacity={0.04} className="z-[1]" />

      {/* Glow blanco 7% (tope 8%) de 720×420 centrado en 50% 42% */}
      <div
        aria-hidden="true"
        className="glow-soft pointer-events-none absolute left-1/2 top-[42%] z-[2] h-[420px] w-[720px] max-w-full -translate-x-1/2 -translate-y-1/2"
      />

      {/* Viñeta */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{ background: "radial-gradient(120% 90% at 50% 40%, transparent 35%, rgba(10,10,10,.85) 100%)" }}
      />

      {/* Cierre: el video muere exactamente donde arranca TrustStrip */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[4]"
        style={{
          background: "linear-gradient(180deg, rgba(10,10,10,.35) 0%, rgba(10,10,10,.72) 55%, #0a0a0a 100%)",
        }}
      />

      {/* Sombra superior para que el header flote legible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{ background: "linear-gradient(180deg, rgba(10,10,10,.9), transparent 22%)" }}
      />

      {/* ---- Contenido: grilla editorial de 12 columnas (spec §33) ---- */}
      <div className="shell relative z-20 pb-24 pt-[calc(var(--header-h)+2.5rem)] lg:pb-[180px] lg:pt-[calc(var(--header-h)+3rem)]">
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-6">
          {/* Eyebrow + titular · col 1-7 */}
          <div className="lg:col-span-7 lg:row-start-1 lg:self-end">
            <Reveal y={12} blur={false}>
              {/* Eyebrow con coordenadas reales + chip de zona (spec §35) */}
              <MonoLabel as="div" className="max-w-full flex-wrap">
                <span className="whitespace-nowrap">
                  General Pacheco
                  <span className="hidden min-[400px]:inline"> · Buenos Aires</span>
                </span>
                {/* Hairline de 40px (24px bajo 400px para que la fila entre en 375px) */}
                <div aria-hidden="true" className="w-6 shrink-0 min-[400px]:w-10">
                  <Hairline />
                </div>
                <span className="whitespace-nowrap tracking-[0.1em]">{COORDS}</span>
                <span className="hidden md:inline-flex">
                  <Tag>Zona Norte · CABA</Tag>
                </span>
              </MonoLabel>
            </Reveal>

            {/* h1 único de la web: línea 1 blanco puro, línea 2 cromo con sweep (spec §34) */}
            <h1 id="hero-title" className="t-display mt-6 text-white">
              <LayerText
                delay={0.1}
                lines={[
                  "Impresión 3D",
                  <ChromeText key="industrial" sweep>
                    Industrial
                  </ChromeText>,
                ]}
              />
            </h1>
          </div>

          {/* Ficha técnica lateral · col 9-12, alineada al baseline del h1 (spec §38) */}
          <aside
            aria-label="Ficha técnica del taller"
            className="hidden lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:block lg:self-end"
          >
            <Reveal delay={0.45} y={16}>
              <div className="flex items-center justify-between gap-4 pb-3">
                <MonoLabel rule>Ficha técnica</MonoLabel>
                <MonoLabel>SNJ Soluciones</MonoLabel>
              </div>
              <Hairline />
            </Reveal>
            {/* Una SpecTable por fila para poder escalonarlas 70 ms (400 ms después del h1) */}
            <Stagger wrap start={0.5} step={0.07}>
              {SPEC_ROWS.map((row) => (
                <SpecTable key={row.k} rows={[row]} />
              ))}
            </Stagger>
            <Hairline />
          </aside>

          {/* Subtítulo + CTAs + micro-pruebas · col 1-7 */}
          <div className="lg:col-span-7 lg:row-start-2">
            <Reveal delay={0.35}>
              <p className="t-lead" style={{ maxWidth: "42ch" }}>
                Fabricación de repuestos, matricería y series cortas en Pacheco, Buenos Aires. Alta precisión y
                resistencia para los desafíos de tu empresa.
              </p>
            </Reveal>

            {/* CTAs con jerarquía real (spec §36): apilados a ancho completo bajo sm, en fila desde sm */}
            <Reveal delay={0.45}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <MagneticButton strength={0.15} radius={40} className="flex w-full sm:inline-flex sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    href="#contacto"
                    icon={<ArrowIcon />}
                    className="w-full max-sm:h-[52px]! sm:w-auto"
                  >
                    Cotizar mi pieza
                  </Button>
                </MagneticButton>
                <MagneticButton strength={0.15} radius={40} className="flex w-full sm:inline-flex sm:w-auto">
                  <Button
                    variant="ghost"
                    size="lg"
                    href="#galeria"
                    icon={<ArrowIcon />}
                    className="w-full max-sm:h-[52px]! sm:w-auto"
                  >
                    Ver trabajos
                  </Button>
                </MagneticButton>
              </div>
            </Reveal>

            {/* Fila de micro-pruebas (spec §37) */}
            <Reveal delay={0.55} y={12}>
              <ul
                role="list"
                className="font-mono-tech mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] leading-none"
                style={{ color: "var(--tx-4)" }}
              >
                {PROOFS.map((proof, i) => (
                  <li key={proof} className="flex items-center gap-3">
                    {i > 0 && (
                      <span
                        aria-hidden="true"
                        className="inline-block h-[3px] w-[3px] shrink-0 rounded-full"
                        style={{ background: "var(--tx-5)" }}
                      />
                    )}
                    {proof}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Indicador de scroll (spec §41): no se monta con reduced-motion */}
      {!reduced && <ScrollCue />}
    </section>
  );
}
