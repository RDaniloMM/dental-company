import { streamText, UIMessage, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import {
  searchFAQsFromDB,
  searchContextoFromDB,
  getInfoFromDB,
  getServiciosFromDB,
  getEquipoFromDB,
  getChatbotConfigFromDB,
  generateRAGContext,
  isRelevantForFAQ,
} from "@/lib/rag-utils";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

// Configuración para Node.js runtime (mejor para problemas de IP con Google Cloud)
export const runtime = "nodejs";
export const maxDuration = 30;
export const dynamic = "force-dynamic";

// Tasa de muestreo para logging (10% de las conversaciones)
const SAMPLE_RATE = 0.1;

// Función para generar hash de IP (privacidad)
function hashIP(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex").substring(0, 16);
}

// Función para logging con muestreo
async function logConversation(
  sessionId: string,
  pregunta: string,
  respuesta: string | null,
  modelo: string,
  tiempoMs: number,
  error: string | null,
  ipHash: string,
  userAgent: string | null
) {
  // Aplicar muestreo
  if (Math.random() > SAMPLE_RATE && !error) {
    return; // No loguear esta conversación
  }

  try {
    const supabase = await createClient();

    await supabase.from("chatbot_conversaciones").insert({
      session_id: sessionId,
      pregunta: pregunta.substring(0, 1000), // Limitar longitud
      respuesta: respuesta?.substring(0, 2000),
      modelo,
      tiempo_respuesta_ms: tiempoMs,
      error_tipo: error,
      ip_hash: ipHash,
      user_agent: userAgent?.substring(0, 500),
    });
  } catch (e) {
    console.error("Error logging conversation:", e);
  }
}

export async function POST(req: Request) {
  const startTime = Date.now();
  const sessionId = crypto.randomUUID();

  // Obtener headers para logging
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";
  const ipHash = hashIP(ip);
  const userAgent = req.headers.get("user-agent");

  let userQuery = "";
  let modelo = "";

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
      useFAQ = true,
    }: {
      messages: UIMessage[];
      model: string;
      useFAQ?: boolean;
    } = await req.json();

    modelo = model;

    // Validar input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Mensajes inválidos" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const geminiModel = google(model);

    // Obtener la última pregunta del usuario
    const lastMessage = messages[messages.length - 1];
    userQuery = lastMessage.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join(" ");

    // Obtener configuración del chatbot (incluyendo system prompt personalizado)
    const chatbotConfig = await getChatbotConfigFromDB();

    // Verificar qué fuentes están habilitadas en la configuración
    const usarInfoGeneral = chatbotConfig.chatbot_usar_info_general !== "false";
    const usarServicios = chatbotConfig.chatbot_usar_servicios !== "false";
    const usarEquipo = chatbotConfig.chatbot_usar_equipo !== "false";

    // Sistema base - Prompt optimizado para asistente público de clínica dental
    // Usar prompt personalizado si está configurado, o el default
    const customPrompt = chatbotConfig.chatbot_system_prompt?.trim();

    // Si hay prompt personalizado, usarlo. Si no, generar uno basado en la configuración
    let systemPrompt: string;

    if (customPrompt) {
      systemPrompt = customPrompt;
    } else {
      // Prompt base genérico (sin información específica de la clínica)
      systemPrompt = `Eres un asistente virtual de una clínica dental.

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
- SIEMPRE recomienda agendar una cita para evaluación personalizada
- No menciones que eres una IA o modelo de lenguaje, mantente en tu rol de asistente`;
    }

    // Buscar contexto dinámico desde la BD usando embeddings vectoriales
    if (useFAQ && messages.length > 0 && isRelevantForFAQ(userQuery)) {
      try {
        // Solo obtener datos de las fuentes habilitadas
        const [faqs, contextos, info, servicios, equipo] = await Promise.all([
          searchFAQsFromDB(userQuery, 3),
          searchContextoFromDB(userQuery, 2),
          usarInfoGeneral ? getInfoFromDB() : Promise.resolve({}),
          usarServicios ? getServiciosFromDB() : Promise.resolve([]),
          usarEquipo ? getEquipoFromDB() : Promise.resolve([]),
        ]);

        const ragContext = generateRAGContext(
          faqs,
          contextos,
          info,
          servicios,
          equipo,
          chatbotConfig
        );
        if (ragContext) {
          systemPrompt += "\n\n" + ragContext;
        }
      } catch (ragError) {
        console.error("Error obteniendo RAG context:", ragError);
        // Continuar sin contexto RAG
      }
    }

    const result = streamText({
      model: geminiModel,
      messages: convertToModelMessages(messages),
      system: systemPrompt,
    });

    // Logging asíncrono (no bloquea la respuesta)
    logConversation(
      sessionId,
      userQuery,
      null, // No tenemos la respuesta completa en streaming
      modelo,
      Date.now() - startTime,
      null,
      ipHash,
      userAgent
    );

    // NO enviar sources ni reasoning al cliente para proteger el system prompt
    return result.toUIMessageStreamResponse({
      sendSources: false,
      sendReasoning: false,
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; status?: number };
    const tiempoTotal = Date.now() - startTime;

    // Log detallado del error
    console.error("Error en chatbot API:", {
      message: err.message,
      name: err.name,
      statusCode: err.statusCode || err.status,
      timestamp: new Date().toISOString(),
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });

    // Determinar tipo de error para logging
    let errorTipo = "INTERNAL_ERROR";

    // Rate limit / Quota exceeded (Google Cloud)
    if (
      err.message?.includes("quota") ||
      err.message?.includes("limit") ||
      err.message?.includes("429") ||
      err.message?.includes("RESOURCE_EXHAUSTED") ||
      err.message?.includes("rate") ||
      err.statusCode === 429 ||
      err.status === 429
    ) {
      console.warn("Rate limit hit - Google Cloud quota exceeded");
      errorTipo = "QUOTA_EXCEEDED";

      // Loguear errores siempre
      logConversation(
        sessionId,
        userQuery,
        null,
        modelo,
        tiempoTotal,
        errorTipo,
        ipHash,
        userAgent
      );

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

    // API key inválida o problemas de autenticación (incluyendo bloqueos de IP)
    if (
      err.message?.includes("API key") ||
      err.message?.includes("401") ||
      err.message?.includes("403") ||
      err.message?.includes("authentication") ||
      err.message?.includes("PERMISSION_DENIED") ||
      err.message?.includes("blocked") ||
      err.statusCode === 401 ||
      err.statusCode === 403
    ) {
      console.warn("Auth error - possible IP block or invalid API key");
      errorTipo = "AUTH_ERROR";

      logConversation(
        sessionId,
        userQuery,
        null,
        modelo,
        tiempoTotal,
        errorTipo,
        ipHash,
        userAgent
      );

      return new Response(
        JSON.stringify({
          error:
            "🔧 Error de autenticación. Puede ser un bloqueo temporal. Llámanos al +51 952 864 883",
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
      errorTipo = "TIMEOUT";
      logConversation(
        sessionId,
        userQuery,
        null,
        modelo,
        tiempoTotal,
        errorTipo,
        ipHash,
        userAgent
      );

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

    // Log error genérico
    logConversation(
      sessionId,
      userQuery,
      null,
      modelo,
      tiempoTotal,
      errorTipo,
      ipHash,
      userAgent
    );

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
