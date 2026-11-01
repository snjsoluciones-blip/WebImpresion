"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CLAVE = "snj-gestion-tema";

const TEMAS = [
  { id: "grafito", nombre: "Grafito", color: "#e5e5ea" },
  { id: "azul", nombre: "Azul", color: "#0a84ff" },
  { id: "oro", nombre: "Oro", color: "#e3bd52" },
  { id: "verde", nombre: "Verde", color: "#30d158" },
  { id: "violeta", nombre: "Violeta", color: "#bf5af2" },
  { id: "coral", nombre: "Coral", color: "#ff6a5a" },
] as const;

type TemaId = (typeof TEMAS)[number]["id"];

function aplicar(id: TemaId) {
  const raiz = document.querySelector(".gestion-root");
  if (!raiz) return;
  if (id === "grafito") raiz.removeAttribute("data-tema");
  else raiz.setAttribute("data-tema", id);
}

/** Botón redondo con el color actual; abre un panel de vidrio para elegir otro. Se guarda en este navegador. */
export default function ColorPicker() {
  const [tema, setTema] = useState<TemaId>("grafito");
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement | null>(null);

  // Recuerda la elección de la última vez (diferido: sin setState sincrónico en el efecto).
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const guardado = window.localStorage.getItem(CLAVE) as TemaId | null;
        if (guardado && TEMAS.some((t) => t.id === guardado)) {
          setTema(guardado);
          aplicar(guardado);
        }
      } catch {
        /* sin storage: queda Grafito */
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const elegir = useCallback((id: TemaId) => {
    setTema(id);
    aplicar(id);
    setAbierto(false);
    try {
      window.localStorage.setItem(CLAVE, id);
    } catch {
      /* sin storage */
    }
  }, []);

  // Se cierra al tocar afuera o con Escape.
  useEffect(() => {
    if (!abierto) return;
    const afuera = (e: PointerEvent) => {
      if (caja.current && !caja.current.contains(e.target as Node)) setAbierto(false);
    };
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("pointerdown", afuera);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("pointerdown", afuera);
      document.removeEventListener("keydown", tecla);
    };
  }, [abierto]);

  const actual = TEMAS.find((t) => t.id === tema) ?? TEMAS[0];

  return (
    <div className="g-colores" ref={caja}>
      <button
        type="button"
        className="g-colores-boton g-vidrio"
        aria-label={`Color de la app: ${actual.nombre}. Cambiar`}
        aria-expanded={abierto}
        onClick={() => setAbierto((v) => !v)}
      >
        <i style={{ "--c": actual.color } as CSSProperties} />
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            className="g-colores-panel"
            role="radiogroup"
            aria-label="Color de la app"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
          >
            {TEMAS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={t.id === tema}
                className="g-color"
                onClick={() => elegir(t.id)}
              >
                <i style={{ "--c": t.color } as CSSProperties} />
                {t.nombre}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
