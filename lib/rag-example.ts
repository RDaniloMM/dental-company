// Ejemplo de uso del sistema RAG (Archivo de referencia)
// Este archivo demuestra cómo funcionaría la búsqueda con el sistema RAG
// NOTA: Las funciones reales ahora usan la base de datos (Supabase)

/*
El sistema RAG actual funciona así:

1. searchFAQsFromDB(query, limit) - Busca FAQs en la base de datos
   - Usa keywords para matching
   - Retorna FAQs ordenadas por prioridad

2. getContextoFromDB(tipo?) - Obtiene contexto adicional
   - Tipos: 'informacion', 'servicio', 'politica', 'promocion'

3. generateRAGContext(faqs) - Genera el contexto para el LLM
   - Formatea las FAQs encontradas para el prompt

4. isRelevantForFAQ(query) - Verifica si la consulta es relevante
   - Detecta keywords comunes de la clínica

Ejemplo de uso en el chat API:

```typescript
import { 
  searchFAQsFromDB, 
  getContextoFromDB, 
  generateRAGContext 
} from "@/lib/rag-utils";

// Buscar FAQs relevantes
const faqs = await searchFAQsFromDB(userMessage, 3);
const context = generateRAGContext(faqs);

// Obtener contexto adicional
const contextoExtra = await getContextoFromDB();

// Usar en el prompt del LLM
const systemPrompt = `
Eres un asistente de Dental Company.

${context}

Información adicional:
${contextoExtra.map(c => c.contenido).join('\n')}
`;
```

Para gestionar las FAQs y el contexto, usa la interfaz de admin:
- /admin/chatbot - Gestión de FAQs y contexto
*/

export {};
