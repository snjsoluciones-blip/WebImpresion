"use client";

import { useCallback, useSyncExternalStore, type MouseEvent } from "react";
import { Button, WhatsAppIcon, useActiveSection, useMediaQuery, useReducedMotionSafe } from "./ui";

/**
 * MobileActionBar — spec §105-106.
 *
 * Barra fija SOLO bajo `md` (48rem) con dos acciones al 50%: "Cotizar" (primary → #contacto)
 * y "WhatsApp" (verde → wa.me directo). Aparece cuando `scrollY > innerHeight * 0.9` y se
 * oculta mientras `#contacto` es la sección activa (ahí ya hay un botón verde grande).
 * Entra con `translateY(100% → 0)` en 300 ms `--ease-in-out-quart`; con reduced-motion no anima.
 *
 * §106: mientras la barra está visible se renderiza un spacer de 72px (+ safe-area) en flujo,
 * inmediatamente después del <footer> (este componente va justo después de Footer en page.tsx),
 * para que la barra no tape la línea de copyright. La coordinación con WhatsAppButton (que sube
 * a `bottom: calc(5.5rem + safe-area)` cuando la barra está visible) se hace por contrato:
 * ambos usan el mismo umbral (0.9 × innerHeight), el mismo breakpoint (md) y `useActiveSection`.
 */

// Mismo número y mismo mensaje que el botón flotante de WhatsApp.
const WHATSAPP_URL = `https://wa.me/541161256413?text=${encodeURIComponent(
  "¡Hola! Vengo de la web de SNJ Soluciones y quiero hacer una consulta."
)}`;

const CONTACT_ID = "contacto";
const CONTACT_IDS = [CONTACT_ID];
/** Umbral compartido con WhatsAppButton (BAR_AT = 0.9). */
const FOLD_RATIO = 0.9;
/** Alto nominal de la barra: botón md (48px) + 12px arriba y abajo. */
const BAR_HEIGHT = 72;
const ENTER_MS = 300;

// Umbral de scroll como store externo: sin setState en efectos, SSR-safe (server → false).
// Solo re-renderiza cuando cambia el booleano, no en cada evento de scroll.
function subscribeFold(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}
function getPastFold(): boolean {
  return window.scrollY > window.innerHeight * FOLD_RATIO;
}
function getPastFoldServer(): boolean {
  return false;
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2.5 8h11M9.5 4l4 4-4 4" />
    </svg>
  );
}

export default function MobileActionBar() {
  const isDesktop = useMediaQuery("(min-width: 48rem)", false); // = breakpoint `md` de Tailwind 4
  const reduced = useReducedMotionSafe();
  const pastFold = useSyncExternalStore(subscribeFold, getPastFold, getPastFoldServer);
  const active = useActiveSection(CONTACT_IDS, 80);

  const visible = !isDesktop && pastFold && active !== CONTACT_ID;

  // Con reduced-motion el anchor no debe disparar el `scroll-behavior: smooth` global de <html>:
  // saltamos en seco a #contacto ("instant" ignora la CSS; "auto" la respetaría), honrando
  // scroll-padding-top, y dejamos el hash en la URL como haría el anchor.
  const handleQuoteCapture = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!reduced) return;
      const target = document.getElementById(CONTACT_ID);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "instant", block: "start" });
      window.history.pushState(null, "", `#${CONTACT_ID}`);
    },
    [reduced]
  );

  if (isDesktop) return null;

  // Al ocultarse, `visibility` espera a que termine el transform para no cortar la salida;
  // al mostrarse cambia en seco. Oculta también quita los botones del orden de tabulación.
  const transition = reduced
    ? "none"
    : visible
      ? `transform ${ENTER_MS}ms var(--ease-in-out-quart)`
      : `transform ${ENTER_MS}ms var(--ease-in-out-quart), visibility 0s linear ${ENTER_MS}ms`;

  return (
    <>
      <nav
        aria-label="Acciones rápidas"
        data-visible={visible ? "true" : "false"}
        className="fixed inset-x-0 bottom-0 z-[45] backdrop-blur-xl md:hidden"
        style={{
          background: "rgba(10,10,10,0.86)",
          paddingBottom: "env(safe-area-inset-bottom)",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          visibility: visible ? "visible" : "hidden",
          transition,
        }}
      >
        <div aria-hidden="true" className="hairline absolute inset-x-0 top-0" />
        <div
          className="grid grid-cols-2 gap-2 py-3"
          style={{
            paddingLeft: "max(var(--gutter), env(safe-area-inset-left))",
            paddingRight: "max(var(--gutter), env(safe-area-inset-right))",
          }}
        >
          <div onClickCapture={handleQuoteCapture}>
            <Button variant="primary" size="md" href={`#${CONTACT_ID}`} full icon={<ArrowRightIcon />}>
              Cotizar
            </Button>
          </div>
          <Button
            variant="whatsapp"
            size="md"
            href={WHATSAPP_URL}
            external
            full
            icon={<WhatsAppIcon className="h-[18px] w-[18px]" />}
            iconPosition="left"
          >
            WhatsApp
          </Button>
        </div>
      </nav>

      {/* §106: compensación en flujo (tras el footer) para que la barra no tape el copyright */}
      {visible && (
        <div
          aria-hidden="true"
          className="md:hidden"
          style={{ height: `calc(${BAR_HEIGHT}px + env(safe-area-inset-bottom))` }}
        />
      )}
    </>
  );
}
