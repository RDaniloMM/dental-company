-- ============================================================
-- FIX: Políticas RLS para numero_historia_secuencia
-- El trigger necesita poder INSERT/UPDATE en esta tabla
-- ============================================================

-- Opción 1: Deshabilitar RLS para esta tabla (es una tabla interna del sistema)
-- Esta es la opción más simple ya que la tabla solo es usada por el trigger
ALTER TABLE public.numero_historia_secuencia DISABLE ROW LEVEL SECURITY;

-- Alternativa (si prefieres mantener RLS habilitado):
-- Crear políticas para INSERT y UPDATE

-- DROP POLICY IF EXISTS "Lectura de secuencia para usuarios autenticados" ON public.numero_historia_secuencia;

-- Política para SELECT
-- CREATE POLICY "select_secuencia"
-- ON public.numero_historia_secuencia
-- FOR SELECT
-- TO authenticated
-- USING (true);

-- Política para INSERT (necesaria para el trigger)
-- CREATE POLICY "insert_secuencia"
-- ON public.numero_historia_secuencia
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (true);

-- Política para UPDATE (necesaria para el trigger)
-- CREATE POLICY "update_secuencia"
-- ON public.numero_historia_secuencia
-- FOR UPDATE
-- TO authenticated
-- USING (true)
-- WITH CHECK (true);
