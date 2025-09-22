-- =================================================================
-- ESQUEMA DE BASE DE DATOS PARA DENTAL COMPANY - TACNA
-- =================================================================
-- Drop database if exists public;


CREATE TYPE public.estado_cita AS ENUM ('Programada', 'Confirmada', 'Cancelada', 'Completada', 'No Asistió');
CREATE TYPE public.rol AS ENUM ('Admin', 'Odontólogo');
CREATE TYPE public.plan_status AS ENUM ('Propuesto', 'En Progreso', 'Completado', 'Cancelado');
CREATE TYPE public.item_status AS ENUM ('Pendiente', 'En Progreso', 'Completado', 'Cancelado');
CREATE TYPE public.medida_tratamiento AS ENUM ('No específica', 'General', 'Pieza', 'Radiografía', 'Prótesis', 'Corona', 'Consulta', 'Cirugías');
CREATE TYPE public.estado_civil AS ENUM ('Soltero', 'Casado', 'Divorciado', 'Viudo', 'Unión Libre');

CREATE TABLE public.personal (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombres TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  rol public.rol NOT NULL,
  especialidad TEXT,
  activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE public.pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombres TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  dni TEXT UNIQUE NOT NULL,
  genero TEXT,
  ocupacion TEXT,
  estado_civil public.estado_civil,
  telefono TEXT,
  email TEXT UNIQUE,
  direccion TEXT,
  lugar_procedencia TEXT,
  alerta_medica TEXT,
  antecedentes_patologicos JSONB,
  habitos JSONB,
  talla_m DECIMAL(3, 2),
  peso_kg DECIMAL(5, 2),
  imc DECIMAL(4, 2),
  presion_arterial TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.odontogramas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  odontograma_data JSONB,
  fecha_registro TIMESTAMPTZ DEFAULT NOW(),
  version INT NOT NULL,
  CONSTRAINT odontograma_paciente_version_unique UNIQUE (paciente_id, version)
);

CREATE TABLE public.unidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT UNIQUE NOT NULL
);

CREATE TABLE public.grupos_procedimiento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT UNIQUE NOT NULL,
  descripcion TEXT,
  unidad_id UUID REFERENCES public.unidades(id)
);

CREATE TABLE public.procedimientos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT UNIQUE NOT NULL,
    descripcion TEXT,
    unidad_id UUID REFERENCES public.unidades(id),
    grupo_id UUID REFERENCES public.grupos_procedimiento(id),
    medida public.medida_tratamiento,
    tipo TEXT, -- Campo flexible para futuras categorizaciones
    comision_porcentaje DECIMAL(5, 2) DEFAULT 0.00,
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.monedas(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    simbolo TEXT NOT NULL
);

CREATE TABLE public.procedimiento_precios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    procedimiento_id UUID NOT NULL REFERENCES public.procedimientos(id) ON DELETE CASCADE,
    moneda_id UUID NOT NULL REFERENCES public.monedas(id),
    precio DECIMAL(10, 2) NOT NULL,
    vigente_desde DATE DEFAULT CURRENT_DATE,
    vigente_hasta DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT procedimiento_moneda_unique UNIQUE (procedimiento_id, moneda_id, vigente_desde)
);

CREATE TABLE public.planes_procedimiento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    costo_total DECIMAL(10, 2),
    moneda_id UUID REFERENCES public.monedas(id),
    estado public.plan_status DEFAULT 'Propuesto',
    fecha_creacion TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.plan_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES public.planes_procedimiento(id) ON DELETE CASCADE,
    procedimiento_id UUID NOT NULL REFERENCES public.procedimientos(id),
    -- moneda_id UUID NOT NULL REFERENCES public.monedas(id),
    estado public.item_status DEFAULT 'Pendiente',
    -- costo DECIMAL(10, 2) NOT NULL,
    cantidad INTEGER DEFAULT 1, -- Cuántas veces se realizará el procedimiento
    pieza_dental TEXT, -- Específica para este plan item
    notas TEXT,
    orden_ejecucion INTEGER -- Para definir secuencia de procedimientos
);

CREATE TABLE public.citas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  odontologo_id UUID NOT NULL REFERENCES public.personal(id),
  fecha_inicio TIMESTAMPTZ NOT NULL,
  fecha_fin TIMESTAMPTZ NOT NULL,
  estado public.estado_cita DEFAULT 'Programada',
  motivo TEXT,
  costo_total DECIMAL(10, 2),
  moneda_id UUID REFERENCES public.monedas(id),
  google_calendar_event_id TEXT,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.seguimientos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cita_id UUID REFERENCES public.citas(id) ON DELETE SET NULL,
  procedimiento_id UUID REFERENCES public.procedimientos(id),
  fecha_proxima_cita DATE
);

-- Tabla para almacenar imágenes de referencia asociadas a un seguimiento.
CREATE TABLE public.seguimiento_imagenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seguimiento_id UUID NOT NULL REFERENCES public.seguimientos(id) ON DELETE CASCADE,
  ruta TEXT NOT NULL,
  descripcion TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.transacciones_financieras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cita_id UUID REFERENCES public.citas(id) ON DELETE SET NULL,
  monto DECIMAL(10, 2) NOT NULL,
  moneda_id UUID NOT NULL REFERENCES public.monedas(id),
  procedimiento_id UUID NOT NULL REFERENCES public.procedimientos(id),
  notas_transaccion TEXT,
  fecha_transaccion TIMESTAMPTZ DEFAULT NOW()
);

-- =================================================================
-- FUNCIONES PARA CÁLCULO AUTOMÁTICO DE COSTOS
-- =================================================================

-- Función para calcular el costo total de un plan de procedimientos
CREATE OR REPLACE FUNCTION calcular_costo_plan(plan_id UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  costo_total DECIMAL(10,2) := 0;
  plan_moneda UUID;
BEGIN
  -- Obtener la moneda del plan
  SELECT moneda_id INTO plan_moneda 
  FROM planes_procedimiento 
  WHERE id = plan_id;
  
  -- Si no hay moneda definida en el plan, usar la primera moneda de los items
  IF plan_moneda IS NULL THEN
    SELECT DISTINCT moneda_id INTO plan_moneda
    FROM plan_items 
    WHERE plan_id = calcular_costo_plan.plan_id
    LIMIT 1;
  END IF;
  
  -- Sumar costos de items en la misma moneda (considerando cantidad)
  SELECT COALESCE(SUM(costo * cantidad), 0) INTO costo_total
  FROM plan_items 
  WHERE plan_id = calcular_costo_plan.plan_id 
    AND moneda_id = plan_moneda;
  
  RETURN costo_total;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar el costo total del plan
CREATE OR REPLACE FUNCTION actualizar_costo_plan()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar el costo del plan afectado
  UPDATE planes_procedimiento 
  SET costo_total = calcular_costo_plan(
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.plan_id
      ELSE NEW.plan_id
    END
  )
  WHERE id = (
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.plan_id
      ELSE NEW.plan_id
    END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;


-- =================================================================
-- TRIGGERS PARA CÁLCULO AUTOMÁTICO
-- =================================================================

-- Trigger para actualizar automáticamente el costo del plan cuando se modifican los items
CREATE TRIGGER trigger_actualizar_costo_plan
  AFTER INSERT OR UPDATE OR DELETE ON plan_items
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_costo_plan();

-- Trigger para calcular automáticamente el costo de la cita
CREATE OR REPLACE FUNCTION actualizar_costo_cita()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar el costo de la cita afectada
  UPDATE citas 
  SET costo_total = calcular_costo_cita(
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.cita_id
      ELSE NEW.cita_id
    END
  )
  WHERE id = (
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.cita_id
      ELSE NEW.cita_id
    END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_costo_cita
  AFTER INSERT OR UPDATE OR DELETE ON transacciones_financieras
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_costo_cita();

-- =================================================================
-- VISTAS ÚTILES PARA REPORTES
-- =================================================================

-- Vista para costos de planes con detalles
CREATE VIEW vista_planes_costo AS
SELECT 
  p.id,
  p.nombre,
  pac.nombres || ' ' || pac.apellidos as paciente,
  p.costo_total,
  m.simbolo as simbolo_moneda,
  p.estado,
  COUNT(pi.id) as total_items,
  p.fecha_creacion
FROM planes_procedimiento p
LEFT JOIN pacientes pac ON p.paciente_id = pac.id
LEFT JOIN monedas m ON p.moneda_id = m.id
LEFT JOIN plan_items pi ON p.id = pi.plan_id
GROUP BY p.id, p.nombre, pac.nombres, pac.apellidos, p.costo_total, m.simbolo, p.estado, p.fecha_creacion;

-- Vista para citas con costos
CREATE VIEW vista_citas_costo AS
SELECT 
  c.id,
  pac.nombres || ' ' || pac.apellidos as paciente,
  per.nombre_completo as odontologo,
  c.fecha_inicio,
  c.costo_total,
  m.simbolo as simbolo_moneda,
  c.estado
FROM citas c
LEFT JOIN pacientes pac ON c.paciente_id = pac.id
LEFT JOIN personal per ON c.odontologo_id = per.id
LEFT JOIN monedas m ON c.moneda_id = m.id;