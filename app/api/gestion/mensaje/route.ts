import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

interface ItemInfo {
  producto: string;
  cantidad: number;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta configurar ANTHROPIC_API_KEY en el servidor." },
      { status: 500 }
    );
  }

  let proyecto: {
    nombre?: string;
    cliente?: string;
    entregado?: boolean;
    pagado?: boolean;
    fecha?: string;
    ingresos?: ItemInfo[];
    total?: number;
  };
  try {
    proyecto = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const contexto = [
    `Proyecto: ${proyecto.nombre ?? "-"}`,
    `Cliente: ${proyecto.cliente || "cliente"}`,
    `Entregado: ${proyecto.entregado ? "sí" : "no"}`,
    `Pagado: ${proyecto.pagado ? "sí" : "no"}`,
    proyecto.fecha ? `Fecha acordada: ${proyecto.fecha}` : "",
    "Piezas:",
    ...(proyecto.ingresos ?? []).map((i) => `- ${i.producto} x${i.cantidad}`),
    proyecto.total != null ? `Total: $${proyecto.total}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 500,
      system:
        "Sos parte de SNJ Soluciones, una empresa de impresión 3D de Argentina. " +
        "Redactás un mensaje corto, amable y profesional de WhatsApp para el cliente, en español rioplatense (voseo). " +
        "Adaptá el mensaje al estado del proyecto: si está entregado y no pagado, recordá amablemente el pago; " +
        "si no está entregado, avisá que está en proceso o listo para coordinar entrega. " +
        "No inventes datos que no estén. No uses asteriscos de markdown. Devolvé solo el texto del mensaje.",
      messages: [
        {
          role: "user",
          content: `Escribí el mensaje de WhatsApp para este proyecto:\n\n${contexto}`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "No se pudo generar." }, { status: 502 });
    }
    return NextResponse.json({ mensaje: textBlock.text.trim() });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: `Error de IA: ${msg}` }, { status: 502 });
  }
}
