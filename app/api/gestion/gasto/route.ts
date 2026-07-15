import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SOCIOS = ["Titi", "Nico", "Juan"] as const;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta configurar ANTHROPIC_API_KEY en el servidor." },
      { status: 500 }
    );
  }

  let texto = "";
  try {
    const body = await req.json();
    texto = String(body?.texto ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }
  if (!texto) {
    return NextResponse.json({ error: "Escribí el gasto." }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 300,
      system:
        "Sos un asistente que extrae un gasto de un texto en español rioplatense para una empresa de impresión 3D. " +
        "Interpretá montos como '20 mil' = 20000, '20lucas' = 20000, '$1.500' = 1500. " +
        "El campo pagadoPor es quién pagó el gasto y debe ser exactamente uno de: Titi, Nico, Juan. " +
        "Si no se menciona quién pagó, usá 'Titi'. Si no se menciona cantidad, usá 1.",
      messages: [{ role: "user", content: texto }],
      output_config: {
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              producto: { type: "string", description: "Qué se compró" },
              precio: { type: "number", description: "Precio unitario en pesos, sin símbolos" },
              cantidad: { type: "number", description: "Cantidad comprada" },
              pagadoPor: { type: "string", enum: [...SOCIOS] },
            },
            required: ["producto", "precio", "cantidad", "pagadoPor"],
            additionalProperties: false,
          },
        },
      },
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "No se pudo interpretar." }, { status: 502 });
    }
    const gasto = JSON.parse(textBlock.text);
    return NextResponse.json({ gasto });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: `Error de IA: ${msg}` }, { status: 502 });
  }
}
