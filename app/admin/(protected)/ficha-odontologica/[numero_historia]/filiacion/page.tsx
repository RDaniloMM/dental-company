import { createClient } from "@/lib/supabase/server";
import FiliacionForm from "@/components/filiacion-form";
import { notFound } from "next/navigation";

export default async function FiliacionPage({
  params,
}: {
  params: { numero_historia: string };
}) {
  const supabase = await createClient();
  const { data: patient, error } = await supabase
    .from("pacientes")
    .select("*")
    .eq("numero_historia", params.numero_historia)
    .single();

  if (error || !patient) {
    notFound();
  }

  return <FiliacionForm patient={patient} />;
}
