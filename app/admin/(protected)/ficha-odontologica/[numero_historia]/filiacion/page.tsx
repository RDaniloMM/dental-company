import { createClient } from "@/lib/supabase/server";
import FiliacionForm from "@/components/filiacion/filiacion-form";
import { notFound } from "next/navigation";
import { AlertCircle } from "lucide-react";

interface FiliacionPageProps {
  params: Promise<{ numero_historia: string }>;
}

export default async function FiliacionPage({ params }: FiliacionPageProps) {
  const { numero_historia } = await params;
  const supabase = await createClient();
  
  const { data: patient, error } = await supabase
    .from("pacientes")
    .select("*")
    .eq("numero_historia", numero_historia)
    .single();

  if (error || !patient) {
    if (error && error.code !== "PGRST116") {
        return (
            <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 p-6 text-center text-red-600">
              <AlertCircle className="mb-2 h-10 w-10" />
              <h3 className="text-lg font-semibold">Error al cargar paciente</h3>
              <p className="text-sm">No se pudo recuperar la información de filiación.</p>
            </div>
        );
    }
    notFound();
  }

  return <FiliacionForm patient={patient} />;
}