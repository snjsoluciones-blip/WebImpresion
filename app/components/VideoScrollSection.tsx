"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Hairline,
  LayerLines,
  MonoLabel,
  Reveal,
  STAGGER,
  useMediaQuery,
  useReducedMotionSafe,
} from "./ui";

/* --------------------------------------------------------------------------
   Contenido real. Los tres titulares se conservan palabra por palabra.
   -------------------------------------------------------------------------- */
const CHAPTERS = [
  { kicker: "01 / Capa a capa", text: "Precisión en cada capa" },
  { kicker: "02 / Bambu Lab P2S", text: "Tecnología de vanguardia" },
  { kicker: "03 / De la idea a la pieza", text: "Tu visión, hecha realidad" },
] as const;

type TextRange = readonly [fadeInStart: number, peakStart: number, peakEnd: number, fadeOutEnd: number];

// Rangos de opacidad por capítulo. Están afinados: no cambiar.
const TEXT_RANGES: readonly TextRange[] = [
  [0, 0.08, 0.3, 0.42],
  [0.42, 0.52, 0.72, 0.82],
  [0.82, 0.9, 1.0, 1.0],
];

const TOTAL_LAYERS = 300;
/** Umbral de seek (s): reasignar currentTime en cada pixel de scroll trababa el scroll. */
const SEEK_THRESHOLD = 0.033;
/** 0.35 se sentía nervioso. */
const SCRUB = 0.6;
/** Distancia a la que se sube el preload del video a "auto". */
const NEAR_ROOT_MARGIN = "200% 0px";
/** Si al acercarse la sección el video sigue sin metadata pasado este tiempo, se baja al fallback estático. */
const METADATA_TIMEOUT_MS = 10000;

const getTextOpacity = (progress: number, range: TextRange) => {
  const [fi, ps, pe, fo] = range;
  if (progress < fi || progress > fo) return 0;
  if (progress < ps) return (progress - fi) / (ps - fi);
  if (progress <= pe) return 1;
  if (progress <= fo) return 1 - (progress - pe) / (fo - pe);
  return 0;
};

const getTextY = (progress: number, range: TextRange) => {
  const [fi, ps] = range;
  if (progress < fi) return 16;
  if (progress < ps) {
    const t = (progress - fi) / (ps - fi);
    return 16 * (1 - t);
  }
  return 0;
};

const layerLabel = (progress: number) =>
  "CAPA " + String(Math.round(progress * TOTAL_LAYERS)).padStart(3, "0") + " / " + TOTAL_LAYERS;

// Misma fórmula que staggerDelay() de ui/motion.ts (escalera "líneas", tope de 6).
// Local porque el parámetro `step` de staggerDelay está tipado como el literal 0.07.
const chapterDelay = (i: number) => Math.min(i, STAGGER.max) * STAGGER.line;

/* --------------------------------------------------------------------------
   Estilos compartidos entre el modo scrub y el fallback.
   -------------------------------------------------------------------------- */
const VIDEO_STYLE: CSSProperties = { filter: "grayscale(1) contrast(1.1)" };

// Texto alineado a la izquierda → el lado izquierdo es el más oscuro; la viñeta radial
// garantiza contraste en cualquier frame del video.
const OVERLAY_STYLE: CSSProperties = {
  background: [
    "radial-gradient(120% 90% at 50% 50%, transparent 45%, rgba(8,8,8,0.72) 100%)",
    "linear-gradient(90deg, rgba(8,8,8,0.85) 0%, rgba(8,8,8,0.42) 55%, rgba(8,8,8,0.7) 100%)",
  ].join(", "),
};

const FADE_TOP_STYLE: CSSProperties = { background: "linear-gradient(180deg, var(--srf-1), transparent)" };
const FADE_BOTTOM_STYLE: CSSProperties = { background: "linear-gradient(0deg, var(--srf-1), transparent)" };

const KICKER_CLASS = "font-mono-tech text-[11px] uppercase tracking-[0.18em] leading-none";

/* --------------------------------------------------------------------------
   Modo scrub (puntero fino, sin reduced-motion): el único pin del sitio.
   -------------------------------------------------------------------------- */
function ScrubChapters({ onFail }: { onFail: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    let cancelled = false;
    let trigger: ScrollTrigger | null = null;
    let lastSeek = -1;
    let watchdog: number | null = null;

    const textEls = [text1Ref.current, text2Ref.current, text3Ref.current];
    const counter = counterRef.current;
    const bar = barRef.current;

    const hasDuration = () => Number.isFinite(video.duration) && video.duration > 0;

    // Seek solo con duración real (evita el salto por NaN) y solo si el salto es perceptible.
    const seekTo = (p: number, force = false) => {
      if (!hasDuration() || video.readyState < 2) return;
      const target = p * video.duration;
      if (force || Math.abs(target - lastSeek) > SEEK_THRESHOLD) {
        video.currentTime = target;
        lastSeek = target;
      }
    };

    // Capítulos, contador y barra: escritura directa por ref, sin setState por frame.
    const paint = (p: number) => {
      textEls.forEach((el, i) => {
        if (!el) return;
        el.style.opacity = String(getTextOpacity(p, TEXT_RANGES[i]));
        el.style.transform = `translateY(${getTextY(p, TEXT_RANGES[i])}px)`;
      });
      if (counter) counter.textContent = layerLabel(p);
      if (bar) bar.style.transform = `scaleX(${p})`;
    };

    // El trigger arranca ya: el texto y el contador no dependen del video.
    // El video se suma apenas tiene datos (y se sincroniza al progreso actual).
    trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: SCRUB,
      onUpdate: (self) => {
        seekTo(self.progress);
        paint(self.progress);
      },
    });

    const clearWatchdog = () => {
      if (watchdog !== null) {
        window.clearTimeout(watchdog);
        watchdog = null;
      }
    };

    // Si el video nunca resuelve, bajamos al fallback estático — pero solo si el usuario todavía
    // no llegó a la sección: colapsar 240vh bajo sus pies (o por encima, si ya la pasó) pegaría
    // un salto de página. Si ya la alcanzó, el scrub de texto sigue sobre el poster.
    const fail = () => {
      if (cancelled) return;
      clearWatchdog();
      if (!trigger || trigger.progress === 0) onFail();
    };

    const onLoadedData = () => {
      if (cancelled) return;
      clearWatchdog();
      if (trigger) seekTo(trigger.progress, true);
    };
    const onLoadedMetadata = () => {
      if (!cancelled) clearWatchdog();
    };

    video.addEventListener("error", fail);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("loadeddata", onLoadedData);
    if (video.readyState >= 2) onLoadedData();

    // Upgrade diferido de preload: metadata → auto solo cuando la sección se acerca.
    const near = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        near.disconnect();
        if (cancelled) return;
        video.preload = "auto";
        if (video.readyState < 1 && watchdog === null) {
          watchdog = window.setTimeout(() => {
            watchdog = null;
            if (video.readyState < 1) fail();
          }, METADATA_TIMEOUT_MS);
        }
      },
      { rootMargin: NEAR_ROOT_MARGIN }
    );
    near.observe(section);

    // Space Grotesk entra con display:swap: si las secciones de arriba cambian de alto al llegar
    // la fuente, el pin recalcula sus marcas de inicio/fin.
    if ("fonts" in document) {
      void document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    }

    return () => {
      cancelled = true;
      clearWatchdog();
      near.disconnect();
      video.removeEventListener("error", fail);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("loadeddata", onLoadedData);
      trigger?.kill();
      trigger = null;
    };
  }, [onFail]);

  const refs = [text1Ref, text2Ref, text3Ref];

  return (
    <section
      ref={sectionRef}
      id="precision"
      aria-label="Precisión en cada capa"
      className="relative h-[240vh]"
      style={{ background: "var(--srf-1)" }}
    >
      {/* Viewport fijado */}
      <div className="sticky top-0 h-svh overflow-hidden" style={{ background: "var(--srf-1)" }}>
        <video
          ref={videoRef}
          src="/videos/gear.mp4"
          poster="/images/gear.png"
          className="absolute inset-0 h-full w-full object-cover"
          style={VIDEO_STYLE}
          muted
          playsInline
          preload="metadata"
          disablePictureInPicture
          aria-hidden="true"
        />

        <div aria-hidden="true" className="absolute inset-0" style={OVERLAY_STYLE} />
        <LayerLines opacity={0.035} />

        {/* Capítulos: apilados en la misma celda de grilla, centrados verticalmente */}
        <div className="absolute inset-0 flex items-center">
          <div className="shell">
            <div className="grid">
              {CHAPTERS.map((chapter, i) => (
                <div
                  key={chapter.text}
                  ref={refs[i]}
                  className="col-start-1 row-start-1 self-center will-change-[transform,opacity]"
                  style={{ opacity: 0, transform: "translateY(16px)" }}
                >
                  <MonoLabel rule>{chapter.kicker}</MonoLabel>
                  <p className="t-h2 mt-5 max-w-[13ch] text-white md:mt-6">{chapter.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Indicador de capa + barra de progreso (escritos por ref) */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0">
          <div className="shell flex items-end justify-between gap-4 pb-6 md:pb-8">
            <span ref={counterRef} className={KICKER_CLASS} style={{ color: "var(--tx-5)" }}>
              {layerLabel(0)}
            </span>
            <span className={`${KICKER_CLASS} hidden sm:inline`} style={{ color: "var(--tx-5)" }}>
              FDM · Bambu Lab P2S
            </span>
          </div>
          <div className="h-px w-full" style={{ background: "var(--line-2)" }}>
            <div
              ref={barRef}
              className="h-full w-full origin-left bg-white will-change-transform"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>

      {/* Degradados de 120px: sin corte duro contra Services y Gallery */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[120px]" style={FADE_TOP_STYLE} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[120px]"
        style={FADE_BOTTOM_STYLE}
      />
    </section>
  );
}

/* --------------------------------------------------------------------------
   Fallback sin scrub: touch, reduced-motion o video que nunca resolvió.
   Sección de altura normal, sin sticky, con los tres capítulos apilados.
   -------------------------------------------------------------------------- */
function StaticChapters({ loop }: { loop: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // En touch (sin reduced-motion) el video hace loop, pero solo mientras está a la vista.
  useEffect(() => {
    const video = videoRef.current;
    if (!loop || !video) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(video);

    return () => {
      io.disconnect();
      video.pause();
    };
  }, [loop]);

  return (
    <section
      id="precision"
      aria-label="Precisión en cada capa"
      className="relative overflow-hidden"
      style={{ paddingBlock: "var(--pad-y)", background: "var(--srf-1)" }}
    >
      <div aria-hidden="true" className="absolute inset-0">
        <video
          ref={videoRef}
          src="/videos/gear.mp4"
          poster="/images/gear.png"
          className="absolute inset-0 h-full w-full object-cover"
          style={VIDEO_STYLE}
          muted
          playsInline
          loop={loop}
          preload={loop ? "metadata" : "none"}
          disablePictureInPicture
        />
        <div className="absolute inset-0" style={OVERLAY_STYLE} />
        <LayerLines opacity={0.035} />
        <div className="absolute inset-x-0 top-0 h-[120px]" style={FADE_TOP_STYLE} />
        <div className="absolute inset-x-0 bottom-0 h-[120px]" style={FADE_BOTTOM_STYLE} />
      </div>

      <div className="shell relative">
        <ol className="flex flex-col">
          {CHAPTERS.map((chapter, i) => (
            <li key={chapter.text}>
              {i > 0 && <Hairline animate className="my-10 md:my-14" />}
              <Reveal delay={chapterDelay(i)}>
                <MonoLabel rule>{chapter.kicker}</MonoLabel>
                <p className="t-h2 mt-5 max-w-[13ch] text-white md:mt-6">{chapter.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   Sección #precision. Decide el modo una sola vez por cambio de media query;
   los hooks de matchMedia devuelven false en SSR y se corrigen al hidratar.
   -------------------------------------------------------------------------- */
export default function VideoScrollSection() {
  const reduced = useReducedMotionSafe();
  const coarse = useMediaQuery("(pointer: coarse)", false);
  const [videoFailed, setVideoFailed] = useState(false);
  const onFail = useCallback(() => setVideoFailed(true), []);

  if (reduced || coarse || videoFailed) {
    return <StaticChapters loop={coarse && !reduced && !videoFailed} />;
  }
  return <ScrubChapters onFail={onFail} />;
}
