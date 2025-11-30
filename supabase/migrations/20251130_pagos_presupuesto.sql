-- Tabla de pagos para registrar abonos al presupuesto
CREATE TABLE IF NOT EXISTS public.pagos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  presupuesto_id uuid NOT NULL,
  paciente_id uuid NOT NULL,
  monto numeric NOT NULL,
  moneda_id uuid NOT NULL,
  metodo_pago text NOT NULL DEFAULT 'efectivo', -- efectivo, tarjeta, transferencia, yape, plin
  numero_comprobante text,
  tipo_comprobante text DEFAULT 'boleta', -- boleta, factura, ticket
  notas text,
  recibido_por uuid, -- personal que recibió el pago
  fecha_pago timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT pagos_pkey PRIMARY KEY (id),
  CONSTRAINT pagos_presupuesto_id_fkey FOREIGN KEY (presupuesto_id) REFERENCES public.presupuestos(id) ON DELETE CASCADE,
  CONSTRAINT pagos_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id),
  CONSTRAINT pagos_moneda_id_fkey FOREIGN KEY (moneda_id) REFERENCES public.monedas(id),
  CONSTRAINT pagos_recibido_por_fkey FOREIGN KEY (recibido_por) REFERENCES public.personal(id)
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_pagos_presupuesto_id ON public.pagos(presupuesto_id);
CREATE INDEX IF NOT EXISTS idx_pagos_paciente_id ON public.pagos(paciente_id);
CREATE INDEX IF NOT EXISTS idx_pagos_fecha ON public.pagos(fecha_pago);

-- Agregar columna de descuento global si no existe
ALTER TABLE public.presupuestos 
ADD COLUMN IF NOT EXISTS descuento_global numeric DEFAULT 0;

-- Comentarios
COMMENT ON TABLE public.pagos IS 'Registro de pagos/abonos realizados a presupuestos';
COMMENT ON COLUMN public.pagos.metodo_pago IS 'Método de pago: efectivo, tarjeta, transferencia, yape, plin';
COMMENT ON COLUMN public.pagos.tipo_comprobante IS 'Tipo de comprobante: boleta, factura, ticket';
