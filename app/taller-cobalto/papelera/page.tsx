"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useStore } from "../lib/store";
import { ganancia, totalPresupuesto, formatCurrency } from "../lib/calc";
import { normalizeDB, DB } from "../lib/types";
import { exportarResumenProyectosCSV, exportarGastosCSV } from "../lib/csv";
import { BASE } from "../lib/rutas";

export default function Papelera() {
  const { db, updateProyecto, removeProyecto, updatePresupuesto, removePresupuesto, applyBatch } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [restaurando, setRestaurando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const proyectos = db.proyectos.filter((p) => p.eliminadoEn);
  const presupuestos = db.presupuestos.filter((p) => p.eliminadoEn);

  function descargarBackup() {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const fecha = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `snj-backup-${fecha}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function elegirArchivo() {
    fileRef.current?.click();
  }

  function onArchivoElegido(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setMensaje("");
    setRestaurando(true);
    const reader = new FileReader();
    reader.onload = () => {
      setRestaurando(false);
      try {
        const parsed = JSON.parse(String(reader.result)) as Partial<DB>;
        if (!Array.isArray(parsed.proyectos)) throw new Error("Archivo inválido");
        const cantidad = parsed.proyectos.length;
        if (
          !confirm(
            `Este archivo tiene ${cantidad} proyecto(s). ¿Reemplazar TODOS los datos actuales con este backup? Esto pisa lo que hay ahora (podés deshacerlo restaurando otro backup).`
          )
        ) {
          return;
        }
        const normalizado = normalizeDB(parsed);
        applyBatch(() => normalizado);
        setMensaje("Backup restaurado.");
      } catch {
        setMensaje("Ese archivo no es un backup válido.");
      }
    };
    reader.readAsText(file);
  }

  function restaurarProyecto(id: string) {
    updateProyecto(id, (p) => ({ ...p, eliminadoEn: "" }));
  }

  function borrarProyectoDefinitivo(id: string, nombre: string) {
    if (!confirm(`¿Eliminar "${nombre}" para siempre? Esto no se puede deshacer.`)) return;
    removeProyecto(id);
  }

  function restaurarPresupuesto(id: string) {
    updatePresupuesto(id, (p) => ({ ...p, eliminadoEn: "" }));
  }

  function borrarPresupuestoDefinitivo(id: string, cliente: string) {
    if (!confirm(`¿Eliminar el presupuesto de "${cliente}" para siempre? Esto no se puede deshacer.`)) return;
    removePresupuesto(id);
  }

  return (
    <div>
      <h1 className="text-xl font-medium mb-1">Papelera</h1>
      <p className="text-sm text-white/50 mb-6">
        Lo que borrás queda acá. Se puede restaurar en cualquier momento, o eliminar para siempre.
      </p>

      <div className="border border-white/10 rounded-lg p-4 mb-8">
        <h2 className="text-sm font-medium text-white/70 mb-1">Backup manual</h2>
        <p className="text-xs text-white/40 mb-3">
          Bajá una copia de todo (proyectos, presupuestos, gastos, tareas) en un archivo. Si
          algo sale mal, restaurala desde acá.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={descargarBackup}
            className="px-3 py-1.5 rounded-md text-sm bg-white text-black hover:bg-white/90"
          >
            Descargar backup
          </button>
          <button
            onClick={elegirArchivo}
            disabled={restaurando}
            className="px-3 py-1.5 rounded-md text-sm bg-white/10 hover:bg-white/20 disabled:opacity-50"
          >
            {restaurando ? "Leyendo…" : "Restaurar desde archivo"}
          </button>
          <input ref={fileRef} type="file" accept="application/json" onChange={onArchivoElegido} className="hidden" />
          {mensaje && <span className="text-xs text-white/50">{mensaje}</span>}
        </div>
      </div>

      <div className="border border-white/10 rounded-lg p-4 mb-8">
        <h2 className="text-sm font-medium text-white/70 mb-1">Exportar a Excel</h2>
        <p className="text-xs text-white/40 mb-3">
          Archivos CSV que se abren directo en Excel. Solo incluyen proyectos confirmados
          (no los de la papelera ni los "sin confirmar").
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportarResumenProyectosCSV(db)}
            className="px-3 py-1.5 rounded-md text-sm bg-white/10 hover:bg-white/20"
          >
            Resumen de proyectos (CSV)
          </button>
          <button
            onClick={() => exportarGastosCSV(db)}
            className="px-3 py-1.5 rounded-md text-sm bg-white/10 hover:bg-white/20"
          >
            Detalle de gastos (CSV)
          </button>
        </div>
      </div>

      <h2 className="text-sm font-medium text-white/70 mb-3">Proyectos</h2>
      <div className="border border-white/10 rounded-lg overflow-hidden mb-8">
        {proyectos.length === 0 && (
          <p className="px-4 py-6 text-sm text-white/40">No hay proyectos en la papelera.</p>
        )}
        {proyectos.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0"
          >
            <div>
              <Link href={`${BASE}/proyectos/${p.id}`} className="font-medium hover:underline">
                {p.numero}. {p.nombre}
              </Link>
              <p className="text-xs text-white/40">
                {p.cliente || "sin cliente"} · ganancia {formatCurrency(ganancia(p))}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => restaurarProyecto(p.id)}
                className="text-sm text-emerald-400 hover:text-emerald-300"
              >
                Restaurar
              </button>
              <button
                onClick={() => borrarProyectoDefinitivo(p.id, p.nombre)}
                className="text-sm text-red-400/70 hover:text-red-400"
              >
                Eliminar para siempre
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-medium text-white/70 mb-3">Presupuestos</h2>
      <div className="border border-white/10 rounded-lg overflow-hidden">
        {presupuestos.length === 0 && (
          <p className="px-4 py-6 text-sm text-white/40">No hay presupuestos en la papelera.</p>
        )}
        {presupuestos.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0"
          >
            <div>
              <span className="font-medium">{p.cliente}</span>
              <p className="text-xs text-white/40">
                {p.fecha} · {formatCurrency(totalPresupuesto(p.items))}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => restaurarPresupuesto(p.id)}
                className="text-sm text-emerald-400 hover:text-emerald-300"
              >
                Restaurar
              </button>
              <button
                onClick={() => borrarPresupuestoDefinitivo(p.id, p.cliente)}
                className="text-sm text-red-400/70 hover:text-red-400"
              >
                Eliminar para siempre
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
