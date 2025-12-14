export type SubFieldValue = string | number;

export type AnswerValue =
  | boolean
  | {
      respuesta?: boolean;
      texto?: string;
      opciones?: string[];
      subFields?: Record<string, SubFieldValue>;
    };

export type SubFieldConfig = {
  id: string;
  text: string;
  type: string;
  placeholder: string;
};

export type OptionConfig = {
  label: string;
  value: string;
  conditionalTextInput?: boolean;
  placeholder?: string;
  subFields?: SubFieldConfig[];
};

export type QuestionConfig = {
  id: string;
  text: string;
  type: "checkbox" | "checkbox-with-input";
  conditionalTextInput?: boolean;
  placeholder?: string;
  options?: OptionConfig[];
  isSingleSelect?: boolean;
};

export type AnnotationItem = {
  id: string;
  selection: string;
  detail: string;
};

export type CategoryState = {
  questions: Record<string, AnswerValue>;
  refiere: boolean; 
  annotationsEnabled: boolean;
  annotations: AnnotationItem[];
};

export type AntecedentesData = Record<string, CategoryState>;

export type CategoryConfig = {
  id: string;
  label: string;
  options: { label: string; value: string }[];
};