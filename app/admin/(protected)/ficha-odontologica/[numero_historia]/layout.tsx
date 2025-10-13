import { redirect } from "next/navigation";
import HistoriaLayoutClient from "./layout-client";
import { createClient } from "@/lib/supabase/server";

export default async function HistoriaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ numero_historia: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { data: paciente, error } = await supabase
    .from("pacientes")
    .select("id")
    .eq("numero_historia", resolvedParams.numero_historia)
    .single();

  if (error || !paciente) {
    return (
      <div className="p-6 text-center text-red-500">
        No se pudo encontrar al paciente.
      </div>
    );
  }

  return (
    <HistoriaLayoutClient patientId={paciente.id}>
      {children}
    </HistoriaLayoutClient>
  );
}
