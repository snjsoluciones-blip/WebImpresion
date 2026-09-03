"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import LayerLines from "./LayerLines";
import Tag from "./Tag";
import { DUR, EASE, VIEWPORT } from "./motion";
import { usePointerFine } from "./usePointerFine";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

export type MediaFrameProps = {
  /** Imagen (next/image fill). */
  src?: string;
  /** Video (muted, loop, playsInline, preload metadata; play sólo con ≥50% visible). */
  video?: string;
  alt: string;
  poster?: string;
  /** "16/10" | "4/3" | "1/1". Si se omite, controlá el aspecto con className (aspect-[4/3] lg:aspect-[16/10]). */
  ratio?: string;
  /** Obligatorio para imágenes (default "100vw"). */
  sizes?: string;
  quality?: number;
  priority?: boolean;
  /** Número de caso: se muestra como índice tabular "01". */
  index?: number;
  /** Badge de categoría (arriba a la izquierda). */
  category?: string;
  /** Badge secundario (arriba a la derecha), p. ej. "VIDEO". */
  badge?: string;
  /** Si se pasa, el marco es un <button aria-label={`Ver ${alt}`}> (lightbox). */
  onOpen?: () => void;
  /** aria-label del botón play/pausa (default "Reproducir/Pausar {alt}"). */
  playLabel?: string;
  /** preload del video (default "metadata"; la galería usa "none"). */
  preload?: "none" | "metadata" | "auto";
  className?: string;
};

/**
 * Contenedor único de toda imagen/video del sitio. Entra con clip-path desde abajo y
 * contra-escala 1.06→1; hover zoom 1.04 (solo puntero fino); trama .layer-lines al 4%;
 * badge de categoría e índice tabular. Video: play/pause por IntersectionObserver + botón de 40px.
 * Reduced-motion: video pausado en el poster, sin zoom, reveal en fade.
 */
export default function MediaFrame({
  src,
  video,
  alt,
  poster,
  ratio,
  sizes = "100vw",
  quality = 80,
  priority = false,
  index,
  category,
  badge,
  onOpen,
  playLabel,
  preload = "metadata",
  className = "",
}: MediaFrameProps) {
  const reduced = useReducedMotionSafe();
  const fine = usePointerFine();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);

  // Autoplay sólo con ≥50% de visibilidad; pausa al salir. Nunca con reduced-motion.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !video || reduced || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (!userPaused.current) el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: [0, 0.5] }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.pause();
    };
  }, [video, reduced]);

  const togglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      userPaused.current = false;
      el.play().catch(() => {});
    } else {
      userPaused.current = true;
      el.pause();
    }
  }, []);

  const style: CSSProperties | undefined = ratio ? { aspectRatio: ratio.replace("/", " / ") } : undefined;
  const zoom = fine && !reduced ? "transition-transform duration-[900ms] group-hover:scale-[1.04]" : "";
  const frameCls =
    "relative block w-full overflow-hidden rounded-[var(--r-lg)] border text-left focus-visible:outline-none";
  const frameStyle: CSSProperties = { ...style, borderColor: "var(--line-1)", background: "var(--srf-2)" };

  const media = (
    <div
      className="absolute inset-0"
      style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
    >
      {video ? (
        <video
          ref={videoRef}
          src={video}
          poster={poster}
          muted
          playsInline
          loop
          preload={preload}
          disablePictureInPicture
          aria-label={alt}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className={`h-full w-full object-cover ${zoom}`}
          style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
        />
      ) : src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className={`object-cover ${zoom}`}
          style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
        />
      ) : null}
      <LayerLines opacity={0.04} fade={false} className="opacity-100" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(180deg, transparent 55%, rgba(10,10,10,0.45) 100%)" }}
      />
      {category && (
        <div className="absolute left-4 top-4">
          <Tag tone="solid">{category}</Tag>
        </div>
      )}
      {badge && (
        <div className="absolute right-4 top-4">
          <Tag tone="line">{badge}</Tag>
        </div>
      )}
      {typeof index === "number" && (
        <span
          aria-hidden="true"
          className="font-mono-tech absolute bottom-4 right-4 text-[11px] tracking-[0.18em]"
          style={{ color: "var(--tx-4)" }}
        >
          {String(index).padStart(2, "0")}
        </span>
      )}
    </div>
  );

  const frame = onOpen ? (
    <button type="button" onClick={onOpen} aria-label={`Ver ${alt}`} className={`${frameCls} cursor-zoom-in`} style={frameStyle}>
      {media}
    </button>
  ) : (
    <div className={frameCls} style={frameStyle}>
      {media}
    </div>
  );

  // Reveal: clip-path desde abajo + contra-escala (fade con reduced-motion)
  const revealed = reduced ? (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VIEWPORT} transition={{ duration: 0.2 }}>
      {frame}
    </motion.div>
  ) : (
    <motion.div
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.d5, ease: EASE.expo }}
    >
      <motion.div
        initial={{ scale: 1.06 }}
        whileInView={{ scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: DUR.d5, ease: EASE.expo }}
      >
        {frame}
      </motion.div>
    </motion.div>
  );

  return (
    <div className={`group relative ${className}`}>
      {revealed}
      {video && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playLabel ?? `${playing ? "Pausar" : "Reproducir"} ${alt}`}
          aria-pressed={playing}
          className="absolute bottom-4 left-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border text-white backdrop-blur-md transition-colors duration-[160ms] hover:bg-white/15"
          style={{ background: "rgba(10,10,10,0.55)", borderColor: "var(--line-3)" }}
        >
          {playing ? (
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <rect x="3.5" y="2.5" width="3" height="11" rx="0.5" />
              <rect x="9.5" y="2.5" width="3" height="11" rx="0.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" className="ml-0.5 h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M4 2.5v11l9-5.5z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
