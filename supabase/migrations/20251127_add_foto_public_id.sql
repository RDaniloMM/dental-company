-- Migración: Añadir columna foto_public_id a cms_equipo
-- Fecha: 2025-11-27
-- Descripción: Añade columna para almacenar el public_id de Cloudinary

ALTER TABLE public.cms_equipo 
ADD COLUMN IF NOT EXISTS foto_public_id TEXT;

-- Comentario descriptivo
COMMENT ON COLUMN public.cms_equipo.foto_public_id IS 'Public ID de Cloudinary para poder eliminar la imagen';
