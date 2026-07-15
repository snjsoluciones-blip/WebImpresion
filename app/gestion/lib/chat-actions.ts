import { DB, Proyecto, Socio, SOCIOS } from "./types";
import {
  totalGastos,
  totalIngresos,
  ganancia,
  estadoProyecto,
  repartoProyecto,
  cuentasGlobales,
  gananciaTotal,
  porCobrar,
  formatCurrency,
} from "./calc";

// Acciones que la IA puede pedir (coinciden con las tools del endpoint).
export type Accion =
  | { tipo: "crear_proyecto"; nombre: string; cliente?: string }
  | { tipo: "agregar_gasto"; proyecto: string; producto: string; precio: number; cantidad: number; pagado_por: Socio }
  | { tipo: "agregar_ingreso"; proyecto: string; producto: string; precio: number; cantidad: number }
  | { tipo: "agregar_tarea"; proyecto: string; descripcion: string; asignado_a: Socio }
  | { tipo: "marcar_estado"; proyecto: string; entregado?: boolean; pagado?: boolean };

function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

function buscarProyecto(proyectos: Proyecto[], nombre: string): Proyecto | undefined {
  const n = normalizar(nombre);
  return (
    proyectos.find((p) => normalizar(p.nombre) === n) ??
    proyectos.find((p) => normalizar(p.nombre).includes(n) || n.includes(normalizar(p.nombre)))
  );
}

function socioValido(s: string, fallback: Socio): Socio {
  return (SOCIOS as readonly string[]).includes(s) ? (s as Socio) : fallback;
}

// Aplica todas las acciones sobre la DB en una sola pasada (atómico).
export function aplicarAcciones(
  db: DB,
  acciones: Accion[],
  usuario: Socio,
  newId: () => string
): DB {
  let proyectos = [...db.proyectos];
  // Crear proyectos primero para poder cargarles cosas en el mismo mensaje.
  const ordenadas = [...acciones].sort((a, b) =>
    a.tipo === "crear_proyecto" ? -1 : b.tipo === "crear_proyecto" ? 1 : 0
  );

  for (const acc of ordenadas) {
    if (acc.tipo === "crear_proyecto") {
      if (buscarProyecto(proyectos, acc.nombre)) continue;
      const numero = proyectos.length ? Math.max(...proyectos.map((p) => p.numero)) + 1 : 1;
      proyectos.push({
        id: newId(),
        numero,
        nombre: acc.nombre,
        cliente: acc.cliente ?? "",
        entregado: false,
        pagado: false,
        fecha: "",
        gastos: [],
        ingresos: [],
        tareas: [],
      });
      continue;
    }

    const target = buscarProyecto(proyectos, acc.proyecto);
    if (!target) continue;
    proyectos = proyectos.map((p) => {
      if (p.id !== target.id) return p;
      switch (acc.tipo) {
        case "agregar_gasto":
          return {
            ...p,
            gastos: [
              ...p.gastos,
              {
                id: newId(),
                producto: acc.producto,
                precio: acc.precio,
                cantidad: acc.cantidad,
                pagadoPor: socioValido(acc.pagado_por, usuario),
              },
            ],
          };
        case "agregar_ingreso":
          return {
            ...p,
            ingresos: [
              ...p.ingresos,
              { id: newId(), producto: acc.producto, precio: acc.precio, cantidad: acc.cantidad },
            ],
          };
        case "agregar_tarea":
          return {
            ...p,
            tareas: [
              ...p.tareas,
              { id: newId(), descripcion: acc.descripcion, asignadoA: socioValido(acc.asignado_a, usuario), hecha: false },
            ],
          };
        case "marcar_estado":
          return {
            ...p,
            entregado: acc.entregado ?? p.entregado,
            pagado: acc.pagado ?? p.pagado,
          };
        default:
          return p;
      }
    });
  }

  return { ...db, proyectos };
}

// Resumen compacto del estado actual para que la IA responda preguntas y ubique proyectos.
export function resumenParaIA(db: DB, usuario: Socio): string {
  const g = cuentasGlobales(db.proyectos);
  const lineas: string[] = [];
  lineas.push(`Usuario logueado: ${usuario}. Socios: ${SOCIOS.join(", ")}.`);
  lineas.push(
    `GLOBAL — Ganancia total: ${formatCurrency(gananciaTotal(db.proyectos))}. ` +
      `Por cobrar: ${formatCurrency(porCobrar(db.proyectos))}.`
  );
  for (const s of SOCIOS) {
    lineas.push(`  ${s}: puso ${formatCurrency(g[s].puso)}, le toca cobrar ${formatCurrency(g[s].cobra)}.`);
  }
  lineas.push("PROYECTOS:");
  for (const p of db.proyectos) {
    const rep = repartoProyecto(p);
    const repTxt = SOCIOS.map((s) => `${s} cobra ${formatCurrency(rep[s].cobra)}`).join(", ");
    lineas.push(
      `- "${p.nombre}" (cliente: ${p.cliente || "sin cliente"}) — estado ${estadoProyecto(p)}. ` +
        `Gastos ${formatCurrency(totalGastos(p))}, ingresos ${formatCurrency(totalIngresos(p))}, ` +
        `ganancia ${formatCurrency(ganancia(p))}. Reparto: ${repTxt}.`
    );
  }
  return lineas.join("\n");
}
