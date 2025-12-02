-- Migración para agregar el campo public_id a la tabla cms_carrusel
-- Este campo almacena el ID de Cloudinary para poder eliminar las imágenes

ALTER TABLE public.cms_carrusel
ADD COLUMN IF NOT EXISTS public_id text;

-- Comentario para documentar el campo
COMMENT ON COLUMN public.cms_carrusel.public_id IS 'ID público de Cloudinary para gestión de imágenes';
