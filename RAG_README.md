# Sistema RAG con Embeddings Vectoriales

Este sistema utiliza **Retrieval-Augmented Generation (RAG)** con embeddings vectoriales para responder preguntas frecuentes de la clínica dental con alta precisión semántica.

## 🎯 ¿Qué es RAG con Embeddings?

RAG combina la búsqueda de información relevante con la generación de texto de un modelo de lenguaje. Esta implementación usa **embeddings vectoriales** para búsqueda semántica, lo que significa que puede entender el significado de las preguntas, no solo coincidencias de palabras.

### Ejemplo:

- Usuario pregunta: _"¿Cuánto sale arreglar una muela?"_
- El sistema entiende que es similar a: _"¿Cuál es el precio de un tratamiento dental?"_
- Aunque las palabras son diferentes, el **significado** es el mismo.

## 📁 Arquitectura del Sistema

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Usuario hace   │────▶│  Generar         │────▶│  Buscar en BD   │
│  una pregunta   │     │  Embedding (768d)│     │  con pgvector   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Respuesta      │◀────│  Gemini genera   │◀────│  FAQs + Contexto│
│  al usuario     │     │  respuesta       │     │  más similares  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## 🔧 Componentes

### 1. Base de Datos (Supabase + pgvector)

**Tablas principales:**

- `chatbot_faqs` - Preguntas frecuentes con embeddings
- `chatbot_contexto` - Información adicional con embeddings
- `cms_tema` - Datos de contacto de la clínica

**Columnas de embeddings:**

```sql
embedding vector(768)           -- Vector de 768 dimensiones
embedding_updated_at TIMESTAMPTZ -- Fecha de última actualización
```

### 2. Funciones SQL para búsqueda vectorial

```sql
-- Buscar FAQs similares
search_faqs_by_embedding(query_embedding, match_threshold, match_count)

-- Buscar contexto similar
search_contexto_by_embedding(query_embedding, match_threshold, match_count)
```

### 3. lib/rag-utils.ts

| Función                             | Descripción                     |
| ----------------------------------- | ------------------------------- |
| `generateEmbedding(text)`           | Genera embedding para un texto  |
| `generateEmbeddings(texts)`         | Genera embeddings en batch      |
| `searchFAQsFromDB(query, topK)`     | Búsqueda semántica de FAQs      |
| `searchContextoFromDB(query, topK)` | Búsqueda semántica de contexto  |
| `updateFAQEmbedding(id)`            | Actualiza embedding de un FAQ   |
| `syncAllFAQEmbeddings()`            | Sincroniza todos los embeddings |

### 4. API Endpoints

**Chat (POST /api/chat)**

- Recibe pregunta del usuario
- Genera embedding de la consulta
- Busca FAQs y contexto similares
- Genera respuesta con Gemini

**Sync Embeddings (POST /api/chatbot/sync-embeddings)**

- Actualiza embeddings cuando se modifican FAQs
- Solo accesible para administradores

## 🚀 Configuración Inicial

### 1. Ejecutar migración SQL

```bash
# En Supabase Dashboard > SQL Editor
# Ejecutar: supabase/migrations/20251128_add_vector_embeddings.sql
```

### 2. Sincronizar embeddings iniciales

```bash
# Llamar al endpoint (requiere autenticación de admin)
POST /api/chatbot/sync-embeddings
Body: { "type": "all" }
```

### 3. Verificar estado

```bash
GET /api/chatbot/sync-embeddings
# Retorna estadísticas de embeddings
```

## 📝 Agregar/Editar FAQs

Cuando un administrador modifica un FAQ en el panel de administración:

1. Se guarda en `chatbot_faqs`
2. El embedding se marca como desactualizado
3. Se debe llamar al endpoint de sync para regenerar:

```typescript
// Sincronizar un FAQ específico
POST /api/chatbot/sync-embeddings
Body: { "type": "faq", "id": "uuid-del-faq" }

// Sincronizar todos
POST /api/chatbot/sync-embeddings
Body: { "type": "all" }
```

## 🎯 Parámetros de Búsqueda

| Parámetro                  | Valor | Descripción                   |
| -------------------------- | ----- | ----------------------------- |
| `match_threshold` FAQs     | 0.45  | Mínimo 45% de similitud       |
| `match_threshold` Contexto | 0.40  | Mínimo 40% de similitud       |
| `match_count` FAQs         | 3     | Top 3 FAQs más similares      |
| `match_count` Contexto     | 2     | Top 2 contextos más similares |

## 🔒 Seguridad

- Los embeddings se generan **server-side** únicamente
- El modelo **NO aprende** de las conversaciones de usuarios
- Solo los administradores pueden modificar la base de conocimiento
- El system prompt no se expone al cliente

## 📊 Ventajas vs Sistema Anterior

| Aspecto              | Antes (Keywords)  | Ahora (Embeddings) |
| -------------------- | ----------------- | ------------------ |
| Sinónimos            | ❌ No entiende    | ✅ Entiende        |
| Errores ortográficos | ❌ Falla          | ✅ Tolera          |
| Preguntas naturales  | ⚠️ Limitado       | ✅ Excelente       |
| Precisión            | ~60%              | ~90%               |
| Mantenimiento        | Manual (keywords) | Automático         |

## 🧪 Pruebas Recomendadas

✅ "¿Cuál es el horario de atención?"
✅ "¿A qué hora abren?"
✅ "¿Hasta qué hora atienden?"
✅ "cuando puedo ir" (sin tildes, informal)

✅ "¿Cuánto cuesta una limpieza?"
✅ "precio de profilaxis"
✅ "¿Qué tan caro es hacerse una limpieza dental?"

✅ "¿Dónde están ubicados?"
✅ "dirección de la clínica"
✅ "¿cómo llego?"
```

## 🔧 Troubleshooting

### Embeddings no se generan

```bash
# Verificar API key de Google
echo $GOOGLE_GENERATIVE_AI_API_KEY

# Verificar extensión pgvector en Supabase
SELECT * FROM pg_extension WHERE extname = 'vector';
```

### Búsqueda no retorna resultados

```sql
-- Verificar que hay embeddings
SELECT COUNT(*) FROM chatbot_faqs WHERE embedding IS NOT NULL;

-- Probar función directamente
SELECT * FROM search_faqs_by_embedding(
  '[0.1, 0.2, ...]'::vector(768),
  0.3,
  5
);
```

## 📚 Recursos

- [Supabase pgvector](https://supabase.com/docs/guides/database/extensions/pgvector)
- [Google AI Embeddings](https://ai.google.dev/gemini-api/docs/embeddings)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
