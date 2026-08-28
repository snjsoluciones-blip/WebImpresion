import { DB, SOCIOS } from "./types";
import { totalGastos, totalIngresos, ganancia, repartoProyecto, estadoProyecto } from "./calc";

// Excel en Argentina espera ";" como separador (la "," la usa como decimal),
// y necesita el BOM para que los acentos no se rompan.
const BOM = "﻿";

function csvEscape(valor: string | number): string {
  const s = String(valor);
  if (s.includes(";") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function descargarCSV(nombreArchivo: string, filas: string[][]) {
  const contenido = BOM + filas.map((fila) => fila.map(csvEscape).join(";")).join("\r\n");
  const blob = new Blob([contenido], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportarResumenProyectosCSV(db: DB) {
  const proyectos = db.proyectos.filter((p) => !p.eliminadoEn && p.confirmado);
  const headers = [
    "Numero",
    "Nombre",
    "Cliente",
    "Estado",
    "Fecha",
    "GastosTotales",
    "IngresosTotales",
    "Ganancia",
    ...SOCIOS.flatMap((s) => [`${s}_Puso`, `${s}_Cobra`]),
  ];
  const filas = proyectos.map((p) => {
    const reparto = repartoProyecto(p);
    return [
      String(p.numero),
      p.nombre,
      p.cliente,
      estadoProyecto(p),
      p.fecha,
      String(Math.round(totalGastos(p))),
      String(Math.round(totalIngresos(p))),
      String(Math.round(ganancia(p))),
      ...SOCIOS.flatMap((s) => [
        String(Math.round(reparto[s].puso)),
        String(Math.round(reparto[s].cobra)),
      ]),
    ];
  });
  const fecha = new Date().toISOString().slice(0, 10);
  descargarCSV(`snj-proyectos-${fecha}.csv`, [headers, ...filas]);
}

export function exportarGastosCSV(db: DB) {
  const proyectos = db.proyectos.filter((p) => !p.eliminadoEn && p.confirmado);
  const headers = ["Proyecto", "Producto", "Precio", "Cantidad", "Total", "PagadoPor"];
  const filas = proyectos.flatMap((p) =>
    p.gastos.map((g) => [
      p.nombre,
      g.producto,
      String(g.precio),
      String(g.cantidad),
      String(Math.round(g.precio * g.cantidad)),
      g.pagadoPor,
    ])
  );
  const fecha = new Date().toISOString().slice(0, 10);
  descargarCSV(`snj-gastos-${fecha}.csv`, [headers, ...filas]);
}
