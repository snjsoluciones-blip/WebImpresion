"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore, newId } from "../../lib/store";
import { SOCIOS, Socio, Gasto, Ingreso, Filamento, Tarea } from "../../lib/types";
import {
  totalGastos,
  totalIngresos,
  ganancia,
  repartoProyecto,
  estadoProyecto,
  formatCurrency,
} from "../../lib/calc";

export default function ProyectoDetalle() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { db, updateProyecto, removeProyecto } = useStore();
  const proyecto = db.proyectos.find((p) => p.id === id);

  const [gProd, setGProd] = useState("");
  const [gPrecio, setGPrecio] = useState("");
  const [gCant, setGCant] = useState("1");
  const [gQuien, setGQuien] = useState<Socio>(SOCIOS[0]);

  const [iProd, setIProd] = useState("");
  const [iPrecio, setIPrecio] = useState("");
  const [iCant, setICant] = useState("1");

  const [fPieza, setFPieza] = useState("");
  const [fColor, setFColor] = useState("");
  const [fPeso, setFPeso] = useState("");

  const [tDesc, setTDesc] = useState("");
  const [tQuien, setTQuien] = useState<Socio>(SOCIOS[0]);

  if (!proyecto) {
    return (
      <div>
        <p className="text-white/60 mb-4">No se encontró el proyecto.</p>
        <button onClick={() => router.push("/gestion")} className="text-sm underline">
          Volver al tablero
        </button>
      </div>
    );
  }

  const reparto = repartoProyecto(proyecto);

  function addGasto(e: React.FormEvent) {
    e.preventDefault();
    if (!gProd.trim() || !gPrecio) return;
    const nuevo: Gasto = {
      id: newId(),
      producto: gProd.trim(),
      precio: Number(gPrecio),
      cantidad: Number(gCant) || 1,
      pagadoPor: gQuien,
    };
    updateProyecto(proyecto!.id, (p) => ({ ...p, gastos: [...p.gastos, nuevo] }));
    setGProd("");
    setGPrecio("");
    setGCant("1");
  }

  function addIngreso(e: React.FormEvent) {
    e.preventDefault();
    if (!iProd.trim() || !iPrecio) return;
    const nuevo: Ingreso = {
      id: newId(),
      producto: iProd.trim(),
      precio: Number(iPrecio),
      cantidad: Number(iCant) || 1,
    };
    updateProyecto(proyecto!.id, (p) => ({ ...p, ingresos: [...p.ingresos, nuevo] }));
    setIProd("");
    setIPrecio("");
    setICant("1");
  }

  function addFilamento(e: React.FormEvent) {
    e.preventDefault();
    if (!fPieza.trim()) return;
    const nuevo: Filamento = { id: newId(), pieza: fPieza.trim(), color: fColor.trim(), peso: fPeso.trim() };
    updateProyecto(proyecto!.id, (p) => ({ ...p, filamentos: [...p.filamentos, nuevo] }));
    setFPieza("");
    setFColor("");
    setFPeso("");
  }

  function addTarea(e: React.FormEvent) {
    e.preventDefault();
    if (!tDesc.trim()) return;
    const nueva: Tarea = { id: newId(), descripcion: tDesc.trim(), asignadoA: tQuien, hecha: false };
    updateProyecto(proyecto!.id, (p) => ({ ...p, tareas: [...p.tareas, nueva] }));
    setTDesc("");
  }

  function toggleTarea(tareaId: string) {
    updateProyecto(proyecto!.id, (p) => ({
      ...p,
      tareas: p.tareas.map((t) => (t.id === tareaId ? { ...t, hecha: !t.hecha } : t)),
    }));
  }

  function borrar(lista: "gastos" | "ingresos" | "filamentos" | "tareas", itemId: string) {
    updateProyecto(proyecto!.id, (p) => ({
      ...p,
      [lista]: (p[lista] as { id: string }[]).filter((x) => x.id !== itemId),
    }));
  }

  function eliminarProyecto() {
    if (!confirm(`¿Eliminar el proyecto "${proyecto!.nombre}"? No se puede deshacer.`)) return;
    removeProyecto(proyecto!.id);
    router.push("/gestion");
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <button onClick={() => router.push("/gestion")} className="text-sm text-white/50 hover:text-white mb-2">
            ← Tablero
          </button>
          <h1 className="text-xl font-medium">
            {proyecto.numero}. {proyecto.nombre}
          </h1>
          <p className="text-sm text-white/50">{proyecto.cliente || "Sin cliente"}</p>
        </div>
        <button onClick={eliminarProyecto} className="text-sm text-red-400/70 hover:text-red-400">
          Eliminar proyecto
        </button>
      </div>

      {/* Datos generales */}
      <Section title="Datos generales">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={proyecto.entregado}
              onChange={(e) => updateProyecto(proyecto.id, (p) => ({ ...p, entregado: e.target.checked }))}
            />
            Entregado
          </label>
          <input
            type="date"
            value={proyecto.fechaEntrega}
            onChange={(e) => updateProyecto(proyecto.id, (p) => ({ ...p, fechaEntrega: e.target.value }))}
            className="rounded-md bg-white/5 border border-white/10 px-3 py-1.5 text-sm outline-none focus:border-white/30"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={proyecto.pagado}
              onChange={(e) => updateProyecto(proyecto.id, (p) => ({ ...p, pagado: e.target.checked }))}
            />
            Pagado
          </label>
          <input
            type="date"
            value={proyecto.fechaPago}
            onChange={(e) => updateProyecto(proyecto.id, (p) => ({ ...p, fechaPago: e.target.value }))}
            className="rounded-md bg-white/5 border border-white/10 px-3 py-1.5 text-sm outline-none focus:border-white/30"
          />
        </div>
        <p className="mt-3 text-sm text-white/50">
          Estado: <span className="text-white">{estadoProyecto(proyecto)}</span>
        </p>
      </Section>

      {/* Gastos */}
      <Section title={`Gastos — total ${formatCurrency(totalGastos(proyecto))}`}>
        <Tabla
          headers={["Producto", "Precio", "Cant.", "Pagó", ""]}
          rows={proyecto.gastos.map((g) => [
            g.producto,
            formatCurrency(g.precio),
            String(g.cantidad),
            g.pagadoPor,
            <button key="del" onClick={() => borrar("gastos", g.id)} className="text-white/30 hover:text-red-400">
              ✕
            </button>,
          ])}
        />
        <form onSubmit={addGasto} className="flex flex-wrap gap-2 mt-3">
          <input value={gProd} onChange={(e) => setGProd(e.target.value)} placeholder="Producto" className="input flex-1 min-w-[140px]" />
          <input value={gPrecio} onChange={(e) => setGPrecio(e.target.value)} placeholder="Precio" type="number" className="input w-28" />
          <input value={gCant} onChange={(e) => setGCant(e.target.value)} placeholder="Cant." type="number" step="0.1" className="input w-20" />
          <select value={gQuien} onChange={(e) => setGQuien(e.target.value as Socio)} className="input w-28">
            {SOCIOS.map((s) => (
              <option key={s} value={s} className="bg-black">
                {s}
              </option>
            ))}
          </select>
          <button type="submit" className="px-3 py-1.5 rounded-md bg-white text-black text-sm">
            Agregar
          </button>
        </form>
      </Section>

      {/* Ingresos */}
      <Section title={`Ingresos — total ${formatCurrency(totalIngresos(proyecto))}`}>
        <Tabla
          headers={["Producto", "Precio", "Cant.", ""]}
          rows={proyecto.ingresos.map((i) => [
            i.producto,
            formatCurrency(i.precio),
            String(i.cantidad),
            <button key="del" onClick={() => borrar("ingresos", i.id)} className="text-white/30 hover:text-red-400">
              ✕
            </button>,
          ])}
        />
        <form onSubmit={addIngreso} className="flex flex-wrap gap-2 mt-3">
          <input value={iProd} onChange={(e) => setIProd(e.target.value)} placeholder="Producto" className="input flex-1 min-w-[140px]" />
          <input value={iPrecio} onChange={(e) => setIPrecio(e.target.value)} placeholder="Precio" type="number" className="input w-28" />
          <input value={iCant} onChange={(e) => setICant(e.target.value)} placeholder="Cant." type="number" className="input w-20" />
          <button type="submit" className="px-3 py-1.5 rounded-md bg-white text-black text-sm">
            Agregar
          </button>
        </form>
      </Section>

      {/* Ganancia y reparto */}
      <Section title={`Ganancia: ${formatCurrency(ganancia(proyecto))}`}>
        <div className="grid grid-cols-3 gap-3">
          {SOCIOS.map((s) => (
            <div key={s} className="border border-white/10 rounded-lg p-3">
              <p className="font-medium mb-2">{s}</p>
              <p className="text-xs text-white/50">Puso {formatCurrency(reparto[s].puso)}</p>
              <p className="text-sm text-green-300 mt-1">Cobra {formatCurrency(reparto[s].cobra)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Filamento */}
      <Section title="Filamento">
        <Tabla
          headers={["Pieza", "Color", "Peso", ""]}
          rows={proyecto.filamentos.map((f) => [
            f.pieza,
            f.color,
            f.peso,
            <button key="del" onClick={() => borrar("filamentos", f.id)} className="text-white/30 hover:text-red-400">
              ✕
            </button>,
          ])}
        />
        <form onSubmit={addFilamento} className="flex flex-wrap gap-2 mt-3">
          <input value={fPieza} onChange={(e) => setFPieza(e.target.value)} placeholder="Pieza" className="input flex-1 min-w-[120px]" />
          <input value={fColor} onChange={(e) => setFColor(e.target.value)} placeholder="Color" className="input w-32" />
          <input value={fPeso} onChange={(e) => setFPeso(e.target.value)} placeholder="Peso" className="input w-24" />
          <button type="submit" className="px-3 py-1.5 rounded-md bg-white text-black text-sm">
            Agregar
          </button>
        </form>
      </Section>

      {/* Tareas */}
      <Section title="Tareas">
        <div className="space-y-1 mb-3">
          {proyecto.tareas.map((t) => (
            <div key={t.id} className="flex items-center gap-2 text-sm py-1">
              <input type="checkbox" checked={t.hecha} onChange={() => toggleTarea(t.id)} />
              <span className={t.hecha ? "line-through text-white/30" : ""}>{t.descripcion}</span>
              <span className="text-white/40 text-xs">({t.asignadoA})</span>
              <button onClick={() => borrar("tareas", t.id)} className="ml-auto text-white/30 hover:text-red-400">
                ✕
              </button>
            </div>
          ))}
          {proyecto.tareas.length === 0 && <p className="text-sm text-white/30">Sin tareas.</p>}
        </div>
        <form onSubmit={addTarea} className="flex flex-wrap gap-2">
          <input value={tDesc} onChange={(e) => setTDesc(e.target.value)} placeholder="Tarea" className="input flex-1 min-w-[140px]" />
          <select value={tQuien} onChange={(e) => setTQuien(e.target.value as Socio)} className="input w-28">
            {SOCIOS.map((s) => (
              <option key={s} value={s} className="bg-black">
                {s}
              </option>
            ))}
          </select>
          <button type="submit" className="px-3 py-1.5 rounded-md bg-white text-black text-sm">
            Agregar
          </button>
        </form>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 border border-white/10 rounded-lg p-4">
      <h2 className="text-sm font-medium text-white/70 mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Tabla({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  if (rows.length === 0) return <p className="text-sm text-white/30">Sin datos todavía.</p>;
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-white/40 text-xs">
          {headers.map((h, i) => (
            <th key={i} className="text-left font-normal pb-2">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-t border-white/5">
            {row.map((cell, j) => (
              <td key={j} className="py-1.5 pr-2">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
