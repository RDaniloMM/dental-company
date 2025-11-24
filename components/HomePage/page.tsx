import { createClient } from "@/lib/supabase/server";
import CalendarHome from "@/components/calendar/CalendarHome";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: patients } = await supabase
    .from("pacientes")
    .select("id, nombres, apellidos, numero_historia");
  return (
    <>
      <main className="h-full">
        <div className="grid grid-cols-3 grid-rows-[auto,1fr] gap-4 h-full">
          <div className="rounded-lg border border-border bg-card p-4 sm:p-6 text-card-foreground">
            <h3 className="font-semibold text-base sm:text-lg">Resumen</h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Métricas y estado general.
            </p>
          </div>
          
          <div className="col-span-3 h-auto rounded-lg">
            <CalendarHome />
          </div>
        </div>
      </main>
    </>
  );
}