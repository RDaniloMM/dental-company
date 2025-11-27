-- Agregar campo curriculum a cms_equipo para guardar CV de odontólogos
ALTER TABLE cms_equipo 
ADD COLUMN IF NOT EXISTS curriculum JSONB DEFAULT NULL;

COMMENT ON COLUMN cms_equipo.curriculum IS 'Curriculum vitae del miembro del equipo en formato JSON';

-- Migrar datos hardcodeados a la BD

-- Dr. Ulises Peñaloza
UPDATE cms_equipo 
SET curriculum = '{
  "formacion": [
    "Doctorado en Odontología",
    "Maestría en Odontología con mención en patología",
    "Maestría en Investigación e innovación científica",
    "Segunda Especialidad en Periodoncia e implantología",
    "Cirujano dentista"
  ],
  "experiencia": [
    "17 años de experiencia profesional",
    "16 años como docente Universitario",
    "Investigador Renacyt",
    "Miembro de la Asociación Peruana de Periodoncia y osteointegración",
    "Ganador del concurso Nacional de Invenciones - INDECOPI (Patente frente al COVID)",
    "Diversas publicaciones en revistas científicas indexadas"
  ],
  "especialidades": [
    "Implantes dentales post extracción",
    "Regeneración ósea guiada",
    "Prótesis sobre implantes",
    "Injertos de encía",
    "Tratamiento de periodontitis"
  ],
  "filosofia": "Mi objetivo es devolverle no solo la funcionalidad a la sonrisa de mis pacientes, sino también la confianza para reír sin preocupaciones. Utilizo tecnología de vanguardia para planificar cada caso de manera precisa y predecible con un enfoque en la salud integral de mis pacientes."
}'::jsonb
WHERE nombre ILIKE '%Ulises Peñaloza%';

-- Dra. Gabriela Condori
UPDATE cms_equipo 
SET curriculum = '{
  "formacion": [
    "Maestría en Investigación e innovación científica",
    "Segunda Especialidad en Ortodoncia e ortopedia maxilar",
    "Cirujano dentista"
  ],
  "experiencia": [
    "10 años de experiencia profesional",
    "Más de 100 casos tratados con ortodoncia",
    "Diversas publicaciones en revistas científicas indexadas"
  ],
  "especialidades": [
    "Ortodoncia interceptiva en niños",
    "Ortodoncia con Brackets estéticos",
    "Disyunción maxilar"
  ],
  "filosofia": "Cada sonrisa cuenta una historia única. Mi misión es crear tratamientos personalizados que se adapten al estilo de vida de cada paciente, utilizando los avances más modernos en ortodoncia."
}'::jsonb
WHERE nombre ILIKE '%Gabriela Condori%';

-- Dra. Paola Peñaloza
UPDATE cms_equipo 
SET curriculum = '{
  "formacion": [
    "Maestría en Odontología con mención de patología",
    "Diplomado en Políticas Públicas para el Acceso Universal a Salud Oral",
    "Cirujano dentista"
  ],
  "experiencia": [
    "17 años de experiencia profesional",
    "10 años como odontóloga asistencial del Centro de Salud Leoncio Prado",
    "Responsable del servicio de odontología del centro de salud"
  ],
  "especialidades": [
    "Epidemiología en salud bucal",
    "Planificación y evaluación de programas sanitarios",
    "Prevención y promoción de salud oral comunitaria"
  ],
  "filosofia": "Creo firmemente que la salud bucal es un derecho fundamental, no un privilegio. Mi trabajo se centra en reducir las brechas de acceso y desarrollar políticas públicas que garanticen atención odontológica de calidad para todos los segmentos de la población, especialmente los más vulnerables."
}'::jsonb
WHERE nombre ILIKE '%Paola Peñaloza%';
