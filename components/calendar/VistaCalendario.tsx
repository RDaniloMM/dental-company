"use client";

import React from "react";

interface VistaCalendarioProps {
  calendarKey?: number;
  pacienteId?: string;
  casoId?: string;
}

export default function VistaCalendario(props: VistaCalendarioProps) {
  const { calendarKey } = props
  return (
    <section className='h-full w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] bg-white rounded-none sm:rounded-xl shadow-none sm:shadow overflow-hidden'>
      <iframe
        key={calendarKey}
        src='https://calendar.google.com/calendar/embed?src=58413af797c861e29361584a48b401453fcc2db58bcd7da9f8546e99f73832e6%40group.calendar.google.com&ctz=America%2FLima'
        className='w-full h-full min-h-[inherit]'
        style={{ border: 0 }}
        title="Google Calendar de Citas"
      ></iframe>
    </section>
  );
}