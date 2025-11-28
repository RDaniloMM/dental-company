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
    <div className='flex flex-col lg:flex-row h-full gap-0 sm:gap-4'>
      {/* Sección izquierda: calendario */}
      <section className='flex-1 lg:flex-[2] p-0 sm:p-4 flex flex-col space-y-2 sm:space-y-4 bg-card text-card-foreground border-0 sm:border sm:border-border rounded-none sm:rounded-md min-h-0'>
        <div className='px-2 sm:px-0'>
          <CalendarAgregar onCitaCreada={handleCitaCreada} />
        </div>
        <div className='flex-1 min-h-0'>
          <VistaCalendario calendarKey={calendarKey} />
        </div>
      </section>

      {/* Sección derecha: citas futuras - oculta en móvil */}
      <section className='hidden lg:flex flex-none lg:flex-[1] p-4 bg-card text-card-foreground border border-border rounded-md flex-col h-auto'>
        <h3 className='text-xl text-center font-semibold'>Citas Futuras</h3>

        {/* Separator horizontal */}
        <div className='my-2 border-t border-border' />

        <CalendarioCitas citas={citas} />
      </section>
    </div>
  );
}
