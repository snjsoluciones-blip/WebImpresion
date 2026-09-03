"use client";

import { useState, useSyncExternalStore } from "react";
import { motion, type Transition } from "framer-motion";
import {
  DUR,
  EASE,
  MagneticButton,
  WhatsAppIcon,
  useActiveSection,
  useMediaQuery,
  usePointerFine,
  useReducedMotionSafe,
} from "./ui";

// href y mensaje intactos (spec §102). Mismo número y mismo texto que MobileActionBar.
const WHATSAPP_URL = `https://wa.me/541161256413?text=${encodeURIComponent(
  "¡Hola! Vengo de la web de SNJ Soluciones y quiero hacer una consulta."
)}`;

const CONTACT_ID = "contacto";
const CONTACT_IDS = [CONTACT_ID];

/**
 * Umbrales de scroll compartidos con MobileActionBar (§103, §105, §106):
 * el botón flotante entra pasado el 60 % del alto de viewport; la barra mobile, pasado el 90 %.
 * Ambos se retiran mientras #contacto está activo.
 */
const SHOW_RATIO = 0.6;
const BAR_RATIO = 0.9;
/** 5.5rem − 1.5rem = 4rem: cuánto sube el botón (vía transform) cuando la barra mobile está visible (§106). */
const BAR_LIFT_PX = 64;

// Umbrales como stores externos: SSR-safe (server → false), sin setState en efectos, y React
// solo re-renderiza cuando cambia el booleano (no en cada evento de scroll).
function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}
const getPastShow = () => window.scrollY > window.innerHeight * SHOW_RATIO;
const getPastBar = () => window.scrollY > window.innerHeight * BAR_RATIO;
const getServerFalse = () => false;

/**
 * Botón flotante de WhatsApp (spec §102-104).
 * - Entra con scrollY > 60vh (escala .6→1 + opacidad, 300 ms expo) y se retira mientras
 *   #contacto está activo (opacity 0 / scale .85 / y 12, 260 ms), quedando inerte.
 * - Con puntero fino, en hover/focus se expande a pill "Escribinos" animando el max-width
 *   del <span> interno (nunca el ancho del contenedor: cero layout thrash). En touch, círculo de 56 px.
 * - Anillo `snj-ring-pulse` hasta la primera interacción. Reduced-motion: sin animación ni anillo.
 * - Safe-area insets, z-40 (header 50, MobileActionBar 45, overlay del menú 70).
 * - Bajo `md`, mientras la MobileActionBar está visible, sube 4rem para no quedar tapado.
 */
export default function WhatsAppButton() {
  const reduced = useReducedMotionSafe();
  const fine = usePointerFine();
  const mdUp = useMediaQuery("(min-width: 48rem)", false); // = breakpoint `md`, igual que MobileActionBar
  const pastShow = useSyncExternalStore(subscribeScroll, getPastShow, getServerFalse);
  const pastBar = useSyncExternalStore(subscribeScroll, getPastBar, getServerFalse);
  const active = useActiveSection(CONTACT_IDS, 80);
  const [interacted, setInteracted] = useState(false);

  const inContact = active === CONTACT_ID;
  const shown = pastShow && !inContact;
  const barVisible = !mdUp && pastBar && !inContact;
  const lift = barVisible ? -BAR_LIFT_PX : 0;

  const target = !pastShow
    ? { opacity: 0, scale: 0.6, y: 0 }
    : inContact
      ? { opacity: 0, scale: 0.85, y: 12 }
      : { opacity: 1, scale: 1, y: lift };

  // Entrada: 300 ms expo. Salida: 260 ms mech. El desplazamiento por la barra mobile acompaña
  // su propia entrada (300 ms in-out-quart). Reduced-motion: todo instantáneo.
  const transition: Transition = reduced
    ? { duration: 0 }
    : shown
      ? { duration: 0.3, ease: EASE.expo, y: { duration: 0.3, ease: EASE.quart } }
      : { duration: DUR.d2, ease: EASE.mech };

  const showRing = shown && !interacted && !reduced;
  const stopRing = () => setInteracted(true);

  // Solo con puntero fino: el rótulo se revela en hover/focus-visible del <a> (grupo).
  const expandOnFine = fine
    ? "group-hover:max-w-[132px] group-hover:opacity-100 group-focus-visible:max-w-[132px] group-focus-visible:opacity-100"
    : "";

  return (
    <div
      className={`fixed z-40 ${shown ? "" : "pointer-events-none"}`}
      style={{
        bottom: "calc(1.5rem + env(safe-area-inset-bottom))",
        right: "calc(1.25rem + env(safe-area-inset-right))",
      }}
      inert={!shown}
      aria-hidden={!shown}
    >
      <motion.div initial={false} animate={target} transition={transition} className="flex">
        <MagneticButton strength={0.15} radius={72}>
          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escribinos por WhatsApp"
            tabIndex={shown ? undefined : -1}
            whileHover={reduced ? undefined : { scale: 1.08 }}
            whileTap={reduced ? undefined : { scale: 0.95 }}
            transition={{ type: "tween", duration: DUR.d2, ease: EASE.mech }}
            onPointerEnter={stopRing}
            onPointerDown={stopRing}
            onFocus={stopRing}
            className="group relative flex h-14 min-w-14 items-center justify-end rounded-full bg-[#25D366] text-white shadow-[0_10px_34px_rgba(37,211,102,0.22)] transition-[background-color] duration-[var(--dur-1)] ease-[var(--ease-mech)] hover:bg-[var(--wa-hover)]"
          >
            {showRing && (
              <span
                aria-hidden="true"
                className="snj-ring-pulse pointer-events-none absolute inset-0 rounded-full border-2 border-[#25D366]"
              />
            )}
            <span
              aria-hidden="true"
              className={`block max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity] duration-[320ms] ease-[var(--ease-mech)] ${expandOnFine}`}
            >
              <span className="block pl-6 pr-1 text-[15px] font-semibold leading-none tracking-[-0.01em]">
                Escribinos
              </span>
            </span>
            <span className="flex h-14 w-14 shrink-0 items-center justify-center">
              <WhatsAppIcon className="h-7 w-7" />
            </span>
          </motion.a>
        </MagneticButton>
      </motion.div>
    </div>
  );
}
