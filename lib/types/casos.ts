// Tipos para la página de casos clínicos

export interface DiagnosticoData {
  id: string;
  nombre: string;
  caso_id: string;
}

export interface PresupuestoData {
  id: string;
  caso_id: string;
  costo_total: number;
  total_pagado?: number;
  estado: string;
  monedas?: {
    codigo: string;
    simbolo: string;
  };
}

export interface PagoData {
  presupuesto_id: string;
  pago_id: string;
  pagos?: {
    monto: number;
  };
}

export interface SeguimientoData {
  id: string;
  caso_id: string;
  fecha: string;
  titulo: string;
}

export interface MonedaInfo {
  codigo: string;
  simbolo: string;
  total: number;
  pagado: number;
  estado: string;
  moneda?: {
    codigo: string;
    simbolo: string;
  };
}
