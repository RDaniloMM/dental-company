-- Agregar columnas para servicios detallados
ALTER TABLE cms_servicios
ADD COLUMN IF NOT EXISTS detalle_completo TEXT,
ADD COLUMN IF NOT EXISTS beneficios TEXT[], -- Array de strings
ADD COLUMN IF NOT EXISTS duracion VARCHAR(100),
ADD COLUMN IF NOT EXISTS recomendaciones TEXT;

-- Actualizar servicios existentes con datos por defecto
UPDATE cms_servicios SET
  detalle_completo = CASE nombre
    WHEN 'Odontología General' THEN 'La odontología general es la base de una buena salud bucal. Realizamos evaluaciones completas de tu boca, detectando problemas en etapas tempranas para un tratamiento más efectivo y menos invasivo. Incluye radiografías digitales, examen de encías, evaluación de mordida y un plan de tratamiento personalizado según tus necesidades.'
    WHEN 'Estética Dental' THEN 'Transformamos tu sonrisa con tratamientos estéticos de última generación. Utilizamos tecnología digital para diseñar tu sonrisa ideal antes del tratamiento, permitiéndote ver cómo lucirás al finalizar. Trabajamos con materiales de alta calidad que garantizan resultados naturales y duraderos.'
    WHEN 'Ortodoncia' THEN 'Corregimos la posición de tus dientes y mejoramos tu mordida con tratamientos ortodónticos personalizados. Ofrecemos brackets tradicionales, estéticos (de cerámica transparente) y tratamientos especiales para niños que previenen problemas mayores en el futuro. La Dra. Gabriela Condori, especialista en ortodoncia con más de 10 años de experiencia, evaluará tu caso individualmente.'
    WHEN 'Implantes Dentales' THEN 'Los implantes dentales son la solución más avanzada y duradera para reemplazar dientes perdidos. Utilizamos implantes de titanio de alta calidad que se integran perfectamente con el hueso. El Dr. Ulises Peñaloza, especialista en implantología con 17 años de experiencia, ofrece técnicas de carga inmediata que permiten colocar dientes provisionales el mismo día de la cirugía.'
    WHEN 'Cirugía Bucal' THEN 'Realizamos procedimientos quirúrgicos con técnicas modernas y mínimamente invasivas para reducir molestias y acelerar tu recuperación. Nuestro equipo está especializado en extracciones complejas, incluyendo muelas del juicio que no han salido correctamente, y cirugías de regeneración para preparar tu boca para implantes.'
    WHEN 'Endodoncia' THEN 'La endodoncia permite salvar dientes que de otra manera tendrían que ser extraídos. Este tratamiento, conocido popularmente como ''matar el nervio'', elimina la infección interna del diente, limpia completamente los conductos y los sella para prevenir futuras infecciones. Con las técnicas modernas que utilizamos, el procedimiento es prácticamente indoloro.'
    WHEN 'Periodoncia' THEN 'Tratamos las enfermedades de las encías, desde inflamación leve hasta casos avanzados donde hay pérdida de hueso. El Dr. Ulises Peñaloza, especialista en periodoncia, puede detener la progresión de la enfermedad y en muchos casos regenerar los tejidos perdidos. Las encías sanas son fundamentales porque la enfermedad de las encías es la principal causa de pérdida de dientes en adultos.'
    WHEN 'Odontopediatría' THEN 'Brindamos atención dental especializada para los más pequeños de la casa en un ambiente amigable y libre de miedo. Utilizamos técnicas especiales de comunicación para que los niños tengan experiencias positivas en el dentista desde temprana edad. Nos enfocamos en la prevención para asegurar que sus dientes crezcan sanos y fuertes.'
    WHEN 'Prótesis Dental' THEN 'Restauramos la función y belleza de tu sonrisa con prótesis dentales hechas a tu medida. Trabajamos con materiales modernos como el zirconio que lucen completamente naturales. Ofrecemos desde coronas individuales para un solo diente hasta rehabilitaciones completas para quienes han perdido todos sus dientes.'
    WHEN 'Diagnóstico de Patologías' THEN 'Realizamos exámenes completos de toda tu boca para detectar cualquier lesión que requiera atención. La detección temprana de problemas serios, incluyendo lesiones pre-cancerosas y cáncer oral, es crucial para un tratamiento exitoso. Si encontramos algo que necesite evaluación especializada, te guiaremos en los siguientes pasos.'
    ELSE NULL
  END,
  beneficios = CASE nombre
    WHEN 'Odontología General' THEN ARRAY['Prevención de enfermedades bucales', 'Detección temprana de caries y problemas en las encías', 'Limpieza profunda que elimina sarro y manchas', 'Consejos personalizados para tu higiene diaria', 'Seguimiento continuo de tu salud dental']
    WHEN 'Estética Dental' THEN ARRAY['Sonrisa más blanca y brillante', 'Corrección de forma, tamaño y color de dientes', 'Resultados naturales que lucen como tus propios dientes', 'Aumento de la autoestima y confianza', 'Materiales seguros y de larga duración']
    WHEN 'Ortodoncia' THEN ARRAY['Dientes perfectamente alineados', 'Mejora de la mordida para masticar mejor', 'Prevención de desgaste dental', 'Mayor facilidad para cepillarte y usar hilo dental', 'Mejora notable de tu perfil facial']
    WHEN 'Implantes Dentales' THEN ARRAY['Solución permanente para dientes perdidos', 'Lucen y funcionan como dientes naturales', 'Mantienen saludable el hueso de tu mandíbula', 'No dañan los dientes vecinos', 'Pueden durar toda la vida con el cuidado adecuado']
    WHEN 'Cirugía Bucal' THEN ARRAY['Procedimientos con mínimas molestias', 'Recuperación más rápida que con técnicas tradicionales', 'Anestesia efectiva para un procedimiento sin dolor', 'Seguimiento incluido después de la cirugía', 'Prevención de complicaciones a futuro']
    WHEN 'Endodoncia' THEN ARRAY['Salva dientes que parecían perdidos', 'Elimina el dolor intenso causado por la infección', 'Procedimiento prácticamente sin dolor', 'Conserva tu diente natural en lugar de reemplazarlo', 'Evita la necesidad de implantes o prótesis']
    WHEN 'Periodoncia' THEN ARRAY['Encías saludables que no sangran al cepillarte', 'Prevención de pérdida de dientes', 'Eliminación del mal aliento causado por bacterias', 'Posibilidad de recuperar hueso perdido', 'Mejor salud general (las encías enfermas afectan el corazón y otros órganos)']
    WHEN 'Odontopediatría' THEN ARRAY['Ambiente diseñado para que los niños se sientan cómodos', 'Prevención de caries desde los primeros dientes', 'Enseñamos higiene oral de forma divertida', 'Sellantes que protegen las muelitas de las caries', 'Detección temprana si necesitarán ortodoncia']
    WHEN 'Prótesis Dental' THEN ARRAY['Vuelve a masticar todos tus alimentos favoritos', 'Sonrisa restaurada con apariencia natural', 'Materiales resistentes que duran muchos años', 'Ajuste cómodo y preciso', 'Mejora de la pronunciación al hablar']
    WHEN 'Diagnóstico de Patologías' THEN ARRAY['La detección temprana puede salvar tu vida', 'Diagnóstico preciso de cualquier lesión en la boca', 'Seguimiento de manchas o llagas sospechosas', 'Coordinación con especialistas si es necesario', 'Tranquilidad de saber que todo está bien']
    ELSE NULL
  END,
  duracion = CASE nombre
    WHEN 'Odontología General' THEN '30-60 minutos por consulta'
    WHEN 'Estética Dental' THEN '1-3 citas según el tratamiento'
    WHEN 'Ortodoncia' THEN '12-24 meses promedio'
    WHEN 'Implantes Dentales' THEN '3-6 meses para integración completa'
    WHEN 'Cirugía Bucal' THEN '30-90 minutos según el procedimiento'
    WHEN 'Endodoncia' THEN '1-2 citas de 60-90 minutos'
    WHEN 'Periodoncia' THEN 'Varias sesiones según la severidad'
    WHEN 'Odontopediatría' THEN '20-40 minutos por sesión'
    WHEN 'Prótesis Dental' THEN '2-4 citas según el tipo de prótesis'
    WHEN 'Diagnóstico de Patologías' THEN '30-45 minutos de evaluación'
    ELSE NULL
  END,
  recomendaciones = CASE nombre
    WHEN 'Odontología General' THEN 'Te sugerimos visitarnos cada 6 meses para mantener tu sonrisa saludable. Recuerda cepillarte después de cada comida y usar hilo dental diariamente.'
    WHEN 'Estética Dental' THEN 'Después del blanqueamiento, evita por 48 horas café, té, vino tinto y alimentos con colorantes. Mantén una buena higiene para que los resultados duren más tiempo.'
    WHEN 'Ortodoncia' THEN 'Asiste puntualmente a tus controles mensuales. Evita alimentos duros o pegajosos que puedan dañar los brackets. Usa los cepillos especiales que te proporcionamos para limpiar alrededor de los brackets.'
    WHEN 'Implantes Dentales' THEN 'Durante los primeros días después de la cirugía, consume alimentos blandos y fríos. No fumes, ya que afecta la cicatrización. Sigue todas las indicaciones que te daremos para asegurar el éxito del implante.'
    WHEN 'Cirugía Bucal' THEN 'Después de la cirugía, descansa el resto del día y aplica hielo en la zona por intervalos de 15 minutos. Come alimentos blandos y fríos. Evita enjuagues fuertes las primeras 24 horas. Te daremos medicación para controlar cualquier molestia.'
    WHEN 'Endodoncia' THEN 'Es normal sentir sensibilidad los primeros días; esto pasará gradualmente. Evita masticar con ese diente hasta que te coloquemos la corona definitiva. Toma los medicamentos según las indicaciones para una recuperación cómoda.'
    WHEN 'Periodoncia' THEN 'Después del tratamiento, tus encías pueden estar sensibles por unos días. Usa el enjuague especial que te recetaremos. Es muy importante que asistas a tus citas de mantenimiento cada 3-4 meses para evitar que la enfermedad regrese.'
    WHEN 'Odontopediatría' THEN 'La primera visita al dentista debe ser al cumplir el primer año o cuando salga el primer diente. Supervisa el cepillado de tu hijo hasta los 7-8 años. Limita los dulces y jugos azucarados, especialmente antes de dormir.'
    WHEN 'Prótesis Dental' THEN 'Si tienes prótesis removible, retírala para dormir y mantenla limpia. Las prótesis fijas se cuidan igual que los dientes naturales. Visítanos regularmente para verificar el ajuste y hacer mantenimiento.'
    WHEN 'Diagnóstico de Patologías' THEN 'Revisa tu boca mensualmente frente al espejo. Consulta de inmediato si notas llagas que no sanan en 2 semanas, manchas blancas o rojas, bultos, o cualquier cambio inusual. No te alarmes, la mayoría de las lesiones son benignas, pero es mejor verificar.'
    ELSE NULL
  END
WHERE detalle_completo IS NULL;

-- Comentario para documentar
COMMENT ON COLUMN cms_servicios.detalle_completo IS 'Descripción extendida del servicio para el modal de detalles';
COMMENT ON COLUMN cms_servicios.beneficios IS 'Lista de beneficios del servicio';
COMMENT ON COLUMN cms_servicios.duracion IS 'Tiempo estimado del tratamiento';
COMMENT ON COLUMN cms_servicios.recomendaciones IS 'Consejos para el paciente sobre este servicio';
