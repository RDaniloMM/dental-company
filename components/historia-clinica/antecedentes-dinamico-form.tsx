"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import AntecedenteItem, { Question, AnswerValue } from "./antecedente-item-dinamico";
import { toast } from "sonner";
import { saveAntecedentes, getAntecedentesClient } from "@/app/admin/(protected)/ficha-odontologica/[numero_historia]/actions";
import LoadingDots from "@/components/ui/LoadingDots";

const questionsConfig: { [category: string]: Question[] } = {
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

export type CategoryState = {
  questions: { [questionId: string]: AnswerValue };
  noRefiereCategoria: boolean;
};

export type CuestionarioData = {
  [category: string]: CategoryState;
};

export default function AntecedentesDinamicoForm({
  historiaId,
  pacienteId,
  initialData,
}: {
  historiaId?: string;
  pacienteId?: string;
  initialData?: CuestionarioData;
}) {
  const createDefaultState = () => {
    const defaultState: CuestionarioData = {};
    for (const category in questionsConfig) {
      defaultState[category] = {
        questions: {},
        noRefiereCategoria: true,
      };
    }
    return defaultState;
  };

  const [actualHistoriaId, setActualHistoriaId] = useState<string | null>(historiaId || null);
  const [formData, setFormData] = useState<CuestionarioData>(
    initialData && Object.keys(initialData).length > 0 ? initialData : createDefaultState()
  );
  const [isLoading, setIsLoading] = useState(!initialData || !actualHistoriaId);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!actualHistoriaId && pacienteId) {
        setIsLoading(true);
        try {
          const { data: paciente, error: pacienteError } = await getAntecedentesClient(pacienteId);
          if (!pacienteError && paciente) {
            setActualHistoriaId(pacienteId);
          }
        } catch (err) {
          console.error("Error obtaining historia from paciente:", err);
        }
      }

      if (!initialData && actualHistoriaId) {
        setIsLoading(true);
        const { data, error } = await getAntecedentesClient(actualHistoriaId);
        if (error) {
          console.error("Error loading antecedentes:", error);
          toast.error("No se pudieron cargar los antecedentes.");
        } else if (data) {
          setFormData(data);
        }
        setIsLoading(false);
      }
    };

    loadData();
  }, [actualHistoriaId, initialData, pacienteId]);

  useEffect(() => {
    const handleAntecedenteUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<CuestionarioData>;
      if (customEvent.detail) {
        setFormData(customEvent.detail);
      }
    };

    window.addEventListener("antecedentes-updated", handleAntecedenteUpdate);
    return () => {
      window.removeEventListener("antecedentes-updated", handleAntecedenteUpdate);
    };
  }, []);

  const handleQuestionChange = useCallback(
    (category: string, questionId: string, value: AnswerValue) => {
      setFormData((prevData) => ({
        ...prevData,
        [category]: {
          ...(prevData[category] || { questions: {}, noRefiereCategoria: false }),
          questions: {
            ...(prevData[category]?.questions || {}),
            [questionId]: value,
          },
        },
      }));
    },
    []
  );

  const handleNoRefiereCategoriaChange = useCallback(
    (category: string, checked: boolean) => {
      setFormData((prevData) => {
        const newCategoryState: CategoryState = {
          ...(prevData[category] || { questions: {}, noRefiereCategoria: false }),
          noRefiereCategoria: checked,
        };
        if (checked) {
          newCategoryState.questions = {};
        }
        return {
          ...prevData,
          [category]: newCategoryState,
        };
      });
    },
    []
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSaving(true);

    let hasValidationErrors = false;
    const errorMessages: string[] = [];

    for (const category in questionsConfig) {
      const categoryState = formData[category];
      if (categoryState && !categoryState.noRefiereCategoria) {
        for (const question of questionsConfig[category]) {
          const answer = categoryState.questions[question.id];

          if (question.conditionalTextInput && typeof answer === 'object' && answer?.respuesta && !answer.texto) {
            errorMessages.push(`${category} • ${question.text}: se olvidó completar este campo`);
            hasValidationErrors = true;
          }

          if (question.options && typeof answer === 'object' && answer?.respuesta) {
            // Validar que al menos una opción esté seleccionada
            if (!answer.opciones || answer.opciones.length === 0) {
              errorMessages.push(`${category} • ${question.text}: seleccione al menos una opción`);
              hasValidationErrors = true;
            } else {
              for (const option of question.options) {
                if (answer.opciones.includes(option.value)) {
                  if (option.conditionalTextInput && !answer.subFields?.[option.value]) {
                    errorMessages.push(`${category} • ${option.label}: se olvidó completar este campo`);
                    hasValidationErrors = true;
                  }
                  if (option.subFields) {
                    for (const subField of option.subFields) {
                      if (!answer.subFields?.[subField.id]) {
                        errorMessages.push(`${category} • ${option.label} • ${subField.text}: se olvidó completar este campo`);
                        hasValidationErrors = true;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    if (hasValidationErrors) {
      setIsSaving(false);
      // Mostrar cada error como una notificación individual
      errorMessages.forEach((error) => {
        toast.warning(error, { 
          style: { backgroundColor: '#FFA500', color: 'white' },
          duration: 4000
        });
      });
      return;
    }

    const finalFormData = { ...formData };
    for (const category in questionsConfig) {
      const categoryState = finalFormData[category];
      if (categoryState && !categoryState.noRefiereCategoria) {
        let isCategoryEmpty = true;
        for (const question of questionsConfig[category]) {
          const answer = categoryState.questions[question.id];
          if (answer) {
            if (typeof answer === 'boolean' && answer) {
              isCategoryEmpty = false;
              break;
            }
            if (typeof answer === 'object' && answer.respuesta) {
              isCategoryEmpty = false;
              break;
            }
          }
        }
        if (isCategoryEmpty) {
          finalFormData[category] = {
            questions: {},
            noRefiereCategoria: true,
          };
        }
      }
    }

    const { data, error } = await saveAntecedentes(actualHistoriaId || pacienteId || "unknown", finalFormData);

    if (error) {
      console.error("Error al guardar antecedentes:", error);
      toast.error("Error al guardar antecedentes.", { style: { backgroundColor: '#FF0000', color: 'white' } }); // Rojo para error
    } else {
      toast.success("Antecedentes guardados correctamente.", { style: { backgroundColor: '#008000', color: 'white' } }); // Verde para éxito
      console.log("Antecedentes guardados:", data);
      try {
        window.dispatchEvent(new CustomEvent("antecedentes-updated", { detail: finalFormData }));
      } catch {
        // ignore if running in restricted env
      }
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return <div className="text-center p-8">Cargando antecedentes...</div>;
  }

  return (
    <CardContent className="pt-6">
      <form onSubmit={handleSubmit} className="space-y-8 text-gray-900 dark:text-gray-100">
        {Object.entries(questionsConfig).map(([category, questions]) => {
          const categoryState = formData[category] || { questions: {}, noRefiereCategoria: false };
          const isCategoryNoRefiere = categoryState.noRefiereCategoria === true;
          return (
            <div key={category} className="mb-8">
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex justify-between items-center mb-4 border-b pb-3 border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{category}</h3>
                    <div className="flex items-center space-x-2">
                    <Label htmlFor={`no-refiere-categoria-${category}`} className="text-sm text-gray-600 dark:text-gray-400">No Refiere</Label>
                    <Switch id={`no-refiere-categoria-${category}`} checked={isCategoryNoRefiere} onCheckedChange={(checked: boolean) => handleNoRefiereCategoriaChange(category, checked)} className="data-[state=checked]:bg-gray-900 data-[state=unchecked]:bg-gray-300 dark:data-[state=checked]:bg-gray-100 dark:data-[state=unchecked]:bg-gray-700" />
                  </div>
                </div>
                <div className={`transition-opacity duration-200 ${isCategoryNoRefiere ? "opacity-50" : ""}`}>
                  {questions.map((question) => (
                    <AntecedenteItem
                      key={question.id}
                      question={question}
                      value={categoryState.questions[question.id] || (question.type === "checkbox" ? false : {})}
                      onChange={(id: string, value: AnswerValue) => handleQuestionChange(category, id, value)}
                      disabled={isCategoryNoRefiere}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        <div className="flex justify-end">
          <Button type="submit">Guardar Cambios</Button>
        </div>
      </form>
      {isSaving && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
          <div className="bg-transparent p-2 rounded-md">
            <LoadingDots />
          </div>
        </div>
      )}
    </CardContent>
  );
}
