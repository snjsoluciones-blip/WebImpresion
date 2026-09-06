"use client";

import { useCallback, useState, type CSSProperties } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Section from "./ui/Section";
import SectionHeading from "./ui/SectionHeading";
import MediaFrame from "./ui/MediaFrame";
import TiltCard from "./ui/TiltCard";
import SpecTable, { type SpecRow } from "./ui/SpecTable";
import Lightbox from "./ui/Lightbox";
import Stagger from "./ui/Stagger";
import MonoLabel from "./ui/MonoLabel";
import Hairline from "./ui/Hairline";
import { EASE } from "./ui/motion";
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
  /** Relación de aspecto fija (ancho/alto) para fotos verticales u otras que no sean 16:10 —
   *  sin esto, MediaFrame las recorta fuerte con object-cover. Si no se pasa, usa el default. */
  ratio?: string;
  pairRatio?: string;
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
    // Fotos verticales (piloto sosteniendo la rueda arriba de la cabeza): sin esto se recortan mal.
    ratio: "0.6",
    pairRatio: "0.75",
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
    src: "/images/estuche-aim-solo2.jpg",
    video: "/videos/estuche-aim-solo2.mp4",
    title: "Estuches AiM Solo 2 + Cámara, a Medida",
    desc: "Estuche rígido con espuma recortada a medida para guardar el AiM Solo 2 junto con una cámara de acción, con el nombre del piloto grabado en la tapa. Ya lo hicimos para varios pilotos.",
    category: "Automovilismo",
    alt: "Estuche rígido personalizado con el nombre del piloto grabado, con espuma recortada para el AiM Solo 2 y una cámara de acción",
    label: "A medida",
    specs: [
      { k: "Interior", v: "Espuma recortada a medida" },
      { k: "Personalización", v: "Nombre grabado en la tapa" },
      { k: "Rubro", v: "Automovilismo" },
    ],
  },
  {
    src: "/images/llavero-mc-racing.jpg",
    title: "Llaveros Personalizados",
    desc: "Tanda de 500 llaveros con diseño 100% a medida del logo del cliente, terminados en menos de una semana.",
    category: "Personalizados",
    alt: "Tanda de llaveros personalizados con el logo de MC Racing",
    label: "500 unidades",
    specs: [
      { k: "Cantidad", v: "500" },
      { k: "Plazo", v: "Menos de una semana" },
      { k: "Diseño", v: "100% propio" },
    ],
  },
  {
    src: "/images/trofeo-piloto-dorado.jpg",
    title: "Trofeo Piloto en Acabado Dorado",
    desc: "Trofeo a medida para un cliente de automovilismo: figura de piloto de pie con las manos en alto, en acabado metalizado dorado, sobre base circular negra.",
    category: "Automovilismo",
    alt: "Trofeo de un piloto de pie con las manos en alto, en acabado metalizado dorado",
    label: "Acabado dorado",
    specs: [
      { k: "Acabado", v: "Metalizado dorado" },
      { k: "Base", v: "Circular, negra" },
      { k: "Rubro", v: "Automovilismo" },
    ],
    pairSrc: "/images/trofeo-piloto-dorado-impresion.jpg",
    pairAlt: "El mismo trofeo recién terminado, todavía sobre la base de la impresora 3D",
    pairLabel: "Recién impreso",
    // Foto principal casi cuadrada + foto del proceso, vertical: mismo motivo que el caso anterior.
    ratio: "1",
    pairRatio: "0.6",
  },
];

/* Capa extra de scanlines que se suma a la de MediaFrame (.04) en hover → ~.06 total. */
const HOVER_LINES: CSSProperties = {
  "--layer-sp": "7px",
  "--layer-o": "0.02",
  transitionTimingFunction: "var(--ease-mech)",
} as CSSProperties;

const HOVER_EASE: CSSProperties = { transitionTimingFunction: "var(--ease-mech)" };

/* ------------------------------------------------------------------------ */
/* Fotos flotantes: piezas reales del taller, decorativas, en el margen       */
/* AFUERA de .shell (nunca contra el contenido: .shell mide 1240px, así que    */
/* con la pantalla angosta ese margen no existe — por eso solo aparecen desde  */
/* 2xl, donde el margen real ya es mayor que la foto + un colchón). */
/* ------------------------------------------------------------------------ */

type FloatPhoto = { src: string; alt: string; side: "left" | "right"; top: string };

const FLOAT_SIZE = 176; // px, fijo (no responsive): así el cálculo del margen de abajo es exacto.

const FLOAT_PHOTOS: readonly FloatPhoto[] = [
  { src: "/images/float-llavero-castrol.jpg", alt: "Llavero personalizado de un bidón Castrol", side: "left", top: "8%" },
  { src: "/images/float-estuche-valen.jpg", alt: "Estuche a medida para AiM Solo 2 y cámara, con el nombre del piloto grabado", side: "right", top: "32%" },
  { src: "/images/float-llavero-castrol-car.jpg", alt: "Llavero de un auto de carrera Castrol, junto a un estuche GoPro", side: "left", top: "58%" },
  { src: "/images/float-estuche-interior.jpg", alt: "Interior de un estuche a medida, con la espuma recortada para cada pieza", side: "right", top: "82%" },
] as const;

// Afuera de .shell con un colchón de 24px: (100% - shell)/2 es el margen real a cada lado.
// En pantallas donde ese margen no alcanza, el valor da negativo y overflow-hidden la recorta
// en vez de superponerla al contenido — por eso además se oculta por completo hasta 2xl (1536px).
const marginOffset = `calc((100% - var(--shell)) / 2 - ${FLOAT_SIZE}px - 24px)`;

function FloatingPhoto({ photo, reduced }: { photo: FloatPhoto; reduced: boolean }) {
  const fromX = photo.side === "left" ? -120 : 120;
  const restRotate = photo.side === "left" ? -3 : 3;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute hidden overflow-hidden rounded-[var(--r-lg)] border 2xl:block"
      style={{
        top: photo.top,
        width: FLOAT_SIZE,
        [photo.side]: marginOffset,
        borderColor: "var(--line-2)",
        background: "var(--srf-2)",
        boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
      }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: fromX, scale: 0.82, rotate: 0 }}
      whileInView={
        reduced
          ? { opacity: 1 }
          : { opacity: 1, x: 0, scale: 1, rotate: restRotate }
      }
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, ease: EASE.expo }}
    >
      {/* Flote continuo y sutil, aparte de la entrada — se detiene con reduced-motion. */}
      <motion.div
        className="relative aspect-[4/3]"
        animate={reduced ? undefined : { y: [0, -10, 0] }}
        transition={reduced ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src={photo.src} alt={photo.alt} fill sizes={`${FLOAT_SIZE}px`} quality={72} className="object-cover" />
      </motion.div>
    </motion.div>
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
  /** Relación de aspecto fija (ver GalleryItem.ratio). Si no se pasa, usa el default responsive. */
  ratio?: string;
};

/** Un marco de media (foto o video) con TiltCard + rótulo en hover. Reutilizado para el caso
 * simple y para el par de fotos en paralelo (díptico). */
function GalleryMedia({ src, video, alt, category, hoverLabel, hoverFx, onOpen, playLabel, sizes, ratio }: GalleryMediaProps) {
  return (
    <TiltCard max={5} glare>
      <div className="group/gal relative">
        <MediaFrame
          src={src}
          video={video}
          poster={video ? src : undefined}
          alt={alt}
          // MediaFrame necesita un ratio en el marco. Sin override: 4/3 (1.3333) en mobile,
          // 16/10 (1.6) desde lg, vía la variable. Con override (fotos verticales o cuadradas
          // que "cover" recortaría mal), un número fijo en las dos resoluciones.
          ratio={ratio ?? "var(--gal-ratio, 1.6)"}
          className={ratio ? undefined : "[--gal-ratio:1.3333] lg:[--gal-ratio:1.6]"}
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
            {/* Scanlines: se sacan en video — contra el movimiento generan un moiré tipo
                "cuadraditos" que queda feo. En fotos estáticas quedan bien. */}
            {!video && (
              <div
                aria-hidden="true"
                className="layer-lines layer-lines--nofade pointer-events-none absolute inset-0 rounded-[var(--r-lg)] opacity-0 transition-opacity duration-[500ms] group-hover/gal:opacity-100"
                style={HOVER_LINES}
              />
            )}
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
 * Portfolio · 02. Cinco casos reales en layout editorial de 12 columnas (media 7 / ficha 4,
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
    <Section id="galeria" tone="base" labelledBy="galeria-title" className="overflow-hidden">
      {FLOAT_PHOTOS.map((photo) => (
        <FloatingPhoto key={photo.src} photo={photo} reduced={reduced} />
      ))}

      <SectionHeading
        index="02"
        eyebrow="Portfolio"
        titleId="galeria-title"
        title="Trabajos que ya salieron de la impresora"
        lead="Cinco casos reales: automovilismo, telemetría y personalizados."
      />

      <ol
        role="list"
        className="relative m-0 flex list-none flex-col p-0"
        style={{ rowGap: "clamp(5rem, 3rem + 6vw, 9rem)" }}
      >
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
                      ratio={item.ratio}
                    />
                    <GalleryMedia
                      src={item.pairSrc}
                      alt={item.pairAlt ?? item.alt}
                      hoverLabel={item.pairLabel ?? item.label}
                      hoverFx={hoverFx}
                      onOpen={() => openAt(i, "pair")}
                      sizes="(max-width: 1024px) 50vw, 29vw"
                      ratio={item.pairRatio ?? item.ratio}
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
                    ratio={item.ratio}
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
