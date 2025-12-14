"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import LoadingDots from "@/components/ui/LoadingDots";

import AntecedenteItem from "./antecedentes-item-dinamico";
import { QUESTIONS_CONFIG, CATEGORIES_CONFIG } from "./constants";
import { AntecedentesData, CategoryState, AnswerValue } from "./types";
import { saveAntecedentes, getAntecedentesClient } from "@/app/admin/(protected)/ficha-odontologica/[numero_historia]/historia-clinica/actions";

interface AntecedentesDinamicoFormProps {
  historiaId?: string;
  pacienteId?: string;
  initialData?: AntecedentesData;
}

export default function AntecedentesDinamicoForm({
  historiaId,
  pacienteId,
  initialData,
}: AntecedentesDinamicoFormProps) {
  
  const createDefaultState = (): AntecedentesData => {
    const defaultState: AntecedentesData = {};
    for (const categoryId in QUESTIONS_CONFIG) {
      defaultState[categoryId] = {
        questions: {},
        refiere: false, 
        annotationsEnabled: false,
        annotations: [],
      };
    }
    return defaultState;
  };

  const [actualHistoriaId] = useState<string | null>(historiaId || null);
  const [formData, setFormData] = useState<AntecedentesData>(
    initialData && Object.keys(initialData).length > 0 ? initialData : createDefaultState()
  );
  const [isLoading, setIsLoading] = useState(!initialData || !actualHistoriaId);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!actualHistoriaId && pacienteId) {
        setIsLoading(true);
        try {
          const { data } = await getAntecedentesClient(pacienteId);
          if (data) setFormData(data);
        } catch (err) {
          console.error("Error loading data:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadData();
  }, [actualHistoriaId, initialData, pacienteId]);

  const handleQuestionChange = useCallback(
    (category: string, questionId: string, value: AnswerValue) => {
      setFormData((prev) => ({
        ...prev,
        [category]: {
          ...(prev[category] || { questions: {}, refiere: false, annotationsEnabled: false, annotations: [] }),
          questions: {
            ...(prev[category]?.questions || {}),
            [questionId]: value,
          },
        },
      }));
    },
    []
  );

  const handleRefiereChange = useCallback(
    (category: string, checked: boolean) => {
      setFormData((prev) => {
        const newState = {
          ...(prev[category] || { questions: {}, annotationsEnabled: false, annotations: [] }),
          refiere: checked,
        };
        if (!checked) {
          newState.questions = {};
        }
        return { ...prev, [category]: newState };
      });
    },
    []
  );

  const handleToggleAnnotations = useCallback((categoryId: string, isEnabled: boolean) => {
    setFormData((prev) => {
      const current = prev[categoryId];
      let newAnnotations = current.annotations;
      
      if (isEnabled && newAnnotations.length === 0) {
        newAnnotations = [{ id: crypto.randomUUID(), selection: "General", detail: "" }];
      }

      return {
        ...prev,
        [categoryId]: {
          ...current,
          annotationsEnabled: isEnabled,
          annotations: newAnnotations,
        },
      };
    });
  }, []);

  const handleAddAnnotationRow = useCallback((categoryId: string) => {
    setFormData((prev) => {
      const current = prev[categoryId];
      return {
        ...prev,
        [categoryId]: {
          ...current,
          annotations: [
            ...current.annotations,
            { id: crypto.randomUUID(), selection: "General", detail: "" },
          ],
        },
      };
    });
  }, []);

  const handleRemoveAnnotationRow = useCallback((categoryId: string, index: number) => {
    setFormData((prev) => {
      const current = prev[categoryId];
      const newAnnotations = [...current.annotations];

      if (index === 0 && newAnnotations.length === 1) {
        newAnnotations[0] = { ...newAnnotations[0], selection: "General", detail: "" };
      } else {
        newAnnotations.splice(index, 1);
      }

      return {
        ...prev,
        [categoryId]: {
          ...current,
          annotations: newAnnotations,
        },
      };
    });
  }, []);

  const handleAnnotationChange = useCallback((
    categoryId: string, 
    annotationId: string, 
    field: 'selection' | 'detail', 
    value: string
  ) => {
    setFormData((prev) => {
      const current = prev[categoryId];
      const newAnnotations = current.annotations.map((ann) => 
        ann.id === annotationId ? { ...ann, [field]: value } : ann
      );
      return {
        ...prev,
        [categoryId]: {
          ...current,
          annotations: newAnnotations,
        },
      };
    });
  }, []);

  const validateForm = (): string[] => {
    const errors: string[] = [];

    for (const category in QUESTIONS_CONFIG) {
      const categoryState = formData[category];
      if (categoryState && categoryState.refiere) {
        for (const question of QUESTIONS_CONFIG[category]) {
          const answer = categoryState.questions[question.id];
          if (question.conditionalTextInput && typeof answer === "object" && answer?.respuesta && !answer.texto) {
            errors.push(`${category} • ${question.text}: complete la información requerida`);
          }
          if (question.options && typeof answer === "object" && answer?.respuesta) {
            if (!answer.opciones || answer.opciones.length === 0) {
              errors.push(`${category} • ${question.text}: seleccione al menos una opción`);
            } else {
              for (const option of question.options) {
                if (answer.opciones.includes(option.value)) {
                  if (option.conditionalTextInput && !answer.subFields?.[option.value]) {
                    errors.push(`${category} • ${option.label}: especifique el detalle`);
                  }
                  if (option.subFields) {
                    for (const subField of option.subFields) {
                      if (!answer.subFields?.[subField.id]) {
                        errors.push(`${category} • ${option.label} • ${subField.text}: campo requerido`);
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
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach((msg) => toast.warning(msg));
      setIsSaving(false);
      return;
    }

    const cleanedData: AntecedentesData = { ...formData };

    Object.keys(cleanedData).forEach((catId) => {
      const catState = cleanedData[catId];
      const validAnnotations = catState.annotations.filter(ann => ann.detail.trim() !== "");
      const hasQuestionsAnswered = Object.values(catState.questions).some(val => 
        (typeof val === 'boolean' && val) || (typeof val === 'object' && val.respuesta)
      );
      const hasAnnotations = catState.annotationsEnabled && validAnnotations.length > 0;

      if (catState.refiere && !hasQuestionsAnswered && !hasAnnotations) {
        cleanedData[catId] = {
          ...catState,
          refiere: false,
          questions: {},
          annotationsEnabled: false,
          annotations: [],
        };
      } else {
        if (catState.annotationsEnabled && validAnnotations.length > 0) {
          cleanedData[catId] = {
            ...cleanedData[catId],
            annotationsEnabled: true,
            annotations: validAnnotations,
          };
        } else {
          cleanedData[catId] = {
            ...cleanedData[catId],
            annotationsEnabled: false,
            annotations: [], 
          };
        }
      }
    });

    const targetId = pacienteId || "unknown";
    const { error } = await saveAntecedentes(targetId, cleanedData);

    if (error) {
      toast.error("Error al guardar antecedentes.");
    } else {
      toast.success("Antecedentes guardados correctamente.");
      setFormData(cleanedData);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <LoadingDots />
      </div>
    );
  }

  return (
    <CardContent className="pt-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {Object.entries(QUESTIONS_CONFIG).map(([category, questions]) => {
          const categoryState = formData[category] || { 
            questions: {}, 
            refiere: false, 
            annotationsEnabled: false, 
            annotations: [] 
          };
          const config = CATEGORIES_CONFIG[category] || { label: category, options: [] };
          
          return (
            <div key={category} className="mb-6 rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-2">
                <h3 className="text-lg font-bold text-foreground">{category}</h3>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Label 
                      htmlFor={`switch-annotations-${category}`} 
                      className={`text-sm font-medium cursor-pointer ${categoryState.annotationsEnabled ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      Anotaciones
                    </Label>
                    <Switch
                      id={`switch-annotations-${category}`}
                      checked={categoryState.annotationsEnabled}
                      onCheckedChange={(checked) => handleToggleAnnotations(category, checked)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Label 
                      htmlFor={`switch-refiere-${category}`} 
                      className={`text-sm font-medium cursor-pointer ${categoryState.refiere ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                      Refiere
                    </Label>
                    <Switch
                      id={`switch-refiere-${category}`}
                      checked={categoryState.refiere}
                      onCheckedChange={(checked) => handleRefiereChange(category, checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border mb-4"></div>

              <div className={`transition-opacity duration-200 ${!categoryState.refiere ? "opacity-50 pointer-events-none" : ""}`}>
                {questions.map((question) => (
                  <AntecedenteItem
                    key={question.id}
                    question={question}
                    value={categoryState.questions[question.id] || (question.type === "checkbox" ? false : {})}
                    onChange={(id, value) => handleQuestionChange(category, id, value)}
                    disabled={!categoryState.refiere}
                  />
                ))}
              </div>

              {categoryState.annotationsEnabled && (
                <>
                  <div className="border-t border-border my-4"></div>
                  
                  <div className="space-y-3 pt-2">
                    {categoryState.annotations.map((annotation, index) => (
                      <div key={annotation.id} className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="w-48 shrink-0">
                          <Select
                            value={annotation.selection}
                            onValueChange={(val) => handleAnnotationChange(category, annotation.id, 'selection', val)}
                          >
                            <SelectTrigger className="h-9 rounded-full border-input bg-background px-4 text-sm shadow-sm hover:bg-accent hover:text-accent-foreground">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {config.options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Input
                          value={annotation.detail}
                          onChange={(e) => handleAnnotationChange(category, annotation.id, 'detail', e.target.value)}
                          placeholder="Especifique detalles..."
                          className="h-9 flex-1 bg-background text-sm"
                        />

                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                            onClick={() => handleAddAnnotationRow(category)}
                            title="Agregar otra anotación"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                            onClick={() => handleRemoveAnnotationRow(category, index)}
                            title={index === 0 && categoryState.annotations.length === 1 ? "Limpiar campos" : "Eliminar fila"}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
        
        <div className="flex justify-end pt-4 sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 border-t border-border -mx-6 -mb-6 mt-8 rounded-b-lg">
          <Button type="submit" disabled={isSaving} className="min-w-[150px] shadow-md">
            {isSaving ? <LoadingDots /> : "Guardar Antecedentes"}
          </Button>
        </div>
      </form>
    </CardContent>
  );
}