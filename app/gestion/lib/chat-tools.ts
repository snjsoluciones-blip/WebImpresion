import Anthropic from "@anthropic-ai/sdk";

const SOCIOS = ["Titi", "Nico", "Juan"];

export const CHAT_TOOLS: Anthropic.Tool[] = [
  {
    name: "crear_proyecto",
    description: "Crea un proyecto/trabajo nuevo.",
    input_schema: {
      type: "object",
      properties: {
        nombre: { type: "string", description: "Nombre del proyecto" },
        cliente: { type: "string", description: "Cliente, si se menciona" },
      },
      required: ["nombre"],
    },
  },
  {
    name: "agregar_gasto",
    description:
      "Agrega un gasto (material comprado) a un proyecto existente. La cantidad de filamento se mide en KILOS: " +
      "si dan gramos, convertí (1700 g = 1.7). Si no dicen quién pagó, usá el usuario logueado.",
    input_schema: {
      type: "object",
      properties: {
        proyecto: { type: "string", description: "Nombre del proyecto donde va el gasto" },
        producto: { type: "string", description: "Qué se compró" },
        precio: { type: "number", description: "Precio unitario en pesos, sin símbolos" },
        cantidad: { type: "number", description: "Cantidad (filamento en kilos)" },
        pagado_por: { type: "string", enum: SOCIOS },
      },
      required: ["proyecto", "producto", "precio", "cantidad", "pagado_por"],
    },
  },
  {
    name: "agregar_ingreso",
    description: "Agrega un ingreso/venta a un proyecto existente.",
    input_schema: {
      type: "object",
      properties: {
        proyecto: { type: "string" },
        producto: { type: "string", description: "Qué se vendió" },
        precio: { type: "number", description: "Precio unitario en pesos" },
        cantidad: { type: "number" },
      },
      required: ["proyecto", "producto", "precio", "cantidad"],
    },
  },
  {
    name: "agregar_tarea",
    description: "Agrega una tarea a un proyecto, asignada a un socio.",
    input_schema: {
      type: "object",
      properties: {
        proyecto: { type: "string" },
        descripcion: { type: "string" },
        asignado_a: { type: "string", enum: SOCIOS },
      },
      required: ["proyecto", "descripcion", "asignado_a"],
    },
  },
  {
    name: "marcar_estado",
    description: "Marca un proyecto como entregado y/o pagado (cobrado).",
    input_schema: {
      type: "object",
      properties: {
        proyecto: { type: "string" },
        entregado: { type: "boolean" },
        pagado: { type: "boolean" },
      },
      required: ["proyecto"],
    },
  },
];
