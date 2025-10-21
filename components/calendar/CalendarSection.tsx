"use client";

import { useState } from "react";
import CitaBoton from "../../components/calendar/CitaBoton";
import VistaCalendario from "../../components/calendar/VistaCalendario";

interface CalendarSectionProps {
  showButton?: boolean;
}

export default function CalendarSection({
  showButton = true,
}: CalendarSectionProps) {
  const [calendarKey, setCalendarKey] = useState(0);

  const handleCitaCreada = () => {
    setCalendarKey((k) => k + 1);
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow space-y-4">
      {showButton && <CitaBoton onCitaCreada={handleCitaCreada} />}
      <VistaCalendario calendarKey={calendarKey} />
    </div>
  );
}
