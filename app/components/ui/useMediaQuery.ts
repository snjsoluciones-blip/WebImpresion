"use client";

import { useSyncExternalStore } from "react";

const noop = () => {};

/**
 * Base SSR-safe para hooks de matchMedia. `getServerSnapshot` devuelve
 * `serverValue` (false por defecto) para evitar hydration mismatch; React
 * corrige el valor en cliente inmediatamente después de hidratar.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = (cb: () => void) => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return noop;
    const mq = window.matchMedia(query);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  };
  const getSnapshot = () => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return serverValue;
    return window.matchMedia(query).matches;
  };
  const getServerSnapshot = () => serverValue;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
