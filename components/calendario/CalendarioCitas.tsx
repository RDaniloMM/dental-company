"use client";
import React, { useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import esLocale from "@fullcalendar/core/locales/es";
import { Tooltip } from "@heroui/react";
import "./calendario.css";

export default function CalendarioCitas() {
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;
  const calendarId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID!;

  const formatDate = (date: Date | null) =>
    date
      ? date.toLocaleString("es-PE", {
          weekday: "long",
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  return (
    <section className="py-12 bg-gray-100 relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          Calendario Médico/Odontológico
        </h2>
        <div className="relative z-20">
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              googleCalendarPlugin,
            ]}
            initialView="dayGridMonth"
            locales={[esLocale]}
            locale="es"
            height="70vh"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            buttonText={{
              today: "Hoy",
              month: "Mes",
            }}
            googleCalendarApiKey={googleApiKey}
            eventSources={[
              { googleCalendarId: calendarId, className: "fc-event-google" },
            ]}
            dayMaxEvents={2}
            dayCellClassNames={() => ["no-bg"]}
            moreLinkClick="popover"
            moreLinkContent={(args) => ({
              html: `<div 
                class="fc-more-popover rounded-lg overflow-hidden bg-white"
              >
                <button
                  type="button"
                  class="w-full text-left px-2 py-1 rounded-lg text-sm leading-tight truncate bg-indigo-50 hover:bg-indigo-100 hover:shadow-md transition-all border border-transparent hover:border-indigo-300"
                >
                  +${args.num} más
                </button>
              </div>`,
            })}
            eventDataTransform={(eventData) => {
              delete eventData.url;
              return eventData;
            }}
            eventClick={(info) => {
              info.jsEvent.preventDefault();
              info.jsEvent.stopPropagation();
            }}
            eventDidMount={(info) => {
              const el = info.el as HTMLElement;
              const link = el.querySelector("a");
              if (link) {
                link.removeAttribute("href");
                link.removeAttribute("target");
                link.style.pointerEvents = "none";
              }
            }}
            eventContent={(arg) => {
              const event = arg.event;
              const startTime = formatDate(event.start);
              const description =
                event.extendedProps.description || "Sin descripción disponible";

              return (
                <Tooltip
                  key={event.id}
                  content={
                    <div className="px-3 py-2 bg-white border border-indigo-400 rounded-lg shadow-lg text-sm text-gray-700 max-w-[220px]">
                      <p className="font-semibold text-indigo-600 mb-1">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500 mb-1">{startTime}</p>
                      <hr className="my-1 border-indigo-200" />
                      <p className="text-xs text-gray-700 line-clamp-4">
                        {description}
                      </p>
                    </div>
                  }
                  delay={0}
                  closeDelay={0}
                  placement="right"
                  showArrow
                >
                  <button
                    type="button"
                    className="w-full text-left px-2 py-1 text-sm leading-tight truncate rounded-md bg-indigo-50 hover:bg-indigo-100 hover:shadow-md transition-all border border-transparent hover:border-indigo-300"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <span className="font-medium text-indigo-700 truncate block">
                      {event.title}
                    </span>
                  </button>
                </Tooltip>
              );
            }}
          />
        </div>
      </div>
    </section>
  );
}
