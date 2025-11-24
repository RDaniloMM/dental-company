import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FichaOdontologicaContent from "./client-content";

type FichaOdontologicaPageProps = {
  params: Promise<{ numero_historia: string }>;
};

export default async function FichaOdontologicaPage({
  params,
}: FichaOdontologicaPageProps) {
  const resolvedParams = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/admin/login");
  }

  const { data: patient, error } = await supabase
    .from("pacientes")
    .select("id")
    .eq("numero_historia", resolvedParams.numero_historia)
    .single();

  if (error || !patient) {
    console.error("Patient not found:", error);
    return redirect("/admin/dashboard");
  }

  return (
    <div className="w-full h-full">
      <FichaOdontologicaContent patientId={patient.id} />
    </div>
  );
}
