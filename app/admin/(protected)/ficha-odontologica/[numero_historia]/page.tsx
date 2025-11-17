import { Suspense } from "react";
import { createClient as createServerClient } from "@/lib/supabase/server";
import FichaOdontologicaContent from "./client-content";

// --- INICIO DE LA CORRECCIÓN ---

// 1. Define una interfaz para las props de la página
interface FichaOdontologicaPageProps {
  params: Promise<{ numero_historia: string }>;
}

// Server Component para la página principal de la ficha odontológica
export default async function FichaOdontologicaPage({
  params: paramsPromise, // 2. Usa la interfaz y renombra la prop
}: FichaOdontologicaPageProps) {
  // 3. Espera la resolución de la promesa para obtener los parámetros
  const params = await paramsPromise;

// --- FIN DE LA CORRECCIÓN ---

  const supabase = await createServerClient();

  const { data: paciente, error: pacienteError } = await supabase
    .from("pacientes")
    .select("id")
    .eq("numero_historia", params.numero_historia) // 'params' ahora es el objeto resuelto
    .single();

  if (pacienteError || !paciente) {
    console.error("Error fetching patient in FichaOdontologicaPage:", JSON.stringify(pacienteError, null, 2));
    return (
      <div className="p-6 text-center text-red-500">
        No se pudo encontrar al paciente.
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Cargando contenido de la ficha...</div>}>
      <FichaOdontologicaContent patientId={paciente.id} />
    </Suspense>
  );
}