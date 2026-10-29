"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Button,
  ChromeText,
  LayerLines,
  LayerText,
  MagneticButton,
  Reveal,
  useReducedMotionSafe,
} from "./ui";

// Hero "ficha técnica" (spec §33-41): grilla editorial de 12 columnas alineada a la izquierda,
// h1 que se imprime capa por capa (LayerText) con la segunda línea en cromo con barrido
// (el ÚNICO sweep de toda la web), eyebrow mono con las coordenadas reales del JSON-LD,
// ficha lateral con 4 datos reales, video de fondo en grises pausado fuera de viewport
// (no se monta con reduced-motion ni con saveData) e indicador de scroll sin animate-bounce.

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
  // Al bajar, el contenido sube más lento, se achica y se apaga: profundidad tipo Apple.
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 600], [0, reduced ? 0 : -90]);
  const contentOpacity = useTransform(scrollY, [0, 520], [1, reduced ? 1 : 0.1]);
  const contentScale = useTransform(scrollY, [0, 600], [1, reduced ? 1 : 0.94]);

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
        style={{ background: "radial-gradient(120% 90% at 50% 40%, transparent 35%, rgba(6,7,11,.8) 100%)" }}
      />

      {/* Cierre: el video muere exactamente donde arranca TrustStrip */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[4]"
        style={{
          background: "linear-gradient(180deg, rgba(6,7,11,.3) 0%, rgba(6,7,11,.62) 55%, rgba(6,7,11,0) 100%)",
        }}
      />

      {/* Sombra superior para que el header flote legible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{ background: "linear-gradient(180deg, rgba(6,7,11,.8), transparent 22%)" }}
      />

      {/* ---- Contenido: grilla editorial de 12 columnas (spec §33) ---- */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
        className="shell relative z-20 pb-24 pt-[calc(var(--header-h)+2.5rem)] lg:pb-[180px] lg:pt-[calc(var(--header-h)+3rem)]">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-y-8 text-center">
          {/* Eyebrow + titular · col 1-7 */}
          <div>
            <Reveal y={12} blur={false}>
              <span
                className="snj-float glass-edge relative inline-flex items-center rounded-full px-4 py-2 text-[13px]"
                style={{
                  color: "var(--tx-2)",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))",
                  border: "1px solid var(--line-2)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                }}
              >
                General Pacheco · Buenos Aires
              </span>
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

          {/* Subtítulo + CTAs + micro-pruebas · col 1-7 */}
          <div className="flex flex-col items-center">
            <Reveal delay={0.35}>
              <p className="t-lead mx-auto" style={{ maxWidth: "34ch" }}>
                Repuestos, matricería y series cortas.
                Alta precisión, desde Pacheco.
              </p>
            </Reveal>

            {/* CTAs con jerarquía real (spec §36): apilados a ancho completo bajo sm, en fila desde sm */}
            <Reveal delay={0.45}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
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

          </div>
        </div>
      </motion.div>

      {/* Indicador de scroll (spec §41): no se monta con reduced-motion */}
      {!reduced && <ScrollCue />}
    </section>
  );
}
