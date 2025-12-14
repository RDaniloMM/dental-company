// Tipos para generación de PDF

export interface Filiacion {
  nombres?: string;
  apellidos?: string;
  fecha_nacimiento?: string;
  ocupacion?: string;
  telefono?: string;
  email?: string;
  alerta_medica?: string;
  direccion?: string;
  sexo?: 'masculino' | 'femenino' | 'no_especifica';
  estado_civil?: string;
  lugar_procedencia?: string;
  recomendado_por?: string;
}

export interface AntecedentesQuestion {
  respuesta?: boolean;
  texto?: string;
  detalle?: string;
  [key: string]: unknown; // Allow dynamic form fields
}

export type TableCell = string | { content: string; colSpan?: number; styles?: Record<string, unknown> };
export type TableRow = TableCell[];
export type TableBody = TableRow[];

export interface AntecedentesAnnotation {
  id: string;
  selection: string;
  detail: string;
}

export interface AntecedentesCategory {
  questions: Record<string, AntecedentesQuestion>;
  refiere: boolean;
  annotationsEnabled: boolean;
  annotations: AntecedentesAnnotation[];
}

export interface Antecedentes {
  [category: string]: AntecedentesCategory;
}

export interface OdontogramaData {
  existe: boolean;
  version?: string;
  fecha_registro?: string;
  observaciones?: string;
  imagen_base64?: string;
}

export interface Seguimiento {
  fecha: string;
  tratamientos: string[];
  observaciones?: string;
}

export interface FichaPDFPayload {
  tipo_reporte?: 'ficha';
  numero_historia?: string;
  filiacion?: Filiacion;
  antecedentes?: Antecedentes;
  odontograma?: OdontogramaData;
  seguimientos?: Seguimiento[];
}

export interface PresupuestoItem {
  nombre: string;
  descripcion?: string;
  cantidad: number;
  costo: number;
  notas?: string;
  precio_unitario?: number;
}

export interface PagoItem {
  fecha: string;
  tratamientos: string[];
  monto: number;
}

export interface PresupuestoPDFPayload {
  tipo_reporte?: 'presupuesto';
  paciente_nombre?: string;
  numero_historia?: string;
  fecha_presupuesto?: string;
  correlativo?: number;
  items?: PresupuestoItem[];
  moneda_simbolo?: string;
  pagos?: PagoItem[];
}

export type PDFPayload = FichaPDFPayload | PresupuestoPDFPayload;
