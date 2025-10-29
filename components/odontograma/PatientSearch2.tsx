"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Patient = {
  id: string;
  nombres: string;
  apellidos: string;
  numero_historia: string;
};

type PatientSearchProps = {
  patients: Patient[];
  onSelectPaciente: (id: string) => void;
  selectedPaciente?: string;
};

export default function PatientSearch({
  patients,
  onSelectPaciente,
  selectedPaciente,
}: PatientSearchProps) {
  return (
    <div className="w-full max-w-sm">
      <Select value={selectedPaciente || ""} onValueChange={onSelectPaciente}>
        <SelectTrigger className="border px-2 py-1 rounded w-full">
          <SelectValue placeholder="Seleccione un paciente..." />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-auto">
          {patients.map((patient) => (
            <SelectItem key={patient.id} value={patient.id}>
              {patient.nombres} {patient.apellidos}
              {/* ({patient.numero_historia}) */}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
