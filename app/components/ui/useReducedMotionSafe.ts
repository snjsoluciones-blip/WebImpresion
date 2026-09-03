"use client";

import { useMediaQuery } from "./useMediaQuery";

/**
 * Única fuente de verdad de movimiento de la web pública.
 * `true` si el usuario pidió `prefers-reduced-motion: reduce`.
 * SSR: devuelve `false` y se corrige tras hidratar. Ningún componente anima sin consultarlo.
 */
export function useReducedMotionSafe(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}
