"use client";

import Link from "next/link";
import { useStore } from "../lib/store";
import { claveCliente } from "../lib/types";
import { BASE } from "../lib/rutas";

/**
 * Menú desplegable con los clientes cargados en la pestaña Clientes. Si el proyecto ya
 * tenía un nombre escrito a mano que no está en la lista, se muestra igual (para no perderlo).
 */
export default function ClienteSelect({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (nombre: string) => void;
  className?: string;
}) {
  const { db } = useStore();
  const clientes = [...db.clientes].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  const enLista = !value.trim() || clientes.some((c) => claveCliente(c.nombre) === claveCliente(value));

  return (
    <span className="inline-flex flex-1 flex-col gap-1">
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`${className} [&>option]:text-black`}>
        <option value="">— Elegir cliente —</option>
        {!enLista && <option value={value}>{value} (no está en Clientes)</option>}
        {clientes.map((c) => (
          <option key={c.id} value={c.nombre}>
            {c.nombre}
          </option>
        ))}
      </select>
      <Link href={`${BASE}/clientes`} className="text-xs text-white/40 hover:text-white/70 underline underline-offset-2">
        ¿No está? Cargalo en Clientes
      </Link>
    </span>
  );
}
