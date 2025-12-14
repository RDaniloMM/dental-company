import { createClient } from "@/lib/supabase/server";
import { getAntecedentes } from "./actions";
import AntecedentesDinamicoForm from "@/components/historia-clinica/antecedentes-dinamico-form";
import { AlertCircle } from "lucide-react";

interface PageProps {
  params: Promise<{ numero_historia: string }>;
}

export default async function HistoriaClinicaPage({ params }: PageProps) {
  const { numero_historia } = await params;
  const supabase = await createClient();

  const { data: paciente, error: pacienteError } = await supabase
    .from("pacientes")
    .select("id")
    .eq("numero_historia", numero_historia)
    .single();

  if (pacienteError || !paciente) {
    return (
      <div className="w-full p-6 text-center text-red-600 border border-red-200 rounded-lg bg-red-50 flex flex-col items-center">
        <AlertCircle className="w-10 h-10 mb-2" />
        <h3 className="font-bold">Paciente no encontrado</h3>
      </div>
    );
  }

  const { data: initialFormData, error: antecedentesError } = await getAntecedentes(paciente.id);

  if (antecedentesError) {
    console.error("Error fetching antecedentes:", antecedentesError);
  }

  return (
    <div className="w-full max-w-none">
      <div className="rounded-lg border border-border bg-card">
        <div className="bg-blue-500 dark:bg-blue-800 p-4 rounded-t-lg text-center">
          <h2 className="text-2xl font-bold text-white">Antecedentes</h2>
        </div>
        
        <AntecedentesDinamicoForm
          historiaId={paciente.id} 
          pacienteId={paciente.id}
          initialData={initialFormData || {}}
        />
      </div>
    </div>
  );
}