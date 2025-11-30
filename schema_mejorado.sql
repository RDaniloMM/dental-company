CREATE TYPE public.estado_cita AS ENUM ('Programada', 'Confirmada', 'Cancelada', 'Completada', 'No Asistió');
CREATE TYPE public.rol AS ENUM ('Admin', 'Odontólogo');
CREATE TYPE public.item_status AS ENUM ('Pendiente', 'En Progreso', 'Completado', 'Cancelado');
CREATE TYPE public.medida_tratamiento AS ENUM ('No específica', 'General', 'Pieza', 'Radiografía', 'Prótesis', 'Corona', 'Consulta', 'Cirugías');
CREATE TYPE public.estado_civil AS ENUM ('Soltero', 'Casado', 'Divorciado', 'Viudo', 'Unión Libre');
