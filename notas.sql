-- Agregar la columna moneda_id a la tabla presupuestos
ALTER TABLE public.presupuestos
ADD COLUMN moneda_id uuid,
ADD CONSTRAINT fk_moneda
FOREIGN KEY (moneda_id)
REFERENCES public.monedas(id);
