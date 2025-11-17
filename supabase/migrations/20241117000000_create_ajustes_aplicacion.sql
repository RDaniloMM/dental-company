-- =============================================
-- SISTEMA DE PARAMETRIZACIÓN DE CONTENIDO
-- =============================================
-- Este script crea las tablas necesarias para parametrizar
-- todo el contenido de la página web desde Supabase

-- 1. Crear el tipo ENUM para los diferentes tipos de ajustes
CREATE TYPE public.tipo_ajuste AS ENUM (
    'color',      -- Para valores de color (ej. #FFFFFF o 59 130 246)
    'texto',      -- Para textos cortos (títulos, etiquetas de botones)
    'textarea',   -- Para textos largos (párrafos, descripciones)
    'numero',     -- Para valores numéricos (ej. número de WhatsApp)
    'booleano',   -- Para activar/desactivar funcionalidades
    'imagen',     -- Para URLs de imágenes
    'email',      -- Para direcciones de correo
    'telefono',   -- Para números de teléfono
    'url'         -- Para URLs externas
);

-- 2. Crear la tabla principal de ajustes
CREATE TABLE public.ajustes_aplicacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clave TEXT UNIQUE NOT NULL,
    valor TEXT,
    grupo TEXT NOT NULL,
    tipo public.tipo_ajuste NOT NULL,
    descripcion TEXT,
    orden INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Crear índice para búsquedas rápidas
CREATE INDEX idx_ajustes_aplicacion_clave ON public.ajustes_aplicacion(clave);
CREATE INDEX idx_ajustes_aplicacion_grupo ON public.ajustes_aplicacion(grupo);

-- 4. Añadir comentarios para documentación
COMMENT ON TABLE public.ajustes_aplicacion IS 'Almacena configuraciones clave-valor para la personalización de la UI y funcionalidades de la aplicación.';
COMMENT ON COLUMN public.ajustes_aplicacion.clave IS 'Identificador único usado en el código. Ej: theme.color.primary';
COMMENT ON COLUMN public.ajustes_aplicacion.grupo IS 'Categoría para agrupar ajustes. Ej: Tema, Landing Page, Contacto';

-- 5. Función para actualizar el timestamp automáticamente
CREATE OR REPLACE FUNCTION public.actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_updated_at
    BEFORE UPDATE ON public.ajustes_aplicacion
    FOR EACH ROW
    EXECUTE FUNCTION public.actualizar_updated_at();

-- =============================================
-- DATOS INICIALES - CONFIGURACIÓN DE TEMA
-- =============================================

-- GRUPO: Tema - Colores principales
INSERT INTO public.ajustes_aplicacion (clave, valor, grupo, tipo, descripcion, orden) VALUES
('theme.color.primary', '59 130 246', 'Tema', 'color', 'Color primario de la aplicación (RGB sin prefijo)', 1),
('theme.color.secondary', '147 51 234', 'Tema', 'color', 'Color secundario de la aplicación (RGB sin prefijo)', 2),
('theme.color.accent', '34 197 94', 'Tema', 'color', 'Color de acento para destacados (RGB sin prefijo)', 3),
('theme.color.background', '255 255 255', 'Tema', 'color', 'Color de fondo principal (RGB sin prefijo)', 4),
('theme.color.text', '17 24 39', 'Tema', 'color', 'Color de texto principal (RGB sin prefijo)', 5),
('theme.color.muted', '107 114 128', 'Tema', 'color', 'Color de texto secundario (RGB sin prefijo)', 6);

-- =============================================
-- DATOS INICIALES - LANDING PAGE
-- =============================================

-- GRUPO: Header
INSERT INTO public.ajustes_aplicacion (clave, valor, grupo, tipo, descripcion, orden) VALUES
('header.logo.url', '/logo.png', 'Header', 'imagen', 'URL del logo en el header', 1),
('header.logo.alt', 'Dental Company Logo', 'Header', 'texto', 'Texto alternativo del logo', 2),
('header.menu.inicio', 'Inicio', 'Header', 'texto', 'Etiqueta del menú Inicio', 3),
('header.menu.nosotros', 'Nosotros', 'Header', 'texto', 'Etiqueta del menú Nosotros', 4),
('header.menu.servicios', 'Servicios', 'Header', 'texto', 'Etiqueta del menú Servicios', 5),
('header.menu.reservas', 'Reservas', 'Header', 'texto', 'Etiqueta del botón de Reservas', 6),
('header.fixed', 'true', 'Header', 'booleano', 'Header fijo al hacer scroll', 7);

-- GRUPO: Hero / Banner Principal
INSERT INTO public.ajustes_aplicacion (clave, valor, grupo, tipo, descripcion, orden) VALUES
('hero.titulo', 'Tu Sonrisa, Nuestra Pasión', 'Hero', 'texto', 'Título principal del hero', 1),
('hero.subtitulo', 'Cuidado dental de excelencia con tecnología de punta', 'Hero', 'textarea', 'Subtítulo del hero', 2),
('hero.descripcion', 'En Dental Company brindamos servicios odontológicos integrales con los más altos estándares de calidad. Nuestro equipo de especialistas está comprometido con tu salud bucal.', 'Hero', 'textarea', 'Descripción del hero', 3),
('hero.boton.texto', 'Agenda tu Cita', 'Hero', 'texto', 'Texto del botón principal', 4),
('hero.boton.url', '#reservas', 'Hero', 'url', 'URL del botón principal', 5),
('hero.imagen.principal', '/foto_interior_2.jpeg', 'Hero', 'imagen', 'Imagen principal del hero', 6),
('hero.mostrar', 'true', 'Hero', 'booleano', 'Mostrar sección hero', 7);

-- GRUPO: Carousel
INSERT INTO public.ajustes_aplicacion (clave, valor, grupo, tipo, descripcion, orden) VALUES
('carousel.imagen1', '/foto_interior_2.jpeg', 'Carousel', 'imagen', 'Primera imagen del carousel', 1),
('carousel.imagen2', '/foto_interior_3.jpeg', 'Carousel', 'imagen', 'Segunda imagen del carousel', 2),
('carousel.imagen3', '/foto_interior_4.jpeg', 'Carousel', 'imagen', 'Tercera imagen del carousel', 3),
('carousel.autoplay', 'true', 'Carousel', 'booleano', 'Autoplay del carousel', 4),
('carousel.intervalo', '5000', 'Carousel', 'numero', 'Intervalo en milisegundos', 5);

-- GRUPO: Servicios
INSERT INTO public.ajustes_aplicacion (clave, valor, grupo, tipo, descripcion, orden) VALUES
('servicios.titulo', 'Nuestros Servicios', 'Servicios', 'texto', 'Título de la sección de servicios', 1),
('servicios.subtitulo', 'Ofrecemos una amplia gama de tratamientos dentales', 'Servicios', 'textarea', 'Subtítulo de servicios', 2),
('servicios.servicio1.nombre', 'Odontología General', 'Servicios', 'texto', 'Nombre del servicio 1', 3),
('servicios.servicio1.descripcion', 'Consultas, limpiezas y tratamientos preventivos', 'Servicios', 'textarea', 'Descripción del servicio 1', 4),
('servicios.servicio2.nombre', 'Ortodoncia', 'Servicios', 'texto', 'Nombre del servicio 2', 5),
('servicios.servicio2.descripcion', 'Brackets y alineadores invisibles', 'Servicios', 'textarea', 'Descripción del servicio 2', 6),
('servicios.servicio3.nombre', 'Implantes', 'Servicios', 'texto', 'Nombre del servicio 3', 7),
('servicios.servicio3.descripcion', 'Soluciones permanentes para piezas perdidas', 'Servicios', 'textarea', 'Descripción del servicio 3', 8),
('servicios.servicio4.nombre', 'Estética Dental', 'Servicios', 'texto', 'Nombre del servicio 4', 9),
('servicios.servicio4.descripcion', 'Blanqueamiento y carillas', 'Servicios', 'textarea', 'Descripción del servicio 4', 10);

-- GRUPO: Nosotros
INSERT INTO public.ajustes_aplicacion (clave, valor, grupo, tipo, descripcion, orden) VALUES
('nosotros.titulo', 'Sobre Nosotros', 'Nosotros', 'texto', 'Título de la sección', 1),
('nosotros.descripcion', 'Somos una clínica dental moderna comprometida con la excelencia en el cuidado de tu salud bucal. Contamos con más de 10 años de experiencia y un equipo de especialistas altamente calificados.', 'Nosotros', 'textarea', 'Descripción de la empresa', 2),
('nosotros.mision', 'Brindar servicios odontológicos de calidad con tecnología de punta y atención personalizada', 'Nosotros', 'textarea', 'Misión de la empresa', 3),
('nosotros.vision', 'Ser la clínica dental de referencia en la región', 'Nosotros', 'textarea', 'Visión de la empresa', 4),
('nosotros.anos_experiencia', '10', 'Nosotros', 'numero', 'Años de experiencia', 5),
('nosotros.imagen', '/foto_interior_3.jpeg', 'Nosotros', 'imagen', 'Imagen de la sección', 6);

-- GRUPO: Contacto
INSERT INTO public.ajustes_aplicacion (clave, valor, grupo, tipo, descripcion, orden) VALUES
('contacto.whatsapp', '51914340074', 'Contacto', 'telefono', 'Número de WhatsApp (con código de país)', 1),
('contacto.telefono', '+51 914 340 074', 'Contacto', 'telefono', 'Teléfono de contacto principal', 2),
('contacto.email', 'contacto@dentalcompany.com', 'Contacto', 'email', 'Email de contacto', 3),
('contacto.direccion', 'Av. Principal 123, Lima, Perú', 'Contacto', 'textarea', 'Dirección física', 4),
('contacto.horario', 'Lunes a Viernes: 9:00 AM - 8:00 PM\nSábados: 9:00 AM - 2:00 PM', 'Contacto', 'textarea', 'Horario de atención', 5),
('contacto.maps.url', 'https://maps.google.com', 'Contacto', 'url', 'URL de Google Maps', 6),
('contacto.facebook', 'https://facebook.com/dentalcompany', 'Contacto', 'url', 'URL de Facebook', 7),
('contacto.instagram', 'https://instagram.com/dentalcompany', 'Contacto', 'url', 'URL de Instagram', 8);

-- GRUPO: Footer
INSERT INTO public.ajustes_aplicacion (clave, valor, grupo, tipo, descripcion, orden) VALUES
('footer.texto_copyright', '© 2024 Dental Company. Todos los derechos reservados.', 'Footer', 'texto', 'Texto de copyright', 1),
('footer.mostrar_redes', 'true', 'Footer', 'booleano', 'Mostrar redes sociales', 2),
('footer.mostrar_mapa', 'true', 'Footer', 'booleano', 'Mostrar mapa en footer', 3);

-- GRUPO: Chatbot
INSERT INTO public.ajustes_aplicacion (clave, valor, grupo, tipo, descripcion, orden) VALUES
('chatbot.activado', 'true', 'Chatbot', 'booleano', 'Activar/desactivar chatbot', 1),
('chatbot.titulo', '¿En qué podemos ayudarte?', 'Chatbot', 'texto', 'Título del chatbot', 2),
('chatbot.mensaje_bienvenida', 'Hola! Soy tu asistente virtual. ¿Cómo puedo ayudarte hoy?', 'Chatbot', 'textarea', 'Mensaje de bienvenida', 3),
('chatbot.color', '59 130 246', 'Chatbot', 'color', 'Color del chatbot', 4),
('chatbot.posicion', 'derecha', 'Chatbot', 'texto', 'Posición del chatbot (derecha/izquierda)', 5);

-- GRUPO: SEO
INSERT INTO public.ajustes_aplicacion (clave, valor, grupo, tipo, descripcion, orden) VALUES
('seo.titulo', 'Dental Company - Clínica Dental en Lima', 'SEO', 'texto', 'Título de la página (meta title)', 1),
('seo.descripcion', 'Clínica dental en Lima con servicios de odontología general, ortodoncia, implantes y estética dental. Agenda tu cita hoy.', 'SEO', 'textarea', 'Descripción meta', 2),
('seo.keywords', 'dentista, clínica dental, ortodoncia, implantes, Lima', 'SEO', 'textarea', 'Palabras clave', 3),
('seo.imagen_og', '/logo.png', 'SEO', 'imagen', 'Imagen para compartir en redes sociales', 4);

-- GRUPO: Promociones
INSERT INTO public.ajustes_aplicacion (clave, valor, grupo, tipo, descripcion, orden) VALUES
('promo.banner.activo', 'false', 'Promociones', 'booleano', 'Mostrar banner promocional', 1),
('promo.banner.texto', '¡50% de descuento en limpieza dental este mes!', 'Promociones', 'texto', 'Texto del banner', 2),
('promo.banner.color_fondo', '34 197 94', 'Promociones', 'color', 'Color de fondo del banner', 3),
('promo.banner.url', '#reservas', 'Promociones', 'url', 'URL al hacer clic en el banner', 4);

-- =============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- =============================================

-- Habilitar RLS en la tabla
ALTER TABLE public.ajustes_aplicacion ENABLE ROW LEVEL SECURITY;

-- Política: Cualquier usuario autenticado puede leer los ajustes
CREATE POLICY "Ajustes son visibles para todos los usuarios autenticados"
    ON public.ajustes_aplicacion
    FOR SELECT
    TO authenticated
    USING (true);

-- Política: Solo administradores pueden modificar ajustes
CREATE POLICY "Solo administradores pueden modificar ajustes"
    ON public.ajustes_aplicacion
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.personal
            WHERE personal.id = auth.uid()
            AND personal.rol = 'Admin'
            AND personal.activo = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.personal
            WHERE personal.id = auth.uid()
            AND personal.rol = 'Admin'
            AND personal.activo = true
        )
    );

-- =============================================
-- FUNCIONES AUXILIARES
-- =============================================

-- Función para obtener un ajuste por su clave
CREATE OR REPLACE FUNCTION public.obtener_ajuste(p_clave TEXT)
RETURNS TEXT AS $$
DECLARE
    v_valor TEXT;
BEGIN
    SELECT valor INTO v_valor
    FROM public.ajustes_aplicacion
    WHERE clave = p_clave;
    
    RETURN v_valor;
END;
$$ LANGUAGE plpgsql STABLE;

-- Función para obtener todos los ajustes de un grupo
CREATE OR REPLACE FUNCTION public.obtener_ajustes_por_grupo(p_grupo TEXT)
RETURNS TABLE (
    clave TEXT,
    valor TEXT,
    tipo tipo_ajuste,
    descripcion TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.clave,
        a.valor,
        a.tipo,
        a.descripcion
    FROM public.ajustes_aplicacion a
    WHERE a.grupo = p_grupo
    ORDER BY a.orden ASC, a.clave ASC;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.obtener_ajuste IS 'Obtiene el valor de un ajuste por su clave';
COMMENT ON FUNCTION public.obtener_ajustes_por_grupo IS 'Obtiene todos los ajustes de un grupo específico';
