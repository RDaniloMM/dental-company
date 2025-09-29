import FichaSidebar from "@/components/ficha-sidebar";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import React from "react";

export default async function HistoriaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { numero_historia: string };
}) {
  const { numero_historia } = params;
  const supabase = await createClient();
  
  // Buscar el paciente por número de historia
  const { data: patient, error } = await supabase
    .from("pacientes")
    .select("id")
    .eq("numero_historia", numero_historia)
    .single();

  if (error || !patient) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <FichaSidebar patientId={patient.id} numeroHistoria={numero_historia} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
}
