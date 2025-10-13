"use client";

import React, { useCallback, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import esLocale from "@fullcalendar/core/locales/es";
import { Tooltip } from "@heroui/react";
import { createClient } from "@/lib/supabase/client";
import "./calendario.css";

interface Cita {
  id: string;
  nombre_cita: string;
  paciente: string;
  odontologo: string;
  especialidad: string;
  moneda: string;
  costo_total: number;
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string | null;
}
interface Paciente {
  id: string;
  nombres: string;
}

interface Odontologo {
  id: string;
  nombre_completo: string;
  especialidad?: string;
}
interface CitaDB {
  id: string;
  motivo: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  costo_total: number;
  nombre_cita: string;
  pacientes?: { nombres: string }[];
  personal?: { nombre_completo: string; especialidad: string }[];
  monedas?: { simbolo: string }[];
}

export default function CalendarioCitas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  //  Nuevos estados para listas
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [odontologos, setOdontologos] = useState<Odontologo[]>([]);
  //  Estado para nueva cita
  const [nuevaCita, setNuevaCita] = useState({
    nombre_cita: "",
    fecha_inicio: "",
    fecha_fin: "",
    costo_total: "",
    paciente_id: "",
    odontologo_id: "",
    motivo: "",
  });

  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;
  const calendarId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID!;
  const supabase = createClient();

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

  // 🔹 Obtener citas desde Supabase con useCallback
  const fetchCitas = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("citas").select(`
    id,
    motivo,
    fecha_inicio,
    fecha_fin,
    costo_total,
    nombre_cita,
    pacientes:paciente_id (nombres),
    personal:odontologo_id (nombre_completo, especialidad),
    monedas:moneda_id (simbolo)
  `);

    if (error) {
      console.error("Error cargando citas:", error);
      setLoading(false);
      return;
    }

    const citasFormateadas: Cita[] =
      (data as CitaDB[])?.map((cita) => ({
        id: cita.id,
        nombre_cita: cita.nombre_cita || cita.motivo || "Cita sin nombre",
        paciente: cita.pacientes?.[0]?.nombres || "",
        odontologo: cita.personal?.[0]?.nombre_completo || "",
        especialidad: cita.personal?.[0]?.especialidad || "General",
        moneda: cita.monedas?.[0]?.simbolo || "",
        costo_total: cita.costo_total || 0,
        fecha_inicio: cita.fecha_inicio,
        fecha_fin: cita.fecha_fin,
        motivo: cita.motivo,
      })) || [];

    setCitas(citasFormateadas);
    setLoading(false);
  }, [supabase]);

  // 🔹 Obtener listas de pacientes y odontólogos con useCallback
  const fetchListas = useCallback(async () => {
    const [{ data: pacientesData }, { data: odontologosData }] =
      await Promise.all([
        supabase.from("pacientes").select("id, nombres"),
        supabase.from("personal").select("id, nombre_completo"),
      ]);
    setPacientes(pacientesData || []);
    setOdontologos(odontologosData || []);
  }, [supabase]);

  // 🔹 Ejecutar ambas funciones cuando se monte el componente
  useEffect(() => {
    fetchCitas();
    fetchListas();
  }, [fetchCitas, fetchListas]);

  //  Insertar nueva cita en Supabase
  const handleGuardarCita = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      nombre_cita,
      fecha_inicio,
      fecha_fin,
      costo_total,
      paciente_id,
      odontologo_id,
    } = nuevaCita;

    const { error } = await supabase.from("citas").insert([
      {
        nombre_cita,
        fecha_inicio,
        fecha_fin,
        costo_total: Number(costo_total),
        paciente_id,
        odontologo_id,
        moneda_id: "b0601091-4bbb-47e0-81a3-76716e97d222",
        motivo: nuevaCita.motivo,
      },
    ]);

    if (error) {
      console.error("Error insertando cita:", error);
      alert("Error al crear la cita");
      return;
    }

    setShowModal(false);
    setNuevaCita({
      nombre_cita: "",
      fecha_inicio: "",
      fecha_fin: "",
      costo_total: "",
      paciente_id: "",
      odontologo_id: "",
      motivo: "",
    });
    fetchCitas();
  };

  //  Eventos de calendario
  const eventos = citas.map((cita) => ({
    id: cita.id,
    title: cita.nombre_cita,
    start: cita.fecha_inicio,
    end: cita.fecha_fin,
    extendedProps: {
      paciente: cita.paciente,
      odontologo: cita.odontologo,
      especialidad: cita.especialidad,
      costo: `${cita.moneda} ${cita.costo_total}`,
      motivo: cita.motivo,
    },
  }));

  return (
    <section className="py-12 bg-gray-100 relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-600">
            Calendario Médico/Odontológico
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            + Nueva cita
          </button>
        </div>
        {/* Próxima cita */}
        {loading ? (
          <p className="text-center text-gray-500 mb-4">Cargando citas...</p>
        ) : citas.length > 0 ? (
          <div>
            {/* <div className="bg-white shadow-md rounded-xl p-4 mb-6 border border-gray-200">
              <h3 className="font-semibold text-indigo-600 mb-2">
              Próxima cita:
            </h3>
            <p className="text-gray-700">
              <strong>Nombre:</strong> {citas[0].nombre_cita} <br />
              <strong>Motivo:</strong> {citas[0].motivo || "Sin motivo"} <br />
              <strong>Paciente:</strong> {citas[0].paciente} <br />
              <strong>Odontólogo:</strong> {citas[0].odontologo} (
              {citas[0].especialidad}) <br />
              <strong>Inicio:</strong>{" "}
              {formatDate(new Date(citas[0].fecha_inicio))} <br />
              <strong>Fin:</strong> {formatDate(new Date(citas[0].fecha_fin))}{" "}
              <br />
              <strong>Costo:</strong> {citas[0].moneda}
              {citas[0].costo_total}
            </p>
            <hr className="my-2 border-indigo-200" /> */}
          </div>
        ) : (
          <p className="text-center text-gray-500 mb-4">
            No hay citas registradas.
          </p>
        )}

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
            googleCalendarApiKey={googleApiKey}
            eventSources={[{ googleCalendarId: calendarId }]}
            dayMaxEvents={2}
            events={eventos}
            eventClick={(e) => e.jsEvent.preventDefault()}
            eventContent={(arg) => {
              const event = arg.event;
              const startTime = formatDate(event.start);
              const props = event.extendedProps;

              return (
                <Tooltip
                  key={event.id}
                  content={
                    <div className="px-3 py-2 bg-white border border-indigo-400 rounded-lg shadow-lg text-sm text-gray-700 max-w-[220px]">
                      <p className="font-semibold text-indigo-600 mb-1">
                        {props.paciente}
                      </p>
                      <p className="text-xs text-gray-500 mb-1">
                        {startTime} — {props.especialidad}
                      </p>
                      <hr className="my-1 border-indigo-200" />
                      <p className="text-xs text-gray-700">
                        <strong>Motivo:</strong> {props.motivo || "Sin motivo"}
                      </p>
                      <p className="text-xs text-gray-700">
                        <strong>Odontólogo:</strong> {props.odontologo}
                      </p>
                      <p className="text-xs text-indigo-700 mt-1 font-semibold">
                        {props.costo}
                      </p>
                    </div>
                  }
                  delay={100}
                  placement="right"
                  showArrow
                >
                  <button
                    type="button"
                    className="max-w-[115px] text-left px-2 py-1 text-sm leading-tight truncate rounded-md bg-indigo-50 hover:bg-indigo-100 hover:shadow-md transition-all"
                    onClick={(e) => e.preventDefault()}
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

      {/* 🔹 Modal para crear nueva cita */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold text-indigo-600 mb-4">
              Crear nueva cita
            </h3>

            <form onSubmit={handleGuardarCita}>
              {/* Nombre */}
              <div className="mb-3">
                <label className="block text-sm text-gray-700">
                  Nombre de cita
                </label>
                <input
                  type="text"
                  className="border rounded-lg w-full px-3 py-2 mt-1"
                  value={nuevaCita.nombre_cita}
                  onChange={(e) =>
                    setNuevaCita({ ...nuevaCita, nombre_cita: e.target.value })
                  }
                  required
                />
              </div>

              {/* Paciente */}
              <div className="mb-3">
                <label className="block text-sm text-gray-700">Paciente</label>
                <select
                  className="border rounded-lg w-full px-3 py-2 mt-1"
                  value={nuevaCita.paciente_id}
                  onChange={(e) =>
                    setNuevaCita({ ...nuevaCita, paciente_id: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar paciente</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombres}
                    </option>
                  ))}
                </select>
              </div>

              {/* Odontólogo */}
              <div className="mb-3">
                <label className="block text-sm text-gray-700">
                  Odontólogo
                </label>
                <select
                  className="border rounded-lg w-full px-3 py-2 mt-1"
                  value={nuevaCita.odontologo_id}
                  onChange={(e) =>
                    setNuevaCita({
                      ...nuevaCita,
                      odontologo_id: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Seleccionar odontólogo</option>
                  {odontologos.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.nombre_completo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fechas y costo */}
              <div className="mb-3">
                <label className="block text-sm text-gray-700">
                  Fecha inicio
                </label>
                <input
                  type="datetime-local"
                  className="border rounded-lg w-full px-3 py-2 mt-1"
                  value={nuevaCita.fecha_inicio}
                  onChange={(e) => {
                    const fechaInicio = e.target.value;
                    // 🔹 Si no hay fecha fin o el usuario no la ha modificado, se iguala
                    setNuevaCita((prev) => ({
                      ...prev,
                      fecha_inicio: fechaInicio,
                      fecha_fin: prev.fecha_fin || fechaInicio,
                    }));
                  }}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm text-gray-700">Fecha fin</label>
                <input
                  type="datetime-local"
                  className="border rounded-lg w-full px-3 py-2 mt-1"
                  value={nuevaCita.fecha_fin}
                  onChange={(e) =>
                    setNuevaCita({ ...nuevaCita, fecha_fin: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm text-gray-700">Costo</label>
                <input
                  type="number"
                  className="border rounded-lg w-full px-3 py-2 mt-1"
                  value={nuevaCita.costo_total}
                  onChange={(e) =>
                    setNuevaCita({ ...nuevaCita, costo_total: e.target.value })
                  }
                  required
                />
              </div>
              {/* Motivo */}
              <div className="mb-3">
                <label className="block text-sm text-gray-700">Motivo</label>
                <input
                  type="text"
                  className="border rounded-lg w-full px-3 py-2 mt-1"
                  value={nuevaCita.motivo}
                  onChange={(e) =>
                    setNuevaCita({ ...nuevaCita, motivo: e.target.value })
                  }
                  placeholder="Motivo de la cita (opcional)"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
