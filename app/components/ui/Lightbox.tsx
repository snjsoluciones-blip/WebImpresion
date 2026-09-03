"use client";

import { useEffect, useRef, useSyncExternalStore, type MouseEvent as ReactMouseEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { DUR, EASE } from "./motion";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

export type LightboxProps = {
  open: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  /** 0-based */
  index?: number;
  total?: number;
  src?: string;
  video?: string;
  alt: string;
  title?: string;
  caption?: string;
};

const FOCUSABLE = 'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';
const noopSubscribe = () => () => {};
const clientTrue = () => true;
const serverFalse = () => false;

/**
 * Portal a document.body con AnimatePresence. Fondo rgba(10,10,10,.94) + blur(14px) en 260 ms,
 * media 0.94→1 con EASE.expo. Escape / click fuera / ✕. ← → navegan. Trap de foco básico,
 * restaura el foco al disparador, bloquea el scroll compensando el ancho de la scrollbar.
 * Reduced-motion: aparece/desaparece sin animar.
 */
export default function Lightbox({
  open,
  onClose,
  onPrev,
  onNext,
  index,
  total,
  src,
  video,
  alt,
  title,
  caption,
}: LightboxProps) {
  const reduced = useReducedMotionSafe();
  // true sólo en cliente tras hidratar (portal a document.body)
  const mounted = useSyncExternalStore(noopSubscribe, clientTrue, serverFalse);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = (document.activeElement as HTMLElement | null) ?? null;

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (sbw > 0) body.style.paddingRight = `${sbw}px`;

    const focusTimer = window.requestAnimationFrame(() => closeRef.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft" && onPrev) {
        onPrev();
      } else if (e.key === "ArrowRight" && onNext) {
        onNext();
      } else if (e.key === "Tab" && dialogRef.current) {
        const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.cancelAnimationFrame(focusTimer);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      restoreRef.current?.focus?.();
    };
  }, [open, onClose, onPrev, onNext]);

  if (!mounted) return null;

  const onBackdrop = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const counter =
    typeof index === "number" && typeof total === "number"
      ? `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`
      : null;

  const navBtn =
    "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border text-white transition-colors duration-[160ms] hover:bg-white/10";

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={title ?? alt}
          ref={dialogRef}
          onClick={onBackdrop}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: DUR.d2 }}
          className="site-root fixed inset-0 z-[90] flex flex-col items-center justify-center p-4 sm:p-8"
          style={{ background: "rgba(10,10,10,0.94)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className={`${navBtn} absolute right-4 top-4 z-10`}
            style={{ borderColor: "var(--line-2)", background: "rgba(10,10,10,0.6)" }}
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.25} aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
            </svg>
          </button>

          <motion.div
            initial={reduced ? false : { scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reduced ? undefined : { scale: 0.96, opacity: 0 }}
            transition={{ duration: DUR.d3, ease: EASE.expo }}
            className="relative w-[min(96vw,1200px)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative h-[min(68vh,760px)] w-full overflow-hidden rounded-[var(--r-lg)] border"
              style={{ borderColor: "var(--line-2)", background: "#000" }}
            >
              {video ? (
                <video
                  src={video}
                  controls
                  autoPlay={!reduced}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  aria-label={alt}
                  className="h-full w-full object-contain"
                />
              ) : src ? (
                <Image src={src} alt={alt} fill sizes="96vw" quality={85} className="object-contain" />
              ) : null}
            </div>

            {(title || caption || counter) && (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                <div className="min-w-0">
                  {title && <p className="t-h3 m-0 text-white">{title}</p>}
                  {caption && (
                    <p className="m-0 mt-1 max-w-[60ch] text-sm leading-relaxed" style={{ color: "var(--tx-3)" }}>
                      {caption}
                    </p>
                  )}
                </div>
                {counter && (
                  <span className="font-mono-tech shrink-0 text-[11px] tracking-[0.18em]" style={{ color: "var(--tx-4)" }}>
                    {counter}
                  </span>
                )}
              </div>
            )}
          </motion.div>

          {(onPrev || onNext) && (
            <div className="mt-5 flex items-center gap-3">
              {onPrev && (
                <button type="button" onClick={onPrev} aria-label="Anterior" className={navBtn} style={{ borderColor: "var(--line-2)" }}>
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.25} aria-hidden="true">
                    <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
              {onNext && (
                <button type="button" onClick={onNext} aria-label="Siguiente" className={navBtn} style={{ borderColor: "var(--line-2)" }}>
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.25} aria-hidden="true">
                    <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
