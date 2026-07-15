"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStore, newId } from "./lib/store";
import { estadoProyecto, ganancia, gananciaTotal, porCobrar, formatCurrency } from "./lib/calc";
import { EstadoProyecto, Proyecto } from "./lib/types";

const FILTROS: (EstadoProyecto | "Todos")[] = ["Todos", "En proceso", "Entregado", "Cobrado"];

const ESTADO_STYLE: Record<EstadoProyecto, string> = {
  "En proceso": "bg-amber-100 text-amber-700",
  Entregado: "bg-blue-100 text-blue-700",
  Cobrado: "bg-emerald-100 text-emerald-700",
};

const METRIC_STYLES = [
  { grad: "linear-gradient(135deg,#7c3aed,#a855f7)", label: "text-white/80", value: "text-white" },
  { grad: "linear-gradient(135deg,#f59e0b,#f97316)", label: "text-white/85", value: "text-white" },
  { grad: "linear-gradient(135deg,#06b6d4,#0ea5e9)", label: "text-white/85", value: "text-white" },
];

export default function Tablero() {
  const { db, addProyecto } = useStore();
  const [filtro, setFiltro] = useState<EstadoProyecto | "Todos">("Todos");
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [cliente, setCliente] = useState("");

  const proyectos = db.proyectos;
  const activos = proyectos.filter((p) => estadoProyecto(p) !== "Cobrado").length;

  const filtrados = useMemo(
    () => (filtro === "Todos" ? proyectos : proyectos.filter((p) => estadoProyecto(p) === filtro)),
    [proyectos, filtro]
  );

  function crearProyecto(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    const nuevo: Proyecto = {
      id: newId(),
      numero: proyectos.length ? Math.max(...proyectos.map((p) => p.numero)) + 1 : 1,
      nombre: nombre.trim(),
      cliente: cliente.trim(),
      entregado: false,
      pagado: false,
      fecha: "",
      gastos: [],
      ingresos: [],
      tareas: [],
    };
    addProyecto(nuevo);
    setNombre("");
    setCliente("");
    setShowForm(false);
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <Metric label="Ganancia total" value={formatCurrency(gananciaTotal(proyectos))} index={0} />
        <Metric label="Por cobrar" value={formatCurrency(porCobrar(proyectos))} index={1} />
        <Metric label="Proyectos activos" value={String(activos)} index={2} />
      </div>

      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex gap-1 overflow-x-auto">
          {FILTROS.map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                filtro === f ? "text-white" : "text-neutral-500 hover:bg-black/5"
              }`}
              style={filtro === f ? { background: "linear-gradient(135deg,#7c3aed,#06b6d4)" } : undefined}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="g-btn-primary px-4 py-1.5 text-sm font-medium whitespace-nowrap"
        >
          + Nuevo proyecto
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={crearProyecto}
          className="g-card mb-6 p-4 flex flex-col sm:flex-row gap-3"
        >
          <input
            autoFocus
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del proyecto"
            className="input flex-1"
          />
          <input
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Cliente"
            className="input flex-1"
          />
          <button type="submit" className="g-btn-primary px-4 py-2 text-sm font-medium">
            Crear
          </button>
        </motion.form>
      )}

      <div className="g-card overflow-hidden">
        <div className="g-layers h-1" />
        <div className="grid grid-cols-[2fr_1.3fr_1fr_1fr] gap-2 px-4 py-2.5 text-xs text-neutral-400 border-b border-black/5">
          <span>Proyecto</span>
          <span>Cliente</span>
          <span>Estado</span>
          <span className="text-right">Ganancia</span>
        </div>
        {filtrados.length === 0 && (
          <p className="px-4 py-6 text-sm text-neutral-400">No hay proyectos en este filtro.</p>
        )}
        {filtrados.map((p, i) => {
          const estado = estadoProyecto(p);
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4), ease: "easeOut" }}
            >
              <Link
                href={`/gestion/proyectos/${p.id}`}
                className="grid grid-cols-[2fr_1.3fr_1fr_1fr] gap-2 px-4 py-3 items-center border-b border-black/5 last:border-0 hover:bg-violet-50/60 transition"
              >
                <span className="font-medium text-neutral-800">
                  {p.numero}. {p.nombre}
                </span>
                <span className="text-neutral-500 text-sm">{p.cliente || "—"}</span>
                <span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${ESTADO_STYLE[estado]}`}>{estado}</span>
                </span>
                <span className="text-right font-medium text-neutral-800">{formatCurrency(ganancia(p))}</span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Metric({ label, value, index }: { label: string; value: string; index: number }) {
  const s = METRIC_STYLES[index] ?? METRIC_STYLES[0];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="rounded-2xl p-4 shadow-sm relative overflow-hidden"
      style={{ background: s.grad }}
    >
      <div className="g-layers absolute inset-x-0 bottom-0 h-6 opacity-40" />
      <p className={`text-xs mb-1 relative ${s.label}`}>{label}</p>
      <p className={`text-2xl font-semibold relative ${s.value}`}>{value}</p>
    </motion.div>
  );
}
