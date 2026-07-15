"use client";

import { useEffect, useState, ReactNode } from "react";
import { DB, Proyecto, Presupuesto, normalizeDB } from "./types";
import { seedDB } from "./seed-data";
import { StoreContext } from "./store";

const STORAGE_KEY = "snj-gestion-db";

export function LocalStoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(seedDB);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setDb(normalizeDB(JSON.parse(saved)));
      } catch {
        setDb(seedDB);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }, [db, loaded]);

  function addProyecto(p: Proyecto) {
    setDb((prev) => ({ ...prev, proyectos: [...prev.proyectos, p] }));
  }

  function updateProyecto(id: string, fn: (p: Proyecto) => Proyecto) {
    setDb((prev) => ({
      ...prev,
      proyectos: prev.proyectos.map((p) => (p.id === id ? fn(p) : p)),
    }));
  }

  function removeProyecto(id: string) {
    setDb((prev) => ({ ...prev, proyectos: prev.proyectos.filter((p) => p.id !== id) }));
  }

  function addPresupuesto(p: Presupuesto) {
    setDb((prev) => ({ ...prev, presupuestos: [...prev.presupuestos, p] }));
  }

  function removePresupuesto(id: string) {
    setDb((prev) => ({
      ...prev,
      presupuestos: prev.presupuestos.filter((p) => p.id !== id),
    }));
  }

  function applyBatch(mutator: (db: DB) => DB) {
    setDb((prev) => mutator(prev));
  }

  if (!loaded) return null;

  return (
    <StoreContext.Provider
      value={{ db, addProyecto, updateProyecto, removeProyecto, addPresupuesto, removePresupuesto, applyBatch }}
    >
      {children}
    </StoreContext.Provider>
  );
}
