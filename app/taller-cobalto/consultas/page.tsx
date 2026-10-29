"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStore, newId } from "../lib/store";
import { claveCliente, Cliente, Proyecto } from "../lib/types";
import { BASE } from "../lib/rutas";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import {
  Consulta,
  EstadoConsulta,
  borrarConsulta,
  cambiarEstado,
  guardarNota,
  linkArchivo,
  listarConsultas,
  telefonoParaWhatsapp,
} from "../lib/consultas";

const FILTROS: { id: EstadoConsulta | "todas"; label: string }[] = [
  { id: "nueva", label: "Nuevas" },
  { id: "respondida", label: "Respondidas" },
  { id: "convertida", label: "Pasadas a proyecto" },
  { id: "descartada", label: "Descartadas" },
  { id: "todas", label: "Todas" },
];

const ESTADO_STYLE: Record<EstadoConsulta, string> = {
  nueva: "bg-amber-400/15 text-amber-300",
  respondida: "bg-blue-400/15 text-blue-300",
  convertida: "bg-green-400/15 text-green-300",
  descartada: "bg-white/10 text-white/50",
};

const fechaCorta = (iso: string) =>
  new Date(iso).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

export default function Consultas() {
  const { db, applyBatch } = useStore();
  const [items, setItems] = useState<Consulta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<EstadoConsulta | "todas">("nueva");
  const [aviso, setAviso] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    const { data, error } = await listarConsultas();
    setItems(data);
    setError(error);
    setCargando(false);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const id = window.setTimeout(cargar, 0);
    return () => window.clearTimeout(id);
  }, [cargar]);

  if (!isSupabaseConfigured) {
    return (
      <p className="text-sm text-white/50">
        Las consultas de la web llegan acá cuando la gestión está conectada a Supabase (en la versión de prueba local no se
        ven).
      </p>
    );
  }

  const visibles = items.filter((c) => filtro === "todas" || c.estado === filtro);
  const nuevas = items.filter((c) => c.estado === "nueva").length;

  async function marcar(c: Consulta, estado: EstadoConsulta) {
    if (await cambiarEstado(c.id, estado)) {
      setItems((prev) => prev.map((x) => (x.id === c.id ? { ...x, estado } : x)));
    } else {
      setAviso("No se pudo guardar el cambio. Probá de nuevo.");
    }
  }

  async function bajarArchivo(c: Consulta) {
    const url = await linkArchivo(c.archivo_path);
    if (url) window.open(url, "_blank", "noopener");
    else setAviso("No se pudo abrir el archivo.");
  }

  async function eliminar(c: Consulta) {
    if (!confirm(`¿Borrar para siempre la consulta de "${c.nombre}"${c.archivo_path ? " y su archivo" : ""}?`)) return;
    if (await borrarConsulta(c)) setItems((prev) => prev.filter((x) => x.id !== c.id));
    else setAviso("No se pudo borrar. Probá de nuevo.");
  }

  async function pasarAProyecto(c: Consulta) {
    const vivos = db.proyectos.filter((p) => !p.eliminadoEn);
    const proyecto: Proyecto = {
      id: newId(),
      numero: vivos.length ? Math.max(...vivos.map((p) => p.numero)) + 1 : 1,
      nombre: (c.descripcion.trim().split(/\n/)[0] || c.servicio || "Consulta de la web").slice(0, 60),
      cliente: c.nombre.trim(),
      entregado: false,
      pagado: false,
      confirmado: false, // entra como "sin confirmar" hasta que se acuerde el trabajo
      fecha: "",
      gastos: [],
      ingresos: [],
      tareas: [],
      eliminadoEn: "",
    };
    applyBatch((d) => {
      const existe = d.clientes.some((x) => claveCliente(x.nombre) === claveCliente(c.nombre));
      const nuevoCliente: Cliente = {
        id: newId(),
        nombre: c.nombre.trim(),
        telefono: c.telefono.trim(),
        otroContacto: c.email.trim(),
      };
      return {
        ...d,
        clientes: existe ? d.clientes : [...d.clientes, nuevoCliente],
        proyectos: [...d.proyectos, proyecto],
      };
    });
    await marcar(c, "convertida");
    setAviso(`Se creó el proyecto "${proyecto.nombre}" (sin confirmar) para ${c.nombre}.`);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <div className="flex gap-1 flex-wrap">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={`px-3 py-1.5 rounded-md text-sm transition whitespace-nowrap ${
                filtro === f.id ? "bg-white text-black" : "text-white/60 hover:bg-white/10"
              }`}
            >
              {f.label}
              {f.id === "nueva" && nuevas > 0 ? ` (${nuevas})` : ""}
            </button>
          ))}
        </div>
        <button onClick={cargar} className="px-3 py-1.5 rounded-md text-sm text-white/60 hover:bg-white/10">
          Actualizar
        </button>
      </div>

      {aviso && (
        <p className="mb-4 text-sm text-emerald-300" role="status">
          {aviso}
        </p>
      )}
      {error && (
        <p className="mb-4 text-sm text-red-300">
          No se pudieron cargar las consultas ({error}). Si es la primera vez, falta correr el archivo
          supabase/consultas.sql en Supabase.
        </p>
      )}

      {cargando && <p className="text-sm text-white/40">Cargando…</p>}
      {!cargando && !error && visibles.length === 0 && (
        <p className="text-sm text-white/40">No hay consultas en este filtro.</p>
      )}

      <div className="flex flex-col gap-3">
        {visibles.map((c, i) => {
          const wa = telefonoParaWhatsapp(c.telefono);
          const mensaje = encodeURIComponent(
            `Hola ${c.nombre.split(" ")[0]}! Te escribimos de SNJ Soluciones por tu consulta de la web.`
          );
          return (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3), ease: "easeOut" }}
              className="border border-white/10 rounded-lg bg-white/[0.03] p-4"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="font-medium text-base m-0">{c.nombre}</h3>
                  <p className="text-xs text-white/40 m-0 mt-0.5">
                    {fechaCorta(c.creada)} · {c.servicio || "Sin servicio"}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${ESTADO_STYLE[c.estado]}`}>{c.estado}</span>
              </div>

              {c.descripcion && <p className="text-sm text-white/80 mt-3 whitespace-pre-wrap">{c.descripcion}</p>}

              <dl className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-sm m-0">
                <Dato label="Material" value={c.material} />
                <Dato label="Cantidad" value={c.cantidad} />
                <Dato label="Medidas" value={c.medidas} />
                <Dato label="Teléfono" value={c.telefono} />
                <Dato label="Email" value={c.email} />
                <Dato label="Archivo" value={c.archivo_nombre ? (c.archivo_path ? c.archivo_nombre : `${c.archivo_nombre} (no se guardó)`) : ""} />
              </dl>

              <NotaEditable c={c} onGuardada={(nota) => setItems((prev) => prev.map((x) => (x.id === c.id ? { ...x, nota } : x)))} />

              <div className="mt-4 flex gap-2 flex-wrap">
                {wa && (
                  <a
                    href={`https://wa.me/${wa}?text=${mensaje}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => c.estado === "nueva" && marcar(c, "respondida")}
                    className="px-3 py-1.5 rounded-md text-sm bg-emerald-500/90 text-black font-medium hover:bg-emerald-400"
                  >
                    Responder por WhatsApp
                  </a>
                )}
                {c.archivo_path && (
                  <button
                    onClick={() => bajarArchivo(c)}
                    className="px-3 py-1.5 rounded-md text-sm bg-white/10 hover:bg-white/20"
                  >
                    Bajar archivo
                  </button>
                )}
                {c.estado !== "convertida" && (
                  <button
                    onClick={() => pasarAProyecto(c)}
                    className="px-3 py-1.5 rounded-md text-sm bg-white text-black hover:bg-white/90"
                  >
                    Pasar a proyecto
                  </button>
                )}
                {c.estado === "convertida" && (
                  <Link href={BASE} className="px-3 py-1.5 rounded-md text-sm bg-white/10 hover:bg-white/20">
                    Ver en el Tablero
                  </Link>
                )}
                {c.estado !== "descartada" && c.estado !== "convertida" && (
                  <button
                    onClick={() => marcar(c, "descartada")}
                    className="px-3 py-1.5 rounded-md text-sm text-white/60 hover:bg-white/10"
                  >
                    Descartar
                  </button>
                )}
                <button
                  onClick={() => eliminar(c)}
                  className="px-3 py-1.5 rounded-md text-sm text-white/40 hover:bg-white/10 hover:text-red-300"
                >
                  Borrar
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

function Dato({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs text-white/40">{label}</dt>
      <dd className="m-0 break-words">{value}</dd>
    </div>
  );
}

function NotaEditable({ c, onGuardada }: { c: Consulta; onGuardada: (nota: string) => void }) {
  const [texto, setTexto] = useState(c.nota);
  const cambio = texto !== c.nota;
  return (
    <div className="mt-3">
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onBlur={async () => {
          if (cambio && (await guardarNota(c.id, texto))) onGuardada(texto);
        }}
        placeholder="Nota interna (se guarda al salir del cuadro)"
        rows={2}
        className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/30 resize-none"
      />
    </div>
  );
}
