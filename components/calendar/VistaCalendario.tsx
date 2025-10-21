"use client";

interface VistaCalendarioProps {
  calendarKey: number;
}

export default function VistaCalendario({ calendarKey }: VistaCalendarioProps) {
  return (
    <section className="w-full max-w-5xl bg-white rounded-xl shadow overflow-hidden">
      <iframe
        key={calendarKey}
        src="https://calendar.google.com/calendar/embed?src=534467c63a881f4bebb4a5aabe6923949a304991cd19d6cbacb07aa6b645c21f%40group.calendar.google.com&ctz=America%2FLima"
        width="100%"
        height="600"
        style={{ border: 0 }}
      ></iframe>
    </section>
  );
}
