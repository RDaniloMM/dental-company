"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

interface GoogleCalendarPageProps {
  onCitaCreada?: () => void;
}

export default function GoogleCalendarPage({
  onCitaCreada,
}: GoogleCalendarPageProps) {
  const [connected, setConnected] = useState(false);

  // Datos simulados (temporal)
  const pacientes = [
    { id: "p1", nombre: "Juan Pérez" },
    { id: "p2", nombre: "María López" },
  ];

  const odontologos = [
    { id: "o1", nombre: "Dr. Luis Martínez" },
    { id: "o2", nombre: "Dra. Ana Torres" },
  ];

  const monedas = [
    { id: "m1", nombre: "Soles (PEN)" },
    { id: "m2", nombre: "Dólares (USD)" },
  ];

  // Verificar conexión con Google Calendar
  useEffect(() => {
    fetch("/api/calendar/create-event")
      .then((res) => res.json())
      .then((data) => setConnected(Boolean(data?.connected)))
      .catch(() => setConnected(false));
  }, []);

  const openEventForm = () => {
    Swal.fire({
      title: "Registrar nueva cita",
      width: "auto",
      html: `
        <style>
          .swal2-popup { border-radius: 16px !important; background: #f9fafb !important; font-family: 'Inter', sans-serif; }
          .swal2-title { font-weight: 600; color: #1f2937; font-size: 1.4rem; }
          #calendar-form { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; text-align: left; }
          #calendar-form label { font-weight: 500; color: #374151; margin-bottom: 2px; }
          #calendar-form input, #calendar-form select, #calendar-form textarea { width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.95rem; background: #fff; }
          #calendar-form input:focus, #calendar-form select:focus, #calendar-form textarea:focus { border-color: #3b82f6; outline: none; box-shadow: 0 0 0 1px #3b82f6; }
          .swal2-confirm, .swal2-cancel { border-radius: 8px !important; padding: 8px 20px !important; font-size: 0.95rem !important; font-weight: 500 !important; }
          .swal2-confirm { background-color: #2563eb !important; }
          .swal2-cancel { background-color: #9ca3af !important; }
        </style>

        <form id="calendar-form">
          <label>Paciente:</label>
          <select id="paciente_id" required>
            <option value="">Seleccione...</option>
            ${pacientes
              .map((p) => `<option value="${p.id}">${p.nombre}</option>`)
              .join("")}
          </select>

          <label>Odontólogo:</label>
          <select id="odontologo_id" required>
            <option value="">Seleccione...</option>
            ${odontologos
              .map((o) => `<option value="${o.id}">${o.nombre}</option>`)
              .join("")}
          </select>

          <label>Motivo de la cita:</label>
          <textarea id="motivo" placeholder="Ej. Limpieza, control, etc."></textarea>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <label>Inicio:</label>
              <input id="fecha_inicio" placeholder="Selecciona fecha y hora" required>
            </div>
            <div>
              <label>Fin:</label>
              <input id="fecha_fin" placeholder="Selecciona fecha y hora" required>
            </div>
          </div>

          <label>Estado:</label>
          <select id="estado">
            <option value="Programada">Programada</option>
            <option value="Confirmada">Confirmada</option>
            <option value="Cancelada">Cancelada</option>
          </select>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <label>Moneda:</label>
              <select id="moneda_id">
                <option value="">Seleccione...</option>
                ${monedas
                  .map((m) => `<option value="${m.id}">${m.nombre}</option>`)
                  .join("")}
              </select>
            </div>
            <div>
              <label>Costo total:</label>
              <input id="costo_total" type="number" step="0.01" placeholder="Monto en números">
            </div>
            
          </div>

          <label>Notas adicionales:</label>
          <textarea id="notas" placeholder="Agregar observaciones si es necesario"></textarea>
        </form>
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Guardar cita",
      reverseButtons: true,
      didOpen: () => {
        flatpickr("#fecha_inicio", {
          enableTime: true,
          dateFormat: "Y-m-d h:i K",
          minDate: "today",
          time_24hr: false,
        });
        flatpickr("#fecha_fin", {
          enableTime: true,
          dateFormat: "Y-m-d h:i K",
          minDate: "today",
          time_24hr: false,
        });
      },
      preConfirm: async () => {
        const get = (id: string) =>
          (document.getElementById(id) as HTMLInputElement)?.value;
        const data = {
          paciente_id: get("paciente_id"),
          odontologo_id: get("odontologo_id"),
          fecha_inicio: get("fecha_inicio"),
          fecha_fin: get("fecha_fin"),
          estado: get("estado"),
          motivo: get("motivo"),
          costo_total: get("costo_total"),
          moneda_id: get("moneda_id"),
          notas: get("notas"),
        };

        if (
          !data.paciente_id ||
          !data.odontologo_id ||
          !data.fecha_inicio ||
          !data.fecha_fin
        ) {
          Swal.showValidationMessage(
            "Por favor, complete todos los campos obligatorios."
          );
          return false;
        }

        const startDate = new Date(data.fecha_inicio);
        const endDate = new Date(data.fecha_fin);
        if (endDate <= startDate) {
          Swal.showValidationMessage(
            "La hora de fin debe ser posterior a la de inicio."
          );
          return false;
        }

        try {
          const res = await fetch("/api/calendar/create-event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              summary: `Cita: ${data.motivo || "Consulta odontológica"}`,
              description: `Paciente: ${
                pacientes.find((p) => p.id === data.paciente_id)?.nombre
              }\nOdontólogo: ${
                odontologos.find((o) => o.id === data.odontologo_id)?.nombre
              }\nNotas: ${data.notas || "Sin notas"}`,
              start: startDate.toISOString(),
              end: endDate.toISOString(),
            }),
          });

          const result = await res.json();
          if (result.success) {
            Swal.fire({
              icon: "success",
              title: "Cita registrada correctamente",
              showConfirmButton: false,
              timer: 1500,
            });
            if (onCitaCreada) onCitaCreada();
          } else {
            Swal.fire({
              icon: "error",
              title: "Error al crear la cita",
              text: result.error || "Intente nuevamente.",
            });
          }
        } catch {
          Swal.fire({
            icon: "error",
            title: "Error de conexión con el servidor",
          });
        }
      },
    });
  };

  return (
    <main className="flex flex-col items-center ">
      <section className="w-full max-w-4xl bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Agenda Odontológica
          </h1>
          <p className="text-sm text-gray-600">
            Sincronizada con Google Calendar
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div
              className={`w-3 h-3 rounded-full ${
                connected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-gray-700 text-sm">
              {connected ? "Conectado" : "Sin conexión"}
            </span>
          </div>
        </div>
        <button
          onClick={openEventForm}
          disabled={!connected}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          Nueva cita
        </button>
      </section>
    </main>
  );
}
