"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "../lib/store";
import { Proyecto } from "../lib/types";

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function toKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function Calendario() {
  const { db } = useStore();
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const proyectosPorFecha = useMemo(() => {
    const map: Record<string, Proyecto[]> = {};
    for (const p of db.proyectos) {
      if (!p.fecha) continue;
      if (!map[p.fecha]) map[p.fecha] = [];
      map[p.fecha].push(p);
    }
    return map;
  }, [db.proyectos]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // semana arranca lunes
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const todayKey = toKey(new Date());

  const proximos = [...db.proyectos].filter((p) => p.fecha).sort((a, b) => a.fecha.localeCompare(b.fecha));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Calendario</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="px-2 py-1 rounded-md hover:bg-white/10 text-sm"
          >
            ←
          </button>
          <span className="text-sm w-36 text-center capitalize">
            {MESES[month]} {year}
          </span>
          <button
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="px-2 py-1 rounded-md hover:bg-white/10 text-sm"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-8">
        {DIAS.map((d) => (
          <div key={d} className="text-center text-xs text-white/40 pb-2">
            {d}
          </div>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const key = toKey(date);
          const proyectosDelDia = proyectosPorFecha[key] ?? [];
          const isToday = key === todayKey;
          return (
            <div
              key={i}
              className={`min-h-[70px] rounded-md border p-1.5 text-xs ${
                isToday ? "border-white/40" : "border-white/10"
              }`}
            >
              <p className={`mb-1 ${isToday ? "text-white font-medium" : "text-white/50"}`}>{date.getDate()}</p>
              {proyectosDelDia.map((p) => (
                <Link
                  key={p.id}
                  href={`/gestion/proyectos/${p.id}`}
                  className="block truncate rounded bg-white/10 px-1.5 py-0.5 mb-1 hover:bg-white/20"
                  title={p.nombre}
                >
                  {p.nombre}
                </Link>
              ))}
            </div>
          );
        })}
      </div>

      <h2 className="text-sm font-medium text-white/70 mb-3">Próximas fechas</h2>
      <div className="border border-white/10 rounded-lg overflow-hidden">
        {proximos.length === 0 && (
          <p className="px-4 py-6 text-sm text-white/40">No hay proyectos con fecha cargada.</p>
        )}
        {proximos.map((p) => (
          <Link
            key={p.id}
            href={`/gestion/proyectos/${p.id}`}
            className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.04]"
          >
            <span className="font-medium">
              {p.numero}. {p.nombre}
            </span>
            <span className="text-sm text-white/50">{p.fecha}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
