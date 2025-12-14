"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import flatpickr from "flatpickr";
import 'flatpickr/dist/flatpickr.min.css';
import { createClient } from "@/lib/supabase/client";

interface GoogleCalendarPageProps {
  onCitaCreada?: () => void;
}

interface Paciente {
  id: string;
  nombres: string;
  apellidos: string; // <--- agregado
}

interface Odontologo {
  id: string;
  nombre_completo: string;
}

interface Moneda {
  id: string;
  nombre: string;
}

interface CasoClinico {
  id: string;
  nombre_caso: string;
  historia_id: string;
  // Supabase puede devolver la relación como objeto único o como array
  historias_clinicas?: { paciente_id: string } | { paciente_id: string }[] | null;
}

type HistoriaClinicaRelation = { paciente_id: string };

export default function GoogleCalendarPage({
  onCitaCreada,
}: GoogleCalendarPageProps) {
  const [connected, setConnected] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [odontologos, setOdontologos] = useState<Odontologo[]>([]);
  const [monedas, setMonedas] = useState<Moneda[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [casosClinicosMap, setCasosClinicosMap] = useState<
    Map<string, CasoClinico[]>
  >(new Map());

  const supabase = createClient();

  // Cargar datos reales desde la base
  useEffect(() => {
    const fetchData = async () => {
      // Obtener usuario actual
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }

      const [pacientesData, odontologosData, monedasData, casosData] =
        await Promise.all([
          supabase.from("pacientes").select("id,nombres,apellidos"),
          supabase.from("personal").select("id,nombre_completo"),
          supabase.from("monedas").select("id,nombre"),
          supabase
            .from("casos_clinicos")
            .select("id,nombre_caso,historia_id,historias_clinicas(paciente_id)")
            .eq("estado", "Abierto"),
        ]);

      if (pacientesData.data) setPacientes(pacientesData.data);
      if (odontologosData.data) setOdontologos(odontologosData.data);
      if (monedasData.data) setMonedas(monedasData.data);

      // Agrupar casos por paciente_id (derivado de historias_clinicas)
      if (casosData.data) {
        const casosMap = new Map<string, CasoClinico[]>();
        (casosData.data as CasoClinico[]).forEach((caso) => {
          const hc = caso.historias_clinicas;
          const pacienteId = Array.isArray(hc)
            ? (hc[0] as HistoriaClinicaRelation | undefined)?.paciente_id
            : (hc as HistoriaClinicaRelation | undefined)?.paciente_id;
          if (!pacienteId) return;
          const existing = casosMap.get(pacienteId) || [];
          existing.push(caso as CasoClinico);
          casosMap.set(pacienteId, existing);
        });
        setCasosClinicosMap(casosMap);
      }
    };

    fetchData();
  }, [supabase]);

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
        .swal2-popup { border-radius: 16px !important; background: hsl(var(--card)) !important; color: hsl(var(--foreground)) !important; font-family: 'Inter', sans-serif; }
        .swal2-title { font-weight: 600; color: hsl(var(--foreground)); font-size: 1.4rem; }
        .swal2-html-container { color: hsl(var(--muted-foreground)) !important; }
        #calendar-form { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; text-align: left; }
        #calendar-form label { font-weight: 500; color: hsl(var(--foreground)); margin-bottom: 2px; }
        #calendar-form input, #calendar-form select, #calendar-form textarea { width: 100%; padding: 8px 10px; border: 1px solid hsl(var(--border)); border-radius: 8px; font-size: 0.95rem; background: hsl(var(--background)); color: hsl(var(--foreground)); }
        #calendar-form input:focus, #calendar-form select:focus, #calendar-form textarea:focus { border-color: hsl(var(--primary)); outline: none; box-shadow: 0 0 0 1px hsl(var(--primary)); }
        #caso_clinico_id { display: none; }
        #caso_wrapper { display: none; }
        
        /* SweetAlert2 Buttons */
        .swal2-confirm {
          background-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
        }
        .swal2-confirm:focus {
          box-shadow: 0 0 0 3px hsl(var(--ring)) !important;
        }
        .swal2-cancel {
          background-color: hsl(var(--muted)) !important;
          color: hsl(var(--muted-foreground)) !important;
        }
      </style>

      <form id="calendar-form">
        <label>Paciente:</label>
        <select id="paciente_id" required>
          <option value="">Seleccione...</option>
          ${pacientes
            .map(
              (p) =>
                `<option value="${p.id}">${p.nombres} ${p.apellidos}</option>`
            )
            .join("")}
        </select>

        <div id="caso_wrapper">
          <label>Caso Clínico (opcional):</label>
          <select id="caso_clinico_id">
            <option value="">Sin vincular a caso</option>
          </select>
        </div>

        <label>Odontólogo:</label>
        <select id="odontologo_id" required>
          <option value="">Seleccione...</option>
          ${odontologos
            .map(
              (o) =>
                `<option value="${o.id}"${
                  o.id === currentUserId ? " selected" : ""
                }>${o.nombre_completo}</option>`
            )
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
            <label>Duración:</label>
            <select id="duracion">
              <option value="15">15 min</option>
              <option value="20">20 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60" selected>1 hora</option>
              <option value="75">1h 15min</option>
              <option value="90">1h 30min</option>
              <option value="120">2 horas</option>
              <option value="150">2h 30min</option>
              <option value="180">3 horas</option>
            </select>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <label>Estado:</label>
            <select id="estado">
              <option value="Programada">Programada</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
          <div></div>
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

        // Manejar cambio de paciente para mostrar casos clínicos
        const pacienteSelect = document.getElementById(
          "paciente_id"
        ) as HTMLSelectElement;
        const casoSelect = document.getElementById(
          "caso_clinico_id"
        ) as HTMLSelectElement;
        const casoWrapper = document.getElementById(
          "caso_wrapper"
        ) as HTMLDivElement;

        pacienteSelect?.addEventListener("change", () => {
          const selectedPacienteId = pacienteSelect.value;
          const casos = casosClinicosMap.get(selectedPacienteId) || [];

          // Limpiar y actualizar opciones de casos
          casoSelect.innerHTML =
            '<option value="">Sin vincular a caso</option>';
          casos.forEach((caso) => {
            const option = document.createElement("option");
            option.value = caso.id;
            option.textContent = caso.nombre_caso;
            casoSelect.appendChild(option);
          });

          // Mostrar/ocultar el selector de casos
          if (casos.length > 0) {
            casoWrapper.style.display = "block";
            casoSelect.style.display = "block";
          } else {
            casoWrapper.style.display = "none";
            casoSelect.style.display = "none";
          }
        });
      },
      preConfirm: async () => {
        const get = (id: string) =>
          (document.getElementById(id) as HTMLInputElement)?.value;
        const data = {
          paciente_id: get("paciente_id"),
          odontologo_id: get("odontologo_id"),
          fecha_inicio: get("fecha_inicio"),
          duracion: get("duracion") || "60",
          estado: get("estado"),
          motivo: get("motivo"),
          notas: get("notas"),
          caso_id: get("caso_clinico_id") || null,
        };

        if (!data.paciente_id || !data.odontologo_id || !data.fecha_inicio) {
          Swal.showValidationMessage(
            "Por favor, complete todos los campos obligatorios."
          );
          return false;
        }

        const startDate = new Date(data.fecha_inicio);
        const duracionMin = parseInt(data.duracion);
        const endDate = new Date(startDate.getTime() + duracionMin * 60000); // duración seleccionada

        // Corregir zona horaria: convertir de hora local a UTC compensando el offset
        const offsetMs = startDate.getTimezoneOffset() * 60000;
        const startDateUTC = new Date(startDate.getTime() + offsetMs);
        const endDateUTC = new Date(endDate.getTime() + offsetMs);

        try {
          // Google Calendar
          const paciente = pacientes.find((p) => p.id === data.paciente_id);
          const odontologo = odontologos.find((o) => o.id === data.odontologo_id);
          
          const res = await fetch("/api/calendar/create-event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              summary: `Cita: ${paciente?.nombres} ${paciente?.apellidos} - ${odontologo?.nombre_completo}`,
              description: `Motivo: ${data.motivo || "Sin motivo"}\n\nNotas: ${data.notas || "Sin notas"}`,
              start: startDateUTC.toISOString(),
              end: endDateUTC.toISOString(),
            }),
          });
          const result = await res.json();
          if (!result.success)
            throw new Error(
              result.error || "Error creando evento en Google Calendar"
            );
          const googleEventId = result.eventId;

          // Supabase
          const { error: dbError } = await supabase.from("citas").insert([
            {
              paciente_id: data.paciente_id,
              odontologo_id: data.odontologo_id,
              fecha_inicio: startDateUTC.toISOString(),
              fecha_fin: endDateUTC.toISOString(),
              estado: data.estado,
              motivo: data.motivo,
              notas: data.notas,
              google_calendar_event_id: googleEventId,
              caso_id: data.caso_id,
            },
          ]);
          if (dbError) throw dbError;

          Swal.fire({
            icon: "success",
            title: "Cita registrada correctamente",
            showConfirmButton: false,
            timer: 1500,
          });
          if (onCitaCreada) onCitaCreada();
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Error al crear la cita",
            text: (err as Error).message || "Intente nuevamente.",
          });
        }
      },
    });
  };

  return (
    <main className='flex flex-col items-center w-full'>
      <section className='w-full flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='flex items-center gap-3'>
          <h3 className='font-semibold text-base sm:text-lg'>
            Agenda Odontológica
          </h3>

          {/* Badge de conexión */}
          <span
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium ${
              connected
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                connected ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            {connected ? "Conectado" : "Sin conexión"}
          </span>
        </div>

        <button
          onClick={openEventForm}
          disabled={!connected}
          className='px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:bg-muted disabled:text-muted-foreground'
        >
          Nueva cita
        </button>
      </section>
    </main>
  );
}
