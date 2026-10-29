"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export type EstadoConsulta = "nueva" | "respondida" | "convertida" | "descartada";

export interface Consulta {
  id: string;
  creada: string;
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  descripcion: string;
  medidas: string;
  material: string;
  cantidad: string;
  archivo_path: string;
  archivo_nombre: string;
  estado: EstadoConsulta;
  nota: string;
}

export async function listarConsultas(): Promise<{ data: Consulta[]; error: string | null }> {
  if (!supabase) return { data: [], error: "Sin conexión con Supabase." };
  const { data, error } = await supabase.from("consultas").select("*").order("creada", { ascending: false });
  return { data: (data ?? []) as Consulta[], error: error?.message ?? null };
}

export async function cambiarEstado(id: string, estado: EstadoConsulta): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("consultas").update({ estado }).eq("id", id);
  return !error;
}

export async function guardarNota(id: string, nota: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("consultas").update({ nota: nota.slice(0, 2000) }).eq("id", id);
  return !error;
}

export async function borrarConsulta(c: Consulta): Promise<boolean> {
  if (!supabase) return false;
  if (c.archivo_path) await supabase.storage.from("consultas").remove([c.archivo_path]);
  const { error } = await supabase.from("consultas").delete().eq("id", c.id);
  return !error;
}

/** Link temporal (2 minutos) para bajar el archivo STL/3MF que mandó el cliente. */
export async function linkArchivo(path: string): Promise<string | null> {
  if (!supabase || !path) return null;
  const { data, error } = await supabase.storage.from("consultas").createSignedUrl(path, 120);
  return error ? null : data.signedUrl;
}

/** Cantidad de consultas nuevas, para el cartelito del menú. Se actualiza solo cada minuto. */
export function useConsultasNuevas(refrescarCon?: unknown): number {
  const [n, setN] = useState(0);

  const cargar = useCallback(async () => {
    if (!supabase) return;
    const { count, error } = await supabase
      .from("consultas")
      .select("id", { count: "exact", head: true })
      .eq("estado", "nueva");
    if (!error) setN(count ?? 0);
  }, []);

  useEffect(() => {
    // Diferido: no se llama setState de forma sincrónica dentro del efecto.
    const primero = window.setTimeout(cargar, 0);
    const cada = window.setInterval(cargar, 60_000);
    return () => {
      window.clearTimeout(primero);
      window.clearInterval(cada);
    };
  }, [cargar, refrescarCon]);

  return n;
}

/** Arma el número para wa.me a partir de lo que escribió la persona (formato argentino). */
export function telefonoParaWhatsapp(tel: string): string {
  let d = tel.replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("54")) return d;
  d = d.replace(/^0+/, "");
  return d.startsWith("9") ? `54${d}` : `549${d}`;
}
