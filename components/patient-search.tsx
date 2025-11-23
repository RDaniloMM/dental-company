"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Patient = {
  id: string;
  nombres: string;
  apellidos: string;
  numero_historia: string;
};

type PatientSearchProps = {
  patients: Patient[];
};

export default function PatientSearch({ patients }: PatientSearchProps) {
  const [selectedNumeroHistoria, setSelectedNumeroHistoria] = useState<
    string | null
  >(null);
  const router = useRouter();

  const handleGoToHistory = () => {
    if (selectedNumeroHistoria) {
      router.push(`/admin/ficha-odontologica/${selectedNumeroHistoria}`);
    }
  };

  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="font-semibold text-slate-800">Búsqueda de pacientes</h3>

      <div className="grid grid-cols-[1fr_auto] gap-2 mt-3 items-center">
        <Select onValueChange={setSelectedNumeroHistoria}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione un paciente..." />
          </SelectTrigger>
          <SelectContent>
            {patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.numero_historia}>
                {`${patient.nombres} ${patient.apellidos}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleGoToHistory} disabled={!selectedNumeroHistoria}>
          Ir a historia
        </Button>
      </div>
    </div>
  );
}
