// Guarda en la gestión (Supabase) la consulta que alguien arma en el formulario de la web,
// con su archivo STL/3MF si lo subió. Es "mejor esfuerzo": si algo falla (sin conexión, la
// tabla todavía no existe, etc.) devuelve false y el WhatsApp sigue funcionando igual.
import { supabase } from "../taller-cobalto/lib/supabaseClient";

export interface DatosConsulta {
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  descripcion: string;
  medidas: string;
  material: string;
  cantidad: string;
}

const MAX_ARCHIVO = 25 * 1024 * 1024; // mismo tope que la carpeta de Supabase

const corto = (s: string, max: number) => s.trim().slice(0, max);

function nombreSeguro(nombre: string) {
  return nombre.replace(/[^\w.\-]+/g, "_").slice(0, 100) || "archivo";
}

export async function guardarConsulta(datos: DatosConsulta, archivo?: File | null): Promise<boolean> {
  if (!supabase) return false;
  try {
    let archivoPath = "";
    if (archivo && archivo.size <= MAX_ARCHIVO) {
      const path = `${crypto.randomUUID()}/${nombreSeguro(archivo.name)}`;
      const { error } = await supabase.storage.from("consultas").upload(path, archivo, { upsert: false });
      if (!error) archivoPath = path;
    }

    const { error } = await supabase.from("consultas").insert({
      nombre: corto(datos.nombre, 120),
      email: corto(datos.email, 200),
      telefono: corto(datos.telefono, 60),
      servicio: corto(datos.servicio, 60),
      descripcion: corto(datos.descripcion, 2000),
      medidas: corto(datos.medidas, 200),
      material: corto(datos.material, 60),
      cantidad: corto(datos.cantidad, 40),
      archivo_path: archivoPath,
      archivo_nombre: archivo ? corto(archivo.name, 200) : "",
    });
    return !error;
  } catch {
    return false;
  }
}
