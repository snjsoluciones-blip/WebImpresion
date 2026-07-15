"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useStore, newId } from "../../lib/store";
import { SOCIOS, Socio, Gasto, Ingreso, Tarea } from "../../lib/types";
import {
  totalGastos,
  totalIngresos,
  ganancia,
  repartoProyecto,
  estadoProyecto,
  formatCurrency,
} from "../../lib/calc";
import PrintLoader from "../../components/PrintLoader";

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

  const [tDesc, setTDesc] = useState("");
  const [tQuien, setTQuien] = useState<Socio>(SOCIOS[0]);

  // IA: cargar gasto por texto libre
  const [iaTexto, setIaTexto] = useState("");
  const [iaLoading, setIaLoading] = useState(false);
  const [iaError, setIaError] = useState("");

  // IA: redactar mensaje al cliente
  const [mensaje, setMensaje] = useState("");
  const [mensajeLoading, setMensajeLoading] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

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

  function editarGasto(gastoId: string, campo: keyof Gasto, valor: string) {
    updateProyecto(proyecto!.id, (p) => ({
      ...p,
      gastos: p.gastos.map((g) =>
        g.id === gastoId
          ? {
              ...g,
              [campo]: campo === "precio" || campo === "cantidad" ? Number(valor) || 0 : valor,
            }
          : g
      ),
    }));
  }

  function editarIngreso(ingresoId: string, campo: keyof Ingreso, valor: string) {
    updateProyecto(proyecto!.id, (p) => ({
      ...p,
      ingresos: p.ingresos.map((i) =>
        i.id === ingresoId
          ? { ...i, [campo]: campo === "precio" || campo === "cantidad" ? Number(valor) || 0 : valor }
          : i
      ),
    }));
  }

  function editarTarea(tareaId: string, campo: keyof Tarea, valor: string | boolean) {
    updateProyecto(proyecto!.id, (p) => ({
      ...p,
      tareas: p.tareas.map((t) => (t.id === tareaId ? { ...t, [campo]: valor } : t)),
    }));
  }

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

  function addTarea(e: React.FormEvent) {
    e.preventDefault();
    if (!tDesc.trim()) return;
    const nueva: Tarea = { id: newId(), descripcion: tDesc.trim(), asignadoA: tQuien, hecha: false };
    updateProyecto(proyecto!.id, (p) => ({ ...p, tareas: [...p.tareas, nueva] }));
    setTDesc("");
  }

  function borrar(lista: "gastos" | "ingresos" | "tareas", itemId: string) {
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

  async function cargarGastoIA(e: React.FormEvent) {
    e.preventDefault();
    if (!iaTexto.trim()) return;
    setIaError("");
    setIaLoading(true);
    try {
      const res = await fetch("/api/gestion/gasto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: iaTexto }),
      });
      const data = await res.json();
      if (!res.ok) {
        setIaError(data.error ?? "No se pudo interpretar.");
        return;
      }
      const g = data.gasto;
      const nuevo: Gasto = {
        id: newId(),
        producto: String(g.producto),
        precio: Number(g.precio) || 0,
        cantidad: Number(g.cantidad) || 1,
        pagadoPor: (SOCIOS as readonly string[]).includes(g.pagadoPor) ? g.pagadoPor : SOCIOS[0],
      };
      updateProyecto(proyecto!.id, (p) => ({ ...p, gastos: [...p.gastos, nuevo] }));
      setIaTexto("");
    } catch {
      setIaError("No se pudo conectar con la IA.");
    } finally {
      setIaLoading(false);
    }
  }

  async function redactarMensaje() {
    setMensajeError("");
    setMensaje("");
    setMensajeLoading(true);
    try {
      const res = await fetch("/api/gestion/mensaje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: proyecto!.nombre,
          cliente: proyecto!.cliente,
          entregado: proyecto!.entregado,
          pagado: proyecto!.pagado,
          fecha: proyecto!.fecha,
          ingresos: proyecto!.ingresos.map((i) => ({ producto: i.producto, cantidad: i.cantidad })),
          total: totalIngresos(proyecto!),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMensajeError(data.error ?? "No se pudo generar.");
        return;
      }
      setMensaje(data.mensaje);
    } catch {
      setMensajeError("No se pudo conectar con la IA.");
    } finally {
      setMensajeLoading(false);
    }
  }

  const waMensaje = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="flex-1">
          <button onClick={() => router.push("/gestion")} className="text-sm text-white/50 hover:text-white mb-2">
            ← Tablero
          </button>
          <div className="flex items-baseline gap-2">
            <span className="text-white/40">{proyecto.numero}.</span>
            <input
              value={proyecto.nombre}
              onChange={(e) => updateProyecto(proyecto.id, (p) => ({ ...p, nombre: e.target.value }))}
              className="text-xl font-medium bg-transparent outline-none border-b border-transparent hover:border-white/20 focus:border-white/40 flex-1"
            />
          </div>
          <input
            value={proyecto.cliente}
            onChange={(e) => updateProyecto(proyecto.id, (p) => ({ ...p, cliente: e.target.value }))}
            placeholder="Cliente"
            className="text-sm text-white/50 bg-transparent outline-none border-b border-transparent hover:border-white/20 focus:border-white/40 mt-1"
          />
        </div>
        <button onClick={eliminarProyecto} className="text-sm text-red-400/70 hover:text-red-400 whitespace-nowrap">
          Eliminar proyecto
        </button>
      </div>

      {/* Mensaje al cliente con IA */}
      <div className="mb-6">
        <button
          onClick={redactarMensaje}
          disabled={mensajeLoading}
          className="px-4 py-2 rounded-full bg-white/10 text-white text-sm hover:bg-white/20 active:scale-95 transition disabled:opacity-50"
        >
          ✨ Redactar mensaje al cliente
        </button>
        {mensajeLoading && (
          <div className="mt-3">
            <PrintLoader label="Redactando el mensaje…" />
          </div>
        )}
        {mensajeError && <p className="mt-2 text-sm text-red-400">{mensajeError}</p>}
        {mensaje && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 border border-white/10 rounded-lg p-4 bg-white/[0.03]"
          >
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={5}
              className="w-full bg-transparent outline-none text-sm resize-none"
            />
            <div className="flex gap-2 mt-2">
              <a
                href={waMensaje}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-md text-sm bg-green-500/20 text-green-300 hover:bg-green-500/30"
              >
                Enviar por WhatsApp
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(mensaje)}
                className="px-3 py-1.5 rounded-md text-sm bg-white/10 hover:bg-white/20"
              >
                Copiar
              </button>
              <button
                onClick={() => setMensaje("")}
                className="px-3 py-1.5 rounded-md text-sm text-white/50 hover:bg-white/10"
              >
                Descartar
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Datos generales */}
      <Section title="Datos generales">
        <div className="grid sm:grid-cols-3 gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={proyecto.entregado}
              onChange={(e) => updateProyecto(proyecto.id, (p) => ({ ...p, entregado: e.target.checked }))}
            />
            Entregado
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={proyecto.pagado}
              onChange={(e) => updateProyecto(proyecto.id, (p) => ({ ...p, pagado: e.target.checked }))}
            />
            Pagado
          </label>
          <div>
            <label className="block text-xs text-white/40 mb-1">Para cuándo es</label>
            <input
              type="date"
              value={proyecto.fecha}
              onChange={(e) => updateProyecto(proyecto.id, (p) => ({ ...p, fecha: e.target.value }))}
              className="input"
            />
          </div>
        </div>
        <p className="mt-3 text-sm text-white/50">
          Estado: <span className="text-white">{estadoProyecto(proyecto)}</span>
        </p>
      </Section>

      {/* Gastos */}
      <Section title={`Gastos — total ${formatCurrency(totalGastos(proyecto))}`}>
        {proyecto.gastos.length > 0 && (
          <table className="w-full text-sm mb-3">
            <thead>
              <tr className="text-white/40 text-xs">
                <th className="text-left font-normal pb-2">Producto</th>
                <th className="text-left font-normal pb-2">Precio</th>
                <th className="text-left font-normal pb-2">Cant.</th>
                <th className="text-left font-normal pb-2">Pagó</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {proyecto.gastos.map((g) => (
                <tr key={g.id} className="border-t border-white/5">
                  <td className="py-1.5 pr-2">
                    <input
                      value={g.producto}
                      onChange={(e) => editarGasto(g.id, "producto", e.target.value)}
                      className="input w-full"
                    />
                  </td>
                  <td className="py-1.5 pr-2">
                    <input
                      type="number"
                      value={g.precio}
                      onChange={(e) => editarGasto(g.id, "precio", e.target.value)}
                      className="input w-24"
                    />
                  </td>
                  <td className="py-1.5 pr-2">
                    <input
                      type="number"
                      step="0.1"
                      value={g.cantidad}
                      onChange={(e) => editarGasto(g.id, "cantidad", e.target.value)}
                      className="input w-16"
                    />
                  </td>
                  <td className="py-1.5 pr-2">
                    <select
                      value={g.pagadoPor}
                      onChange={(e) => editarGasto(g.id, "pagadoPor", e.target.value)}
                      className="input"
                    >
                      {SOCIOS.map((s) => (
                        <option key={s} value={s} className="bg-black">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-1.5">
                    <button onClick={() => borrar("gastos", g.id)} className="text-white/30 hover:text-red-400">
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <form onSubmit={addGasto} className="flex flex-wrap gap-2">
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

        {/* Cargar gasto por texto con IA */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-white/40 mb-2 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
            Cargar escribiendo (IA)
          </p>
          <form onSubmit={cargarGastoIA} className="flex flex-wrap gap-2">
            <input
              value={iaTexto}
              onChange={(e) => setIaTexto(e.target.value)}
              placeholder="Ej: compré 2 rollos de filamento negro a 20 mil, pagó Juan"
              className="input flex-1 min-w-[220px]"
            />
            <button
              type="submit"
              disabled={iaLoading}
              className="px-3 py-1.5 rounded-md bg-white/10 text-white text-sm hover:bg-white/20 disabled:opacity-50"
            >
              Cargar
            </button>
          </form>
          {iaLoading && (
            <div className="mt-2">
              <PrintLoader label="Interpretando el gasto…" />
            </div>
          )}
          {iaError && <p className="mt-2 text-sm text-red-400">{iaError}</p>}
        </div>
      </Section>

      {/* Ingresos */}
      <Section title={`Ingresos — total ${formatCurrency(totalIngresos(proyecto))}`}>
        {proyecto.ingresos.length > 0 && (
          <table className="w-full text-sm mb-3">
            <thead>
              <tr className="text-white/40 text-xs">
                <th className="text-left font-normal pb-2">Producto</th>
                <th className="text-left font-normal pb-2">Precio</th>
                <th className="text-left font-normal pb-2">Cant.</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {proyecto.ingresos.map((i) => (
                <tr key={i.id} className="border-t border-white/5">
                  <td className="py-1.5 pr-2">
                    <input
                      value={i.producto}
                      onChange={(e) => editarIngreso(i.id, "producto", e.target.value)}
                      className="input w-full"
                    />
                  </td>
                  <td className="py-1.5 pr-2">
                    <input
                      type="number"
                      value={i.precio}
                      onChange={(e) => editarIngreso(i.id, "precio", e.target.value)}
                      className="input w-24"
                    />
                  </td>
                  <td className="py-1.5 pr-2">
                    <input
                      type="number"
                      value={i.cantidad}
                      onChange={(e) => editarIngreso(i.id, "cantidad", e.target.value)}
                      className="input w-16"
                    />
                  </td>
                  <td className="py-1.5">
                    <button onClick={() => borrar("ingresos", i.id)} className="text-white/30 hover:text-red-400">
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <form onSubmit={addIngreso} className="flex flex-wrap gap-2">
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

      {/* Tareas */}
      <Section title="Tareas">
        <div className="space-y-1 mb-3">
          {proyecto.tareas.map((t) => (
            <div key={t.id} className="flex items-center gap-2 text-sm py-1">
              <input type="checkbox" checked={t.hecha} onChange={() => editarTarea(t.id, "hecha", !t.hecha)} />
              <input
                value={t.descripcion}
                onChange={(e) => editarTarea(t.id, "descripcion", e.target.value)}
                className={`input flex-1 ${t.hecha ? "line-through text-white/30" : ""}`}
              />
              <select
                value={t.asignadoA}
                onChange={(e) => editarTarea(t.id, "asignadoA", e.target.value)}
                className="input w-24"
              >
                {SOCIOS.map((s) => (
                  <option key={s} value={s} className="bg-black">
                    {s}
                  </option>
                ))}
              </select>
              <button onClick={() => borrar("tareas", t.id)} className="text-white/30 hover:text-red-400">
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
