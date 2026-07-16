"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { DB, Proyecto, Presupuesto, normalizeDB } from "./types";
import { seedDB } from "./seed-data";
import { StoreContext } from "./store";
import { supabase } from "./supabaseClient";

const ROW_ID = "main";
const TABLE = "gestion_state";

export function SupabaseStoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB | null>(null);
  const dbRef = useRef<DB | null>(null);
  const writingOwnChange = useRef(false);

  useEffect(() => {
    if (!supabase) return;

    let cancelled = false;

    async function load() {
      const { data, error } = await supabase!
        .from(TABLE)
        .select("data")
        .eq("id", ROW_ID)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("Error cargando datos de Supabase:", error.message);
        return;
      }

      if (data?.data) {
        const normalized = normalizeDB(data.data as DB);
        setDb(normalized);
        dbRef.current = normalized;
      } else {
        // Primera vez: no existe la fila todavía, la creamos con los datos semilla.
        await supabase!.from(TABLE).insert({ id: ROW_ID, data: seedDB });
        setDb(seedDB);
        dbRef.current = seedDB;
      }
    }

    load();

    const channel = supabase
      .channel("gestion_state_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: TABLE, filter: `id=eq.${ROW_ID}` },
        (payload) => {
          // Si el cambio lo disparamos nosotros mismos, ya tenemos el estado actualizado local.
          if (writingOwnChange.current) {
            writingOwnChange.current = false;
            return;
          }
          const nuevaData = normalizeDB((payload.new as { data: DB }).data);
          setDb(nuevaData);
          dbRef.current = nuevaData;
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase!.removeChannel(channel);
    };
  }, []);

  async function persist(next: DB) {
    setDb(next);
    dbRef.current = next;
    if (!supabase) return;
    writingOwnChange.current = true;
    const { error } = await supabase.from(TABLE).update({ data: next }).eq("id", ROW_ID);
    if (error) console.error("Error guardando en Supabase:", error.message);
  }

  function addProyecto(p: Proyecto) {
    const current = dbRef.current;
    if (!current) return;
    persist({ ...current, proyectos: [...current.proyectos, p] });
  }

  function updateProyecto(id: string, fn: (p: Proyecto) => Proyecto) {
    const current = dbRef.current;
    if (!current) return;
    persist({
      ...current,
      proyectos: current.proyectos.map((p) => (p.id === id ? fn(p) : p)),
    });
  }

  function removeProyecto(id: string) {
    const current = dbRef.current;
    if (!current) return;
    persist({ ...current, proyectos: current.proyectos.filter((p) => p.id !== id) });
  }

  function addPresupuesto(p: Presupuesto) {
    const current = dbRef.current;
    if (!current) return;
    persist({ ...current, presupuestos: [...current.presupuestos, p] });
  }

  function removePresupuesto(id: string) {
    const current = dbRef.current;
    if (!current) return;
    persist({ ...current, presupuestos: current.presupuestos.filter((p) => p.id !== id) });
  }

  function applyBatch(mutator: (db: DB) => DB) {
    const current = dbRef.current;
    if (!current) return;
    persist(mutator(current));
  }

  if (!db) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/40 text-sm">
        Cargando datos compartidos…
      </div>
    );
  }

  return (
    <StoreContext.Provider
      value={{ db, addProyecto, updateProyecto, removeProyecto, addPresupuesto, removePresupuesto, applyBatch }}
    >
      {children}
    </StoreContext.Provider>
  );
}
