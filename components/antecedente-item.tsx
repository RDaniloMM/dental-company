"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type AntecedenteItemProps = {
  titulo: string;
  opciones: string[];
  onChange: (data: { opciones: string[]; otros: string; noRefiere: boolean }) => void;
};

export default function AntecedenteItem({ titulo, opciones, onChange }: AntecedenteItemProps) {
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [otros, setOtros] = useState("");
  const [noRefiere, setNoRefiere] = useState(false);

  const handleCheckboxChange = (opcion: string) => {
    const nuevosSeleccionados = seleccionados.includes(opcion)
      ? seleccionados.filter((item) => item !== opcion)
      : [...seleccionados, opcion];
    setSeleccionados(nuevosSeleccionados);
    onChange({ opciones: nuevosSeleccionados, otros, noRefiere });
  };

  const handleOtrosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtros(e.target.value);
    onChange({ opciones: seleccionados, otros: e.target.value, noRefiere });
  };

  const handleNoRefiereChange = (checked: boolean) => {
    setNoRefiere(checked);
    if (checked) {
      setSeleccionados([]);
      setOtros("");
    }
    onChange({ opciones: [], otros: "", noRefiere: checked });
  };

  return (
    <div className="mb-4 rounded-md border p-4">
      <h4 className="mb-2 font-semibold">{titulo}</h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {opciones.map((opcion) => (
          <div key={opcion} className="flex items-center space-x-2">
            <Checkbox
              id={`${titulo}-${opcion}`}
              checked={seleccionados.includes(opcion)}
              onCheckedChange={() => handleCheckboxChange(opcion)}
              disabled={noRefiere}
            />
            <Label htmlFor={`${titulo}-${opcion}`}>{opcion}</Label>
          </div>
        ))}
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Otros"
            value={otros}
            onChange={handleOtrosChange}
            disabled={noRefiere}
          />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end space-x-2">
        <Label htmlFor={`switch-${titulo}`}>No Refiere</Label>
        <Switch
          id={`switch-${titulo}`}
          checked={noRefiere}
          onCheckedChange={handleNoRefiereChange}
        />
      </div>
    </div>
  );
}
