"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, newId } from "../lib/store";
import { useAuth } from "../lib/auth";
import { Socio } from "../lib/types";
import { aplicarAcciones, resumenParaIA, Accion } from "../lib/chat-actions";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPanel() {
  const { db, applyBatch } = useStore();
  const { usuario } = useAuth();
  const [open, setOpen] = useState(false);
  const [mensajes, setMensajes] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "¡Hola! Soy tu asistente. Escribime cosas como “en Trofeos Pole gasté 1700g de filamento gris a 22 mil, pagó Nico” o “¿cuánto me toca cobrar?”.",
    },
  ]);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [mensajes, loading, open]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const contenido = texto.trim();
    if (!contenido || loading) return;

    // Historial para la API: sin el saludo inicial (mensajes[0])
    const historialApi = [...mensajes.slice(1), { role: "user" as const, content: contenido }];

    setMensajes((prev) => [...prev, { role: "user", content: contenido }]);
    setTexto("");
    setLoading(true);

    try {
      const res = await fetch("/api/gestion/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          historial: historialApi,
          resumen: resumenParaIA(db, usuario as Socio),
          usuario,
          hoy: new Date().toLocaleDateString("es-AR"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMensajes((prev) => [...prev, { role: "assistant", content: data.error ?? "No pude procesarlo." }]);
        return;
      }
      const acciones: Accion[] = (data.acciones ?? []) as Accion[];
      if (acciones.length > 0) {
        applyBatch((current) => aplicarAcciones(current, acciones, usuario as Socio, newId));
      }
      setMensajes((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMensajes((prev) => [...prev, { role: "assistant", content: "No me pude conectar. Probá de nuevo." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Botón flotante para abrir/cerrar (visible en pantallas chicas) */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full text-white shadow-lg flex items-center justify-center"
        style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }}
        aria-label="Abrir asistente"
      >
        <span style={{ fontSize: 22 }}>{open ? "×" : "✨"}</span>
      </button>

      <AnimatePresence>
        {(open || typeof window !== "undefined") && (
          <motion.aside
            initial={false}
            className={`${
              open ? "flex" : "hidden"
            } lg:flex fixed right-0 top-0 z-30 h-screen w-full sm:w-[360px] flex-col border-l border-black/10`}
            style={{ background: "linear-gradient(180deg,#faf7ff,#f3fbff)" }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 text-white"
              style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }}
            >
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 18 }}>✨</span>
                <div>
                  <p className="text-sm font-medium leading-none">Asistente SNJ</p>
                  <p className="text-[11px] text-white/80 mt-0.5">Cargá y consultá hablando</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="lg:hidden text-white/80 hover:text-white text-xl leading-none"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
              {mensajes.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap ${
                      m.role === "user"
                        ? "text-white rounded-br-sm"
                        : "bg-white text-neutral-800 border border-black/5 rounded-bl-sm shadow-sm"
                    }`}
                    style={m.role === "user" ? { background: "linear-gradient(135deg,#7c3aed,#06b6d4)" } : undefined}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-black/5 rounded-2xl rounded-bl-sm px-3.5 py-2 shadow-sm">
                    <div className="text-neutral-500">
                      <PrintLoaderDark />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={enviar} className="p-3 border-t border-black/10 bg-white/60">
              <div className="flex items-end gap-2">
                <textarea
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      enviar(e);
                    }
                  }}
                  rows={1}
                  placeholder="Escribí acá…"
                  className="flex-1 resize-none rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-neutral-800 outline-none focus:border-violet-400 max-h-32"
                />
                <button
                  type="submit"
                  disabled={loading || !texto.trim()}
                  className="h-9 w-9 shrink-0 rounded-xl text-white flex items-center justify-center disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }}
                  aria-label="Enviar"
                >
                  ↑
                </button>
              </div>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

// Variante del loader con color oscuro para fondo claro.
function PrintLoaderDark() {
  return (
    <div className="flex items-center gap-2 text-sm text-neutral-500">
      <div className="flex flex-col-reverse gap-[3px]">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-[3px] w-5 rounded-full"
            style={{ background: "linear-gradient(90deg,#7c3aed,#06b6d4)" }}
            initial={{ scaleX: 0.2, opacity: 0.3 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: i * 0.15, repeat: Infinity, repeatType: "reverse", repeatDelay: 0.3 }}
          />
        ))}
      </div>
      <span>Pensando…</span>
    </div>
  );
}
