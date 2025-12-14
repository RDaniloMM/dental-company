import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Odontograma from "@/components/odontograma/OdontoPage";

export default async function OdontogramaPage({
  params,
  searchParams,
}: {
  params: Promise<{ numero_historia: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const numero_historia = resolvedParams?.numero_historia;

  if (!numero_historia) {
    notFound();
  }
  const supabase = await createClient();

  const { data: patient, error } = await supabase
    .from("pacientes")
    .select("id")
    .eq("numero_historia", numero_historia)
    .single();

  if (error || !patient) {
    notFound();
  }

  let backUrl: string | null = null;
  const resolvedSearchParams = await searchParams;
  
  if (resolvedSearchParams) {
    const sp = resolvedSearchParams;
    const fromParam = Array.isArray(sp.from) ? sp.from[0] : (sp.from as string | undefined);
    const casoParam = Array.isArray(sp.casoId) ? sp.casoId[0] : (sp.casoId as string | undefined);
    
    if (fromParam === 'detalles' && casoParam) {
      backUrl = `/admin/ficha-odontologica/${numero_historia}/casos/${casoParam}/seguimiento?action=crear`;
    }
  }

  return (
    <div className="w-full max-w-none">
      <Odontograma patientId={patient.id} backToSeguimientoUrl={backUrl} />
    </div>
  );
}