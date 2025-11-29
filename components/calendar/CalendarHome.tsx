// CalendarioHome.tsx
"use client";

import { useState } from "react";
import CalendarAgregar from "../../components/calendar/CalendarAgregar";
import VistaCalendario from "../../components/calendar/VistaCalendario";

export default function CalendarioHome() {
  const [calendarKey, setCalendarKey] = useState(0);

  const handleCitaCreada = () => {
    setCalendarKey((k) => k + 1);
  };

  return (
    <div className='flex flex-col h-full min-h-[inherit]'>
      {/* Sección calendario */}
      <section className='flex-1 p-0 sm:p-4 flex flex-col space-y-2 sm:space-y-4 bg-card text-card-foreground border-0 sm:border sm:border-border rounded-none sm:rounded-md'>
        <div className='px-2 sm:px-0'>
          <CalendarAgregar onCitaCreada={handleCitaCreada} />
        </div>
        <div className='flex-1 min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]'>
          <VistaCalendario calendarKey={calendarKey} />
        </div>
      </section>
    </div>
  );
}
