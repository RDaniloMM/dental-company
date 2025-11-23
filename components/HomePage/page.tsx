// import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

import PatientSearch from "@/components/patient-search";

import CalendarHome from "@/components/calendar/CalendarHome";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: patients } = await supabase
    .from("pacientes")
    .select("id, nombres, apellidos, numero_historia");

  return (
    <>
      {/* Contenido principal */}
      <main className="h-full">
        <div className="grid grid-cols-3 grid-rows-[auto,1fr] gap-4 h-full">
          {/* Primera fila: 3 columnas */}
          <div className="rounded-lg border border-border bg-card p-4 sm:p-6 text-card-foreground">
            <h3 className="font-semibold text-base sm:text-lg">Resumen</h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Métricas y estado general.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 sm:p-6 text-card-foreground">
            <h3 className="font-semibold text-base sm:text-lg">
              Próximas citas
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Listado de próximas atenciones.
            </p>
          </div>

          <div>
            <PatientSearch patients={patients || []} />
          </div>

          {/* Segunda fila: 2 columnas */}
          <div className="col-span-3 h-auto bg-white p-6 rounded-lg shadow">
            {/* <CalendarSection showButton={true} /> */}
            <CalendarHome />
          </div>

          {/* <div className="rounded-lg border border-border bg-card p-4 sm:p-6 text-card-foreground h-full">
            <CalendarioCitas></CalendarioCitas>
          </div> */}
        </div>
      </main>
    </>
  );
}
{
  /* <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
          <Link
            href="/admin/ficha"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base text-white hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center sm:justify-start"
          >
            Ir a Ficha Odontológica
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4 sm:p-6 text-card-foreground">
            <h3 className="font-semibold text-base sm:text-lg">Resumen</h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Métricas y estado general.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 sm:p-6 text-card-foreground">
            <h3 className="font-semibold text-base sm:text-lg">
              Próximas citas
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Listado de próximas atenciones.
            </p>
          </div>
        </div>

        <hr className="my-8" />

        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          <PatientSearch patients={patients || []} />
        </div>
        <hr className="my-8" />
        <div>
          <CalendarSection showButton={true} />
        </div> */
}
