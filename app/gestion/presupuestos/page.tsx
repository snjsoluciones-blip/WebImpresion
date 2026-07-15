"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore, newId } from "../lib/store";
import { totalPresupuesto, formatCurrency } from "../lib/calc";
import { Presupuesto, PresupuestoItem } from "../lib/types";

interface DraftItem {
  pieza: string;
  cantidad: string;
  precio: string;
}

const emptyItem = (): DraftItem => ({ pieza: "", cantidad: "1", precio: "" });

export default function Presupuestos() {
  const { db, addPresupuesto, removePresupuesto } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [cliente, setCliente] = useState("");
  const [items, setItems] = useState<DraftItem[]>([emptyItem()]);

  function updateItem(i: number, field: keyof DraftItem, value: string) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)));
  }

  function addRow() {
    setItems((prev) => [...prev, emptyItem()]);
  }

  function removeRow(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function crear(e: React.FormEvent) {
    e.preventDefault();
    if (!cliente.trim()) return;
    const parsedItems: PresupuestoItem[] = items
      .filter((it) => it.pieza.trim() && it.precio)
      .map((it) => ({
        id: newId(),
        pieza: it.pieza.trim(),
        cantidad: Number(it.cantidad) || 1,
        precio: Number(it.precio),
      }));
    if (parsedItems.length === 0) return;
    const nuevo: Presupuesto = {
      id: newId(),
      cliente: cliente.trim(),
      fecha: new Date().toISOString().slice(0, 10),
      items: parsedItems,
    };
    addPresupuesto(nuevo);
    setCliente("");
    setItems([emptyItem()]);
    setShowForm(false);
  }

  const total = items.reduce((acc, it) => acc + (Number(it.precio) || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium">Presupuestos</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="g-btn-primary px-4 py-1.5 text-sm"
        >
          + Nuevo presupuesto
        </button>
      </div>

      {showForm && (
        <form onSubmit={crear} className="g-card mb-6 p-4">
          <input
            autoFocus
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Cliente"
            className="input w-full mb-3"
          />
          <div className="space-y-2 mb-3">
            {items.map((it, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={it.pieza}
                  onChange={(e) => updateItem(i, "pieza", e.target.value)}
                  placeholder="Pieza"
                  className="input flex-1"
                />
                <input
                  value={it.cantidad}
                  onChange={(e) => updateItem(i, "cantidad", e.target.value)}
                  placeholder="Cant."
                  type="number"
                  className="input w-20"
                />
                <input
                  value={it.precio}
                  onChange={(e) => updateItem(i, "precio", e.target.value)}
                  placeholder="Total $"
                  type="number"
                  className="input w-32"
                />
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="text-neutral-400 hover:text-red-500 px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button type="button" onClick={addRow} className="text-sm text-neutral-500 hover:text-neutral-800">
              + Agregar pieza
            </button>
            <p className="text-sm text-neutral-500">
              Total: <span className="text-neutral-800 font-medium">{formatCurrency(total)}</span>
            </p>
          </div>
          <button type="submit" className="mt-4 w-full py-2 rounded-md bg-neutral-800 text-white text-sm font-medium">
            Guardar presupuesto
          </button>
        </form>
      )}

      <div className="g-card overflow-hidden">
        {db.presupuestos.length === 0 && (
          <p className="px-4 py-6 text-sm text-neutral-400">Todavía no hay presupuestos.</p>
        )}
        {[...db.presupuestos].reverse().map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between px-4 py-3 border-b border-black/5 last:border-0"
          >
            <div>
              <Link href={`/gestion/presupuestos/${p.id}`} className="font-medium hover:underline">
                {p.cliente}
              </Link>
              <p className="text-xs text-neutral-400">{p.fecha}</p>
            </div>
            <div className="flex items-center gap-4">
              <span>{formatCurrency(totalPresupuesto(p.items))}</span>
              <button
                onClick={() => removePresupuesto(p.id)}
                className="text-neutral-400 hover:text-red-500 text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
