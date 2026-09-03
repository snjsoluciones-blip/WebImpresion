"use client";

import { useMediaQuery } from "./useMediaQuery";

/**
 * `true` solo con puntero fino y hover real (`(hover:hover) and (pointer:fine)`).
 * Puerta de TODO efecto de hover: spotlight, tilt, magnetismo, zoom de media.
 * En touch los efectos no se degradan: no se montan. SSR → false.
 */
export function usePointerFine(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)", false);
}
