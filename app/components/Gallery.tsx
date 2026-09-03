"use client";

import { useCallback, useState, type CSSProperties } from "react";
import Section from "./ui/Section";
import SectionHeading from "./ui/SectionHeading";
import MediaFrame from "./ui/MediaFrame";
import TiltCard from "./ui/TiltCard";
import SpecTable, { type SpecRow } from "./ui/SpecTable";
import Lightbox from "./ui/Lightbox";
import Reveal from "./ui/Reveal";
import Stagger from "./ui/Stagger";
import MonoLabel from "./ui/MonoLabel";
import Hairline from "./ui/Hairline";
import Button from "./ui/Button";
import { usePointerFine } from "./ui/usePointerFine";
import { useReducedMotionSafe } from "./ui/useReducedMotionSafe";

interface GalleryItem {
  src: string;
  video?: string;
  title: string;
  desc: string;
  category: string;
  /** Alt descriptivo: no repite el título. */
  alt: string;
  /** Rótulo mono que aparece en hover sobre la foto. Solo datos ya publicados. */
  label: string;
  /** Ficha técnica: tomada literalmente de la descripción publicada. */
  specs: SpecRow[];
  /** Segunda foto en paralelo (díptico), p. ej. otra unidad de la misma serie o el proceso de impresión. */
  pairSrc?: string;
  pairAlt?: string;
  pairLabel?: string;
}

const items: GalleryItem[] = [
  {
    src: "/images/trofeo-nankang.jpeg",
    title: "Trofeos Nankang",
    desc: "Serie de dieciocho trofeos para el campeonato, con base texturada, el logo del sponsor grabado en relieve y una placa distinta por categoría.",
    category: "Automovilismo",
    alt: "Serie de trofeos impresos en 3D con base texturada para el campeonato Nankang",
    label: "Serie de 18",
    specs: [
      { k: "Cantidad", v: "18" },
      { k: "Terminación", v: "Base texturada + logo en relieve" },
      { k: "Rubro", v: "Automovilismo" },
    ],
    pairSrc: "/images/trofeo-nankang-pole-minicas.jpg",
    pairAlt: "Otro trofeo de la misma serie Nankang, con la placa grabada para la categoría Mini Cas",
    pairLabel: "Otra unidad",
  },
  {
    src: "/images/soporte-aim-solo2.jpg",
    video: "/videos/soporte-aim-solo2.mp4",
    title: "Soportes de Telemetría a Medida",
    desc: "Soporte para el display AiM Solo 2 y soporte para mejorar el ángulo de visión del Lisso, impresos en PETG por su resistencia. Diseñados a medida para autos de competición.",
    category: "Automovilismo",
    alt: "Soporte impreso en PETG para el display AiM Solo 2 montado en un auto de competición",
    label: "PETG",
    specs: [
      { k: "Material", v: "PETG" },
      { k: "Piezas", v: "2 (AiM Solo 2 + Lisso)" },
      { k: "Diseño", v: "A medida" },
    ],
  },
  {
    src: "/images/llavero-mc-racing.jpg",
    title: "Llaveros Personalizados",
    desc: "Tanda de 500 llaveros con diseño y modelado 100% a medida del logo del cliente, terminados en menos de una semana.",
    category: "Personalizados",
    alt: "Tanda de llaveros personalizados con el logo de MC Racing",
    label: "500 unidades",
    specs: [
      { k: "Cantidad", v: "500" },
      { k: "Plazo", v: "Menos de una semana" },
      { k: "Modelado", v: "100% propio" },
    ],
  },
  {
    src: "/images/trofeo-piloto-dorado.jpg",
    title: "Trofeo Piloto en Acabado Dorado",
    desc: "Figura de piloto de pie con las manos en alto, en acabado metalizado dorado, sobre base circular negra.",
    category: "Personalizados",
    alt: "Trofeo de un piloto de pie con las manos en alto, en acabado metalizado dorado",
    label: "Acabado dorado",
    specs: [
      { k: "Acabado", v: "Metalizado dorado" },
      { k: "Base", v: "Circular, negra" },
      { k: "Rubro", v: "Personalizados" },
    ],
    pairSrc: "/images/trofeo-piloto-dorado-impresion.jpg",
    pairAlt: "El mismo trofeo recién terminado, todavía sobre la base de la impresora 3D",
    pairLabel: "Recién impreso",
  },
];

/* Capa extra de scanlines que se suma a la de MediaFrame (.04) en hover → ~.06 total. */
const HOVER_LINES: CSSProperties = {
  "--layer-sp": "7px",
  "--layer-o": "0.02",
  transitionTimingFunction: "var(--ease-mech)",
} as CSSProperties;

const HOVER_EASE: CSSProperties = { transitionTimingFunction: "var(--ease-mech)" };

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.25} aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type GalleryMediaProps = {
  src: string;
  video?: string;
  alt: string;
  category?: string;
  hoverLabel: string;
  hoverFx: boolean;
  onOpen: () => void;
  playLabel?: string;
  sizes: string;
};

/** Un marco de media (foto o video) con TiltCard + rótulo en hover. Reutilizado para el caso
 * simple y para el par de fotos en paralelo (díptico). */
function GalleryMedia({ src, video, alt, category, hoverLabel, hoverFx, onOpen, playLabel, sizes }: GalleryMediaProps) {
  return (
    <TiltCard max={5} glare>
      <div className="group/gal relative">
        <MediaFrame
          src={src}
          video={video}
          poster={video ? src : undefined}
          alt={alt}
          // MediaFrame necesita un ratio en el marco; la variable lo hace responsive:
          // 4/3 (1.3333) en mobile, 16/10 (1.6) desde lg. Fallback 16/10.
          ratio="var(--gal-ratio, 1.6)"
          className="[--gal-ratio:1.3333] lg:[--gal-ratio:1.6]"
          sizes={sizes}
          quality={80}
          category={category}
          badge={video ? "Video" : undefined}
          preload="none"
          playLabel={playLabel}
          onOpen={onOpen}
        />

        {hoverFx && (
          <>
            {/* Scanlines: suben de .04 a ~.06 */}
            <div
              aria-hidden="true"
              className="layer-lines layer-lines--nofade pointer-events-none absolute inset-0 rounded-[var(--r-lg)] opacity-0 transition-opacity duration-[500ms] group-hover/gal:opacity-100"
              style={HOVER_LINES}
            />
            {/* Borde: --line-1 → --line-3 */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[var(--r-lg)] border opacity-0 transition-opacity duration-[500ms] group-hover/gal:opacity-100"
              style={{ ...HOVER_EASE, borderColor: "var(--line-3)" }}
            />
            {/* Rótulo mono abajo a la izquierda (a la derecha del play si hay video) */}
            <span
              aria-hidden="true"
              className={`font-mono-tech pointer-events-none absolute bottom-4 flex h-10 translate-y-1 items-center text-[11px] uppercase tracking-[0.18em] opacity-0 transition-[opacity,translate,transform] duration-[500ms] group-hover/gal:translate-y-0 group-hover/gal:opacity-100 ${
                video ? "left-16" : "left-4"
              }`}
              style={{ ...HOVER_EASE, color: "var(--tx-2)" }}
            >
              {hoverLabel}
            </span>
          </>
        )}
      </div>
    </TiltCard>
  );
}

/**
 * Portfolio · 02. Cuatro casos reales en layout editorial de 12 columnas (media 7 / ficha 4,
 * alternando lados), sin riel central. Media via MediaFrame (video con preload none, poster,
 * play/pause por IntersectionObserver), ficha con SpecTable, TiltCard + rótulo en hover solo
 * con puntero fino, número de caso fuera de la foto y Lightbox con navegación. Un caso puede
 * traer una segunda foto en paralelo (díptico): otra unidad de la misma serie o el proceso.
 */
export default function Gallery() {
  const fine = usePointerFine();
  const reduced = useReducedMotionSafe();
  // Efectos de hover: no se degradan en touch / reduced-motion, directamente no se montan.
  const hoverFx = fine && !reduced;

  // `index`/`sub` sobreviven al cierre para que el contenido no cambie durante la animación de
  // salida. `sub` distingue la foto principal de la segunda foto en paralelo (si el caso la tiene).
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number; sub: "main" | "pair" }>({
    open: false,
    index: 0,
    sub: "main",
  });

  // Callbacks estables: Lightbox los tiene como deps de su efecto (foco + scroll lock).
  const openAt = useCallback((i: number, sub: "main" | "pair" = "main") => setLightbox({ open: true, index: i, sub }), []);
  const close = useCallback(() => setLightbox((s) => ({ ...s, open: false })), []);
  const prev = useCallback(
    () => setLightbox((s) => ({ ...s, index: (s.index - 1 + items.length) % items.length, sub: "main" })),
    []
  );
  const next = useCallback(
    () => setLightbox((s) => ({ ...s, index: (s.index + 1) % items.length, sub: "main" })),
    []
  );

  const currentItem = items[lightbox.index];
  const current =
    lightbox.sub === "pair" && currentItem.pairSrc
      ? { src: currentItem.pairSrc, video: undefined as string | undefined, alt: currentItem.pairAlt ?? currentItem.alt }
      : { src: currentItem.src, video: currentItem.video, alt: currentItem.alt };

  return (
    <Section id="galeria" tone="base" labelledBy="galeria-title">
      <SectionHeading
        index="02"
        eyebrow="Portfolio"
        titleId="galeria-title"
        title="Trabajos que ya salieron de la impresora"
        lead="Cuatro casos reales: automovilismo, telemetría y personalizados."
      />

      <ol role="list" className="m-0 flex list-none flex-col p-0" style={{ rowGap: "clamp(5rem, 3rem + 6vw, 9rem)" }}>
        {items.map((item, i) => {
          const flip = i % 2 === 1;
          const n = String(i + 1).padStart(2, "0");
          return (
            <li key={item.title} className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6">
              {/* Media: 7 columnas, alternando lado. Con pairSrc: dos fotos lado a lado (díptico). */}
              <div className={`lg:col-span-7 lg:row-start-1 ${flip ? "lg:col-start-6" : "lg:col-start-1"}`}>
                {item.pairSrc ? (
                  <div className="grid grid-cols-2 gap-3">
                    <GalleryMedia
                      src={item.src}
                      video={item.video}
                      alt={item.alt}
                      category={item.category}
                      hoverLabel={item.label}
                      hoverFx={hoverFx}
                      onOpen={() => openAt(i, "main")}
                      playLabel={item.video ? `Reproducir video de ${item.title}` : undefined}
                      sizes="(max-width: 1024px) 50vw, 29vw"
                    />
                    <GalleryMedia
                      src={item.pairSrc}
                      alt={item.pairAlt ?? item.alt}
                      hoverLabel={item.pairLabel ?? item.label}
                      hoverFx={hoverFx}
                      onOpen={() => openAt(i, "pair")}
                      sizes="(max-width: 1024px) 50vw, 29vw"
                    />
                  </div>
                ) : (
                  <GalleryMedia
                    src={item.src}
                    video={item.video}
                    alt={item.alt}
                    category={item.category}
                    hoverLabel={item.label}
                    hoverFx={hoverFx}
                    onOpen={() => openAt(i, "main")}
                    playLabel={item.video ? `Reproducir video de ${item.title}` : undefined}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                )}
              </div>

              {/* Ficha: 4 columnas, del lado opuesto */}
              <div className={`mt-5 lg:col-span-4 lg:row-start-1 lg:mt-0 ${flip ? "lg:col-start-1" : "lg:col-start-9"}`}>
                <Stagger wrap start={0.1} step={0.08}>
                  <div>
                    {/* Número de caso: fuera de la foto, detrás del título */}
                    <span
                      aria-hidden="true"
                      className="font-display block select-none font-bold leading-none tracking-[-0.04em]"
                      style={{
                        fontSize: "clamp(4rem, 3rem + 4vw, 7rem)",
                        color: "rgba(255,255,255,0.055)",
                        marginBottom: "-0.35em",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {n}
                    </span>
                    <div className="relative">
                      <MonoLabel rule className="mb-3">
                        Caso {n} · {item.category}
                      </MonoLabel>
                      <h3 className="t-h3 m-0 text-white">{item.title}</h3>
                    </div>
                  </div>

                  <p className="t-body m-0 mt-4 max-w-[46ch]">{item.desc}</p>

                  <div className="mt-6">
                    <Hairline />
                    <SpecTable rows={item.specs} dense className="mt-1" />
                  </div>
                </Stagger>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Cierre: la sección apunta al mismo lugar que todas */}
      <div style={{ marginTop: "clamp(4rem, 3rem + 4vw, 7rem)" }}>
        <Hairline />
        <Reveal>
          <div className="flex flex-col gap-5 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div>
              <MonoLabel rule as="p" className="m-0">
                ¿Tenés una pieza parecida?
              </MonoLabel>
              <p className="t-body m-0 mt-2 max-w-[52ch]">
                Contanos qué necesitás y te respondemos por WhatsApp. Si no tenés el archivo 3D, lo modelamos nosotros.
              </p>
            </div>
            <Button variant="ghost" size="sm" href="#contacto" icon={<ArrowIcon />}>
              Cotizar mi pieza
            </Button>
          </div>
        </Reveal>
      </div>

      <Lightbox
        open={lightbox.open}
        onClose={close}
        onPrev={prev}
        onNext={next}
        index={lightbox.index}
        total={items.length}
        src={current.src}
        video={current.video}
        alt={current.alt}
        title={currentItem.title}
        caption={`${currentItem.category} — ${currentItem.desc}`}
      />
    </Section>
  );
}
