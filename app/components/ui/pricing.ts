/**
 * Cálculo de precio estimado de impresión 3D — SOLO por peso (sin tiempo de máquina
 * por ahora: falta la tarifa por hora, se suma más adelante si hace falta).
 *
 * precio = gramos estimados × precio por gramo del material
 * gramos estimados = volumen sólido del STL (mm³) × densidad del material
 *
 * SNJ imprime con relleno al 100% (pieza sólida), así que el volumen del STL —que
 * se calcula exacto, no se aproxima— multiplicado por la densidad del material da
 * directamente el peso real, sin ningún factor inventado de por medio. Igual se
 * muestra como ESTIMADO: nunca como precio final cerrado.
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

/** Relleno con el que imprime SNJ: 100% (pieza sólida) — confirmado, no una estimación. */
export const INFILL_FACTOR = 1;

export type PriceEstimate = {
  material: MaterialName;
  volumeMm3: number;
  estimatedGrams: number;
  pricePerGram: number;
  estimatedPriceArs: number;
};

export function estimatePrice(volumeMm3: number, material: MaterialName, quantity = 1): PriceEstimate {
  const volumeCm3 = volumeMm3 / 1000;
  const estimatedGrams = volumeCm3 * INFILL_FACTOR * MATERIAL_DENSITY[material];
  const pricePerGram = PRICE_PER_GRAM[material];
  const estimatedPriceArs = estimatedGrams * pricePerGram * quantity;
  return { material, volumeMm3, estimatedGrams, pricePerGram, estimatedPriceArs };
}

export function formatArs(n: number): string {
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}
