"use client";

import { useParams, useRouter } from "next/navigation";
import { useStore } from "../../lib/store";
import { totalPresupuesto, formatCurrency } from "../../lib/calc";

export default function PresupuestoDetalle() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { db } = useStore();
  const presupuesto = db.presupuestos.find((p) => p.id === id);

  if (!presupuesto) {
    return (
      <div>
        <p className="text-neutral-500 mb-4">No se encontró el presupuesto.</p>
        <button onClick={() => router.push("/gestion/presupuestos")} className="text-sm underline">
          Volver
        </button>
      </div>
    );
  }

  const total = totalPresupuesto(presupuesto.items);

  const textoWhatsapp = [
    `*Presupuesto SNJ Soluciones*`,
    `Cliente: ${presupuesto.cliente}`,
    `Fecha: ${presupuesto.fecha}`,
    ``,
    ...presupuesto.items.map((it) => `${it.pieza} x${it.cantidad} — ${formatCurrency(it.precio)}`),
    ``,
    `Total: ${formatCurrency(total)}`,
    ``,
    `https://www.snjsoluciones.com.ar/`,
  ].join("\n");

  const waLink = `https://wa.me/?text=${encodeURIComponent(textoWhatsapp)}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <button onClick={() => router.push("/gestion/presupuestos")} className="text-sm text-neutral-500 hover:text-neutral-800">
          ← Presupuestos
        </button>
        <div className="flex gap-2">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-md text-sm bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          >
            Enviar por WhatsApp
          </a>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-md text-sm bg-neutral-800 text-white hover:bg-neutral-700"
          >
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="border border-black/10 rounded-lg p-8 bg-white text-black print:border-0 print:p-0">
        <p className="text-lg font-medium">SNJ Soluciones</p>
        <p className="text-sm text-black/60 mb-6">www.snjsoluciones.com.ar</p>

        <p className="text-sm text-black/50">Presupuesto</p>
        <p className="text-base mb-1">Cliente: {presupuesto.cliente}</p>
        <p className="text-sm text-black/50 mb-6">{presupuesto.fecha}</p>

        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="text-black/40 border-b border-black/10">
              <th className="text-left font-normal py-2">Pieza</th>
              <th className="text-left font-normal py-2">Cant.</th>
              <th className="text-right font-normal py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {presupuesto.items.map((it) => (
              <tr key={it.id} className="border-b border-black/5">
                <td className="py-2">{it.pieza}</td>
                <td className="py-2">{it.cantidad}</td>
                <td className="py-2 text-right">{formatCurrency(it.precio)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <p className="text-lg font-medium">Total: {formatCurrency(total)}</p>
        </div>
      </div>
    </div>
  );
}
