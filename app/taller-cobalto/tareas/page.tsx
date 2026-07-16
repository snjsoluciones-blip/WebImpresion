"use client";

import Link from "next/link";
import { useStore } from "../lib/store";
import { SOCIOS, Socio } from "../lib/types";
import { BASE } from "../lib/rutas";

export default function Tareas() {
  const { db, updateProyecto } = useStore();

  const tareasPorSocio: Record<Socio, { proyectoId: string; proyectoNombre: string; tareaId: string; descripcion: string; hecha: boolean }[]> = {
    Titi: [],
    Nico: [],
    Juan: [],
  };

  for (const p of db.proyectos) {
    for (const t of p.tareas) {
      tareasPorSocio[t.asignadoA].push({
        proyectoId: p.id,
        proyectoNombre: p.nombre,
        tareaId: t.id,
        descripcion: t.descripcion,
        hecha: t.hecha,
      });
    }
  }

  function toggle(proyectoId: string, tareaId: string) {
    updateProyecto(proyectoId, (p) => ({
      ...p,
      tareas: p.tareas.map((t) => (t.id === tareaId ? { ...t, hecha: !t.hecha } : t)),
    }));
  }

  return (
    <div>
      <h1 className="text-xl font-medium mb-1">Tareas</h1>
      <p className="text-sm text-white/50 mb-6">Lo que hay que hacer en cada proyecto, por socio.</p>

      <div className="grid sm:grid-cols-3 gap-4">
        {SOCIOS.map((s) => {
          const tareas = tareasPorSocio[s];
          const pendientes = tareas.filter((t) => !t.hecha);
          const hechas = tareas.filter((t) => t.hecha);
          return (
            <div key={s} className="border border-white/10 rounded-lg p-4">
              <p className="font-medium mb-3">{s}</p>
              {tareas.length === 0 && <p className="text-sm text-white/30">Sin tareas asignadas.</p>}
              <div className="space-y-2">
                {[...pendientes, ...hechas].map((t) => (
                  <label key={t.tareaId} className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={t.hecha}
                      onChange={() => toggle(t.proyectoId, t.tareaId)}
                      className="mt-0.5"
                    />
                    <span className={t.hecha ? "line-through text-white/30" : ""}>
                      {t.descripcion}
                      <Link
                        href={`${BASE}/proyectos/${t.proyectoId}`}
                        className="block text-xs text-white/40 hover:text-white/60"
                      >
                        {t.proyectoNombre}
                      </Link>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
