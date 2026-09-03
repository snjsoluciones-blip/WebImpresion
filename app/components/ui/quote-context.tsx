"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * Preset del formulario de cotización. Los valores son EXACTAMENTE los `value`
 * de los <option> del formulario actual:
 *  - servicio: "Modelado + Impresión" | "Solo Impresión"
 *  - material: "PLA" | "PETG" | "ABS" | "TPU" | "No sé, asesorarme"
 */
export type QuotePreset = { servicio?: string; material?: string };
export type QuoteCtx = { preset: QuotePreset; setPreset: (p: QuotePreset) => void };

export const SERVICE_VALUES = ["Modelado + Impresión", "Solo Impresión"] as const;
export const MATERIAL_VALUES = ["PLA", "PETG", "ABS", "TPU", "No sé, asesorarme"] as const;

const QuoteContext = createContext<QuoteCtx>({
  preset: {},
  setPreset: () => {},
});

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [preset, setPresetState] = useState<QuotePreset>({});
  // Merge: "Cotizar en PETG" no debe borrar un servicio ya elegido y viceversa.
  const setPreset = useCallback((p: QuotePreset) => {
    setPresetState((prev) => ({ ...prev, ...p }));
  }, []);
  const value = useMemo(() => ({ preset, setPreset }), [preset, setPreset]);
  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote(): QuoteCtx {
  return useContext(QuoteContext);
}
