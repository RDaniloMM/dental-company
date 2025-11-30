-- =================================================================
-- MIGRACIÓN: Imágenes de Carrusel para Servicios
-- Fecha: 30 de Noviembre de 2025
-- =================================================================

-- Tabla para imágenes de servicios (carrusel por servicio)
CREATE TABLE IF NOT EXISTS public.cms_servicio_imagenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    servicio_id UUID NOT NULL REFERENCES public.cms_servicios(id) ON DELETE CASCADE,
    imagen_url TEXT NOT NULL,
    public_id TEXT, -- ID de Cloudinary para poder eliminar
    descripcion TEXT,
    alt_text TEXT,
    orden INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsqueda por servicio
CREATE INDEX IF NOT EXISTS idx_servicio_imagenes_servicio_id 
ON public.cms_servicio_imagenes(servicio_id);

-- Índice para ordenamiento
CREATE INDEX IF NOT EXISTS idx_servicio_imagenes_orden 
ON public.cms_servicio_imagenes(servicio_id, orden);

-- Habilitar RLS
ALTER TABLE public.cms_servicio_imagenes ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Servicio imágenes lectura pública" 
ON public.cms_servicio_imagenes FOR SELECT USING (visible = true);

CREATE POLICY "Servicio imágenes admin write" 
ON public.cms_servicio_imagenes FOR ALL USING (auth.role() = 'authenticated');

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_servicio_imagenes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_servicio_imagenes_updated_at
BEFORE UPDATE ON public.cms_servicio_imagenes
FOR EACH ROW
EXECUTE FUNCTION update_servicio_imagenes_updated_at();
