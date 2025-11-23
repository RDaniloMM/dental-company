import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Odontograma from "@/components/odontograma/OdontoPage";

export default async function FiliacionPage({
  params,
}: {
  params: Promise<{ numero_historia: string }>;
}) {
  const { numero_historia } = await params;
  const supabase = await createClient();

  const { data: patient, error } = await supabase
    .from("pacientes")
    .select("id")
    .eq("numero_historia", numero_historia)
    .single();

  if (error || !patient) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Odontograma patientId={patient.id} />
    </div>
  );
}
