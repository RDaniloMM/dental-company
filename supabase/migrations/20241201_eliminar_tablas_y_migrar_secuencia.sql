-- =====================================================
-- MIGRACIÓN: Eliminar tablas no utilizadas y migrar
-- numero_historia_secuencia → config_seguridad
-- Fecha: 2024-12-01
-- =====================================================

-- ==========================================
-- 1. MIGRAR SECUENCIA DE HISTORIA CLÍNICA
-- ==========================================

-- Migrar datos existentes de numero_historia_secuencia a config_seguridad
INSERT INTO public.config_seguridad (clave, valor, descripcion)
SELECT 
  'secuencia_historia_' || año::text,
  ultimo_numero::text,
  'Último número de historia clínica para el año ' || año::text
FROM public.numero_historia_secuencia
ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor;

-- ==========================================
-- 2. ACTUALIZAR FUNCIÓN DE GENERACIÓN
-- ==========================================

-- Crear o reemplazar la función generar_numero_historia
-- para usar config_seguridad en lugar de numero_historia_secuencia
CREATE OR REPLACE FUNCTION public.generar_numero_historia() 
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    año_actual INTEGER;
    clave_secuencia TEXT;
    proximo_numero INTEGER;
    config_id UUID;
BEGIN
    -- Obtener el año actual
    año_actual := EXTRACT(YEAR FROM CURRENT_DATE);
    clave_secuencia := 'secuencia_historia_' || año_actual::TEXT;
    
    -- Buscar si existe la configuración para este año
    SELECT id, valor::INTEGER INTO config_id, proximo_numero
    FROM public.config_seguridad
    WHERE clave = clave_secuencia;
    
    IF config_id IS NULL THEN
        -- No existe, crear nuevo registro con valor 1
        INSERT INTO public.config_seguridad (clave, valor, descripcion)
        VALUES (
            clave_secuencia, 
            '1', 
            'Último número de historia clínica para el año ' || año_actual::TEXT
        )
        RETURNING valor::INTEGER INTO proximo_numero;
    ELSE
        -- Existe, incrementar el valor
        UPDATE public.config_seguridad
        SET valor = (proximo_numero + 1)::TEXT,
            updated_at = NOW()
        WHERE id = config_id
        RETURNING valor::INTEGER INTO proximo_numero;
    END IF;
    
    -- Generar el número de historia en formato HC-YYYY-NNNN
    NEW.numero_historia := 'HC-' || año_actual || '-' || LPAD(proximo_numero::TEXT, 4, '0');
    
    RETURN NEW;
END;
$$;

-- ==========================================
-- 3. ELIMINAR TABLAS NO UTILIZADAS
-- ==========================================

-- Eliminar tabla de secuencia (ya migrada a config_seguridad)
DROP TABLE IF EXISTS public.numero_historia_secuencia;

-- Eliminar cola de chatbot (no utilizada)
DROP TABLE IF EXISTS public.chatbot_cola;

-- Eliminar conversaciones de chatbot (funcionalidad removida)
DROP TABLE IF EXISTS public.chatbot_conversaciones;

-- ==========================================
-- 4. LIMPIAR FUNCIONES RELACIONADAS
-- ==========================================

-- Eliminar función de limpieza de conversaciones (ya no necesaria)
DROP FUNCTION IF EXISTS public.limpiar_conversaciones_expiradas();

-- ==========================================
-- RESUMEN DE CAMBIOS
-- ==========================================
-- ✓ Migrada secuencia de números de historia a config_seguridad
-- ✓ Actualizada función generar_numero_historia()
-- ✓ Eliminada tabla numero_historia_secuencia
-- ✓ Eliminada tabla chatbot_cola
-- ✓ Eliminada tabla chatbot_conversaciones
-- ✓ Eliminada función limpiar_conversaciones_expiradas()
