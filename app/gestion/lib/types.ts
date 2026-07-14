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

export interface Filamento {
  id: string;
  pieza: string;
  color: string;
  peso: string;
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
  fechaEntrega: string; // ISO o ""
  pagado: boolean;
  fechaPago: string; // ISO o ""
  gastos: Gasto[];
  ingresos: Ingreso[];
  filamentos: Filamento[];
  tareas: Tarea[];
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
}

export interface DB {
  proyectos: Proyecto[];
  presupuestos: Presupuesto[];
}

export type EstadoProyecto = "En proceso" | "Entregado" | "Cobrado";
