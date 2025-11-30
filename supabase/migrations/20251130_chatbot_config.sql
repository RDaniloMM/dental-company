-- ============================================
-- Migración: Agregar configuración del chatbot a cms_tema
-- Fecha: 2025-11-30
-- Nota: Reutiliza la tabla cms_tema existente con grupo='chatbot'
-- ============================================

-- Insertar configuración del chatbot en cms_tema (reutilizando tabla existente)
INSERT INTO public.cms_tema (clave, valor, tipo, descripcion, grupo) VALUES
    ('chatbot_usar_info_general', 'true', 'otro', 'Incluir información general de la clínica como contexto del chatbot', 'chatbot'),
    ('chatbot_usar_servicios', 'true', 'otro', 'Incluir los servicios de la clínica como contexto del chatbot', 'chatbot'),
    ('chatbot_usar_equipo', 'true', 'otro', 'Incluir información del equipo médico como contexto del chatbot', 'chatbot'),
    ('chatbot_system_prompt', '', 'otro', 'Prompt personalizado para definir la personalidad del chatbot', 'chatbot')
ON CONFLICT (clave) DO NOTHING;
