// CalendarioHome.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import CalendarAgregar from "../../components/calendar/CalendarAgregar";
import VistaCalendario from "../../components/calendar/VistaCalendario";
import CalendarioCitas, { Cita } from "./CitasVistaLateral";
import { createClient } from "@/lib/supabase/client";

export default function CalendarioHome() {
  const supabase = createClient();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [calendarKey, setCalendarKey] = useState(0);

  const fetchCitas = useCallback(async () => {
    const { data, error } = await supabase
      .from("citas")
      .select("*")
      .order("fecha_inicio", { ascending: true });

    if (!error && data) {
      setCitas(data as Cita[]);
    } else if (error) {
      console.error("Error fetching citas:", error);
    }
  }, [supabase]);

  const handleCitaCreada = () => {
    setCalendarKey((k) => k + 1);
    fetchCitas();
  };

  useEffect(() => {
    fetchCitas();
  }, [fetchCitas]);
  return (
    <div className="flex flex-col lg:flex-row h-full gap-4">
      {/* Sección izquierda: calendario */}
      <section className="flex-1 lg:flex-[2] p-4 flex flex-col space-y-4 bg-card text-card-foreground border border-border rounded-md">
        <CalendarAgregar onCitaCreada={handleCitaCreada} />
        <div className="flex-1 min-h-[400px]">
          <VistaCalendario calendarKey={calendarKey} />
        </div>
      </section>

      {/* Sección derecha: citas futuras */}
      <section className="flex-1 lg:flex-[1] p-4 bg-card text-card-foreground border border-border rounded-md flex flex-col max-h-[500px] lg:max-h-none">
        <h3 className="text-xl text-center font-semibold">Citas Futuras</h3>

        {/* Separator horizontal */}
        <div className="my-2 border-t border-border" />

        <CalendarioCitas citas={citas} />
      </section>
    </div>
  );
}
