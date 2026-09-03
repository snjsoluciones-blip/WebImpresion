"use client";

import { useEffect, useState } from "react";

/**
 * Devuelve el id de la sección más visible entre `ids` (sin `#`), o `null`.
 * IntersectionObserver con `rootMargin: -${offset}px 0px -55% 0px`.
 * Lo consumen Header (link activo), MobileActionBar y WhatsAppButton (ocultarse en #contacto).
 * No anima nada por sí solo.
 */
export function useActiveSection(ids: string[], offsetPx = 80): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;
    const list = key ? key.split("|") : [];
    const elements = list
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const ratios = new Map<string, number>();
    const pick = () => {
      let best: string | null = null;
      let bestRatio = 0;
      ratios.forEach((r, id) => {
        if (r > bestRatio) {
          bestRatio = r;
          best = id;
        }
      });
      setActive(best);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        }
        pick();
      },
      {
        rootMargin: `-${offsetPx}px 0px -55% 0px`,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key, offsetPx]);

  return active;
}
