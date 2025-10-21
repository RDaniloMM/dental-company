# Sistema RAG Simple para FAQ

Este es un sistema de Retrieval-Augmented Generation (RAG) simple implementado para responder preguntas frecuentes de la clínica dental.

## 🎯 ¿Qué es RAG?

RAG combina la búsqueda de información relevante con la generación de texto de un modelo de lenguaje. En lugar de que el modelo responda solo con su conocimiento general, primero busca información específica en una base de datos y luego genera una respuesta basada en ese contexto.

## 📁 Archivos Creados

1. **`lib/faq-data.ts`** - Base de datos de preguntas frecuentes
2. **`lib/rag-utils.ts`** - Funciones de búsqueda y generación de contexto
3. **`app/api/chat/route.ts`** - API actualizada con capacidad RAG

## 🔧 Cómo Funciona

### 1. Base de Datos FAQ (`faq-data.ts`)

Contiene un array de objetos con:

- `id`: Identificador único
- `question`: La pregunta frecuente
- `answer`: La respuesta
- `keywords`: Palabras clave para mejorar la búsqueda

### 2. Sistema de Búsqueda (`rag-utils.ts`)

#### `searchFAQs(query, topK)`

Busca las FAQs más relevantes usando:

- **Coincidencia de keywords**: +3 puntos por keyword que coincide
- **Palabras en pregunta**: +2 puntos
- **Palabras en respuesta**: +1 punto
- **Pregunta muy similar**: +5 puntos bonus

Retorna las top K FAQs más relevantes.

#### `generateRAGContext(faqs)`

Genera un prompt estructurado con las FAQs relevantes para que el modelo las use como contexto.

#### `isRelevantForFAQ(query)`

Determina si una consulta es del tipo que podría beneficiarse de las FAQs.

### 3. Integración con Gemini

En la ruta de la API:

1. Si `useFAQ` está activado, extrae la última consulta del usuario
2. Verifica si es relevante para FAQs
3. Busca las 3 FAQs más relevantes
4. Genera el contexto RAG
5. Lo incluye en el system prompt de Gemini
6. El modelo responde basándose en ese contexto

## 🎨 Interfaz de Usuario

Se agregó un botón **"FAQ"** en la barra de herramientas:

- **Activado** (azul): El chatbot usará la base de conocimiento FAQ
- **Desactivado** (gris): El chatbot responderá solo con conocimiento general

## 📝 Agregar Nuevas FAQs

Para agregar nuevas preguntas frecuentes, edita `lib/faq-data.ts`:

```typescript
{
  id: "9",
  question: "¿Tu nueva pregunta?",
  answer: "La respuesta detallada...",
  keywords: ["palabra1", "palabra2", "palabra3"]
}
```

**Tips para buenos keywords:**

- Incluye sinónimos
- Usa verbos y sustantivos clave
- Piensa en cómo los usuarios preguntarían
- Incluye términos técnicos y coloquiales

## 🚀 Mejoras Futuras

### 1. Embeddings Vectoriales

Para búsquedas más precisas, podrías usar:

```typescript
// Instalar: npm install @google/generative-ai
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "embedding-001" });

// Generar embeddings
const result = await model.embedContent(text);
const embedding = result.embedding;
```

### 2. Base de Datos Vectorial

Usar una DB como:

- **Pinecone** (cloud)
- **Chroma** (local)
- **Supabase pgvector** (ya usas Supabase!)

### 3. Chunking de Documentos

Para documentos largos, dividir en chunks:

```typescript
function chunkDocument(text: string, chunkSize: number = 500) {
  const sentences = text.split(/[.!?]+/);
  const chunks = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length < chunkSize) {
      currentChunk += sentence + ". ";
    } else {
      chunks.push(currentChunk.trim());
      currentChunk = sentence + ". ";
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}
```

### 4. Caché de Búsquedas

Implementar caché para consultas comunes:

```typescript
const searchCache = new Map<string, FAQ[]>();

export function searchFAQsWithCache(query: string, topK: number = 3): FAQ[] {
  const cacheKey = query.toLowerCase();
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  const results = searchFAQs(query, topK);
  searchCache.set(cacheKey, results);
  return results;
}
```

## 🧪 Pruebas

Intenta preguntas como:

- "¿Cuál es el horario?"
- "¿Cómo agendo una cita?"
- "¿Cuánto cuesta una limpieza?"
- "¿Atienden emergencias?"
- "¿Aceptan seguro médico?"

Compara las respuestas con y sin el modo FAQ activado.

## 📊 Ventajas de este Enfoque

✅ **Simple**: No requiere dependencias adicionales
✅ **Rápido**: Búsqueda instantánea en memoria
✅ **Controlable**: Sabes exactamente qué información se usa
✅ **Económico**: No requiere embeddings o bases de datos vectoriales
✅ **Actualizable**: Fácil agregar/editar FAQs

## ⚠️ Limitaciones

- Búsqueda básica (no semántica verdadera)
- Limitado a FAQs pre-definidas
- No escala bien con miles de documentos
- Requiere mantener keywords manualmente

## 🎓 Recursos

- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Google Gemini API](https://ai.google.dev/)
- [RAG Explained](https://www.pinecone.io/learn/retrieval-augmented-generation/)
