"use client";

import React from "react";

interface VistaCalendarioProps {
  calendarKey?: number;
  pacienteId?: string;
  casoId?: string;
}

export default function VistaCalendario({
  pacienteId,
  casoId,
  calendarKey, // <-- La recibimos
}: VistaCalendarioProps) {
  return (
    // Y la usamos aquí como una 'key'
    <section
      key={calendarKey} // <-- INICIO DE LA CORRECCIÓN
      className="w-full max-w-5xl bg-white rounded-xl shadow overflow-hidden p-4"
    >
    {/* ...el resto del código sigue igual... */}
      {pacienteId ? (
        <>
          <h3 className="text-lg font-semibold mb-2">Citas del Paciente</h3>
          <p className="text-muted-foreground mb-4">
            Mostrando citas para el Paciente ID: {pacienteId}
            {casoId && `, y filtrando por Caso ID: ${casoId}`}.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold mb-2">Calendario General de Citas</h3>
          <p className="text-muted-foreground mb-4">
            Vista general del calendario. Inicie sesión para ver detalles específicos.
          </p>
        </>
      )}

      <iframe
        src="https://calendar.google.com/calendar/embed?src=534467c63a881f4bebb4a5aabe6923949a304991cd19d6cbacb07aa6b645c21f%40group.calendar.google.com&ctz=America%2FLima"
        width="100%"
        height="600"
        style={{ border: 0 }}
        title="Google Calendar de Citas"
      ></iframe>
    </section>
  );
}