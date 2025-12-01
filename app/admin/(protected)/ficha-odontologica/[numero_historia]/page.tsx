import { createClient } from "@/lib/supabase/server";
import FichaOdontologicaContent from "./client-content";

export default async function FichaOdontologicaPage({ params }: { params: Promise<{ numero_historia: string }> }) {
  const { numero_historia } = await params;
  const supabase = await createClient();

  const { data: patient, error } = await supabase
    .from("pacientes")
    .select("id")
    .eq("numero_historia", numero_historia)
    .single();

  if (error || !patient) {
    console.error("Patient not found:", error);
    return (
      <div className="p-6 text-center text-red-500">No se pudo encontrar al paciente.</div>
    );
  }

  return (
    <div className="w-full h-full">
      <FichaOdontologicaContent patientId={patient.id} />
    </div>
  );
}