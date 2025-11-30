-- Ejecutar este script en el SQL Editor de Supabase para asegurar que la función filtra por activo

-- Recrear la función de búsqueda de FAQs con filtro activo
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

-- Recrear la función de búsqueda de contexto con filtro activo
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

-- Verificar FAQs activos vs inactivos
SELECT 
  activo, 
  COUNT(*) as cantidad 
FROM chatbot_faqs 
GROUP BY activo;

-- Probar la función (debería retornar solo FAQs activos)
-- Descomenta para probar:
-- SELECT * FROM chatbot_faqs WHERE activo = false;
