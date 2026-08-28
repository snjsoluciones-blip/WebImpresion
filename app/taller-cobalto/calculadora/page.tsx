"use client";

import { useState } from "react";
import { formatCurrency } from "../lib/calc";

interface Linea {
  id: number;
  nombre: string;
  gramos: string;
  precioRollo: string;
}

let uid = 0;
const nuevaLinea = (): Linea => ({ id: uid++, nombre: "", gramos: "", precioRollo: "" });

export default function Calculadora() {
  const [lineas, setLineas] = useState<Linea[]>([nuevaLinea()]);
  const [otrosCostos, setOtrosCostos] = useState("");
  const [margen, setMargen] = useState("40");

  function actualizarLinea(id: number, campo: keyof Linea, valor: string) {
    setLineas((prev) => prev.map((l) => (l.id === id ? { ...l, [campo]: valor } : l)));
  }

  function agregarLinea() {
    setLineas((prev) => [...prev, nuevaLinea()]);
  }

  function borrarLinea(id: number) {
    setLineas((prev) => (prev.length > 1 ? prev.filter((l) => l.id !== id) : prev));
  }

  const costoMaterial = lineas.reduce((acc, l) => {
    const gramos = Number(l.gramos) || 0;
    const precioRollo = Number(l.precioRollo) || 0;
    return acc + (gramos / 1000) * precioRollo;
  }, 0);

  const costoTotal = costoMaterial + (Number(otrosCostos) || 0);
  const margenNum = Number(margen) || 0;
  const precioSugerido = costoTotal * (1 + margenNum / 100);
  const gananciaEstimada = precioSugerido - costoTotal;

  return (
    <div>
      <h1 className="text-xl font-medium mb-1">Calculadora de costos</h1>
      <p className="text-sm text-white/50 mb-6">
        Para saber cuánto cobrar antes de aceptar un trabajo. No se guarda en ningún proyecto,
        es solo para calcular.
      </p>

      <div className="border border-white/10 rounded-lg p-4 mb-6">
        <h2 className="text-sm font-medium text-white/70 mb-3">Filamento usado</h2>
        <div className="space-y-2 mb-3">
          {lineas.map((l) => (
            <div key={l.id} className="flex flex-wrap gap-2">
              <input
                value={l.nombre}
                onChange={(e) => actualizarLinea(l.id, "nombre", e.target.value)}
                placeholder="Color / material"
                className="input flex-1 min-w-[140px]"
              />
              <input
                value={l.gramos}
                onChange={(e) => actualizarLinea(l.id, "gramos", e.target.value)}
                placeholder="Gramos usados"
                type="number"
                className="input w-32"
              />
              <input
                value={l.precioRollo}
                onChange={(e) => actualizarLinea(l.id, "precioRollo", e.target.value)}
                placeholder="Precio del rollo (1kg)"
                type="number"
                className="input w-40"
              />
              <button
                onClick={() => borrarLinea(l.id)}
                className="text-white/30 hover:text-red-400 px-2"
                type="button"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={agregarLinea}
          type="button"
          className="text-sm text-white/60 hover:text-white"
        >
          + Agregar material
        </button>
      </div>

      <div className="border border-white/10 rounded-lg p-4 mb-6">
        <h2 className="text-sm font-medium text-white/70 mb-3">Otros costos y margen</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1">
              Otros costos (insertos, tornillos, etc.)
            </label>
            <input
              value={otrosCostos}
              onChange={(e) => setOtrosCostos(e.target.value)}
              placeholder="0"
              type="number"
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">Margen de ganancia deseado (%)</label>
            <input
              value={margen}
              onChange={(e) => setMargen(e.target.value)}
              placeholder="40"
              type="number"
              className="input w-full"
            />
          </div>
        </div>
      </div>

      <div className="border border-white/10 rounded-lg p-4 bg-white/[0.03]">
        <h2 className="text-sm font-medium text-white/70 mb-4">Resultado</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-white/50 mb-1">Costo total</p>
            <p className="text-xl font-medium">{formatCurrency(costoTotal)}</p>
          </div>
          <div>
            <p className="text-xs text-white/50 mb-1">Precio sugerido de venta</p>
            <p className="text-xl font-medium text-emerald-300">{formatCurrency(precioSugerido)}</p>
          </div>
          <div>
            <p className="text-xs text-white/50 mb-1">Ganancia estimada</p>
            <p className="text-xl font-medium text-amber-300">{formatCurrency(gananciaEstimada)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
