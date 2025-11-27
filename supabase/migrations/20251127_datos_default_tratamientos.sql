-- =================================================================
-- DATOS POR DEFECTO PARA TRATAMIENTOS
-- =================================================================

-- Insertar unidades por defecto (si no existen)
INSERT INTO public.unidades (nombre) VALUES
  ('Servicios'),
  ('Unidades'),
  ('Litros'),
  ('Cajas')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar monedas por defecto (si no existen)
INSERT INTO public.monedas (codigo, nombre, simbolo) VALUES
  ('PEN', 'Soles Peruanos', 'S/'),
  ('USD', 'Dólares Americanos', '$'),
  ('EUR', 'Pesos chilenos', 'CLP$')
ON CONFLICT (codigo) DO NOTHING;

-- Insertar grupos de procedimiento por defecto (si no existen)
INSERT INTO public.grupos_procedimiento (nombre, descripcion) VALUES
  ('Ortodoncia', 'Tratamientos de corrección dental'),
  ('Endodoncia', 'Tratamientos de conducto'),
  ('Periodoncia', 'Tratamiento de encías'),
  ('Odontología General', 'Consultas y procedimientos generales'),
  ('Cirugía Oral', 'Extracciones y cirugías'),
  ('Rehabilitación Oral', 'Prótesis y coronas'),
  ('Estética Dental', 'Blanqueamientos y carillas'),
  ('Odontopediatría', 'Tratamientos para niños'),
  ('Radiología', 'Estudios radiográficos')
ON CONFLICT (nombre) DO NOTHING;
