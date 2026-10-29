"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStore, newId } from "../lib/store";
import { formatCurrency, proyectosDeCliente, statsCliente, estadoProyecto } from "../lib/calc";
import { claveCliente, Cliente } from "../lib/types";
import { BASE } from "../lib/rutas";

const COLUMNAS = "grid-cols-[1.5fr_1fr_1.1fr_0.7fr_0.8fr_1fr_1fr_88px]";
const INPUT =
  "w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/30";

export default function Clientes() {
  const { db, applyBatch } = useStore();
  const [busqueda, setBusqueda] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [nuevo, setNuevo] = useState({ nombre: "", telefono: "", otroContacto: "" });
  const [error, setError] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [edit, setEdit] = useState({ nombre: "", telefono: "", otroContacto: "" });
  const [abiertoId, setAbiertoId] = useState<string | null>(null);

  const filas = useMemo(() => {
    const q = claveCliente(busqueda);
    return [...db.clientes]
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
      .filter((c) => !q || `${c.nombre} ${c.telefono} ${c.otroContacto}`.toLowerCase().includes(q))
      .map((c) => ({ cliente: c, stats: statsCliente(db.proyectos, c.nombre) }));
  }, [db.clientes, db.proyectos, busqueda]);

  const totales = filas.reduce(
    (acc, f) => ({
      encargados: acc.encargados + f.stats.encargados,
      entregados: acc.entregados + f.stats.entregados,
      ganancia: acc.ganancia + f.stats.ganancia,
      debe: acc.debe + f.stats.debe,
    }),
    { encargados: 0, entregados: 0, ganancia: 0, debe: 0 }
  );

  function existe(nombre: string, ignorarId?: string) {
    return db.clientes.some((c) => c.id !== ignorarId && claveCliente(c.nombre) === claveCliente(nombre));
  }

  function crear(e: React.FormEvent) {
    e.preventDefault();
    const nombre = nuevo.nombre.trim();
    if (!nombre) return;
    if (existe(nombre)) {
      setError("Ya hay un cliente con ese nombre.");
      return;
    }
    const cliente: Cliente = {
      id: newId(),
      nombre,
      telefono: nuevo.telefono.trim(),
      otroContacto: nuevo.otroContacto.trim(),
    };
    applyBatch((d) => ({ ...d, clientes: [...d.clientes, cliente] }));
    setNuevo({ nombre: "", telefono: "", otroContacto: "" });
    setError("");
    setShowForm(false);
  }

  function empezarEdicion(c: Cliente) {
    setEditandoId(c.id);
    setEdit({ nombre: c.nombre, telefono: c.telefono, otroContacto: c.otroContacto });
    setError("");
  }

  function guardarEdicion(c: Cliente) {
    const nombre = edit.nombre.trim();
    if (!nombre) return;
    if (existe(nombre, c.id)) {
      setError("Ya hay otro cliente con ese nombre.");
      return;
    }
    // Si cambia el nombre, se actualiza también en sus proyectos y presupuestos.
    applyBatch((d) => ({
      ...d,
      clientes: d.clientes.map((x) =>
        x.id === c.id ? { ...x, nombre, telefono: edit.telefono.trim(), otroContacto: edit.otroContacto.trim() } : x
      ),
      proyectos: d.proyectos.map((p) =>
        claveCliente(p.cliente) === claveCliente(c.nombre) ? { ...p, cliente: nombre } : p
      ),
      presupuestos: d.presupuestos.map((p) =>
        claveCliente(p.cliente) === claveCliente(c.nombre) ? { ...p, cliente: nombre } : p
      ),
    }));
    setEditandoId(null);
    setError("");
  }

  function borrar(c: Cliente) {
    const cuantos = db.proyectos.filter((p) => !p.eliminadoEn && claveCliente(p.cliente) === claveCliente(c.nombre)).length;
    const aviso = cuantos
      ? `"${c.nombre}" tiene ${cuantos} proyecto(s). Los proyectos NO se borran, pero el cliente sale de la lista. ¿Seguro?`
      : `¿Sacar a "${c.nombre}" de la lista de clientes?`;
    if (!confirm(aviso)) return;
    applyBatch((d) => ({ ...d, clientes: d.clientes.filter((x) => x.id !== c.id) }));
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Metric label="Clientes" value={String(db.clientes.length)} index={0} />
        <Metric label="Ganancia de clientes" value={formatCurrency(totales.ganancia)} index={1} />
        <Metric label="Nos deben" value={formatCurrency(totales.debe)} accent="text-amber-300" index={2} />
        <Metric label="Proyectos entregados" value={`${totales.entregados} de ${totales.encargados}`} index={3} />
      </div>

      <div className="flex items-center justify-between mb-4 gap-2">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar cliente…"
          className={`${INPUT} max-w-xs`}
        />
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-3 py-1.5 rounded-md text-sm bg-white text-black hover:bg-white/90 whitespace-nowrap"
        >
          + Nuevo cliente
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={crear}
          className="mb-6 p-4 border border-white/10 rounded-lg bg-white/[0.03] flex flex-col sm:flex-row gap-3"
        >
          <input
            autoFocus
            value={nuevo.nombre}
            onChange={(e) => setNuevo((n) => ({ ...n, nombre: e.target.value }))}
            placeholder="Nombre"
            className={INPUT}
          />
          <input
            value={nuevo.telefono}
            onChange={(e) => setNuevo((n) => ({ ...n, telefono: e.target.value }))}
            placeholder="Teléfono"
            inputMode="tel"
            className={INPUT}
          />
          <input
            value={nuevo.otroContacto}
            onChange={(e) => setNuevo((n) => ({ ...n, otroContacto: e.target.value }))}
            placeholder="Otro contacto (email, Instagram…)"
            className={INPUT}
          />
          <button type="submit" className="px-4 py-2 rounded-md bg-white text-black text-sm font-medium whitespace-nowrap">
            Guardar
          </button>
        </form>
      )}

      {error && <p className="mb-3 text-sm text-red-300">{error}</p>}

      <div className="border border-white/10 rounded-lg overflow-x-auto">
        <div className="min-w-[720px]">
          <div className={`grid ${COLUMNAS} gap-2 px-4 py-2 text-xs text-white/40 border-b border-white/10`}>
            <span>Cliente</span>
            <span>Teléfono</span>
            <span>Otro contacto</span>
            <span className="text-right">Encargó</span>
            <span className="text-right">Entregados</span>
            <span className="text-right">Ganancia</span>
            <span className="text-right">Nos debe</span>
            <span className="w-[88px]" />
          </div>

          {filas.length === 0 && (
            <p className="px-4 py-6 text-sm text-white/40">
              {db.clientes.length === 0 ? "Todavía no cargaste clientes." : "No hay clientes con esa búsqueda."}
            </p>
          )}

          {filas.map(({ cliente: c, stats }, i) => {
            const editando = editandoId === c.id;
            const abierto = abiertoId === c.id;
            const suyos = abierto ? proyectosDeCliente(db.proyectos, c.nombre) : [];
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.4), ease: "easeOut" }}
                className="border-b border-white/5 last:border-0"
              >
                {editando ? (
                  <div className="grid grid-cols-1 sm:grid-cols-[1.6fr_1fr_1.2fr_auto] gap-2 px-4 py-3">
                    <input
                      autoFocus
                      value={edit.nombre}
                      onChange={(e) => setEdit((x) => ({ ...x, nombre: e.target.value }))}
                      className={INPUT}
                    />
                    <input
                      value={edit.telefono}
                      onChange={(e) => setEdit((x) => ({ ...x, telefono: e.target.value }))}
                      placeholder="Teléfono"
                      className={INPUT}
                    />
                    <input
                      value={edit.otroContacto}
                      onChange={(e) => setEdit((x) => ({ ...x, otroContacto: e.target.value }))}
                      placeholder="Otro contacto"
                      className={INPUT}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => guardarEdicion(c)}
                        className="px-3 py-2 rounded-md bg-white text-black text-sm font-medium"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setEditandoId(null);
                          setError("");
                        }}
                        className="px-3 py-2 rounded-md text-sm text-white/60 hover:bg-white/10"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`grid ${COLUMNAS} gap-2 px-4 py-3 items-center hover:bg-white/[0.04] transition`}>
                    <button
                      onClick={() => setAbiertoId(abierto ? null : c.id)}
                      className="text-left font-medium hover:underline underline-offset-4"
                      aria-expanded={abierto}
                    >
                      {c.nombre}
                    </button>
                    <span className="text-sm text-white/70">{c.telefono || "—"}</span>
                    <span className="text-sm text-white/70 break-words">{c.otroContacto || "—"}</span>
                    <span className="text-right">{stats.encargados}</span>
                    <span className="text-right">{stats.entregados}</span>
                    <span className="text-right">{formatCurrency(stats.ganancia)}</span>
                    <span className={`text-right ${stats.debe > 0 ? "text-amber-300" : "text-white/50"}`}>
                      {formatCurrency(stats.debe)}
                    </span>
                    <span className="flex gap-1 justify-end w-[88px]">
                      <button
                        onClick={() => empezarEdicion(c)}
                        className="px-2 py-1 rounded-md text-xs text-white/60 hover:bg-white/10"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => borrar(c)}
                        aria-label={`Quitar a ${c.nombre}`}
                        className="px-2 py-1 rounded-md text-xs text-white/40 hover:bg-white/10 hover:text-red-300"
                      >
                        ✕
                      </button>
                    </span>
                  </div>
                )}

                {abierto && !editando && (
                  <div className="px-4 pb-3 -mt-1">
                    {suyos.length === 0 ? (
                      <p className="text-xs text-white/40">Todavía no tiene proyectos confirmados.</p>
                    ) : (
                      <ul className="m-0 p-0 list-none flex flex-col gap-1">
                        {suyos.map((p) => (
                          <li key={p.id}>
                            <Link
                              href={`${BASE}/proyectos/${p.id}`}
                              className="text-sm text-white/70 hover:text-white hover:underline underline-offset-4"
                            >
                              {p.numero}. {p.nombre}
                            </Link>
                            <span className="text-xs text-white/40 ml-2">{estadoProyecto(p)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-xs text-white/40 leading-relaxed">
        Encargó = proyectos confirmados. Ganancia = lo que nos dejaron los proyectos que ya pagó (ingresos menos gastos).
        Nos debe = lo que hay que cobrarle en los proyectos que todavía no pagó.
      </p>
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
      <p className={`text-xl font-medium ${accent ?? ""}`}>{value}</p>
    </motion.div>
  );
}
