"use client";

interface VistaCalendarioProps {
  calendarKey: number;
}

export default function VistaCalendario({ calendarKey }: VistaCalendarioProps) {
  return (
    <section className='h-full w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] bg-white rounded-none sm:rounded-xl shadow-none sm:shadow overflow-hidden'>
      <iframe
        key={calendarKey}
        src='https://calendar.google.com/calendar/embed?src=534467c63a881f4bebb4a5aabe6923949a304991cd19d6cbacb07aa6b645c21f%40group.calendar.google.com&ctz=America%2FLima'
        className='w-full h-full min-h-[inherit]'
        style={{ border: 0 }}
      ></iframe>
    </section>
  );
}
