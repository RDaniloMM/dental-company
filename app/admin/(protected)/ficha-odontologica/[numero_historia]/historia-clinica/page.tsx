import React from 'react';
import { createClient } from "@/lib/supabase/server";
import { getAntecedentes } from "../actions";
import AntecedentesDinamicoForm from "@/components/historia-clinica/antecedentes-dinamico-form";

export default async function HistoriaClinicaPage({
  params,
}: {
  params: Promise<{ numero_historia: string }>;
}): Promise<JSX.Element> {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: paciente, error: pacienteError } = await supabase
    .from("pacientes")
    .select("id")
    .eq("numero_historia", resolvedParams.numero_historia)
    .single();

  if (pacienteError || !paciente) {
    console.error("Error fetching paciente for historia clinica:", pacienteError);
    return (
      <div className="p-6 text-center text-red-500">
        No se pudo cargar la historia clínica. Paciente no encontrado.
      </div>
    );
  }

  const { data: initialFormData, error: antecedentesError } = await getAntecedentes(paciente.id);

  if (antecedentesError) {
    console.error("Error fetching antecedentes data:", antecedentesError);
    return (
      <div className="p-6 text-center text-red-500">
        Error al cargar los antecedentes.
      </div>
    );
  }

  return (
    <div className="w-full max-w-none">
      <div className="rounded-lg border border-border bg-card">
        <div className="bg-blue-500 dark:bg-blue-800 p-4 rounded-t-lg text-center">
          <h2 className="text-2xl font-bold text-white">Antecedentes</h2>
        </div>
        <AntecedentesDinamicoForm
          historiaId={paciente.id}
          initialData={initialFormData || {}}
        />
      </div>
    </div>
  );
}
