// ============================================================================
//  CONTROL DE ACCESO — SNJ Gestión
// ----------------------------------------------------------------------------
//  Este es el ÚNICO lugar donde se decide quién puede entrar y qué secciones ve.
//  Para dar de alta o de baja a alguien, se edita solamente esta lista.
//
//  Reglas:
//   - Si un email NO está en USUARIOS, no puede entrar (aunque tenga cuenta).
//   - `admin: true`  => ve todas las secciones (se ignora `secciones`).
//   - `secciones`    => qué puede abrir cada persona que NO es admin.
//   - `socio`        => solo para quienes participan del reparto de plata.
//                       Si la persona no es socio, se deja sin `socio`.
//
//  IMPORTANTE: la cuenta y la contraseña de cada persona se crean en el panel
//  de Supabase (Authentication → Users). Este archivo NO guarda contraseñas.
// ============================================================================

import { Socio } from "./types";

export const SECCIONES = [
  "tablero",
  "calendario",
  "cuentas",
  "presupuestos",
  "tareas",
] as const;

export type Seccion = (typeof SECCIONES)[number];

// Nombre lindo para mostrar en la barra de navegación.
export const SECCION_LABEL: Record<Seccion, string> = {
  tablero: "Tablero",
  calendario: "Calendario",
  cuentas: "Cuentas",
  presupuestos: "Presupuestos",
  tareas: "Tareas",
};

export interface Usuario {
  email: string; // en minúscula, como se registró en Supabase
  nombre: string; // se muestra arriba a la derecha
  admin?: boolean; // true = ve todo
  socio?: Socio; // solo si participa del reparto (Titi / Nico / Juan)
  secciones?: Seccion[]; // qué puede abrir (se ignora si admin)
}

// ----------------------------------------------------------------------------
//  LISTA DE PERSONAS AUTORIZADAS  (PENDIENTE DE COMPLETAR CON PABLO)
//
//  Ejemplos del formato — reemplazar por las personas y emails reales:
//
//    { email: "pablo@gmail.com", nombre: "Pablo", admin: true },
//    { email: "titi@gmail.com",  nombre: "Titi",  socio: "Titi",
//      secciones: ["tablero", "cuentas", "presupuestos"] },
//    { email: "ayudante@gmail.com", nombre: "Ayudante",
//      secciones: ["tareas"] },
// ----------------------------------------------------------------------------
export const USUARIOS: Usuario[] = [
  { email: "perrottasantino2010@gmail.com", nombre: "Titi", socio: "Titi", admin: true },
  { email: "juanvanbommel@gmail.com", nombre: "Juan", socio: "Juan", admin: true },
  { email: "nperin09@gmail.com", nombre: "Nico", socio: "Nico", admin: true },
];

/** Busca a la persona autorizada por email (sin distinguir mayúsculas). */
export function buscarUsuario(email: string | null | undefined): Usuario | null {
  if (!email) return null;
  const e = email.trim().toLowerCase();
  return USUARIOS.find((u) => u.email.trim().toLowerCase() === e) ?? null;
}

/** ¿Esta persona puede abrir esta sección? */
export function puedeVer(usuario: Usuario | null, seccion: Seccion): boolean {
  if (!usuario) return false;
  if (usuario.admin) return true;
  return (usuario.secciones ?? []).includes(seccion);
}

/** Secciones que la persona puede ver, en orden. */
export function seccionesDe(usuario: Usuario | null): Seccion[] {
  if (!usuario) return [];
  if (usuario.admin) return [...SECCIONES];
  return SECCIONES.filter((s) => (usuario.secciones ?? []).includes(s));
}
