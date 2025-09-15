"use client";
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { EventApi } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";
import "./calendario.css";

const initialEvents = [
  {
    id: "1",
    title: "Cita: Limpieza",
    start: "2025-09-15T10:00:00",
    className: "fc-event-limpieza",
  },
  {
    id: "2",
    title: "Cita: Revisión",
    start: "2025-09-16T14:30:00",
    className: "fc-event-revision",
  },
  {
    id: "3",
    title: "Cita: Urgente",
    start: "2025-09-17T09:00:00",
    className: "fc-event-urgente",
  },
];

export default function CalendarioDemo() {
  const [events, setEvents] = useState(initialEvents);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);

  const handleDateClick = (arg: DateClickArg) => {
    const title = prompt("Nombre de la cita:");
    if (title) {
      let className = "fc-event-otros";
      const lower = title.toLowerCase();
      if (lower.includes("limpieza")) className = "fc-event-limpieza";
      else if (lower.includes("revisión")) className = "fc-event-revision";
      else if (lower.includes("urgente")) className = "fc-event-urgente";

      setEvents([
        ...events,
        { id: String(events.length + 1), title, start: arg.dateStr, className },
      ]);
    }
  };

  const handleEventClick = (arg: { event: EventApi }) => {
    setSelectedEvent(arg.event);
    setModalOpen(true);
  };

  const [modalClosing, setModalClosing] = useState(false);

  const closeModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      setModalClosing(false);
      setSelectedEvent(null);
    }, 250);
  };
  return (
    <section className='py-12 bg-gray-100'>
      <div className='max-w-6xl mx-auto px-4'>
        <h2 className='text-2xl font-bold mb-6 text-center text-indigo-600'>
          Calendario Médico/Odontológico
        </h2>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView='dayGridMonth'
          locales={[esLocale]}
          locale='es'
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          editable={true}
          selectable={true}
          height='70vh'
        />

        {modalOpen && selectedEvent && (
          <div
            className={`odont-modal-backdrop ${modalClosing ? "fadeOut" : ""}`}
            onClick={closeModal}
          >
            <div
              className={`odont-modal-content ${
                modalClosing ? "scaleOut" : ""
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className='odont-modal-title'>{selectedEvent.title}</h3>
              <p className='odont-modal-date'>
                Fecha:{" "}
                {selectedEvent.start?.toLocaleString() || "Fecha no disponible"}
              </p>
              <button
                className='odont-modal-close'
                onClick={closeModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
