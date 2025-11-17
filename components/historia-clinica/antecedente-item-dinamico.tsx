"use client";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type AnswerValue =
  | boolean
  | {
      respuesta?: boolean;
      texto?: string;
      opciones?: string[];
      subFields?: { [key: string]: string | number };
      noRefiere?: boolean;
    };

export type Question = {
  id: string;
  text: string;
  type: "checkbox" | "checkbox-with-input";
  conditionalTextInput?: boolean;
  placeholder?: string;
  options?: {
    label: string;
    value: string;
    conditionalTextInput?: boolean;
    placeholder?: string;
    subFields?: { id: string; text: string; type: string; placeholder: string }[];
  }[];
};

type AntecedenteItemProps = {
  question: Question;
  value: AnswerValue;
  onChange: (id: string, value: AnswerValue) => void;
  disabled?: boolean;
};

const AntecedenteItem: React.FC<AntecedenteItemProps> = ({
  question,
  value,
  onChange,
  disabled,
}) => {
  const handleCheckboxChange = (checked: boolean) => {
    if (question.type === "checkbox") {
      onChange(question.id, checked);
    } else if (question.type === "checkbox-with-input") {
      const newValue = typeof value === "object" ? { ...value } : {};
      newValue.respuesta = checked;
      if (!checked) {
        newValue.texto = "";
        newValue.opciones = [];
        newValue.subFields = {};
      }
      onChange(question.id, newValue);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = typeof value === "object" ? { ...value } : {};
    newValue.texto = e.target.value;
    onChange(question.id, newValue);
  };

  const handleOptionChange = (optionValue: string) => {
    const newValue = typeof value === "object" ? { ...value } : {};
    const currentOptions = newValue.opciones || [];
    const isSelected = currentOptions.includes(optionValue);

    if (question.id === "tabaco" || question.id === "alcohol" || question.id === "drogas_recreacionales") {
      newValue.opciones = [optionValue];
    } else {
      if (isSelected) {
        newValue.opciones = currentOptions.filter((v) => v !== optionValue);
      } else {
        newValue.opciones = [...currentOptions, optionValue];
      }
    }
    onChange(question.id, newValue);
  };

  const handleSubFieldChange = (optionValue: string, subFieldId: string, subFieldValue: string) => {
    const newValue = typeof value === 'object' ? { ...value } : {};
    if (!newValue.subFields) {
      newValue.subFields = {};
    }
    newValue.subFields[subFieldId] = subFieldValue;
    onChange(question.id, newValue);
  };

  const isChecked = !!(
    (typeof value === "boolean" && value) ||
    (typeof value === "object" && value?.respuesta)
  );

  return (
    <div className="flex items-center space-x-4 py-2 min-h-[2.5rem]">
      <div className="flex items-center space-x-2 flex-shrink-0 w-48">
        <Checkbox
          id={question.id}
          checked={isChecked}
          onCheckedChange={handleCheckboxChange}
          disabled={disabled}
        />
        <Label htmlFor={question.id} className="font-medium text-gray-800 dark:text-gray-200">
          {question.text}
        </Label>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isChecked ? "opacity-100 max-h-96" : "opacity-0 max-h-0"
        }`}
        aria-hidden={!isChecked}
      >
        {isChecked && (
          <div className="pl-8 space-y-4">
            {question.conditionalTextInput && (
              <Input
                placeholder={question.placeholder}
                value={(typeof value === "object" && value?.texto) || ""}
                onChange={handleTextChange}
                disabled={disabled}
                className="w-64 h-7 px-2 py-1 text-sm bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md"
              />
            )}

            {question.options && (
              <div className="space-y-3 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                {question.options.map((option) => {
                  const isOptionSelected = !!(typeof value === 'object' && value.opciones?.includes(option.value));
                  return (
                    <div key={option.value} className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${question.id}-${option.value}`}
                          checked={isOptionSelected}
                          onCheckedChange={() => handleOptionChange(option.value)}
                          disabled={disabled}
                        />
                        <Label htmlFor={`${question.id}-${option.value}`} className="text-sm font-medium">
                          {option.label}
                        </Label>
                      </div>

                      {/* Inputs inline, aligned with checkbox */}
                      {isOptionSelected && option.conditionalTextInput && (
                        <Input
                          placeholder={option.placeholder}
                          value={(typeof value === "object" && value.subFields?.[option.value]) || ""}
                          onChange={(e) => handleSubFieldChange(option.value, option.value, e.target.value)}
                          disabled={disabled}
                          className="w-48 h-7 px-2 py-1 text-sm bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md"
                        />
                      )}

                      {isOptionSelected && option.subFields && (
                        <div className="flex items-center gap-3">
                          {option.subFields.map(subField => (
                            <div key={subField.id} className="flex items-center gap-2">
                              <Label htmlFor={`${question.id}-${option.value}-${subField.id}`} className="text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                {subField.text}:
                              </Label>
                              <Input
                                id={`${question.id}-${option.value}-${subField.id}`}
                                type={subField.type}
                                placeholder={subField.placeholder}
                                value={(typeof value === 'object' && value.subFields?.[subField.id]) || ''}
                                onChange={(e) => handleSubFieldChange(option.value, subField.id, e.target.value)}
                                disabled={disabled}
                                className="w-28 h-7 px-2 py-1 text-sm bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AntecedenteItem;
