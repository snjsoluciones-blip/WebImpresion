"use client";

import { createContext, useContext } from "react";
import { DB, Proyecto, Presupuesto } from "./types";

let uidCounter = 0;
export const newId = () => `id-${Date.now()}-${uidCounter++}`;

export interface StoreCtx {
  db: DB;
  addProyecto: (p: Proyecto) => void;
  updateProyecto: (id: string, fn: (p: Proyecto) => Proyecto) => void;
  removeProyecto: (id: string) => void;
  addPresupuesto: (p: Presupuesto) => void;
  removePresupuesto: (id: string) => void;
  applyBatch: (mutator: (db: DB) => DB) => void;
}

export const StoreContext = createContext<StoreCtx | null>(null);

export function useStore(): StoreCtx {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de un StoreProvider");
  return ctx;
}
