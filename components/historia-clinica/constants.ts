import { QuestionConfig, CategoryConfig } from "./types";

// 1. Configuración de las preguntas (Checkboxes)
export const QUESTIONS_CONFIG: Record<string, QuestionConfig[]> = {
  Cardiovascular: [
    {
      id: "hipertension",
      text: "Hipertensión",
      type: "checkbox-with-input",
      conditionalTextInput: true,
      placeholder: "tratamiento:",
    },
    { id: "arritmias", text: "Arritmias", type: "checkbox" },
    { id: "cardiopatia_isquemica", text: "Cardiopatía isquémica", type: "checkbox" },
    { id: "marcapasos", text: "Marcapasos", type: "checkbox" },
    {
      id: "anticoagulantes",
      text: "Anticoagulantes",
      type: "checkbox-with-input",
      options: [
        { label: "Warfarina", value: "Warfarina" },
        { label: "AAS", value: "AAS" },
        { label: "Otro", value: "Otro", conditionalTextInput: true, placeholder: "Especifique" },
      ],
    },
  ],
  Respiratorio: [
    { id: "asma", text: "Asma", type: "checkbox" },
    { id: "epoc", text: "EPOC", type: "checkbox" },
    { id: "apnea_sueno", text: "Apnea del sueño", type: "checkbox" },
    { id: "tuberculosis", text: "Tuberculosis", type: "checkbox" },
  ],
  "Endocrino-Metabólico": [
    {
      id: "diabetes",
      text: "Diabetes",
      type: "checkbox-with-input",
      conditionalTextInput: true,
      placeholder: "tipo:___, HbA1c:__%",
    },
    {
      id: "tiroides",
      text: "Tiroides",
      type: "checkbox-with-input",
      options: [
        { label: "Hipo", value: "Hipo" },
        { label: "Hiper", value: "Hiper" },
      ],
    },
    {
      id: "osteoporosis",
      text: "Osteoporosis",
      type: "checkbox-with-input",
      conditionalTextInput: true,
      placeholder: "tratamiento:",
    },
  ],
  "Neurológico/Psiquiátrico": [
    { id: "epilepsia", text: "Epilepsia", type: "checkbox" },
    { id: "alzheimer", text: "Alzheimer", type: "checkbox" },
    { id: "ansiedad_depresion", text: "Ansiedad/Depresión", type: "checkbox" },
    {
      id: "medicamentos_psiquiatricos",
      text: "Medicamentos psiquiátricos",
      type: "checkbox-with-input",
      conditionalTextInput: true,
      placeholder: "especificar:",
    },
  ],
  "Hematología/Inmunológico": [
    { id: "anemia", text: "Anemia", type: "checkbox" },
    { id: "hemofilia", text: "Hemofilia", type: "checkbox" },
    { id: "vih_sida", text: "VIH/SIDA", type: "checkbox" },
    {
      id: "enfermedades_autoinmunes",
      text: "Enfermedades autoinmunes",
      type: "checkbox",
    },
  ],
  "Digestivo/Hepático": [
    { id: "reflujo", text: "Reflujo", type: "checkbox" },
    { id: "ulcera_gastrica", text: "Úlcera gástrica", type: "checkbox" },
    {
      id: "hepatitis",
      text: "Hepatitis",
      type: "checkbox-with-input",
      conditionalTextInput: true,
      placeholder: "tipo:",
    },
  ],
  Renal: [
    {
      id: "insuficiencia_renal",
      text: "Insuficiencia renal",
      type: "checkbox-with-input",
      conditionalTextInput: true,
      placeholder: "etapa:",
    },
    { id: "dialisis", text: "Diálisis", type: "checkbox" },
  ],
  Alergias: [
    { id: "penicilina", text: "Penicilina", type: "checkbox" },
    { id: "sulfas", text: "Sulfas", type: "checkbox" },
    {
      id: "anestesicos_locales",
      text: "Anestésicos locales",
      type: "checkbox-with-input",
      conditionalTextInput: true,
      placeholder: "especificar:",
    },
    { id: "latex", text: "Látex", type: "checkbox" },
    {
      id: "alimentos",
      text: "Alimentos",
      type: "checkbox-with-input",
      conditionalTextInput: true,
      placeholder: "especificar:",
    },
  ],
  Hábitos: [
    {
      id: "tabaco",
      text: "Tabaco",
      type: "checkbox-with-input",
      isSingleSelect: true,
      options: [
        { label: "Nunca", value: "Nunca" },
        { label: "Exfumador", value: "Exfumador" },
        {
          label: "Actual",
          value: "Actual",
          subFields: [
            {
              id: "cigarros_dia",
              text: "cigarros/día",
              type: "number",
              placeholder: "Cantidad",
            },
          ],
        },
      ],
    },
    {
      id: "alcohol",
      text: "Alcohol",
      type: "checkbox-with-input",
      isSingleSelect: true,
      options: [
        { label: "Ocasional", value: "Ocasional" },
        {
          label: "Frecuente",
          value: "Frecuente",
          subFields: [
            {
              id: "veces_semana",
              text: "veces/semana",
              type: "number",
              placeholder: "Cantidad",
            },
          ],
        },
      ],
    },
    {
      id: "drogas_recreacionales",
      text: "Drogas recreacionales",
      type: "checkbox-with-input",
      isSingleSelect: true,
      options: [
        {
          label: "Sí",
          value: "si",
          subFields: [
            {
              id: "tipo_drogas",
              text: "tipo:",
              type: "text",
              placeholder: "Especifique el tipo",
            },
          ],
        },
        { label: "No", value: "no" },
      ],
    },
  ],
  "Otros relevantes": [
    {
      id: "cancer",
      text: "Cáncer",
      type: "checkbox-with-input",
      conditionalTextInput: true,
      placeholder: "tipo:",
    },
    {
      id: "embarazo_actual",
      text: "Embarazo actual",
      type: "checkbox-with-input",
      conditionalTextInput: true,
      placeholder: "semanas:",
    },
    {
      id: "protesis_articulaciones",
      text: "Prótesis articulaciones",
      type: "checkbox-with-input",
      conditionalTextInput: true,
      placeholder: "fecha de colocación:",
    },
  ],
};

export const CATEGORIES_CONFIG: Record<string, CategoryConfig> = {
  Cardiovascular: {
    id: "cardiovascular",
    label: "Cardiovascular",
    options: [
      { label: "General", value: "General" },
      { label: "Hipertensión", value: "Hipertensión" },
      { label: "Arritmias", value: "Arritmias" },
      { label: "Cardiopatía isquémica", value: "Cardiopatía isquémica" },
      { label: "Marcapasos", value: "Marcapasos" },
      { label: "Anticoagulantes", value: "Anticoagulantes" },
    ],
  },
  Respiratorio: {
    id: "respiratorio",
    label: "Respiratorio",
    options: [
      { label: "General", value: "General" },
      { label: "Asma", value: "Asma" },
      { label: "EPOC", value: "EPOC" },
      { label: "Apnea del sueño", value: "Apnea del sueño" },
      { label: "Tuberculosis", value: "Tuberculosis" },
    ],
  },
  "Endocrino-Metabólico": {
    id: "endocrino",
    label: "Endocrino-Metabólico",
    options: [
      { label: "General", value: "General" },
      { label: "Diabetes", value: "Diabetes" },
      { label: "Tiroides", value: "Tiroides" },
      { label: "Osteoporosis", value: "Osteoporosis" },
    ],
  },
  "Neurológico/Psiquiátrico": {
    id: "neuro",
    label: "Neurológico/Psiquiátrico",
    options: [
      { label: "General", value: "General" },
      { label: "Epilepsia", value: "Epilepsia" },
      { label: "Alzheimer", value: "Alzheimer" },
      { label: "Ansiedad/Depresión", value: "Ansiedad/Depresión" },
      { label: "Medicamentos psiquiátricos", value: "Medicamentos psiquiátricos" },
    ],
  },
  "Hematología/Inmunológico": {
    id: "hemato",
    label: "Hematología/Inmunológico",
    options: [
      { label: "General", value: "General" },
      { label: "Anemia", value: "Anemia" },
      { label: "Hemofilia", value: "Hemofilia" },
      { label: "VIH/SIDA", value: "VIH/SIDA" },
      { label: "Enfermedades autoinmunes", value: "Enfermedades autoinmunes" },
    ],
  },
  "Digestivo/Hepático": {
    id: "digestivo",
    label: "Digestivo/Hepático",
    options: [
      { label: "General", value: "General" },
      { label: "Reflujo", value: "Reflujo" },
      { label: "Úlcera gástrica", value: "Úlcera gástrica" },
      { label: "Hepatitis", value: "Hepatitis" },
    ],
  },
  Renal: {
    id: "renal",
    label: "Renal",
    options: [
      { label: "General", value: "General" },
      { label: "Insuficiencia renal", value: "Insuficiencia renal" },
      { label: "Diálisis", value: "Diálisis" },
    ],
  },
  Alergias: {
    id: "alergias",
    label: "Alergias",
    options: [
      { label: "General", value: "General" },
      { label: "Penicilina", value: "Penicilina" },
      { label: "Sulfas", value: "Sulfas" },
      { label: "Anestésicos locales", value: "Anestésicos locales" },
      { label: "Látex", value: "Látex" },
      { label: "Alimentos", value: "Alimentos" },
    ],
  },
  Hábitos: {
    id: "habitos",
    label: "Hábitos",
    options: [
      { label: "General", value: "General" },
      { label: "Tabaco", value: "Tabaco" },
      { label: "Alcohol", value: "Alcohol" },
      { label: "Drogas recreacionales", value: "Drogas recreacionales" },
    ],
  },
  "Otros relevantes": {
    id: "otros",
    label: "Otros relevantes",
    options: [
      { label: "General", value: "General" },
      { label: "Cáncer", value: "Cáncer" },
      { label: "Embarazo actual", value: "Embarazo actual" },
      { label: "Prótesis articulaciones", value: "Prótesis articulaciones" },
    ],
  },
};