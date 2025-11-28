import { createClient } from "@/lib/supabase/server";

export interface FAQ {
  id: string;
  pregunta: string;
  respuesta: string;
  keywords: string[];
  categoria: string;
  prioridad: number;
}

export interface Contexto {
  id: string;
  titulo: string;
  contenido: string;
  tipo: string;
}

/**
 * Búsqueda de FAQs en la base de datos usando keywords y similitud
 */
export async function searchFAQsFromDB(
  query: string,
  topK: number = 3
): Promise<FAQ[]> {
  try {
    const supabase = await createClient();

    // Obtener todos los FAQs activos
    const { data: faqs, error } = await supabase
      .from("chatbot_faqs")
      .select("*")
      .eq("activo", true);

    if (error || !faqs) {
      console.error("Error obteniendo FAQs:", error);
      return [];
    }

    const queryLower = query.toLowerCase();
    const queryWords = queryLower
      .split(/\s+/)
      .filter((word) => word.length > 2);

    // Calcular puntuación para cada FAQ
    const scored = faqs.map((faq) => {
      let score = 0;

      // Bonus por prioridad
      score += faq.prioridad || 0;

      // Puntos por keywords que coinciden
      if (faq.keywords && Array.isArray(faq.keywords)) {
        for (const keyword of faq.keywords) {
          if (queryLower.includes(keyword.toLowerCase())) {
            score += 3;
          }
        }
      }

      // Puntos por palabras del query en pregunta o respuesta
      for (const word of queryWords) {
        if (faq.pregunta.toLowerCase().includes(word)) {
          score += 2;
        }
        if (faq.respuesta.toLowerCase().includes(word)) {
          score += 1;
        }
      }

      // Bonus si la pregunta es muy similar
      if (
        faq.pregunta.toLowerCase().includes(queryLower) ||
        queryLower.includes(faq.pregunta.toLowerCase())
      ) {
        score += 5;
      }

      return { faq, score };
    });

    // Ordenar por puntuación y tomar los top K con score > 0
    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((item) => ({
        id: item.faq.id,
        pregunta: item.faq.pregunta,
        respuesta: item.faq.respuesta,
        keywords: item.faq.keywords || [],
        categoria: item.faq.categoria,
        prioridad: item.faq.prioridad,
      }));
  } catch (error) {
    console.error("Error en searchFAQsFromDB:", error);
    return [];
  }
}

/**
 * Obtener contexto adicional del chatbot desde la BD
 */
export async function getContextoFromDB(): Promise<Contexto[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("chatbot_contexto")
      .select("*")
      .eq("activo", true);

    if (error || !data) {
      console.error("Error obteniendo contexto:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error en getContextoFromDB:", error);
    return [];
  }
}

/**
 * Obtener configuración del tema (para info de contacto, etc.)
 */
export async function getTemaFromDB(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("cms_tema").select("*");

    if (error || !data) {
      console.error("Error obteniendo tema:", error);
      return {};
    }

    return data.reduce((acc, item) => {
      acc[item.clave] = item.valor;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error("Error en getTemaFromDB:", error);
    return {};
  }
}

/**
 * Genera el contexto RAG para incluir en el prompt del modelo
 */
export function generateRAGContext(
  faqs: FAQ[],
  contextos: Contexto[] = [],
  tema: Record<string, string> = {}
): string {
  let context = "";

  // Agregar información de contacto desde el tema
  if (Object.keys(tema).length > 0) {
    context += "INFORMACIÓN ACTUALIZADA DE LA CLÍNICA:\n";
    if (tema.nombre_clinica) context += `- Nombre: ${tema.nombre_clinica}\n`;
    if (tema.direccion) context += `- Dirección: ${tema.direccion}\n`;
    if (tema.telefono) context += `- Teléfono: ${tema.telefono}\n`;
    if (tema.email) context += `- Email: ${tema.email}\n`;
    if (tema.horario_semana) context += `- Horario: ${tema.horario_semana}\n`;
    if (tema.horario_sabado) context += `- Sábados: ${tema.horario_sabado}\n`;
    if (tema.whatsapp_numero)
      context += `- WhatsApp: +${tema.whatsapp_numero}\n`;
    context += "\n";
  }

  // Agregar contexto adicional
  if (contextos.length > 0) {
    context += "INFORMACIÓN ADICIONAL:\n";
    contextos.forEach((ctx) => {
      context += `\n[${ctx.tipo.toUpperCase()}] ${ctx.titulo}:\n${
        ctx.contenido
      }\n`;
    });
    context += "\n";
  }

  // Agregar FAQs relevantes
  if (faqs.length > 0) {
    context += "PREGUNTAS FRECUENTES RELEVANTES:\n\n";

    faqs.forEach((faq, index) => {
      context += `${index + 1}. Pregunta: ${faq.pregunta}\n`;
      context += `   Respuesta: ${faq.respuesta}\n\n`;
    });
  }

  if (context) {
    context +=
      "\nUSA ESTA INFORMACIÓN PARA RESPONDER. Si no es suficiente, invita al usuario a contactar la clínica.\n";
  }

  return context;
}

/**
 * Determina si una consulta es relevante para FAQs
 */
export function isRelevantForFAQ(query: string): boolean {
  const faqKeywords = [
    "horario",
    "cita",
    "agendar",
    "precio",
    "costo",
    "servicio",
    "seguro",
    "emergencia",
    "contacto",
    "ubicación",
    "dónde",
    "cuánto",
    "cómo",
    "qué",
    "cuando",
    "puedo",
    "telefono",
    "whatsapp",
    "direccion",
    "atencion",
    "tratamiento",
  ];

  const queryLower = query.toLowerCase();
  return faqKeywords.some((keyword) => queryLower.includes(keyword));
}