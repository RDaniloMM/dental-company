import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CasosList from "@/components/casos/CasosList";

interface CasosPageProps {
  params: Promise<{ numero_historia: string }>;
}

export default async function CasosPage({
  params: paramsPromise,
}: CasosPageProps) {
  const params = await paramsPromise;
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { data: paciente, error: pacienteError } = await supabase
    .from("pacientes")
    .select("id, numero_historia")
    .eq("numero_historia", params.numero_historia)
    .single();

  if (pacienteError || !paciente) {
    return (
      <div className='p-6 text-center text-red-500'>
        No se pudo encontrar al paciente o su historial.
      </div>
    );
  }

  // Buscar historia clínica existente
  const { data: historia, error: historiaError } = await supabase
    .from("historias_clinicas")
    .select("id")
    .eq("paciente_id", paciente.id)
    .single();

  // Si no existe, crear una nueva historia clínica automáticamente
  if (historiaError && historiaError.code === "PGRST116") {
    const { data: newHistoria, error: createError } = await supabase
      .from("historias_clinicas")
      .insert({ paciente_id: paciente.id })
      .select("id")
      .single();

    if (createError) {
      console.error("Error creando historia clínica:", createError);
      return (
        <div className='p-6 text-center text-red-500'>
          Error al crear la historia clínica del paciente.
        </div>
      );
    }
    historia = newHistoria;
  } else if (historiaError) {
    console.error("Error fetching historia clínica:", historiaError);
    return (
      <div className='p-6 text-center text-red-500'>
        Error al cargar la historia clínica del paciente.
      </div>
    );
  }

  if (!historia) {
    return (
      <div className='p-6 text-center text-red-500'>
        No se pudo obtener la historia clínica del paciente.
      </div>
    );
  }

  const { data: casos, error: casosError } = await supabase
    .from("casos_clinicos")
    .select(
      "id, nombre_caso, diagnostico_preliminar, descripcion, fecha_inicio, fecha_cierre, estado, citas(fecha_inicio)"
    )
    .eq("historia_id", historia.id)
    .order("fecha_inicio", { ascending: false });

  if (casosError) {
    console.error("Error fetching casos clínicos:", casosError);
    return (
      <div className='p-6 text-center text-red-500'>
        Error al cargar los casos clínicos.
      </div>
    );
  }

  const casosConUltimaCita = casos.map((caso) => {
    const ultimaCita = caso.citas
      ? caso.citas.reduce(
          (maxDate: string | null, cita: { fecha_inicio: string }) => {
            if (!maxDate) return cita.fecha_inicio;
            return new Date(cita.fecha_inicio) > new Date(maxDate)
              ? cita.fecha_inicio
              : maxDate;
          },
          null
        )
      : null;
    return {
      ...caso,
      ultima_cita: ultimaCita,
    };
  });

  return (
    <div className='w-full max-w-none'>
      <div className='rounded-lg border border-border bg-card'>
        <div className='bg-blue-500 dark:bg-blue-800 p-4 rounded-t-lg text-center'>
          <h2 className='text-2xl font-bold text-white'>
            Casos Clínicos del Paciente
          </h2>
        </div>
        <div className='p-4'>
          <CasosList
            casos={casosConUltimaCita}
            historiaId={historia.id}
            numeroHistoria={paciente.numero_historia}
          />
        </div>
      </div>
    </div>
  );
}
