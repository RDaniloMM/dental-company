import { createClient } from "@/lib/supabase/server";
import { google } from "@ai-sdk/google";
import { embedMany, embed } from "ai";

export interface FAQ {
  id: string;
  pregunta: string;
  respuesta: string;
  keywords: string[];
  categoria: string;
  prioridad: number;
  similarity?: number;
}

export interface Contexto {
  id: string;
  titulo: string;
  contenido: string;
  tipo: string;
  similarity?: number;
}

// Modelo de embeddings de Google (768 dimensiones)
const embeddingModel = google.textEmbeddingModel("text-embedding-004");

/**
 * Genera un embedding para un texto usando Google Gemini
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    console.log(
      "[Embedding] Generando embedding para texto de",
      text.length,
      "caracteres"
    );
    const { embedding } = await embed({
      model: embeddingModel,
      value: text,
    });
    console.log(
      "[Embedding] Embedding generado con",
      embedding.length,
      "dimensiones"
    );
    return embedding;
  } catch (error) {
    console.error("[Embedding] Error generando embedding:", error);
    throw error;
  }
}

/**
 * Genera embeddings para múltiples textos en batch
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: texts,
    });
    return embeddings;
  } catch (error) {
    console.error("Error generando embeddings batch:", error);
    throw error;
  }
}

/**
 * Búsqueda semántica de FAQs usando embeddings vectoriales
 */
export async function searchFAQsFromDB(
  query: string,
  topK: number = 3
): Promise<FAQ[]> {
  try {
    const supabase = await createClient();

    // Generar embedding para la consulta del usuario
    const queryEmbedding = await generateEmbedding(query);

    // Buscar FAQs similares usando la función de Supabase
    const { data, error } = await supabase.rpc("search_faqs_by_embedding", {
      query_embedding: `[${queryEmbedding.join(",")}]`,
      match_threshold: 0.45, // Umbral de similitud (0.45 = 45% similar)
      match_count: topK * 2, // Pedimos más para filtrar después
    });

    if (error) {
      console.error("Error en búsqueda vectorial de FAQs:", error);
      // Fallback a búsqueda por keywords si falla
      return searchFAQsByKeywords(query, topK);
    }

    if (!data || data.length === 0) {
      // Si no hay resultados vectoriales, intentar con keywords
      return searchFAQsByKeywords(query, topK);
    }

    // IMPORTANTE: Verificar que solo usamos FAQs activos
    // Consultamos el estado activo de cada FAQ retornado
    const faqIds = data.map((item: { id: string }) => item.id);
    const { data: activeCheck } = await supabase
      .from("chatbot_faqs")
      .select("id, activo")
      .in("id", faqIds)
      .eq("activo", true);

    const activeIds = new Set(
      (activeCheck || []).map((f: { id: string }) => f.id)
    );

    // Filtrar solo los FAQs que están activos
    const activeFaqs = data.filter((item: { id: string }) =>
      activeIds.has(item.id)
    );

    return activeFaqs
      .slice(0, topK)
      .map(
        (item: {
          id: string;
          pregunta: string;
          respuesta: string;
          keywords: string[];
          categoria: string;
          prioridad: number;
          similarity: number;
        }) => ({
          id: item.id,
          pregunta: item.pregunta,
          respuesta: item.respuesta,
          keywords: item.keywords || [],
          categoria: item.categoria,
          prioridad: item.prioridad,
          similarity: item.similarity,
        })
      );
  } catch (error) {
    console.error("Error en searchFAQsFromDB:", error);
    // Fallback a búsqueda por keywords
    return searchFAQsByKeywords(query, topK);
  }
}

/**
 * Búsqueda de FAQs por keywords (fallback cuando no hay embeddings)
 */
async function searchFAQsByKeywords(
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
    console.error("Error en searchFAQsByKeywords:", error);
    return [];
  }
}

/**
 * Búsqueda semántica de contexto adicional
 */
export async function searchContextoFromDB(
  query: string,
  topK: number = 2
): Promise<Contexto[]> {
  try {
    const supabase = await createClient();

    // Generar embedding para la consulta
    const queryEmbedding = await generateEmbedding(query);

    // Buscar contexto similar
    const { data, error } = await supabase.rpc("search_contexto_by_embedding", {
      query_embedding: `[${queryEmbedding.join(",")}]`,
      match_threshold: 0.4,
      match_count: topK * 2, // Pedimos más para filtrar después
    });

    if (error) {
      console.error("Error en búsqueda vectorial de contexto:", error);
      return getContextoFromDB(); // Fallback: retornar todo el contexto activo
    }

    if (!data || data.length === 0) {
      return [];
    }

    // IMPORTANTE: Verificar que solo usamos contexto activo
    const ctxIds = data.map((item: { id: string }) => item.id);
    const { data: activeCheck } = await supabase
      .from("chatbot_contexto")
      .select("id, activo")
      .in("id", ctxIds)
      .eq("activo", true);

    const activeIds = new Set(
      (activeCheck || []).map((c: { id: string }) => c.id)
    );
    const activeContexto = data.filter((item: { id: string }) =>
      activeIds.has(item.id)
    );

    return activeContexto.slice(0, topK);
  } catch (error) {
    console.error("Error en searchContextoFromDB:", error);
    return getContextoFromDB();
  }
}

/**
 * Obtener todo el contexto adicional del chatbot (fallback)
 */
export async function getContextoFromDB(): Promise<Contexto[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("chatbot_contexto")
      .select("id, titulo, contenido, tipo")
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
 * Obtener información general de la clínica (contacto, horarios, etc.)
 * Excluye los registros del grupo 'chatbot' que son configuración del bot
 */
export async function getInfoFromDB(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient();

    // Solo obtener datos del tema CMS, NO la configuración del chatbot
    const { data, error } = await supabase
      .from("cms_tema")
      .select("clave, valor")
      .or("grupo.is.null,grupo.neq.chatbot");

    if (error || !data) {
      console.error("Error obteniendo tema:", error);
      return {};
    }

    return data.reduce((acc, item) => {
      acc[item.clave] = item.valor;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error("Error en getInfoFromDB:", error);
    return {};
  }
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  detalle_completo?: string;
  beneficios?: string[];
  duracion?: string;
}

export interface Miembro {
  id: string;
  nombre: string;
  cargo: string;
  especialidad: string;
  curriculum?: {
    formacion?: string[];
    experiencia?: string[];
    especialidades?: string[];
    filosofia?: string;
  } | null;
}

/**
 * Obtener servicios visibles para el chatbot
 */
export async function getServiciosFromDB(): Promise<Servicio[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("cms_servicios")
      .select("id, nombre, descripcion, detalle_completo, beneficios, duracion")
      .eq("visible", true)
      .order("orden", { ascending: true });

    if (error || !data) {
      console.error("Error obteniendo servicios:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error en getServiciosFromDB:", error);
    return [];
  }
}

/**
 * Obtener equipo visible para el chatbot
 */
export async function getEquipoFromDB(): Promise<Miembro[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("cms_equipo")
      .select("id, nombre, cargo, especialidad, curriculum")
      .eq("visible", true)
      .order("orden", { ascending: true });

    if (error || !data) {
      console.error("Error obteniendo equipo:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error en getEquipoFromDB:", error);
    return [];
  }
}

/**
 * Obtener configuración de contexto del chatbot desde cms_tema (grupo='chatbot')
 */
export async function getChatbotConfigFromDB(): Promise<
  Record<string, string>
> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("cms_tema")
      .select("clave, valor")
      .eq("grupo", "chatbot");

    if (error || !data) {
      // Si no hay datos, devolver valores por defecto
      return {
        chatbot_usar_info_general: "true",
        chatbot_usar_servicios: "true",
        chatbot_usar_equipo: "true",
        chatbot_system_prompt: "",
      };
    }

    return data.reduce((acc, item) => {
      acc[item.clave] = item.valor;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error("Error en getChatbotConfigFromDB:", error);
    return {
      chatbot_usar_info_general: "true",
      chatbot_usar_servicios: "true",
      chatbot_usar_equipo: "true",
      chatbot_system_prompt: "",
    };
  }
}

/**
 * Genera el contexto RAG para incluir en el prompt del modelo
 */
export function generateRAGContext(
  faqs: FAQ[],
  contextos: Contexto[] = [],
  tema: Record<string, string> = {},
  servicios: Servicio[] = [],
  equipo: Miembro[] = [],
  config: Record<string, string> = {}
): string {
  let context = "";

  // Agregar información de contacto desde el tema (si está habilitado)
  const usarInfoGeneral = config.chatbot_usar_info_general !== "false";
  if (usarInfoGeneral && Object.keys(tema).length > 0) {
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

  // Agregar servicios (si está habilitado)
  const usarServicios = config.chatbot_usar_servicios !== "false";
  if (usarServicios && servicios.length > 0) {
    context += "SERVICIOS QUE OFRECEMOS:\n";
    servicios.forEach((servicio) => {
      context += `\n• ${servicio.nombre}: ${servicio.descripcion}`;
      if (servicio.duracion) context += ` (Duración: ${servicio.duracion})`;
      context += "\n";
      if (servicio.detalle_completo) {
        context += `  Detalles: ${servicio.detalle_completo}\n`;
      }
      if (servicio.beneficios && servicio.beneficios.length > 0) {
        context += `  Beneficios: ${servicio.beneficios.join(", ")}\n`;
      }
    });
    context += "\n";
  }

  // Agregar equipo (si está habilitado)
  const usarEquipo = config.chatbot_usar_equipo !== "false";
  if (usarEquipo && equipo.length > 0) {
    context += "NUESTRO EQUIPO MÉDICO:\n";
    equipo.forEach((miembro) => {
      context += `\n• ${miembro.nombre}`;
      if (miembro.cargo) context += ` - ${miembro.cargo}`;
      if (miembro.especialidad) context += ` (${miembro.especialidad})`;
      context += "\n";
      if (miembro.curriculum) {
        if (
          miembro.curriculum.especialidades &&
          miembro.curriculum.especialidades.length > 0
        ) {
          context += `  Especialidades: ${miembro.curriculum.especialidades.join(
            ", "
          )}\n`;
        }
        if (miembro.curriculum.filosofia) {
          context += `  Filosofía: ${miembro.curriculum.filosofia}\n`;
        }
      }
    });
    context += "\n";
  }

  // Agregar contexto adicional relevante
  if (contextos.length > 0) {
    context += "INFORMACIÓN RELEVANTE:\n";
    contextos.forEach((ctx) => {
      const similarityNote = ctx.similarity
        ? ` (relevancia: ${Math.round(ctx.similarity * 100)}%)`
        : "";
      context += `\n[${ctx.tipo.toUpperCase()}] ${
        ctx.titulo
      }${similarityNote}:\n${ctx.contenido}\n`;
    });
    context += "\n";
  }

  // Agregar FAQs relevantes con indicador de relevancia
  if (faqs.length > 0) {
    context += "PREGUNTAS FRECUENTES RELACIONADAS:\n\n";

    faqs.forEach((faq, index) => {
      const similarityNote = faq.similarity
        ? ` (similitud: ${Math.round(faq.similarity * 100)}%)`
        : "";
      context += `${index + 1}. Pregunta: ${faq.pregunta}${similarityNote}\n`;
      context += `   Respuesta: ${faq.respuesta}\n\n`;
    });
  }

  if (context) {
    context +=
      "\nUSA ESTA INFORMACIÓN PARA RESPONDER DE FORMA PRECISA. Si la información no es suficiente para responder, invita al usuario a contactar la clínica directamente.\n";
  }

  return context;
}

/**
 * Determina si una consulta es relevante para buscar en la base de conocimiento
 * (Ahora menos restrictivo porque la búsqueda semántica es más precisa)
 */
export function isRelevantForFAQ(query: string): boolean {
  // Con embeddings, casi cualquier pregunta puede beneficiarse de la búsqueda
  // Solo excluimos saludos muy simples
  const excludePatterns = [
    /^hola$/i,
    /^hi$/i,
    /^buenos?\s*(días?|tardes?|noches?)$/i,
    /^gracias$/i,
    /^ok$/i,
    /^bien$/i,
    /^chao$/i,
    /^adiós$/i,
  ];

  const queryTrimmed = query.trim();

  // Si es muy corto (menos de 3 caracteres), no buscar
  if (queryTrimmed.length < 3) return false;

  // Si coincide con patrones excluidos, no buscar
  for (const pattern of excludePatterns) {
    if (pattern.test(queryTrimmed)) return false;
  }

  return true;
}

/**
 * Actualiza el embedding de un FAQ específico
 */
export async function updateFAQEmbedding(faqId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    console.log("[SyncEmbed] Actualizando FAQ:", faqId);

    // Obtener el FAQ
    const { data: faq, error: fetchError } = await supabase
      .from("chatbot_faqs")
      .select("pregunta, respuesta, keywords")
      .eq("id", faqId)
      .single();

    if (fetchError || !faq) {
      console.error("[SyncEmbed] Error obteniendo FAQ:", fetchError);
      return false;
    }

    // Crear texto para embedding (combinar pregunta, respuesta y keywords)
    const textForEmbedding = [
      faq.pregunta,
      faq.respuesta,
      ...(faq.keywords || []),
    ].join(" ");

    console.log(
      "[SyncEmbed] Texto para embedding:",
      textForEmbedding.substring(0, 100) + "..."
    );

    // Generar embedding
    const embedding = await generateEmbedding(textForEmbedding);
    console.log("[SyncEmbed] Embedding generado, guardando en BD...");

    // Actualizar en la BD - pgvector acepta array directamente o string formato [1,2,3]
    const { error: updateError } = await supabase
      .from("chatbot_faqs")
      .update({
        embedding: `[${embedding.join(",")}]`,
        embedding_updated_at: new Date().toISOString(),
      })
      .eq("id", faqId);

    if (updateError) {
      console.error(
        "[SyncEmbed] Error actualizando embedding en BD:",
        updateError
      );
      return false;
    }

    console.log("[SyncEmbed] FAQ actualizado exitosamente:", faqId);
    return true;
  } catch (error) {
    console.error("[SyncEmbed] Error en updateFAQEmbedding:", error);
    return false;
  }
}

/**
 * Actualiza todos los embeddings de FAQs que no tienen o están desactualizados
 */
export async function syncAllFAQEmbeddings(): Promise<{
  updated: number;
  failed: number;
}> {
  try {
    const supabase = await createClient();

    // Obtener FAQs sin embedding
    const { data: faqs, error } = await supabase
      .from("chatbot_faqs")
      .select("id, pregunta, respuesta, keywords, embedding")
      .eq("activo", true)
      .is("embedding", null);

    if (error) {
      console.error("Error obteniendo FAQs para sync:", error);
      return { updated: 0, failed: 0 };
    }

    if (!faqs || faqs.length === 0) {
      console.log("[SyncEmbed] Todos los FAQs ya tienen embeddings");
      return { updated: 0, failed: 0 };
    }

    console.log(`[SyncEmbed] ${faqs.length} FAQs necesitan embeddings`);

    let updated = 0;
    let failed = 0;

    // Procesar en batches de 5 para no sobrecargar la API
    const batchSize = 5;
    for (let i = 0; i < faqs.length; i += batchSize) {
      const batch = faqs.slice(i, i + batchSize);

      // Preparar textos para embedding
      const texts = batch.map((faq) =>
        [faq.pregunta, faq.respuesta, ...(faq.keywords || [])].join(" ")
      );

      try {
        // Generar embeddings en batch
        const embeddings = await generateEmbeddings(texts);

        // Actualizar cada FAQ
        for (let j = 0; j < batch.length; j++) {
          const { error: updateError } = await supabase
            .from("chatbot_faqs")
            .update({
              embedding: `[${embeddings[j].join(",")}]`,
              embedding_updated_at: new Date().toISOString(),
            })
            .eq("id", batch[j].id);

          if (updateError) {
            console.error(
              `Error actualizando FAQ ${batch[j].id}:`,
              updateError
            );
            failed++;
          } else {
            updated++;
          }
        }
      } catch (batchError) {
        console.error("Error en batch de embeddings:", batchError);
        failed += batch.length;
      }

      // Pequeña pausa entre batches para evitar rate limiting
      if (i + batchSize < faqs.length) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    console.log(
      `[SyncEmbed] Sincronización completada: ${updated} actualizados, ${failed} fallidos`
    );
    return { updated, failed };
  } catch (error) {
    console.error("Error en syncAllFAQEmbeddings:", error);
    return { updated: 0, failed: 0 };
  }
}

/**
 * Actualiza el embedding de un contexto específico
 */
export async function updateContextoEmbedding(
  contextoId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();

    // Obtener el contexto
    const { data: contexto, error: fetchError } = await supabase
      .from("chatbot_contexto")
      .select("titulo, contenido")
      .eq("id", contextoId)
      .single();

    if (fetchError || !contexto) {
      console.error("Error obteniendo contexto:", fetchError);
      return false;
    }

    // Crear texto para embedding
    const textForEmbedding = `${contexto.titulo} ${contexto.contenido}`;

    // Generar embedding
    const embedding = await generateEmbedding(textForEmbedding);

    // Actualizar en la BD - pgvector acepta array directamente o string formato [1,2,3]
    const { error: updateError } = await supabase
      .from("chatbot_contexto")
      .update({
        embedding: `[${embedding.join(",")}]`,
        embedding_updated_at: new Date().toISOString(),
      })
      .eq("id", contextoId);

    if (updateError) {
      console.error("Error actualizando embedding de contexto:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error en updateContextoEmbedding:", error);
    return false;
  }
}
