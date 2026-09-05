"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * Preset del formulario de cotización. Un solo servicio (Solo Impresión), así que
 * lo único que se pre-selecciona es el material. El value es EXACTAMENTE el `value`
 * de los <option> del formulario actual: "PLA" | "PETG" | "ABS" | "TPU" | "No sé, asesorarme"
 */
export type QuotePreset = { material?: string };
export type QuoteCtx = { preset: QuotePreset; setPreset: (p: QuotePreset) => void };

export const MATERIAL_VALUES = ["PLA", "PETG", "ABS", "TPU", "No sé, asesorarme"] as const;

const QuoteContext = createContext<QuoteCtx>({
  preset: {},
  setPreset: () => {},
});

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [preset, setPresetState] = useState<QuotePreset>({});
  const setPreset = useCallback((p: QuotePreset) => {
    setPresetState((prev) => ({ ...prev, ...p }));
  }, []);
  const value = useMemo(() => ({ preset, setPreset }), [preset, setPreset]);
  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote(): QuoteCtx {
  return useContext(QuoteContext);
}
