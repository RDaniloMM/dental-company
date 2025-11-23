import { createClient } from "@/lib/supabase/server";
// import FiliacionForm from "@/components/filiacion-form";
import { notFound } from "next/navigation";
import Odontograma from "@/components/odontograma/OdontoPage";

export default async function FiliacionPage({
  params,
}: {
  params: Promise<{ numero_historia: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: patient, error } = await supabase
    .from("pacientes")
    .select("*")
    .eq("numero_historia", resolvedParams.numero_historia)
    .single();

  if (error || !patient) {
    notFound();
  }

  return <Odontograma />;
}
