export const SOCIOS = ["Titi", "Nico", "Juan"] as const;
export type Socio = (typeof SOCIOS)[number];

export interface Gasto {
  id: string;
  producto: string;
  precio: number;
  cantidad: number;
  pagadoPor: Socio;
}

export interface Ingreso {
  id: string;
  producto: string;
  precio: number;
  cantidad: number;
}

export interface Tarea {
  id: string;
  descripcion: string;
  asignadoA: Socio;
  hecha: boolean;
}

export interface Proyecto {
  id: string;
  numero: number;
  nombre: string;
  cliente: string;
  entregado: boolean;
  pagado: boolean;
  confirmado: boolean; // false = todavía no es seguro que se haga
  fecha: string; // para cuándo es (ISO o "")
  gastos: Gasto[];
  ingresos: Ingreso[];
  tareas: Tarea[];
  eliminadoEn: string; // ISO cuando se mandó a la papelera, "" si no
}

export interface PresupuestoItem {
  id: string;
  pieza: string;
  cantidad: number;
  precio: number; // precio total del renglón
}

export interface Presupuesto {
  id: string;
  cliente: string;
  fecha: string; // ISO
  items: PresupuestoItem[];
  eliminadoEn: string; // ISO cuando se mandó a la papelera, "" si no
}

export interface DB {
  proyectos: Proyecto[];
  presupuestos: Presupuesto[];
}

export type EstadoProyecto = "En proceso" | "Pagado sin entregar" | "Entregado" | "Cobrado";

// Adapta datos guardados con el esquema viejo (fechaEntrega/fechaPago/filamentos,
// sin papelera) al esquema actual, sin perder nada de lo ya cargado.
export function normalizeDB(raw: Partial<DB> | null | undefined): DB {
  const proyectos = (raw?.proyectos ?? []).map((p) => {
    const legacy = p as Proyecto & { fechaEntrega?: string; fechaPago?: string };
    return {
      id: legacy.id,
      numero: legacy.numero,
      nombre: legacy.nombre,
      cliente: legacy.cliente,
      entregado: !!legacy.entregado,
      pagado: !!legacy.pagado,
      confirmado: legacy.confirmado ?? true,
      fecha: legacy.fecha ?? legacy.fechaEntrega ?? legacy.fechaPago ?? "",
      gastos: legacy.gastos ?? [],
      ingresos: legacy.ingresos ?? [],
      tareas: legacy.tareas ?? [],
      eliminadoEn: legacy.eliminadoEn ?? "",
    };
  });
  const presupuestos = (raw?.presupuestos ?? []).map((pr) => ({
    ...pr,
    eliminadoEn: pr.eliminadoEn ?? "",
  }));
  return { proyectos, presupuestos };
}
