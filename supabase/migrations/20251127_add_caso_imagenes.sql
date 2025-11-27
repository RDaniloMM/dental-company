-- Modificar tabla seguimiento_imagenes para soportar también imágenes de casos clínicos
-- Agregar columna caso_id opcional (las imágenes pueden estar vinculadas a seguimiento O a caso)
ALTER TABLE public.seguimiento_imagenes 
ADD COLUMN IF NOT EXISTS caso_id UUID REFERENCES public.casos_clinicos(id) ON DELETE CASCADE;

-- Hacer seguimiento_id opcional (ya que ahora puede ser imagen de caso)
ALTER TABLE public.seguimiento_imagenes 
ALTER COLUMN seguimiento_id DROP NOT NULL;

-- Agregar campos adicionales para mejor gestión de imágenes
ALTER TABLE public.seguimiento_imagenes 
ADD COLUMN IF NOT EXISTS public_id TEXT; -- Para Cloudinary

ALTER TABLE public.seguimiento_imagenes 
ADD COLUMN IF NOT EXISTS titulo TEXT;

ALTER TABLE public.seguimiento_imagenes 
ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'general'; -- 'antes', 'durante', 'despues', 'radiografia', 'general'

ALTER TABLE public.seguimiento_imagenes 
ADD COLUMN IF NOT EXISTS fecha_captura DATE;

-- Renombrar 'ruta' a 'url' si es necesario (o agregar url como alias)
-- No renombramos para no romper código existente, pero agregamos url
ALTER TABLE public.seguimiento_imagenes 
ADD COLUMN IF NOT EXISTS url TEXT;

-- Actualizar registros existentes: copiar ruta a url
UPDATE public.seguimiento_imagenes SET url = ruta WHERE url IS NULL AND ruta IS NOT NULL;

-- Índice para búsquedas por caso
CREATE INDEX IF NOT EXISTS idx_seguimiento_imagenes_caso_id ON public.seguimiento_imagenes(caso_id);

-- Constraint: debe tener al menos seguimiento_id O caso_id
ALTER TABLE public.seguimiento_imagenes 
ADD CONSTRAINT chk_imagen_vinculo CHECK (seguimiento_id IS NOT NULL OR caso_id IS NOT NULL);

-- Comentarios
COMMENT ON COLUMN public.seguimiento_imagenes.caso_id IS 'ID del caso clínico al que pertenece la imagen (opcional)';
COMMENT ON COLUMN public.seguimiento_imagenes.tipo IS 'Tipo de imagen: antes, durante, despues, radiografia, general';
