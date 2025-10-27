import { streamText, UIMessage, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import {
  searchFAQs,
  generateRAGContext,
  isRelevantForFAQ,
} from "@/lib/rag-utils";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Verificar API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY no configurada");
      return new Response(
        JSON.stringify({
          error:
            "Servicio temporalmente no disponible. Contáctanos al +51 952 864 883",
          code: "CONFIG_ERROR",
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const {
      messages,
      model,
      useFAQ = false,
    }: {
      messages: UIMessage[];
      model: string;
      useFAQ?: boolean;
    } = await req.json();

    // Validar input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Mensajes inválidos" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number };
    console.error("Error en chatbot API:", {
      message: err.message,
      name: err.name,
      timestamp: new Date().toISOString(),
    });

    // Rate limit / Quota exceeded
    if (
      err.message?.includes("quota") ||
      err.message?.includes("limit") ||
      err.message?.includes("429") ||
      err.statusCode === 429
    ) {
      return new Response(
        JSON.stringify({
          error:
            "⏳ Muchas consultas al mismo tiempo. Por favor intenta en unos minutos o llámanos al +51 952 864 883",
          code: "QUOTA_EXCEEDED",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
          },
        }
      );
    }

    // API key inválida o problemas de autenticación
    if (
      err.message?.includes("API key") ||
      err.message?.includes("401") ||
      err.message?.includes("authentication") ||
      err.statusCode === 401
    ) {
      return new Response(
        JSON.stringify({
          error:
            "🔧 Error de configuración del servicio. Por favor contáctanos al +51 952 864 883",
          code: "AUTH_ERROR",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Timeout
    if (
      err.message?.includes("timeout") ||
      err.message?.includes("ETIMEDOUT")
    ) {
      return new Response(
        JSON.stringify({
          error:
            "⏱️ La respuesta está tardando mucho. Intenta con una pregunta más corta o llámanos.",
          code: "TIMEOUT",
        }),
        {
          status: 504,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Error genérico
    return new Response(
      JSON.stringify({
        error:
          "⚠️ Error al procesar tu mensaje. Por favor intenta nuevamente o contáctanos al +51 952 864 883",
        code: "INTERNAL_ERROR",
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
