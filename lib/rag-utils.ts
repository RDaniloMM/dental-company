import { faqData, type FAQ } from "./faq-data";

/**
 * Búsqueda simple basada en keywords y similitud de texto
 * Para un RAG más avanzado, podrías usar embeddings vectoriales
 */
export function searchFAQs(query: string, topK: number = 3): FAQ[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter((word) => word.length > 2);

  // Calcular puntuación para cada FAQ
  const scored = faqData.map((faq) => {
    let score = 0;

    // Puntos por keywords que coinciden
    for (const keyword of faq.keywords) {
      if (queryLower.includes(keyword.toLowerCase())) {
        score += 3;
      }
    }

    // Puntos por palabras del query en pregunta o respuesta
    for (const word of queryWords) {
      if (faq.question.toLowerCase().includes(word)) {
        score += 2;
      }
      if (faq.answer.toLowerCase().includes(word)) {
        score += 1;
      }
    }

    // Bonus si la pregunta es muy similar
    if (
      faq.question.toLowerCase().includes(queryLower) ||
      queryLower.includes(faq.question.toLowerCase())
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
    .map((item) => item.faq);
}

/**
 * Genera el contexto RAG para incluir en el prompt del modelo
 */
export function generateRAGContext(faqs: FAQ[]): string {
  if (faqs.length === 0) {
    return "";
  }

  let context = "INFORMACIÓN RELEVANTE DE NUESTRA BASE DE CONOCIMIENTO:\n\n";

  faqs.forEach((faq, index) => {
    context += `${index + 1}. Pregunta: ${faq.question}\n`;
    context += `   Respuesta: ${faq.answer}\n\n`;
  });

  context +=
    "\nUSA ESTA INFORMACIÓN PARA RESPONDER LA PREGUNTA DEL USUARIO. Si la información no es suficiente, puedes responder de manera general pero menciona que pueden contactar a la clínica para más detalles específicos.\n";

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
  ];

  const queryLower = query.toLowerCase();
  return faqKeywords.some((keyword) => queryLower.includes(keyword));
}
