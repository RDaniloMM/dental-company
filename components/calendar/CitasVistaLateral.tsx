"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Cita {
  id: string;
  paciente_id: string | null;
  odontologo_id: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  motivo?: string | null;
  costo_total?: number | null;
  moneda_id?: string | null;
  google_calendar_event_id?: string | null;
  notas?: string | null;
  created_at: string;
}

interface Paciente {
  id: string;
  nombres: string;
  apellidos: string;
}

interface Odontologo {
  id: string;
  nombre_completo: string;
}

interface Moneda {
  id: string;
  nombre: string;
}

interface Props {
  citas: Cita[];
}

export default function CalendarioCitas({ citas }: Props) {
  const supabase = createClient();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [odontologos, setOdontologos] = useState<Odontologo[]>([]);
  const [monedas, setMonedas] = useState<Moneda[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setConnected] = useState(false);

  // ✅ Envolver en useCallback
  const fetchData = useCallback(async () => {
    const [pacientesData, odontologosData, monedasData] = await Promise.all([
      supabase.from("pacientes").select("id,nombres,apellidos"),
      supabase.from("personal").select("id,nombre_completo"),
      supabase.from("monedas").select("id,nombre"),
    ]);

    if (pacientesData.data) setPacientes(pacientesData.data);
    if (odontologosData.data) setOdontologos(odontologosData.data);
    if (monedasData.data) setMonedas(monedasData.data);
    setLoading(false);
  }, [supabase]);

  const checkGoogle = useCallback(async () => {
    try {
      const res = await fetch("/api/calendar/create-event");
      const data = await res.json();
      setConnected(Boolean(data?.connected));
    } catch {
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    checkGoogle();
  }, [fetchData, checkGoogle]); // ✅ agregar las funciones como dependencias

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const citasMesActual = citas
    .filter((cita) => {
      const fecha = new Date(cita.fecha_inicio);
      return fecha.getMonth() === month && fecha.getFullYear() === year;
    })
    .sort(
      (a, b) =>
        new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime()
    );

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[55vh] mt-4">
        {loading && <p>Cargando citas...</p>}
        {!loading && citasMesActual.length === 0 && (
          <p>No hay citas registradas este mes.</p>
        )}
        {!loading &&
          citasMesActual.map((cita) => {
            const paciente = pacientes.find((p) => p.id === cita.paciente_id);
            const odontologo = odontologos.find(
              (o) => o.id === cita.odontologo_id
            );
            return (
              <div
                key={cita.id}
                className="w-full rounded-lg border border-border bg-card p-4 shadow"
              >
                <h4 className="font-semibold text-lg">
                  {cita.motivo || "Consulta odontológica"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(cita.fecha_inicio).toLocaleString()} -{" "}
                  {new Date(cita.fecha_fin).toLocaleString()}
                </p>
                {paciente && (
                  <p className="text-sm mt-1">
                    Paciente: {paciente.nombres} {paciente.apellidos}
                  </p>
                )}
                {odontologo && (
                  <p className="text-sm mt-1">
                    Odontólogo: {odontologo.nombre_completo}
                  </p>
                )}
                <p className="text-sm mt-1">
                  Estado: <span className="font-medium">{cita.estado}</span>
                </p>
                {/* {cita.motivo && (
                  <p className="text-sm mt-1">Motivo: {cita.motivo}</p>
                )} */}
                {cita.costo_total && (
                  <p className="text-sm mt-1">
                    Costo: {cita.costo_total}{" "}
                    {monedas.find((m) => m.id === cita.moneda_id)?.nombre ||
                      "USD"}
                  </p>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
