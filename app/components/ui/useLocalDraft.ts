"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Setter<T> = (v: T | ((p: T) => T)) => void;

/**
 * Borrador persistente en localStorage (SSR-safe).
 * - Lee DENTRO de useEffect (nunca en render) y sólo entonces empieza a escribir.
 * - try/catch en lectura y escritura (modo privado, cuota, Safari ITP…).
 * - Escritura con debounce de 400 ms.
 * - El tercer valor borra el borrador y vuelve a `initial`.
 *
 * Para saber si se recuperó algo: comparar el valor tras el primer render con `initial`
 * (p. ej. `JSON.stringify(value) !== JSON.stringify(initial)`).
 */
export function useLocalDraft<T>(key: string, initial: T): [T, Setter<T>, () => void] {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  const initialRef = useRef(initial);

  // Lectura (solo cliente). Va en un callback diferido (no sincrónico en el cuerpo del efecto)
  // para no encadenar renders durante la hidratación.
  useEffect(() => {
    let cancelled = false;
    const id = window.setTimeout(() => {
      if (cancelled) return;
      try {
        const raw = window.localStorage.getItem(key);
        if (raw !== null) {
          const parsed = JSON.parse(raw) as T;
          if (parsed !== null && typeof parsed === typeof initialRef.current) {
            setValue(parsed);
          }
        }
      } catch {
        /* sin storage: seguimos con initial */
      }
      setHydrated(true);
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [key]);

  // Escritura con debounce (solo después de hidratar, para no pisar lo guardado con `initial`)
  useEffect(() => {
    if (!hydrated) return;
    const t = window.setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* cuota llena o storage bloqueado: ignorar */
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [key, value, hydrated]);

  const set = useCallback<Setter<T>>((v) => {
    setValue((prev) => (typeof v === "function" ? (v as (p: T) => T)(prev) : v));
  }, []);

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignorar */
    }
    setValue(initialRef.current);
  }, [key]);

  return [value, set, clear];
}
