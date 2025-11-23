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
    <div className="flex h-full">
      {/* Sección izquierda: 2/3 */}
      <section className="flex-[2] p-4 flex flex-col space-y-4 bg-white">
        <CalendarAgregar onCitaCreada={handleCitaCreada} />
        <div className="flex-1">
          <VistaCalendario calendarKey={calendarKey} />
        </div>
      </section>

      {/* Separator vertical */}
      <div className="w-px bg-gray-300"></div>

      {/* Sección derecha: 1/3 */}
      <section className="flex-[1] p-4 bg-white flex flex-col">
        <h3 className="text-xl font-semibold">Citas Futuras</h3>

        {/* Separator horizontal */}
        <div className="my-2 border-t border-gray-300"></div>

        <CalendarioCitas citas={citas} />

        {/* Puedes agregar otro separator debajo si quieres */}
      </section>
    </div>
  );
}
