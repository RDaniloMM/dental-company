-- =================================================================
-- MIGRACIÓN: CMS, Chatbot Dinámico y Seguridad
-- Fecha: 27 de Noviembre de 2025
-- =================================================================

-- =================================================================
-- 1. SISTEMA CMS PARA LANDING PAGE
-- =================================================================

-- Tabla para contenido de secciones de la landing page
CREATE TABLE IF NOT EXISTS public.cms_secciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seccion TEXT UNIQUE NOT NULL, -- ej: 'hero', 'servicios', 'nosotros', 'contacto', 'footer'
    titulo TEXT,
    subtitulo TEXT,
    contenido JSONB DEFAULT '{}', -- Datos estructurados específicos de cada sección
    orden INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Tabla para servicios (editable desde admin)
CREATE TABLE IF NOT EXISTS public.cms_servicios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    descripcion TEXT,
    icono TEXT DEFAULT 'Stethoscope', -- Nombre del icono de Lucide
    orden INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para el equipo/especialistas
CREATE TABLE IF NOT EXISTS public.cms_equipo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    cargo TEXT,
    especialidad TEXT,
    foto_url TEXT,
    orden INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para imágenes del carrusel
CREATE TABLE IF NOT EXISTS public.cms_carrusel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    imagen_url TEXT NOT NULL,
    alt_text TEXT,
    orden INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para configuración de tema/colores
CREATE TABLE IF NOT EXISTS public.cms_tema (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clave TEXT UNIQUE NOT NULL, -- ej: 'color_primario', 'color_secundario', 'fuente_principal'
    valor TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('color', 'fuente', 'tamaño', 'otro')),
    descripcion TEXT,
    grupo TEXT DEFAULT 'general',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =================================================================
-- 2. SISTEMA RAG DINÁMICO PARA CHATBOT
-- =================================================================

-- Tabla para FAQs editables desde admin
CREATE TABLE IF NOT EXISTS public.chatbot_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pregunta TEXT NOT NULL,
    respuesta TEXT NOT NULL,
    keywords TEXT[] DEFAULT '{}', -- Array de palabras clave para búsqueda
    categoria TEXT DEFAULT 'general',
    prioridad INTEGER DEFAULT 0, -- Mayor = más relevante
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para contexto adicional del chatbot (info de la clínica, servicios, etc.)
CREATE TABLE IF NOT EXISTS public.chatbot_contexto (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    contenido TEXT NOT NULL,
    tipo TEXT DEFAULT 'informacion', -- 'informacion', 'servicio', 'politica', 'promocion'
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =================================================================
-- 3. MUESTREO DE CONVERSACIONES Y ANALYTICS
-- =================================================================

-- Tabla para almacenar muestras de conversaciones (con TTL automático)
CREATE TABLE IF NOT EXISTS public.chatbot_conversaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    pregunta TEXT NOT NULL,
    respuesta TEXT,
    modelo TEXT,
    tokens_usados INTEGER,
    tiempo_respuesta_ms INTEGER,
    error_tipo TEXT, -- NULL si no hubo error
    ip_hash TEXT, -- Hash de IP para analytics sin identificar
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days') -- Auto-expire
);

-- Índice para limpieza automática
CREATE INDEX IF NOT EXISTS idx_chatbot_conv_expires ON public.chatbot_conversaciones(expires_at);

-- Tabla para rate limiting y cola de espera
CREATE TABLE IF NOT EXISTS public.chatbot_rate_limit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_hash TEXT NOT NULL,
    requests_count INTEGER DEFAULT 1,
    first_request_at TIMESTAMPTZ DEFAULT NOW(),
    last_request_at TIMESTAMPTZ DEFAULT NOW(),
    blocked_until TIMESTAMPTZ,
    UNIQUE(ip_hash)
);

-- Tabla para cola de mensajes (cuando hay errores de API)
CREATE TABLE IF NOT EXISTS public.chatbot_cola (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    intentos INTEGER DEFAULT 0,
    max_intentos INTEGER DEFAULT 3,
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'procesando', 'completado', 'fallido')),
    error_mensaje TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- =================================================================
-- 4. SEGURIDAD: CÓDIGOS DE INVITACIÓN PARA REGISTRO
-- =================================================================

-- Tabla para códigos de invitación
CREATE TABLE IF NOT EXISTS public.codigos_invitacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT UNIQUE NOT NULL,
    creado_por UUID REFERENCES auth.users(id),
    usado_por UUID REFERENCES auth.users(id),
    rol_asignado TEXT DEFAULT 'Odontólogo',
    usos_maximos INTEGER DEFAULT 1,
    usos_actuales INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    expira_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    used_at TIMESTAMPTZ
);

-- Configuración de seguridad del sistema
CREATE TABLE IF NOT EXISTS public.config_seguridad (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clave TEXT UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    descripcion TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar configuración inicial de seguridad
INSERT INTO public.config_seguridad (clave, valor, descripcion) VALUES
    ('registro_publico_habilitado', 'false', 'Si es true, cualquiera puede registrarse. Si es false, requiere código de invitación.'),
    ('requiere_aprobacion_admin', 'true', 'Los nuevos usuarios requieren aprobación de un admin para acceder.')
ON CONFLICT (clave) DO NOTHING;

-- =================================================================
-- 5. FUNCIONES Y TRIGGERS
-- =================================================================

-- Función para limpiar conversaciones expiradas (ejecutar con cron job)
CREATE OR REPLACE FUNCTION limpiar_conversaciones_expiradas()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.chatbot_conversaciones
    WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Función para verificar rate limit
CREATE OR REPLACE FUNCTION verificar_rate_limit(p_ip_hash TEXT, p_limite INTEGER DEFAULT 20, p_ventana_minutos INTEGER DEFAULT 1)
RETURNS BOOLEAN AS $$
DECLARE
    v_record RECORD;
    v_ahora TIMESTAMPTZ := NOW();
BEGIN
    -- Buscar registro existente
    SELECT * INTO v_record FROM public.chatbot_rate_limit WHERE ip_hash = p_ip_hash;
    
    IF NOT FOUND THEN
        -- Primer request de esta IP
        INSERT INTO public.chatbot_rate_limit (ip_hash, requests_count, first_request_at, last_request_at)
        VALUES (p_ip_hash, 1, v_ahora, v_ahora);
        RETURN TRUE;
    END IF;
    
    -- Verificar si está bloqueado
    IF v_record.blocked_until IS NOT NULL AND v_record.blocked_until > v_ahora THEN
        RETURN FALSE;
    END IF;
    
    -- Verificar ventana de tiempo
    IF v_record.first_request_at < v_ahora - (p_ventana_minutos || ' minutes')::INTERVAL THEN
        -- Reiniciar contador
        UPDATE public.chatbot_rate_limit
        SET requests_count = 1, first_request_at = v_ahora, last_request_at = v_ahora, blocked_until = NULL
        WHERE ip_hash = p_ip_hash;
        RETURN TRUE;
    END IF;
    
    -- Incrementar contador
    IF v_record.requests_count >= p_limite THEN
        -- Bloquear por 5 minutos
        UPDATE public.chatbot_rate_limit
        SET blocked_until = v_ahora + INTERVAL '5 minutes', last_request_at = v_ahora
        WHERE ip_hash = p_ip_hash;
        RETURN FALSE;
    END IF;
    
    UPDATE public.chatbot_rate_limit
    SET requests_count = requests_count + 1, last_request_at = v_ahora
    WHERE ip_hash = p_ip_hash;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a tablas CMS
DROP TRIGGER IF EXISTS update_cms_secciones_updated_at ON public.cms_secciones;
CREATE TRIGGER update_cms_secciones_updated_at
    BEFORE UPDATE ON public.cms_secciones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cms_servicios_updated_at ON public.cms_servicios;
CREATE TRIGGER update_cms_servicios_updated_at
    BEFORE UPDATE ON public.cms_servicios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chatbot_faqs_updated_at ON public.chatbot_faqs;
CREATE TRIGGER update_chatbot_faqs_updated_at
    BEFORE UPDATE ON public.chatbot_faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =================================================================
-- 6. DATOS INICIALES
-- =================================================================

-- Insertar tema por defecto
INSERT INTO public.cms_tema (clave, valor, tipo, descripcion, grupo) VALUES
    ('color_primario', '#3b82f6', 'color', 'Color principal de la marca (azul)', 'colores'),
    ('color_secundario', '#1e40af', 'color', 'Color secundario (azul oscuro)', 'colores'),
    ('color_acento', '#22c55e', 'color', 'Color de acento (verde)', 'colores'),
    ('color_fondo', '#ffffff', 'color', 'Color de fondo principal', 'colores'),
    ('color_texto', '#1f2937', 'color', 'Color de texto principal', 'colores'),
    ('whatsapp_numero', '51914340074', 'otro', 'Número de WhatsApp para contacto', 'contacto'),
    ('telefono', '+51 952 864 883', 'otro', 'Teléfono de contacto', 'contacto'),
    ('email', 'd.c.com@hotmail.com', 'otro', 'Email de contacto', 'contacto'),
    ('direccion', 'Av. General Suarez N° 312, Tacna, Perú', 'otro', 'Dirección física', 'contacto'),
    ('horario_semana', 'Lunes a Viernes: 9:00 AM - 7:00 PM', 'otro', 'Horario entre semana', 'contacto'),
    ('horario_sabado', 'Sábados: 9:00 AM - 1:00 PM', 'otro', 'Horario sábados', 'contacto'),
    ('nombre_clinica', 'Dental Company', 'otro', 'Nombre de la clínica', 'general'),
    ('slogan', 'Tu sonrisa es nuestra sonrisa', 'otro', 'Slogan principal', 'general')
ON CONFLICT (clave) DO NOTHING;

-- Insertar sección hero por defecto
INSERT INTO public.cms_secciones (seccion, titulo, subtitulo, contenido, orden) VALUES
    ('hero', 'Clínica Dental Company', 'Tu sonrisa es nuestra sonrisa.', '{"cta_texto": "Agenda tu Cita", "cta_url": "#reservas"}', 1),
    ('servicios', 'Nuestros Servicios', 'Desde revisiones de rutina hasta procedimientos especializados, ofrecemos una gama completa de tratamientos.', '{}', 2),
    ('nosotros', 'Conoce a Nuestros Especialistas', NULL, '{}', 3),
    ('contacto', 'Contáctanos', NULL, '{}', 4),
    ('footer', 'Dental Company', NULL, '{}', 5)
ON CONFLICT (seccion) DO NOTHING;

-- Insertar servicios por defecto
INSERT INTO public.cms_servicios (nombre, descripcion, icono, orden) VALUES
    ('Odontología General', 'Consultas, diagnósticos, limpiezas profesionales y tratamiento de caries para un mantenimiento integral de tu salud bucal.', 'Stethoscope', 1),
    ('Estética Dental', 'Desde blanqueamientos y carillas hasta coronas estéticas para un diseño de sonrisa perfecto y radiante.', 'Sparkles', 2),
    ('Ortodoncia', 'Corrección de la posición dental con brackets metálicos, estéticos y tratamientos interceptivos para niños.', 'Smile', 3),
    ('Implantes Dentales', 'Soluciones permanentes para la pérdida de dientes, incluyendo implantes unitarios, múltiples y prótesis fijas.', 'Bone', 4),
    ('Cirugía Bucal', 'Procedimientos quirúrgicos como extracciones de cordales, cirugía periodontal e injertos de hueso y encía.', 'Syringe', 5),
    ('Endodoncia', 'Tratamiento de conductos radiculares para salvar dientes afectados por caries profundas o traumatismos.', 'Microscope', 6),
    ('Periodoncia', 'Tratamiento especializado de encías, incluyendo manejo de gingivitis, periodontitis y cirugía regenerativa.', 'ShieldCheck', 7),
    ('Odontopediatría', 'Atención dental especializada y amigable para los más pequeños, enfocada en la prevención y el manejo de conducta.', 'Baby', 8),
    ('Prótesis Dental', 'Restauración de la función y estética con coronas, puentes fijos y prótesis removibles o totales.', 'Puzzle', 9),
    ('Diagnóstico de Patologías', 'Detección temprana y diagnóstico de lesiones, infecciones y otras patologías de la mucosa oral.', 'FileSearch', 10)
ON CONFLICT DO NOTHING;

-- Insertar equipo por defecto
INSERT INTO public.cms_equipo (nombre, cargo, especialidad, foto_url, orden) VALUES
    ('Dr. Ulises Peñaloza', 'Director Médico', 'Especialista en Periodoncia e Implantología', '/ulises_penaloza.jpeg', 1),
    ('Dra. Gabriela Condori', 'Ortodoncista', 'Especialista en Ortodoncia y Ortopedia Maxilar', '/dentista.png', 2),
    ('Dra. Paola Peñaloza', 'Odontóloga General', 'Cirujano dentista con experiencia en salud pública', '/dentista.png', 3)
ON CONFLICT DO NOTHING;

-- Migrar FAQs existentes a la nueva tabla
INSERT INTO public.chatbot_faqs (pregunta, respuesta, keywords, categoria, prioridad) VALUES
    ('¿Cuál es el horario de atención?', 'Nuestro horario de atención es de lunes a viernes de 9:00 AM a 7:00 PM, y sábados de 9:00 AM a 1:00 PM. Los domingos permanecemos cerrados.', ARRAY['horario', 'atención', 'hora', 'abierto', 'cerrado'], 'horarios', 10),
    ('¿Cómo puedo agendar una cita?', 'Puedes agendar una cita llamando al +51 952 864 883, enviando un WhatsApp al mismo número, o visitándonos directamente en Av. General Suarez N° 312, Tacna.', ARRAY['cita', 'agendar', 'reservar', 'turno', 'whatsapp'], 'citas', 10),
    ('¿Qué servicios dentales ofrecen?', 'Ofrecemos: Odontología general, Estética dental, Ortodoncia, Implantes dentales, Cirugía Bucal, Endodoncia, Periodoncia, Odontopediatría, Prótesis Dental y Diagnóstico de Patologías.', ARRAY['servicios', 'tratamientos', 'ofrecen', 'hacen'], 'servicios', 10),
    ('¿Dónde están ubicados?', 'Nos encontramos en Av. General Suarez N° 312, Tacna, Perú. Contamos con fácil acceso. Llámanos al +51 952 864 883 para más indicaciones.', ARRAY['ubicación', 'dirección', 'dónde', 'llegar', 'tacna'], 'contacto', 10),
    ('¿Atienden emergencias dentales?', 'Sí, atendemos emergencias dentales durante nuestro horario de atención. Llama al +51 952 864 883 para coordinar tu atención inmediata.', ARRAY['emergencia', 'urgencia', 'dolor', 'inmediato'], 'emergencias', 9),
    ('¿Cuánto cuesta una consulta?', 'Para información sobre precios y costos específicos, te recomendamos contactarnos directamente al +51 952 864 883. Los costos varían según el tratamiento requerido.', ARRAY['precio', 'costo', 'cuánto', 'tarifa', 'pagar'], 'precios', 8)
ON CONFLICT DO NOTHING;

-- =================================================================
-- 7. POLÍTICAS RLS (Row Level Security)
-- =================================================================

-- Habilitar RLS en las tablas
ALTER TABLE public.cms_secciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_equipo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_carrusel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_tema ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_contexto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_conversaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.codigos_invitacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.config_seguridad ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para CMS (landing page)
CREATE POLICY "CMS secciones visibles públicamente" ON public.cms_secciones FOR SELECT USING (visible = true);
CREATE POLICY "CMS servicios visibles públicamente" ON public.cms_servicios FOR SELECT USING (visible = true);
CREATE POLICY "CMS equipo visible públicamente" ON public.cms_equipo FOR SELECT USING (visible = true);
CREATE POLICY "CMS carrusel visible públicamente" ON public.cms_carrusel FOR SELECT USING (visible = true);
CREATE POLICY "CMS tema público" ON public.cms_tema FOR SELECT USING (true);
CREATE POLICY "Chatbot FAQs activos públicos" ON public.chatbot_faqs FOR SELECT USING (activo = true);
CREATE POLICY "Chatbot contexto activo público" ON public.chatbot_contexto FOR SELECT USING (activo = true);

-- Políticas de escritura solo para usuarios autenticados (admin)
CREATE POLICY "CMS secciones admin write" ON public.cms_secciones FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "CMS servicios admin write" ON public.cms_servicios FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "CMS equipo admin write" ON public.cms_equipo FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "CMS carrusel admin write" ON public.cms_carrusel FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "CMS tema admin write" ON public.cms_tema FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Chatbot FAQs admin write" ON public.chatbot_faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Chatbot contexto admin write" ON public.chatbot_contexto FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para conversaciones (insertar público, leer solo admin)
CREATE POLICY "Chatbot conv insert público" ON public.chatbot_conversaciones FOR INSERT WITH CHECK (true);
CREATE POLICY "Chatbot conv admin read" ON public.chatbot_conversaciones FOR SELECT USING (auth.role() = 'authenticated');

-- Políticas para códigos de invitación
CREATE POLICY "Códigos invitación admin" ON public.codigos_invitacion FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Verificar código público" ON public.codigos_invitacion FOR SELECT USING (activo = true AND (usos_actuales < usos_maximos OR usos_maximos IS NULL));

-- Políticas para config seguridad
CREATE POLICY "Config seguridad lectura pública" ON public.config_seguridad FOR SELECT USING (true);
CREATE POLICY "Config seguridad admin write" ON public.config_seguridad FOR ALL USING (auth.role() = 'authenticated');
