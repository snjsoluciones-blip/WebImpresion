"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStore, newId } from "./lib/store";
import { estadoProyecto, ganancia, gananciaTotal, porCobrar, formatCurrency } from "./lib/calc";
import { EstadoProyecto, Proyecto } from "./lib/types";
import { BASE } from "./lib/rutas";

const FILTROS: (EstadoProyecto | "Todos")[] = [
  "Todos",
  "En proceso",
  "Pagado sin entregar",
  "Entregado",
  "Cobrado",
];

const ESTADO_STYLE: Record<EstadoProyecto, string> = {
  "En proceso": "bg-amber-400/15 text-amber-300",
  "Pagado sin entregar": "bg-purple-400/15 text-purple-300",
  Entregado: "bg-blue-400/15 text-blue-300",
  Cobrado: "bg-green-400/15 text-green-300",
};

export default function Tablero() {
  const { db, addProyecto, updateProyecto } = useStore();
  const [filtro, setFiltro] = useState<EstadoProyecto | "Todos">("Todos");
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [cliente, setCliente] = useState("");
  const [sinConfirmar, setSinConfirmar] = useState(false);

  const vivos = db.proyectos.filter((p) => !p.eliminadoEn);
  const proyectos = vivos.filter((p) => p.confirmado);
  const sinConfirmarList = vivos.filter((p) => !p.confirmado);
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
      numero: vivos.length ? Math.max(...vivos.map((p) => p.numero)) + 1 : 1,
      nombre: nombre.trim(),
      cliente: cliente.trim(),
      entregado: false,
      pagado: false,
      confirmado: !sinConfirmar,
      fecha: "",
      gastos: [],
      ingresos: [],
      tareas: [],
      eliminadoEn: "",
    };
    addProyecto(nuevo);
    setNombre("");
    setCliente("");
    setSinConfirmar(false);
    setShowForm(false);
  }

  function confirmarProyecto(id: string) {
    updateProyecto(id, (p) => ({ ...p, confirmado: true }));
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <Metric label="Ganancia total" value={formatCurrency(gananciaTotal(proyectos))} index={0} />
        <Metric label="Por cobrar" value={formatCurrency(porCobrar(proyectos))} accent="text-amber-300" index={1} />
        <Metric label="Proyectos activos" value={String(activos)} index={2} />
      </div>

      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex gap-1 flex-wrap">
          {FILTROS.map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-md text-sm transition whitespace-nowrap ${
                filtro === f ? "bg-white text-black" : "text-white/60 hover:bg-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-3 py-1.5 rounded-md text-sm bg-white text-black hover:bg-white/90 whitespace-nowrap"
        >
          + Nuevo proyecto
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={crearProyecto}
          className="mb-6 p-4 border border-white/10 rounded-lg bg-white/[0.03] flex flex-col gap-3"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              autoFocus
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del proyecto"
              className="flex-1 rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-white/30"
            />
            <input
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Cliente"
              className="flex-1 rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-white/30"
            />
            <button type="submit" className="px-4 py-2 rounded-md bg-white text-black text-sm font-medium whitespace-nowrap">
              Crear
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm text-white/60">
            <input type="checkbox" checked={sinConfirmar} onChange={(e) => setSinConfirmar(e.target.checked)} />
            Sin confirmar todavía (no cuenta en las cuentas ni en la ganancia hasta que lo confirmes)
          </label>
        </form>
      )}

      <div className="border border-white/10 rounded-lg overflow-hidden">
        <div className="grid grid-cols-[2fr_1.3fr_1fr_1fr] gap-2 px-4 py-2 text-xs text-white/40 border-b border-white/10">
          <span>Proyecto</span>
          <span>Cliente</span>
          <span>Estado</span>
          <span className="text-right">Ganancia</span>
        </div>
        {filtrados.length === 0 && (
          <p className="px-4 py-6 text-sm text-white/40">No hay proyectos en este filtro.</p>
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
                href={`${BASE}/proyectos/${p.id}`}
                className="grid grid-cols-[2fr_1.3fr_1fr_1fr] gap-2 px-4 py-3 items-center border-b border-white/5 last:border-0 hover:bg-white/[0.04] transition"
              >
                <span className="font-medium">
                  {p.numero}. {p.nombre}
                </span>
                <span className="text-white/60 text-sm">{p.cliente || "—"}</span>
                <span>
                  <span className={`text-xs px-2 py-1 rounded-full ${ESTADO_STYLE[estado]}`}>{estado}</span>
                </span>
                <span className="text-right">{formatCurrency(ganancia(p))}</span>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {sinConfirmarList.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-medium text-white/70 mb-1">Proyectos sin confirmar</h2>
          <p className="text-xs text-white/40 mb-3">
            Todavía no son seguros. No suman a la ganancia ni a las cuentas hasta que los confirmes.
          </p>
          <div className="border border-dashed border-white/15 rounded-lg overflow-hidden">
            {sinConfirmarList.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/5 last:border-0"
              >
                <Link href={`${BASE}/proyectos/${p.id}`} className="min-w-0 hover:underline">
                  <span className="font-medium">
                    {p.numero}. {p.nombre}
                  </span>
                  <span className="text-white/50 text-sm ml-2">{p.cliente || "—"}</span>
                </Link>
                <button
                  onClick={() => confirmarProyecto(p.id)}
                  className="px-3 py-1.5 rounded-md text-xs bg-white/10 hover:bg-white/20 whitespace-nowrap"
                >
                  Confirmar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, accent, index }: { label: string; value: string; accent?: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="rounded-lg bg-white/[0.04] p-4"
    >
      <p className="text-xs text-white/50 mb-1">{label}</p>
      <p className={`text-2xl font-medium ${accent ?? ""}`}>{value}</p>
    </motion.div>
  );
}
