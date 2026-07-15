import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { CHAT_TOOLS } from "../../../gestion/lib/chat-tools";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta configurar ANTHROPIC_API_KEY en el servidor." },
      { status: 500 }
    );
  }

  let historial: { role: "user" | "assistant"; content: string }[] = [];
  let resumen = "";
  let usuario = "Titi";
  let hoy = "";
  try {
    const body = await req.json();
    historial = Array.isArray(body?.historial) ? body.historial : [];
    resumen = String(body?.resumen ?? "");
    usuario = String(body?.usuario ?? "Titi");
    hoy = String(body?.hoy ?? "");
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const system =
    "Sos el asistente de SNJ Soluciones, una empresa de impresión 3D de 3 socios (Titi, Nico, Juan). " +
    "Hablás en español rioplatense, breve y directo. Ayudás a gestionar los trabajos/proyectos. " +
    "Usás las herramientas para hacer acciones (cargar gastos, ventas, tareas, crear proyectos, marcar estados). " +
    "Reglas importantes:\n" +
    "- El filamento se mide en KILOS. Si te dan gramos, convertí a kilos (1700 g = 1.7).\n" +
    `- Si no dicen quién pagó un gasto, asumí que fue el usuario logueado (${usuario}).\n` +
    "- Interpretá montos en jerga: '20 mil' o '20 lucas' = 20000.\n" +
    "- Para cargar algo en un proyecto, usá el nombre exacto de la lista de proyectos.\n" +
    "- Si te falta un dato clave (ej. a qué proyecto), preguntá en vez de inventar.\n" +
    "- Después de hacer una acción, confirmá en una frase corta qué hiciste.\n" +
    "- No uses formato markdown (nada de asteriscos ** ni #). Texto plano.\n\n" +
    (hoy ? `Fecha de hoy: ${hoy}.\n\n` : "") +
    "Estado actual de la app:\n" +
    resumen;

  const messages: Anthropic.MessageParam[] = historial.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const acciones: { tipo: string; [k: string]: unknown }[] = [];

  try {
    let guard = 0;
    let response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1200,
      system,
      tools: CHAT_TOOLS,
      messages,
    });

    while (response.stop_reason === "tool_use" && guard < 6) {
      guard++;
      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const block of response.content) {
        if (block.type === "tool_use") {
          acciones.push({ tipo: block.name, ...(block.input as object) });
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: "Hecho.",
          });
        }
      }
      messages.push({ role: "assistant", content: response.content });
      messages.push({ role: "user", content: toolResults });

      response = await client.messages.create({
        model: "claude-opus-4-8",
        max_tokens: 1200,
        system,
        tools: CHAT_TOOLS,
        messages,
      });
    }

    const reply = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("\n")
      .trim();

    return NextResponse.json({ reply: reply || "Listo.", acciones });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: `Error de IA: ${msg}` }, { status: 502 });
  }
}
