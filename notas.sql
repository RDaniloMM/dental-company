-- =================================================================
-- NOTAS Y ACTUALIZACIONES PARA LA TABLA PACIENTES
-- =================================================================

-- Verificar si faltan columnas en la tabla pacientes
-- Comparando el esquema actual con los campos del formulario

-- Columnas que ya existen en el esquema:
-- ✓ nombres, apellidos, fecha_nacimiento, dni, genero, ocupacion
-- ✓ telefono, email, direccion, pais, departamento, provincia, distrito
-- ✓ contacto_emergencia (jsonb), recomendado_por, observaciones
-- ✓ estado_civil, grado_instruccion

-- Todas las columnas necesarias ya están en el esquema.
-- El problema es que algunos campos tienen valores NULL en lugar de cadenas vacías.

-- Para verificar datos existentes:
-- SELECT * FROM pacientes WHERE nombres IS NOT NULL LIMIT 5;

-- Si necesitas actualizar valores NULL a cadenas vacías:
/*
UPDATE pacientes SET 
  direccion = COALESCE(direccion, ''),
  genero = COALESCE(genero, ''),
  ocupacion = COALESCE(ocupacion, ''),
  grado_instruccion = COALESCE(grado_instruccion, ''),
  telefono = COALESCE(telefono, ''),
  email = COALESCE(email, ''),
  pais = COALESCE(pais, ''),
  departamento = COALESCE(departamento, ''),
  provincia = COALESCE(provincia, ''),
  distrito = COALESCE(distrito, ''),
  recomendado_por = COALESCE(recomendado_por, ''),
  observaciones = COALESCE(observaciones, '')
WHERE id IS NOT NULL;
*/

-- Nota: El campo contacto_emergencia es JSONB, se maneja diferente en el código

-- =================================================================
-- ACTUALIZACIÓN PARA AÑADIR ESTADO CIVIL (SI FALTA)
-- =================================================================

-- El siguiente comando añade la columna 'estado_civil' a la tabla 'pacientes'.
-- NOTA: Según las notas anteriores, esta columna ya debería existir.
-- Ejecutar este comando solo si se ha verificado que la columna falta.
-- Si la columna ya existe, este comando arrojará un error.

ALTER TABLE pacientes ADD COLUMN estado_civil VARCHAR(50);
