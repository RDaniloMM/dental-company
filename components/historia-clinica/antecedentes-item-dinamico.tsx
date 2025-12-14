"use client";

import React, { useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuestionConfig, AnswerValue, OptionConfig } from "./types";

interface AntecedenteItemProps {
  question: QuestionConfig;
  value: AnswerValue;
  onChange: (id: string, value: AnswerValue) => void;
  disabled?: boolean;
}

const AntecedenteItem: React.FC<AntecedenteItemProps> = ({
  question,
  value,
  onChange,
  disabled,
}) => {
  const isChecked = !!(
    (typeof value === "boolean" && value) ||
    (typeof value === "object" && value?.respuesta)
  );

  const handleCheckboxChange = useCallback((checked: boolean) => {
    if (question.type === "checkbox") {
      onChange(question.id, checked);
    } else {
      const newValue: AnswerValue = typeof value === "object" ? { ...value } : {};
      newValue.respuesta = checked;
      
      if (!checked) {
        newValue.texto = undefined;
        newValue.opciones = [];
        newValue.subFields = {};
      }
      onChange(question.id, newValue);
    }
  }, [question.id, question.type, value, onChange]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = typeof value === "object" ? { ...value } : { respuesta: true };
    newValue.texto = e.target.value;
    onChange(question.id, newValue);
  }, [question.id, value, onChange]);

  const handleOptionChange = useCallback((optionValue: string) => {
    const newValue = typeof value === "object" ? { ...value } : { respuesta: true };
    const currentOptions = newValue.opciones || [];
    const isSelected = currentOptions.includes(optionValue);

    if (question.isSingleSelect) {
      newValue.opciones = [optionValue];
    } else {
      if (isSelected) {
        newValue.opciones = currentOptions.filter((v) => v !== optionValue);
      } else {
        newValue.opciones = [...currentOptions, optionValue];
      }
    }
    
    if (newValue.opciones.length > 0) {
      newValue.respuesta = true;
    }

    onChange(question.id, newValue);
  }, [question.id, question.isSingleSelect, value, onChange]);

  const handleSubFieldChange = useCallback((subFieldId: string, subFieldValue: string) => {
    const newValue = typeof value === "object" ? { ...value } : { respuesta: true };
    if (!newValue.subFields) {
      newValue.subFields = {};
    }
    newValue.subFields[subFieldId] = subFieldValue;
    onChange(question.id, newValue);
  }, [question.id, value, onChange]);

  return (
    <div className="flex flex-col space-y-2 py-2 min-h-[2.5rem]">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 flex-shrink-0 w-48">
          <Checkbox
            id={question.id}
            checked={isChecked}
            onCheckedChange={handleCheckboxChange}
            disabled={disabled}
          />
          <Label htmlFor={question.id} className="font-medium text-foreground cursor-pointer">
            {question.text}
          </Label>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isChecked ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0"
        }`}
      >
        <div className="pl-8 space-y-3 pt-1">
          {question.conditionalTextInput && (
            <Input
              placeholder={question.placeholder}
              value={(typeof value === "object" && value?.texto) || ""}
              onChange={handleTextChange}
              disabled={disabled}
              className="w-full max-w-md h-8 text-sm"
            />
          )}

          {question.options && (
            <div className="space-y-2 pl-4 border-l-2 border-border ml-1">
              {question.options.map((option: OptionConfig) => {
                const isOptionSelected = !!(typeof value === "object" && value.opciones?.includes(option.value));
                
                return (
                  <div key={option.value} className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`${question.id}-${option.value}`}
                        checked={isOptionSelected}
                        onCheckedChange={() => handleOptionChange(option.value)}
                        disabled={disabled}
                      />
                      <Label htmlFor={`${question.id}-${option.value}`} className="text-sm font-medium cursor-pointer">
                        {option.label}
                      </Label>
                    </div>

                    {isOptionSelected && (
                      <div className="pl-7 space-y-2">
                        {option.conditionalTextInput && (
                          <Input
                            placeholder={option.placeholder}
                            value={(typeof value === "object" && value.subFields?.[option.value]) || ""}
                            onChange={(e) => handleSubFieldChange(option.value, e.target.value)}
                            disabled={disabled}
                            className="w-full max-w-sm h-7 text-sm"
                          />
                        )}

                        {option.subFields && (
                          <div className="flex flex-wrap gap-3 items-center">
                            {option.subFields.map((subField) => (
                              <div key={subField.id} className="flex items-center gap-2">
                                <Label 
                                  htmlFor={`${question.id}-${option.value}-${subField.id}`} 
                                  className="text-xs whitespace-nowrap text-muted-foreground"
                                >
                                  {subField.text}:
                                </Label>
                                <Input
                                  id={`${question.id}-${option.value}-${subField.id}`}
                                  type={subField.type}
                                  placeholder={subField.placeholder}
                                  value={(typeof value === "object" && value.subFields?.[subField.id]) || ""}
                                  onChange={(e) => handleSubFieldChange(subField.id, e.target.value)}
                                  disabled={disabled}
                                  className="w-24 h-7 text-sm"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(AntecedenteItem);