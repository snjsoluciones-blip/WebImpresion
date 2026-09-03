// Espejo TS de los tokens de movimiento de globals.css.
// Sin JSX, sin "use client". Los easings van `as const` para que
// compilen contra el tipo `Easing` de framer-motion 12.

export const EASE = {
  expo: [0.16, 1, 0.3, 1],
  mech: [0.22, 0.61, 0.36, 1],
  quart: [0.76, 0, 0.24, 1],
  spring: [0.34, 1.4, 0.64, 1],
} as const;

export const DUR = { d1: 0.16, d2: 0.26, d3: 0.42, d4: 0.7, d5: 1.0 } as const;

export const VIEWPORT = { once: true, margin: "-12% 0px -12% 0px" } as const;

/** Escalera de stagger (segundos): hermanos · palabras · líneas. Tope de 6 elementos. */
export const STAGGER = { sibling: 0.07, word: 0.045, line: 0.09, max: 5 } as const;

/** delay = start + min(i, max) * step — garantiza que nada tarde más de ~0.42s en aparecer. */
export function staggerDelay(i: number, step = STAGGER.sibling, start = 0, max = STAGGER.max): number {
  return start + Math.min(i, max) * step;
}
