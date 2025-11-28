-- ============================================
-- Migración: Agregar soporte de embeddings vectoriales para RAG
-- Fecha: 2025-11-28
-- ============================================

-- 1. Habilitar la extensión pgvector (si no existe)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Agregar columna de embeddings a chatbot_faqs
-- Usamos 768 dimensiones que es el tamaño de los embeddings de Google
ALTER TABLE public.chatbot_faqs 
ADD COLUMN IF NOT EXISTS embedding vector(768);

-- 3. Agregar columna para indicar si el embedding está actualizado
ALTER TABLE public.chatbot_faqs 
ADD COLUMN IF NOT EXISTS embedding_updated_at TIMESTAMPTZ;

-- 4. Crear índice para búsqueda vectorial eficiente (IVFFlat)
-- Nota: Este índice mejora el rendimiento de búsquedas de similitud
DROP INDEX IF EXISTS chatbot_faqs_embedding_idx;
CREATE INDEX chatbot_faqs_embedding_idx ON public.chatbot_faqs 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 10);

-- 5. Agregar columna de embeddings a chatbot_contexto
ALTER TABLE public.chatbot_contexto 
ADD COLUMN IF NOT EXISTS embedding vector(768);

ALTER TABLE public.chatbot_contexto 
ADD COLUMN IF NOT EXISTS embedding_updated_at TIMESTAMPTZ;

-- 6. Crear índice para chatbot_contexto
DROP INDEX IF EXISTS chatbot_contexto_embedding_idx;
CREATE INDEX chatbot_contexto_embedding_idx ON public.chatbot_contexto 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 5);

-- 7. Función para buscar FAQs por similitud semántica
CREATE OR REPLACE FUNCTION search_faqs_by_embedding(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  pregunta TEXT,
  respuesta TEXT,
  keywords TEXT[],
  categoria TEXT,
  prioridad INT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.pregunta,
    f.respuesta,
    f.keywords,
    f.categoria,
    f.prioridad,
    1 - (f.embedding <=> query_embedding) AS similarity
  FROM public.chatbot_faqs f
  WHERE 
    f.activo = true 
    AND f.embedding IS NOT NULL
    AND 1 - (f.embedding <=> query_embedding) > match_threshold
  ORDER BY f.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 8. Función para buscar contexto por similitud
CREATE OR REPLACE FUNCTION search_contexto_by_embedding(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.4,
  match_count int DEFAULT 3
)
RETURNS TABLE (
  id UUID,
  titulo TEXT,
  contenido TEXT,
  tipo TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.titulo,
    c.contenido,
    c.tipo,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM public.chatbot_contexto c
  WHERE 
    c.activo = true 
    AND c.embedding IS NOT NULL
    AND 1 - (c.embedding <=> query_embedding) > match_threshold
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 9. Comentarios para documentación
COMMENT ON COLUMN public.chatbot_faqs.embedding IS 'Vector de embeddings generado por Google Gemini (768 dimensiones)';
COMMENT ON COLUMN public.chatbot_faqs.embedding_updated_at IS 'Timestamp de la última actualización del embedding';
COMMENT ON FUNCTION search_faqs_by_embedding IS 'Busca FAQs similares usando cosine similarity con embeddings vectoriales';
COMMENT ON FUNCTION search_contexto_by_embedding IS 'Busca contexto similar usando cosine similarity con embeddings vectoriales';
