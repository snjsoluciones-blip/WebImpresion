/**
 * Cálculo de precio estimado de impresión 3D — SOLO por peso (sin tiempo de máquina
 * por ahora: falta la tarifa por hora, se suma más adelante si hace falta).
 *
 * precio = gramos estimados × precio por gramo del material
 * gramos estimados = volumen sólido del STL (mm³) × factor de densidad efectiva
 *                     (paredes + relleno, no es una pieza 100% sólida) × densidad del material
 *
 * El factor de densidad efectiva (30%) es un promedio típico de una impresión FDM con
 * relleno y paredes estándar. Es una ESTIMACIÓN: se lo mostramos al cliente como tal,
 * nunca como precio final cerrado.
 */

export const MATERIALS = ["PLA", "PETG", "ABS", "TPU"] as const;
export type MaterialName = (typeof MATERIALS)[number];

/** Densidad real de cada material (g/cm³) — dato físico, no de negocio. */
export const MATERIAL_DENSITY: Record<MaterialName, number> = {
  PLA: 1.24,
  PETG: 1.27,
  ABS: 1.04,
  TPU: 1.21,
};

/**
 * Precio por gramo (ARS). Confirmado por SNJ: PLA $300/g. Los demás son una propuesta
 * (PLA × un múltiplo por costo de filamento y dificultad de impresión) a confirmar:
 *  - PETG ×1.2 (filamento más caro, pieza funcional)
 *  - ABS  ×1.15 (filamento similar, más cuidado al imprimir — warping)
 *  - TPU  ×1.5 (filamento bastante más caro, imprime mucho más lento)
 */
export const PRICE_PER_GRAM: Record<MaterialName, number> = {
  PLA: 300,
  PETG: 360,
  ABS: 345,
  TPU: 450,
};

/** Relleno + paredes típicos de una impresión FDM estándar (no es pieza sólida). */
export const EFFECTIVE_DENSITY_FACTOR = 0.3;

export type PriceEstimate = {
  material: MaterialName;
  volumeMm3: number;
  estimatedGrams: number;
  pricePerGram: number;
  estimatedPriceArs: number;
};

export function estimatePrice(volumeMm3: number, material: MaterialName, quantity = 1): PriceEstimate {
  const volumeCm3 = volumeMm3 / 1000;
  const estimatedGrams = volumeCm3 * EFFECTIVE_DENSITY_FACTOR * MATERIAL_DENSITY[material];
  const pricePerGram = PRICE_PER_GRAM[material];
  const estimatedPriceArs = estimatedGrams * pricePerGram * quantity;
  return { material, volumeMm3, estimatedGrams, pricePerGram, estimatedPriceArs };
}

export function formatArs(n: number): string {
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}
