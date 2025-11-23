import FichaSidebar from "@/components/ficha-sidebar";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import React from "react";

export default async function HistoriaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ numero_historia: string }>;
}) {
  const { numero_historia } = await params;
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
    <div className="grid grid-cols-[300px_1fr]  w-full bg-muted/40">
      {/* Sidebar */}
      <FichaSidebar patientId={patient.id} numeroHistoria={numero_historia} />

      {/* Contenido */}
      <div>{children}</div>
    </div>
  );
}
