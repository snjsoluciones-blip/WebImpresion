import { Proyecto, Socio, SOCIOS, EstadoProyecto } from "./types";

export function totalGastos(p: Proyecto): number {
  return p.gastos.reduce((acc, g) => acc + g.precio * g.cantidad, 0);
}

export function totalIngresos(p: Proyecto): number {
  return p.ingresos.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
}

export function ganancia(p: Proyecto): number {
  return totalIngresos(p) - totalGastos(p);
}

export function gastoPorSocio(p: Proyecto, socio: Socio): number {
  return p.gastos
    .filter((g) => g.pagadoPor === socio)
    .reduce((acc, g) => acc + g.precio * g.cantidad, 0);
}

export function cobraSocio(p: Proyecto, socio: Socio): number {
  return gastoPorSocio(p, socio) + ganancia(p) / SOCIOS.length;
}

export function repartoProyecto(p: Proyecto): Record<Socio, { puso: number; cobra: number }> {
  const out = {} as Record<Socio, { puso: number; cobra: number }>;
  for (const s of SOCIOS) {
    out[s] = { puso: gastoPorSocio(p, s), cobra: cobraSocio(p, s) };
  }
  return out;
}

export function estadoProyecto(p: Proyecto): EstadoProyecto {
  if (p.pagado) return "Cobrado";
  if (p.entregado) return "Entregado";
  return "En proceso";
}

export function cuentasGlobales(proyectos: Proyecto[]): Record<Socio, { puso: number; cobra: number }> {
  const out = {} as Record<Socio, { puso: number; cobra: number }>;
  for (const s of SOCIOS) {
    let puso = 0;
    let cobra = 0;
    for (const p of proyectos) {
      puso += gastoPorSocio(p, s);
      cobra += cobraSocio(p, s);
    }
    out[s] = { puso, cobra };
  }
  return out;
}

export function gananciaTotal(proyectos: Proyecto[]): number {
  return proyectos.reduce((acc, p) => acc + ganancia(p), 0);
}

export function porCobrar(proyectos: Proyecto[]): number {
  return proyectos
    .filter((p) => estadoProyecto(p) !== "Cobrado")
    .reduce((acc, p) => acc + ganancia(p), 0);
}

export function totalPresupuesto(items: { cantidad: number; precio: number }[]): number {
  return items.reduce((acc, i) => acc + i.precio, 0);
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}
