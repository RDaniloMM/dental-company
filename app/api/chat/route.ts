import { streamText, UIMessage, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import {
  searchFAQs,
  generateRAGContext,
  isRelevantForFAQ,
} from "@/lib/rag-utils";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    model,
    useFAQ = false,
  }: {
    messages: UIMessage[];
    model: string;
    useFAQ?: boolean;
  } = await req.json();

  const geminiModel = google(model);

  // Sistema base - Prompt optimizado para asistente público de clínica dental
  let systemPrompt = `Eres el asistente virtual de DENTAL COMPANY, una clínica dental en Tacna, Perú.

INFORMACIÓN DE LA CLÍNICA:
- Ubicación: Av. General Suarez N° 312, Tacna, Perú
- Teléfono: +51 952 864 883
- Email: d.c.com@hotmail.com
- Horario: Lunes a Viernes 9:00 AM - 7:00 PM, Sábados 9:00 AM - 1:00 PM, Domingos cerrado

TU ROL:
- Responde de manera amable, profesional y empática
- Proporciona información clara y precisa sobre servicios dentales
- Si no tienes información específica, invita al usuario a contactar directamente a la clínica
- Usa emojis ocasionalmente para hacer la conversación más amigable 😊
- Sé breve y directo en tus respuestas
- Nunca inventes información médica o precios si no los tienes

IMPORTANTE:
- NO proporciones diagnósticos médicos
- NO recomiendes tratamientos específicos sin evaluación profesional
- SIEMPRE recomienda agendar una cita para evaluación personalizada`;

  // Si el modo FAQ está activado, buscar contexto relevante
  if (useFAQ && messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join(" ");

    // Solo buscar en FAQ si la consulta es relevante
    if (isRelevantForFAQ(userQuery)) {
      const relevantFAQs = searchFAQs(userQuery, 3);
      if (relevantFAQs.length > 0) {
        const ragContext = generateRAGContext(relevantFAQs);
        systemPrompt += "\n\n" + ragContext;
      }
    }
  }

  const result = streamText({
    model: geminiModel,
    messages: convertToModelMessages(messages),
    system: systemPrompt,
  });

  // send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
