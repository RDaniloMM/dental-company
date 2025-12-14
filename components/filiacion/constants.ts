export const NACIONALIDADES_COMMON = [
  "Peruano",
  "Chileno",
  "Argentino",
  "Boliviano",
  "Colombiano",
  "Ecuatoriano",
  "Venezolano",
];

export const GENERO_OPTIONS = [
  { value: "M", label: "Masculino" },
  { value: "F", label: "Femenino" },
];

export const ESTADO_CIVIL_OPTIONS = [
  "Soltero(a)",
  "Casado(a)",
  "Divorciado(a)",
  "Viudo(a)",
  "Conviviente",
];

export const GRADO_INSTRUCCION_OPTIONS = [
  { value: "PRIMARIA COMPLETA", label: "Primaria Completa" },
  { value: "SECUNDARIA COMPLETA", label: "Secundaria Completa" },
  { value: "TECNICA", label: "Técnica" },
  { value: "SUPERIOR", label: "Superior" },
  { value: "NO ESPECIFICA", label: "No especifica" },
];

export const UPPERCASE_FIELDS = [
    "apellidos",
    "nombres",
    "direccion",
    "recomendado_por",
    "observaciones",
    "ocupacion",
    "departamento",
    "provincia",
    "distrito",
] as const;

export type UppercaseField = typeof UPPERCASE_FIELDS[number];