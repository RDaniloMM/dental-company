-- ============================================================
-- MIGRACIÓN: Número de Historia Clínica Secuencial por Año
-- Formato: HC-YYYY-NNNN (ej: HC-2025-0001, HC-2025-0002, etc.)
-- ============================================================

-- 1. Crear secuencia para el año actual (se reinicia cada año)
-- Usamos una tabla para mantener el contador por año
CREATE TABLE IF NOT EXISTS public.numero_historia_secuencia (
    año INTEGER PRIMARY KEY,
    ultimo_numero INTEGER NOT NULL DEFAULT 0
);

-- 2. Función para generar el próximo número de historia
CREATE OR REPLACE FUNCTION public.generar_numero_historia()
RETURNS TRIGGER AS $$
DECLARE
    año_actual INTEGER;
    proximo_numero INTEGER;
BEGIN
    -- Obtener el año actual
    año_actual := EXTRACT(YEAR FROM CURRENT_DATE);
    
    -- Insertar o actualizar el contador del año
    INSERT INTO public.numero_historia_secuencia (año, ultimo_numero)
    VALUES (año_actual, 1)
    ON CONFLICT (año) 
    DO UPDATE SET ultimo_numero = numero_historia_secuencia.ultimo_numero + 1
    RETURNING ultimo_numero INTO proximo_numero;
    
    -- Si no se insertó (ya existía), obtener el valor actualizado
    IF proximo_numero IS NULL THEN
        SELECT ultimo_numero INTO proximo_numero 
        FROM public.numero_historia_secuencia 
        WHERE año = año_actual;
    END IF;
    
    -- Generar el número de historia en formato HC-YYYY-NNNN
    NEW.numero_historia := 'HC-' || año_actual || '-' || LPAD(proximo_numero::TEXT, 4, '0');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Crear trigger que se ejecuta ANTES de insertar un paciente
-- Solo si numero_historia es NULL o vacío
DROP TRIGGER IF EXISTS trigger_generar_numero_historia ON public.pacientes;

CREATE TRIGGER trigger_generar_numero_historia
    BEFORE INSERT ON public.pacientes
    FOR EACH ROW
    WHEN (NEW.numero_historia IS NULL OR NEW.numero_historia = '')
    EXECUTE FUNCTION public.generar_numero_historia();

-- 4. Inicializar la secuencia con el máximo número existente del año actual
-- Esto evita colisiones con registros existentes
DO $$
DECLARE
    año_actual INTEGER;
    max_numero INTEGER;
BEGIN
    año_actual := EXTRACT(YEAR FROM CURRENT_DATE);
    
    -- Buscar el número más alto del año actual
    SELECT COALESCE(MAX(
        CASE 
            WHEN numero_historia ~ ('^HC-' || año_actual || '-[0-9]+$')
            THEN CAST(SUBSTRING(numero_historia FROM 'HC-[0-9]+-([0-9]+)$') AS INTEGER)
            ELSE 0
        END
    ), 0) INTO max_numero
    FROM public.pacientes;
    
    -- Insertar o actualizar la secuencia
    INSERT INTO public.numero_historia_secuencia (año, ultimo_numero)
    VALUES (año_actual, max_numero)
    ON CONFLICT (año) 
    DO UPDATE SET ultimo_numero = GREATEST(numero_historia_secuencia.ultimo_numero, max_numero);
    
    RAISE NOTICE 'Secuencia inicializada para año % con último número %', año_actual, max_numero;
END $$;

-- 5. Agregar índice único para garantizar unicidad
CREATE UNIQUE INDEX IF NOT EXISTS idx_pacientes_numero_historia_unique 
ON public.pacientes (numero_historia);

-- 6. Habilitar RLS en la tabla de secuencia (solo lectura para usuarios autenticados)
ALTER TABLE public.numero_historia_secuencia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura de secuencia para usuarios autenticados"
ON public.numero_historia_secuencia
FOR SELECT
TO authenticated
USING (true);
