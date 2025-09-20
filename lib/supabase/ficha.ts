// Define la estructura del estado del formulario

export type FiliacionData = {
  nombres: string;
  apellidos: string;
  sexo: 'masculino' | 'femenino' | 'otro' | 'no_especifica';
  fecha_nacimiento: string;
  ocupacion: string;
  estado_civil: string;
  telefono: string;
  email: string;
  direccion: string;
  lugar_procedencia: string;
  recomendado_por: string;
  alerta_medica: string;
};

export type AntecedentesData = {
  cardiovascular: {
    no_refiere: boolean;
    hipertension: boolean;
    hipertension_tratamiento: string;
    arritmias: boolean;
    cardiopatia_isquemica: boolean;
    marcapasos: boolean;
    anticoagulantes: boolean;
    anticoagulantes_cuales: { warfarina: boolean; aas: boolean; otro: boolean; };
    anticoagulantes_otro_detalle: string;
  };
  respiratorio: {
    no_refiere: boolean;
    asma: boolean;
    epoc: boolean;
    apnea_sueno: boolean;
    tuberculosis: boolean;
  };
  endocrino_metabolico: {
    no_refiere: boolean;
    diabetes_tipo: string;
    hba1c: string;
    tiroides_hipo: boolean;
    tiroides_hiper: boolean;
    osteoporosis: boolean;
    osteoporosis_tratamiento: string;
  };
  neurologico_psiquiatrico: {
    no_refiere: boolean;
    epilepsia: boolean;
    alzheimer: boolean;
    ansiedad_depresion: boolean;
    medicamentos_psiquiatricos: boolean;
    medicamentos_psiquiatricos_detalle: string;
  };
  hematologico_inmunologico: {
    no_refiere: boolean;
    anemia: boolean;
    hemofilia: boolean;
    vih_sida: boolean;
    enfermedades_autoinmunes: boolean;
  };
  digestivo_hepatico: {
    no_refiere: boolean;
    reflujo: boolean;
    ulcera_gastrica: boolean;
    hepatitis: boolean;
    hepatitis_tipo: string;
  };
  renal: {
    no_refiere: boolean;
    insuficiencia_renal: boolean;
    insuficiencia_renal_etapa: string;
    dialisis: boolean;
  };
  alergias: {
    no_refiere: boolean;
    penicilina: boolean;
    sulfas: boolean;
    anestesicos_locales: boolean;
    anestesicos_locales_detalle: string;
    latex: boolean;
    alimentos: boolean;
    alimentos_detalle: string;
  };
  otros_relevantes: {
    no_refiere: boolean;
    cancer: boolean;
    cancer_tipo: string;
    embarazo_actual: boolean;
    embarazo_semanas: string;
    protesis_articulares: boolean;
    protesis_fecha_colocacion: string;
  };
};

export type HabitosData = {
  tabaco: 'nunca' | 'ex_fumador' | 'actual' | '';
  tabaco_actual_detalle: string;
  alcohol: 'ocasional' | 'frecuente' | 'no' | '';
  alcohol_frecuente_detalle: string;
  drogas_recreacionales: boolean;
  drogas_tipo: string;
};

export type ExamenClinicoData = {
  talla: string;
  peso: string;
  imc: string;
  pa: string;
};

export type SeguimientoRow = {
    id: number;
    fecha: string;
    procedimiento_realizado: string;
    observaciones: string;
    proxima_cita: string;
}

export type FormData = {
  filiacion: FiliacionData;
  antecedentes: AntecedentesData;
  habitos: HabitosData;
  examen_clinico: ExamenClinicoData;
  seguimiento: SeguimientoRow[];
};
