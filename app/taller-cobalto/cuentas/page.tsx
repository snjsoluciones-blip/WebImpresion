"use client";

import { useStore } from "../lib/store";
import { cuentasGlobales, formatCurrency } from "../lib/calc";
import { SOCIOS } from "../lib/types";

export default function Cuentas() {
  const { db } = useStore();
  const cuentas = cuentasGlobales(db.proyectos);

  const promedio =
    SOCIOS.reduce((acc, s) => acc + cuentas[s].cobra, 0) / SOCIOS.length;

  return (
    <div>
      <h1 className="text-xl font-medium mb-1">Cuentas entre socios</h1>
      <p className="text-sm text-white/50 mb-6">
        Suma de todos los proyectos: lo que puso cada uno de su bolsillo y lo que le toca cobrar.
      </p>

      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        {SOCIOS.map((s) => {
          const diff = cuentas[s].cobra - promedio;
          return (
            <div key={s} className="border border-white/10 rounded-lg p-4">
              <p className="font-medium mb-3">{s}</p>
              <p className="text-xs text-white/50">Puso en total</p>
              <p className="text-lg mb-2">{formatCurrency(cuentas[s].puso)}</p>
              <p className="text-xs text-white/50">Le toca cobrar</p>
              <p className="text-lg text-green-300">{formatCurrency(cuentas[s].cobra)}</p>
              {Math.abs(diff) > 1 && (
                <p className="text-xs text-white/40 mt-2">
                  {diff > 0
                    ? `${formatCurrency(diff)} por arriba del promedio`
                    : `${formatCurrency(-diff)} por debajo del promedio`}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-white/30">
        La ganancia de cada proyecto siempre se reparte en 3 partes iguales, así que en el
        largo plazo los 3 terminan cobrando lo mismo — la diferencia de arriba muestra
        solo el desbalance temporal por gastos que puso cada uno.
      </p>
    </div>
  );
}
