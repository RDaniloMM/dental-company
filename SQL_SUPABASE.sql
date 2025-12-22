-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.ajustes_aplicacion (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  clave text NOT NULL UNIQUE,
  valor text,
  grupo text NOT NULL,
  tipo USER-DEFINED NOT NULL,
  descripcion text,
  orden integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  resend_api_key text,
  CONSTRAINT ajustes_aplicacion_pkey PRIMARY KEY (id)
);
CREATE TABLE public.antecedentes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  historia_id uuid NOT NULL,
  categoria text NOT NULL,
  datos jsonb NOT NULL,
  fecha_registro timestamp without time zone DEFAULT now(),
  no_refiere boolean DEFAULT false,
  CONSTRAINT antecedentes_pkey PRIMARY KEY (id),
  CONSTRAINT antecedentes_historia_id_fkey FOREIGN KEY (historia_id) REFERENCES public.historias_clinicas(id)
);
CREATE TABLE public.casos_clinicos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  historia_id uuid NOT NULL,
  nombre_caso text NOT NULL,
  descripcion text,
  diagnostico_preliminar text,
  fecha_inicio timestamp with time zone DEFAULT now(),
  fecha_cierre timestamp with time zone,
  estado text DEFAULT 'Abierto'::text,
  deleted_at timestamp with time zone,
  deleted_by uuid,
  CONSTRAINT casos_clinicos_pkey PRIMARY KEY (id),
  CONSTRAINT casos_clinicos_historia_id_fkey FOREIGN KEY (historia_id) REFERENCES public.historias_clinicas(id),
  CONSTRAINT casos_clinicos_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id)
);
CREATE TABLE public.chatbot_contexto (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  contenido text NOT NULL,
  tipo text DEFAULT 'informacion'::text,
  activo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  embedding USER-DEFINED,
  embedding_updated_at timestamp with time zone,
  CONSTRAINT chatbot_contexto_pkey PRIMARY KEY (id)
);
CREATE TABLE public.chatbot_faqs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pregunta text NOT NULL,
  respuesta text NOT NULL,
  keywords ARRAY DEFAULT '{}'::text[],
  categoria text DEFAULT 'general'::text,
  prioridad integer DEFAULT 0,
  activo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  embedding USER-DEFINED,
  embedding_updated_at timestamp with time zone,
  CONSTRAINT chatbot_faqs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.chatbot_rate_limit (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL UNIQUE,
  requests_count integer DEFAULT 1,
  first_request_at timestamp with time zone DEFAULT now(),
  last_request_at timestamp with time zone DEFAULT now(),
  blocked_until timestamp with time zone,
  CONSTRAINT chatbot_rate_limit_pkey PRIMARY KEY (id)
);
CREATE TABLE public.cie10_catalogo (
  id integer NOT NULL DEFAULT nextval('cie10_catalogo_id_seq'::regclass),
  codigo text NOT NULL UNIQUE,
  descripcion text NOT NULL,
  CONSTRAINT cie10_catalogo_pkey PRIMARY KEY (id)
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
  caso_id uuid,
  deleted_at timestamp with time zone,
  deleted_by uuid,
  CONSTRAINT citas_pkey PRIMARY KEY (id),
  CONSTRAINT citas_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id),
  CONSTRAINT citas_odontologo_id_fkey FOREIGN KEY (odontologo_id) REFERENCES public.personal(id),
  CONSTRAINT citas_moneda_id_fkey FOREIGN KEY (moneda_id) REFERENCES public.monedas(id),
  CONSTRAINT citas_caso_id_fkey FOREIGN KEY (caso_id) REFERENCES public.casos_clinicos(id),
  CONSTRAINT citas_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id)
);
CREATE TABLE public.cms_carrusel (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  imagen_url text NOT NULL,
  alt_text text,
  orden integer DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  public_id text,
  CONSTRAINT cms_carrusel_pkey PRIMARY KEY (id)
);
CREATE TABLE public.cms_equipo (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  cargo text,
  especialidad text,
  foto_url text,
  orden integer DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  foto_public_id text,
  curriculum jsonb,
  CONSTRAINT cms_equipo_pkey PRIMARY KEY (id)
);
CREATE TABLE public.cms_secciones (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  seccion text NOT NULL UNIQUE,
  titulo text,
  subtitulo text,
  contenido jsonb DEFAULT '{}'::jsonb,
  orden integer DEFAULT 0,
  visible boolean DEFAULT true,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid,
  CONSTRAINT cms_secciones_pkey PRIMARY KEY (id),
  CONSTRAINT cms_secciones_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);
CREATE TABLE public.cms_servicio_imagenes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  servicio_id uuid NOT NULL,
  imagen_url text NOT NULL,
  public_id text,
  descripcion text,
  alt_text text,
  orden integer DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cms_servicio_imagenes_pkey PRIMARY KEY (id),
  CONSTRAINT cms_servicio_imagenes_servicio_id_fkey FOREIGN KEY (servicio_id) REFERENCES public.cms_servicios(id)
);
CREATE TABLE public.cms_servicios (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text,
  icono text DEFAULT 'Stethoscope'::text,
  orden integer DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  detalle_completo text,
  beneficios ARRAY,
  duracion character varying,
  recomendaciones text,
  CONSTRAINT cms_servicios_pkey PRIMARY KEY (id)
);
CREATE TABLE public.cms_tema (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  clave text NOT NULL UNIQUE,
  valor text NOT NULL,
  tipo text NOT NULL CHECK (tipo = ANY (ARRAY['color'::text, 'fuente'::text, 'tamaño'::text, 'otro'::text])),
  descripcion text,
  grupo text DEFAULT 'general'::text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cms_tema_pkey PRIMARY KEY (id)
);
CREATE TABLE public.codigos_invitacion (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  codigo text NOT NULL UNIQUE,
  creado_por uuid,
  usado_por uuid,
  rol_asignado text DEFAULT 'Odontólogo'::text,
  usos_maximos integer DEFAULT 1,
  usos_actuales integer DEFAULT 0,
  activo boolean DEFAULT true,
  expira_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  used_at timestamp with time zone,
  CONSTRAINT codigos_invitacion_pkey PRIMARY KEY (id),
  CONSTRAINT codigos_invitacion_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES auth.users(id),
  CONSTRAINT codigos_invitacion_usado_por_fkey FOREIGN KEY (usado_por) REFERENCES auth.users(id)
);
CREATE TABLE public.config_seguridad (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  clave text NOT NULL UNIQUE,
  valor text NOT NULL,
  descripcion text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT config_seguridad_pkey PRIMARY KEY (id)
);
CREATE TABLE public.consentimientos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  caso_id uuid NOT NULL,
  paciente_id uuid NOT NULL,
  tipo text NOT NULL,
  documento_url text,
  firmado boolean DEFAULT false,
  firmado_por uuid,
  fecha_firma timestamp with time zone,
  CONSTRAINT consentimientos_pkey PRIMARY KEY (id),
  CONSTRAINT consentimientos_caso_id_fkey FOREIGN KEY (caso_id) REFERENCES public.casos_clinicos(id),
  CONSTRAINT consentimientos_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id),
  CONSTRAINT consentimientos_firmado_por_fkey FOREIGN KEY (firmado_por) REFERENCES public.personal(id)
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
CREATE TABLE public.diagnosticos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  caso_id uuid NOT NULL,
  odontologo_id uuid NOT NULL,
  tipo text NOT NULL,
  fecha timestamp with time zone DEFAULT now(),
  nombre text NOT NULL DEFAULT 'Diagnóstico General'::text,
  estado_clinico text DEFAULT 'Pendiente'::text,
  CONSTRAINT diagnosticos_pkey PRIMARY KEY (id),
  CONSTRAINT diagnosticos_caso_id_fkey FOREIGN KEY (caso_id) REFERENCES public.casos_clinicos(id),
  CONSTRAINT diagnosticos_odontologo_id_fkey FOREIGN KEY (odontologo_id) REFERENCES public.personal(id)
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
  caso_id uuid,
  etapa text DEFAULT 'durante'::text CHECK (etapa = ANY (ARRAY['antes'::text, 'durante'::text, 'despues'::text, 'seguimiento'::text])),
  fecha_captura date,
  es_principal boolean DEFAULT false,
  CONSTRAINT imagenes_pacientes_pkey PRIMARY KEY (id),
  CONSTRAINT fk_paciente FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id),
  CONSTRAINT imagenes_pacientes_caso_id_fkey FOREIGN KEY (caso_id) REFERENCES public.casos_clinicos(id)
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
  especificaciones text,
  observaciones text,
  imagen_base64 text,
  CONSTRAINT odontogramas_pkey PRIMARY KEY (id),
  CONSTRAINT odontogramas_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id)
);
CREATE TABLE public.pacientes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombres text NOT NULL,
  apellidos text NOT NULL,
  fecha_nacimiento date NOT NULL,
  dni text UNIQUE,
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
CREATE TABLE public.pagos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  presupuesto_id uuid NOT NULL,
  paciente_id uuid NOT NULL,
  monto numeric NOT NULL,
  moneda_id uuid NOT NULL,
  metodo_pago text NOT NULL DEFAULT 'efectivo'::text,
  numero_comprobante text,
  tipo_comprobante text DEFAULT 'boleta'::text,
  notas text,
  recibido_por uuid,
  fecha_pago timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  deleted_by uuid,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid,
  CONSTRAINT pagos_pkey PRIMARY KEY (id),
  CONSTRAINT pagos_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id),
  CONSTRAINT pagos_moneda_id_fkey FOREIGN KEY (moneda_id) REFERENCES public.monedas(id),
  CONSTRAINT pagos_recibido_por_fkey FOREIGN KEY (recibido_por) REFERENCES public.personal(id),
  CONSTRAINT pagos_presupuesto_id_fkey FOREIGN KEY (presupuesto_id) REFERENCES public.presupuestos(id),
  CONSTRAINT pagos_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.personal(id),
  CONSTRAINT pagos_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.personal(id)
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
  caso_id uuid,
  CONSTRAINT planes_procedimiento_pkey PRIMARY KEY (id),
  CONSTRAINT planes_procedimiento_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id),
  CONSTRAINT planes_procedimiento_moneda_id_fkey FOREIGN KEY (moneda_id) REFERENCES public.monedas(id),
  CONSTRAINT planes_procedimiento_caso_id_fkey FOREIGN KEY (caso_id) REFERENCES public.casos_clinicos(id)
);
CREATE TABLE public.presupuesto_diagnosticos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  presupuesto_id uuid NOT NULL,
  diagnostico_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT presupuesto_diagnosticos_pkey PRIMARY KEY (id),
  CONSTRAINT presupuesto_diagnosticos_presupuesto_id_fkey FOREIGN KEY (presupuesto_id) REFERENCES public.presupuestos(id),
  CONSTRAINT presupuesto_diagnosticos_diagnostico_id_fkey FOREIGN KEY (diagnostico_id) REFERENCES public.diagnosticos(id)
);
CREATE TABLE public.presupuesto_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  presupuesto_id uuid NOT NULL,
  procedimiento_id uuid,
  nombre_procedimiento text NOT NULL,
  pieza_dental text,
  cantidad integer NOT NULL DEFAULT 1,
  costo_unitario numeric NOT NULL,
  descuento_porcentaje numeric DEFAULT 0,
  costo_final numeric NOT NULL,
  estado text NOT NULL DEFAULT 'Pendiente'::text CHECK (estado = ANY (ARRAY['Pendiente'::text, 'Realizado'::text, 'Cancelado'::text])),
  orden_ejecucion integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT presupuesto_items_pkey PRIMARY KEY (id),
  CONSTRAINT presupuesto_items_procedimiento_id_fkey FOREIGN KEY (procedimiento_id) REFERENCES public.procedimientos(id),
  CONSTRAINT presupuesto_items_presupuesto_id_fkey FOREIGN KEY (presupuesto_id) REFERENCES public.presupuestos(id)
);
CREATE TABLE public.presupuestos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  paciente_id uuid NOT NULL,
  caso_id uuid NOT NULL,
  medico_id uuid,
  nombre text NOT NULL,
  observacion text,
  especialidad text,
  costo_total numeric NOT NULL CHECK (costo_total >= 0::numeric),
  estado text NOT NULL DEFAULT 'Por Cobrar'::text CHECK (estado = ANY (ARRAY['Por Cobrar'::text, 'Parcial'::text, 'Pagado'::text, 'Cancelado'::text])),
  fecha_creacion timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  moneda_id uuid CHECK (moneda_id IS NOT NULL),
  descuento_global numeric DEFAULT 0 CHECK (descuento_global >= 0::numeric AND descuento_global <= 100::numeric),
  total_pagado numeric DEFAULT 0 CHECK (total_pagado >= 0::numeric),
  saldo_pendiente numeric DEFAULT (costo_total - COALESCE(total_pagado, (0)::numeric)),
  items_json jsonb DEFAULT '[]'::jsonb,
  creador_personal_id uuid,
  creador_nombre text,
  creador_rol text,
  deleted_at timestamp with time zone,
  deleted_by uuid,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid,
  correlativo integer NOT NULL,
  CONSTRAINT presupuestos_pkey PRIMARY KEY (id),
  CONSTRAINT presupuestos_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id),
  CONSTRAINT presupuestos_caso_id_fkey FOREIGN KEY (caso_id) REFERENCES public.casos_clinicos(id),
  CONSTRAINT presupuestos_medico_id_fkey FOREIGN KEY (medico_id) REFERENCES public.personal(id),
  CONSTRAINT fk_moneda FOREIGN KEY (moneda_id) REFERENCES public.monedas(id),
  CONSTRAINT presupuestos_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.personal(id),
  CONSTRAINT presupuestos_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.personal(id)
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
CREATE TABLE public.recetas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  caso_id uuid NOT NULL,
  cita_id uuid,
  paciente_id uuid NOT NULL,
  prescriptor_id uuid NOT NULL,
  contenido text NOT NULL,
  fecha timestamp with time zone DEFAULT now(),
  pdf_url text,
  CONSTRAINT recetas_pkey PRIMARY KEY (id),
  CONSTRAINT recetas_caso_id_fkey FOREIGN KEY (caso_id) REFERENCES public.casos_clinicos(id),
  CONSTRAINT recetas_cita_id_fkey FOREIGN KEY (cita_id) REFERENCES public.citas(id),
  CONSTRAINT recetas_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id),
  CONSTRAINT recetas_prescriptor_id_fkey FOREIGN KEY (prescriptor_id) REFERENCES public.personal(id)
);
CREATE TABLE public.seguimiento_audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  seguimiento_id uuid NOT NULL,
  action text NOT NULL CHECK (action = ANY (ARRAY['create'::text, 'update'::text, 'delete'::text, 'pago_registrado'::text])),
  changed_by uuid,
  changed_at timestamp with time zone NOT NULL DEFAULT now(),
  old_value jsonb,
  new_value jsonb,
  details text,
  CONSTRAINT seguimiento_audit_log_pkey PRIMARY KEY (id),
  CONSTRAINT seguimiento_audit_log_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.personal(id)
);
CREATE TABLE public.seguimiento_imagenes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  seguimiento_id uuid NOT NULL,
  imagen_url text NOT NULL,
  public_id character varying,
  tipo text DEFAULT 'general'::character varying,
  descripcion text,
  fecha_captura timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  caso_id uuid,
  etapa text DEFAULT 'seguimiento'::text,
  CONSTRAINT seguimiento_imagenes_pkey PRIMARY KEY (id),
  CONSTRAINT seguimiento_imagenes_caso_id_fkey FOREIGN KEY (caso_id) REFERENCES public.casos_clinicos(id),
  CONSTRAINT seguimiento_imagenes_seguimiento_id_fkey FOREIGN KEY (seguimiento_id) REFERENCES public.seguimientos(id)
);
CREATE TABLE public.seguimientos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  caso_id uuid NOT NULL,
  paciente_id uuid NOT NULL,
  profesional_id uuid,
  tipo character varying NOT NULL DEFAULT 'control'::character varying,
  titulo character varying NOT NULL,
  descripcion text,
  fecha timestamp with time zone NOT NULL DEFAULT now(),
  pago_id uuid,
  cita_id uuid,
  proxima_cita_id uuid,
  creador_personal_id uuid,
  creador_nombre character varying,
  creador_rol character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp with time zone,
  deleted_by uuid,
  estado text NOT NULL DEFAULT 'activo'::text CHECK (estado = ANY (ARRAY['activo'::text, 'completado'::text, 'pendiente'::text, 'inactivo'::text])),
  odontograma_version integer,
  presupuesto_id uuid,
  saldo_pendiente_snapshot numeric DEFAULT 0,
  tratamientos_realizados_ids jsonb,
  CONSTRAINT seguimientos_pkey PRIMARY KEY (id),
  CONSTRAINT seguimientos_profesional_id_fkey FOREIGN KEY (profesional_id) REFERENCES public.personal(id),
  CONSTRAINT seguimientos_cita_id_fkey FOREIGN KEY (cita_id) REFERENCES public.citas(id),
  CONSTRAINT seguimientos_proxima_cita_id_fkey FOREIGN KEY (proxima_cita_id) REFERENCES public.citas(id),
  CONSTRAINT seguimientos_pago_id_fkey FOREIGN KEY (pago_id) REFERENCES public.pagos(id),
  CONSTRAINT seguimientos_presupuesto_id_fkey FOREIGN KEY (presupuesto_id) REFERENCES public.presupuestos(id),
  CONSTRAINT seguimientos_creador_personal_id_fkey FOREIGN KEY (creador_personal_id) REFERENCES public.personal(id)
);
CREATE TABLE public.unidades (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL UNIQUE,
  CONSTRAINT unidades_pkey PRIMARY KEY (id)
);