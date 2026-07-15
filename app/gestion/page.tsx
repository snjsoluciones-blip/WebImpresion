"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore, newId } from "./lib/store";
import { estadoProyecto, ganancia, gananciaTotal, porCobrar, formatCurrency } from "./lib/calc";
import { EstadoProyecto, Proyecto } from "./lib/types";

const FILTROS: (EstadoProyecto | "Todos")[] = ["Todos", "En proceso", "Entregado", "Cobrado"];

const ESTADO_STYLE: Record<EstadoProyecto, string> = {
  "En proceso": "bg-amber-400/15 text-amber-300",
  Entregado: "bg-blue-400/15 text-blue-300",
  Cobrado: "bg-green-400/15 text-green-300",
};

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
        <Metric label="Ganancia total" value={formatCurrency(gananciaTotal(proyectos))} />
        <Metric label="Por cobrar" value={formatCurrency(porCobrar(proyectos))} accent="text-amber-300" />
        <Metric label="Proyectos activos" value={String(activos)} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {FILTROS.map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-md text-sm transition ${
                filtro === f ? "bg-white text-black" : "text-white/60 hover:bg-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-3 py-1.5 rounded-md text-sm bg-white text-black hover:bg-white/90"
        >
          + Nuevo proyecto
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={crearProyecto}
          className="mb-6 p-4 border border-white/10 rounded-lg bg-white/[0.03] flex flex-col sm:flex-row gap-3"
        >
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
          <button type="submit" className="px-4 py-2 rounded-md bg-white text-black text-sm font-medium">
            Crear
          </button>
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
        {filtrados.map((p) => {
          const estado = estadoProyecto(p);
          return (
            <Link
              key={p.id}
              href={`/gestion/proyectos/${p.id}`}
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
          );
        })}
      </div>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-lg bg-white/[0.04] p-4">
      <p className="text-xs text-white/50 mb-1">{label}</p>
      <p className={`text-2xl font-medium ${accent ?? ""}`}>{value}</p>
    </div>
  );
}
