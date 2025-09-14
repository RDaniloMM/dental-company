"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const CheckboxWithInputVertical = ({
  label,
  checkboxName,
  checkboxValue,
  inputName,
  inputValue,
  placeholder,
  onCheckboxChange,
  onInputChange,
}: {
  label: string;
  checkboxName: string;
  checkboxValue: boolean;
  inputName: string;
  inputValue: string;
  placeholder: string;
  onCheckboxChange: (name: string, checked: boolean) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-2">
      <Checkbox
        id={checkboxName}
        name={checkboxName}
        checked={checkboxValue}
        onCheckedChange={(c) => onCheckboxChange(checkboxName, !!c)}
      />
      <Label htmlFor={checkboxName} className="flex-shrink-0">{label}</Label>
    </div>
    {checkboxValue && (
      <Input
        name={inputName}
        value={inputValue}
        onChange={onInputChange}
        placeholder={placeholder}
        className="h-8"
      />
    )}
  </div>
);
