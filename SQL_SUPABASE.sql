-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.antecedentes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  historia_id uuid NOT NULL,
  categoria text NOT NULL,
  opciones ARRAY,
  otros text,
  no_refiere boolean DEFAULT false,
  CONSTRAINT antecedentes_pkey PRIMARY KEY (id),
  CONSTRAINT antecedentes_historia_id_fkey FOREIGN KEY (historia_id) REFERENCES public.historias_clinicas(id)
);
CREATE TABLE public.citas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  paciente_id uuid NOT NULL,
  odontologo_id uuid NOT NULL,
  fecha_inicio timestamp with time zone NOT NULL,
  fecha_fin timestamp with time zone NOT NULL,
  estado USER-DEFINED DEFAULT 'Programada'::estado_cita,
  motivo text,
  costo_total numeric,
  moneda_id uuid,
  google_calendar_event_id text,
  notas text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT citas_pkey PRIMARY KEY (id),
  CONSTRAINT citas_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id),
  CONSTRAINT citas_odontologo_id_fkey FOREIGN KEY (odontologo_id) REFERENCES public.personal(id),
  CONSTRAINT citas_moneda_id_fkey FOREIGN KEY (moneda_id) REFERENCES public.monedas(id)
);
CREATE TABLE public.cuestionario_respuestas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  historia_id uuid NOT NULL,
  seccion text NOT NULL,
  pregunta text NOT NULL,
  respuesta_si_no boolean,
  respuesta_texto text,
  respuesta_opciones ARRAY,
  detalle text,
  CONSTRAINT cuestionario_respuestas_pkey PRIMARY KEY (id),
  CONSTRAINT cuestionario_respuestas_historia_id_fkey FOREIGN KEY (historia_id) REFERENCES public.historias_clinicas(id)
);
CREATE TABLE public.grupos_procedimiento (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL UNIQUE,
  descripcion text,
  unidad_id uuid,
  CONSTRAINT grupos_procedimiento_pkey PRIMARY KEY (id),
  CONSTRAINT grupos_procedimiento_unidad_id_fkey FOREIGN KEY (unidad_id) REFERENCES public.unidades(id)
);
CREATE TABLE public.historias_clinicas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  paciente_id uuid NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT historias_clinicas_pkey PRIMARY KEY (id),
  CONSTRAINT historias_clinicas_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id)
);
CREATE TABLE public.imagenes_pacientes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  paciente_id uuid NOT NULL,
  tipo text NOT NULL,
  url text NOT NULL,
  public_id text NOT NULL,
  fecha_subida timestamp with time zone NOT NULL DEFAULT now(),
  descripcion text,
  CONSTRAINT imagenes_pacientes_pkey PRIMARY KEY (id),
  CONSTRAINT fk_paciente FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id)
);
CREATE TABLE public.monedas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  codigo text NOT NULL UNIQUE,
  nombre text NOT NULL,
  simbolo text NOT NULL,
  CONSTRAINT monedas_pkey PRIMARY KEY (id)
);
CREATE TABLE public.odontogramas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  paciente_id uuid NOT NULL,
  odontograma_data jsonb,
  fecha_registro timestamp with time zone DEFAULT now(),
  version integer NOT NULL,
  CONSTRAINT odontogramas_pkey PRIMARY KEY (id),
  CONSTRAINT odontogramas_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id)
);
CREATE TABLE public.pacientes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombres text NOT NULL,
  apellidos text NOT NULL,
  fecha_nacimiento date NOT NULL,
  dni text NOT NULL UNIQUE,
  genero text,
  ocupacion text,
  telefono text,
  email text UNIQUE,
  direccion text,
  lugar_procedencia text,
  alerta_medica text,
  antecedentes_patologicos jsonb,
  habitos jsonb,
  talla_m numeric,
  peso_kg numeric,
  imc numeric,
  presion_arterial text,
  created_at timestamp with time zone DEFAULT now(),
  numero_historia text UNIQUE,
  grado_instruccion text,
  pais text,
  departamento text,
  provincia text,
  distrito text,
  contacto_emergencia jsonb,
  recomendado_por text,
  observaciones text,
  estado_civil character varying,
  CONSTRAINT pacientes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.personal (
  id uuid NOT NULL,
  nombre_completo text NOT NULL,
  rol USER-DEFINED NOT NULL,
  especialidad text,
  telefono text,
  email text UNIQUE,
  activo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT personal_pkey PRIMARY KEY (id),
  CONSTRAINT personal_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.plan_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL,
  procedimiento_id uuid NOT NULL,
  moneda_id uuid NOT NULL,
  estado USER-DEFINED DEFAULT 'Pendiente'::item_status,
  costo numeric NOT NULL,
  cantidad integer DEFAULT 1,
  pieza_dental text,
  notas text,
  orden_ejecucion integer,
  CONSTRAINT plan_items_pkey PRIMARY KEY (id),
  CONSTRAINT plan_items_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.planes_procedimiento(id),
  CONSTRAINT plan_items_procedimiento_id_fkey FOREIGN KEY (procedimiento_id) REFERENCES public.procedimientos(id),
  CONSTRAINT plan_items_moneda_id_fkey FOREIGN KEY (moneda_id) REFERENCES public.monedas(id)
);
CREATE TABLE public.planes_procedimiento (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  paciente_id uuid NOT NULL,
  nombre text NOT NULL,
  costo_total numeric,
  moneda_id uuid,
  estado USER-DEFINED DEFAULT 'Propuesto'::plan_status,
  fecha_creacion timestamp with time zone DEFAULT now(),
  CONSTRAINT planes_procedimiento_pkey PRIMARY KEY (id),
  CONSTRAINT planes_procedimiento_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id),
  CONSTRAINT planes_procedimiento_moneda_id_fkey FOREIGN KEY (moneda_id) REFERENCES public.monedas(id)
);
CREATE TABLE public.procedimiento_precios (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  procedimiento_id uuid NOT NULL,
  moneda_id uuid NOT NULL,
  precio numeric NOT NULL,
  vigente_desde date DEFAULT CURRENT_DATE,
  vigente_hasta date,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT procedimiento_precios_pkey PRIMARY KEY (id),
  CONSTRAINT procedimiento_precios_procedimiento_id_fkey FOREIGN KEY (procedimiento_id) REFERENCES public.procedimientos(id),
  CONSTRAINT procedimiento_precios_moneda_id_fkey FOREIGN KEY (moneda_id) REFERENCES public.monedas(id)
);
CREATE TABLE public.procedimientos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL UNIQUE,
  descripcion text,
  unidad_id uuid,
  grupo_id uuid,
  medida USER-DEFINED,
  tipo text,
  comision_porcentaje numeric DEFAULT 0.00,
  activo boolean DEFAULT true,
  fecha_registro timestamp with time zone DEFAULT now(),
  CONSTRAINT procedimientos_pkey PRIMARY KEY (id),
  CONSTRAINT procedimientos_unidad_id_fkey FOREIGN KEY (unidad_id) REFERENCES public.unidades(id),
  CONSTRAINT procedimientos_grupo_id_fkey FOREIGN KEY (grupo_id) REFERENCES public.grupos_procedimiento(id)
);
CREATE TABLE public.seguimiento_imagenes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  seguimiento_id uuid NOT NULL,
  ruta text NOT NULL,
  descripcion text,
  uploaded_at timestamp with time zone DEFAULT now(),
  CONSTRAINT seguimiento_imagenes_pkey PRIMARY KEY (id),
  CONSTRAINT seguimiento_imagenes_seguimiento_id_fkey FOREIGN KEY (seguimiento_id) REFERENCES public.seguimientos(id)
);
CREATE TABLE public.seguimientos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  paciente_id uuid NOT NULL,
  odontologo_id uuid NOT NULL,
  cita_id uuid,
  fecha_seguimiento date NOT NULL DEFAULT CURRENT_DATE,
  procedimiento_id uuid,
  observaciones text,
  fecha_proxima_cita date,
  CONSTRAINT seguimientos_pkey PRIMARY KEY (id),
  CONSTRAINT seguimientos_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id),
  CONSTRAINT seguimientos_odontologo_id_fkey FOREIGN KEY (odontologo_id) REFERENCES public.personal(id),
  CONSTRAINT seguimientos_cita_id_fkey FOREIGN KEY (cita_id) REFERENCES public.citas(id),
  CONSTRAINT seguimientos_procedimiento_id_fkey FOREIGN KEY (procedimiento_id) REFERENCES public.procedimientos(id)
);
CREATE TABLE public.transacciones_financieras (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  cita_id uuid,
  monto numeric NOT NULL,
  moneda_id uuid NOT NULL,
  tipo text NOT NULL,
  descripcion text,
  fecha_transaccion timestamp with time zone DEFAULT now(),
  CONSTRAINT transacciones_financieras_pkey PRIMARY KEY (id),
  CONSTRAINT transacciones_financieras_cita_id_fkey FOREIGN KEY (cita_id) REFERENCES public.citas(id),
  CONSTRAINT transacciones_financieras_moneda_id_fkey FOREIGN KEY (moneda_id) REFERENCES public.monedas(id)
);
CREATE TABLE public.unidades (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL UNIQUE,
  CONSTRAINT unidades_pkey PRIMARY KEY (id)
);