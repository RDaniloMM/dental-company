"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const router = useRouter();

  const filteredPatients = useMemo(() => {
    if (!searchTerm) {
      return [];
    }
    return patients.filter(patient =>
      `${patient.nombres} ${patient.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, patients]);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchTerm(`${patient.nombres} ${patient.apellidos}`);
  };

  const handleGoToHistory = () => {
    if (selectedPatient) {
      router.push(`/admin/ficha-odontologica/${selectedPatient.numero_historia}`);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <label htmlFor="patient-search" className="font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">BÚSQUEDA AVANZADA:</label>
        <div className="relative w-full flex items-center">
          <Search className="absolute left-3 h-5 w-5 text-gray-400" />
          <Input
            id="patient-search"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedPatient(null);
            }}
            placeholder="Escriba el nombre del paciente..."
            className="w-full pl-10 bg-white dark:bg-gray-800 text-black dark:text-white"
            autoComplete="off"
          />
          {searchTerm && filteredPatients.length > 0 && (
            <div className="absolute z-10 w-full mt-1 top-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
              <ul>
                {filteredPatients.map((patient) => (
                  <li
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
                  >
                    {`${patient.nombres} ${patient.apellidos}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Button onClick={handleGoToHistory} disabled={!selectedPatient}>
          Ir a historia
        </Button>
      </div>
    </div>
  );
}
