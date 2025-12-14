// Tipos para la página de reportes

export interface AntecedentesRecord {
  id: string;
  [key: string]: unknown;
}

export interface CasoRecord {
  id: string;
  nombre_caso: string;
  [key: string]: unknown;
}

export interface SeguimientoRecord {
  presupuesto_id: string;
  fecha: string;
  tratamientos_realizados_ids?: string[];
  pago_id?: string;
  pagos?: {
    monto: number;
    moneda_id?: string;
  };
}

export interface PresupuestoRecord {
  id: string;
  items_json?: PresupuestoItemRecord[];
  [key: string]: unknown;
}

export interface PresupuestoItemRecord {
  procedimiento_id: string;
  procedimiento_nombre: string;
  costo?: number;
  cantidad?: number;
  notas?: string;
  descripcion?: string;
}

export interface PagoRecord {
  monto: number;
  moneda_id?: string;
}
