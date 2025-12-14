"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, X } from "lucide-react";

interface Cita {
  id: string;
  paciente_id: string | null;
  odontologo_id: string | null;
  fecha_inicio: string;
  motivo?: string | null;
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

export default function CitasRecordatorio() {
  const supabase = createClient();
  const [proximaCita, setProximaCita] = useState<Cita | null>(null);
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [odontologo, setOdontologo] = useState<Odontologo | null>(null);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [proximoRecordatorio, setProximoRecordatorio] = useState<NodeJS.Timeout | null>(null);

  const buscarProximaCita = useCallback(async () => {
    try {
      const ahora = new Date();
      const hace5Min = new Date(ahora.getTime() - 5 * 60000); // tolerancia de reloj
      const proximos60Min = new Date(ahora.getTime() + 60 * 60000); // 60 min adelante

      const { data: citas } = await supabase
        .from("citas")
        .select("*")
        .is("deleted_at", null)
        .eq("estado", "Programada")
        .gte("fecha_inicio", hace5Min.toISOString())
        .lte("fecha_inicio", proximos60Min.toISOString())
        .order("fecha_inicio", { ascending: true })
        .limit(1);

      if (citas && citas.length > 0) {
        const cita = citas[0];
        setProximaCita(cita);

        // Obtener datos de paciente y odontólogo
        if (cita.paciente_id) {
          const { data: pacientesData } = await supabase
            .from("pacientes")
            .select("id, nombres, apellidos")
            .eq("id", cita.paciente_id)
            .single();
          if (pacientesData) setPaciente(pacientesData);
        }

        if (cita.odontologo_id) {
          const { data: odontologosData } = await supabase
            .from("personal")
            .select("id, nombre_completo")
            .eq("id", cita.odontologo_id)
            .single();
          if (odontologosData) setOdontologo(odontologosData);
        }

        // Determinar si debe mostrarse según recordatorio programado
        const claveProximo = `cita-recordatorio-next-${cita.id}`;
        const proximo = localStorage.getItem(claveProximo);
        const proximoDate = proximo ? new Date(proximo) : null;

        const yaPasoVentana = proximoDate ? ahora >= proximoDate : true;

        if (yaPasoVentana) {
          setMostrarAlerta(true);
        }
      }
    } catch (error) {
      console.error("Error buscando próxima cita:", error);
    }
  }, [supabase]);

  // Buscar cita al montar
  useEffect(() => {
    buscarProximaCita();

    // Buscar cada 1 minuto para respetar reaparición a los 10 min aunque se recargue
    const intervalo = setInterval(buscarProximaCita, 1 * 60000);
    return () => clearInterval(intervalo);
  }, [buscarProximaCita]);

  const handleConfirmar = async () => {
    if (!proximaCita) return;

    try {
      await supabase
        .from("citas")
        .update({ estado: "Confirmada" })
        .eq("id", proximaCita.id);

      setMostrarAlerta(false);
      setProximaCita(null);
      localStorage.removeItem(`cita-recordatorio-next-${proximaCita.id}`);
      // Buscar siguiente cita después de 2 segundos
      setTimeout(buscarProximaCita, 2000);
    } catch (error) {
      console.error("Error confirmando cita:", error);
    }
  };

  const handleRecordatorio = () => {
    // Esperar 10 minutos antes de mostrar el recordatorio nuevamente
    setMostrarAlerta(false);

    // Limpiar recordatorio anterior si existe
    if (proximoRecordatorio) {
      clearTimeout(proximoRecordatorio);
    }

    // Establecer nuevo recordatorio en 10 minutos
    const timeout = setTimeout(() => {
      if (proximaCita) {
        // Limpiar bloqueo para permitir mostrar de nuevo (persistente)
        localStorage.removeItem(`cita-recordatorio-next-${proximaCita.id}`);
        setMostrarAlerta(true);
      }
    }, 10 * 60000); // 10 minutos

    setProximoRecordatorio(timeout);

    // Persistir próximo recordatorio para que reaparezca aunque recargue
    if (proximaCita) {
      const siguiente = new Date(Date.now() + 10 * 60000).toISOString();
      localStorage.setItem(`cita-recordatorio-next-${proximaCita.id}`, siguiente);
    }
  };

  const handleCancelar = async () => {
    if (!proximaCita) return;

    try {
      await supabase
        .from("citas")
        .update({ estado: "Cancelada" })
        .eq("id", proximaCita.id);

      setMostrarAlerta(false);
      setProximaCita(null);
      localStorage.removeItem(`cita-recordatorio-next-${proximaCita.id}`);
      // Buscar siguiente cita después de 2 segundos
      setTimeout(buscarProximaCita, 2000);
    } catch (error) {
      console.error("Error cancelando cita:", error);
    }
  };

  if (!proximaCita) return null;

  const tiempoHasta = new Date(proximaCita.fecha_inicio).toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const nombrePaciente = paciente
    ? `${paciente.nombres} ${paciente.apellidos}`
    : "Paciente";

  const nombreOdontologo = odontologo ? odontologo.nombre_completo : "Odontólogo";

  return (
    <AlertDialog open={mostrarAlerta} onOpenChange={(open) => {
      setMostrarAlerta(open);
      if (!open && proximaCita) {
        localStorage.setItem(
          `cita-recordatorio-next-${proximaCita.id}`,
          new Date().toISOString()
        );
      }
    }}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <AlertDialogTitle>Recordatorio de Cita</AlertDialogTitle>
          </div>
        </AlertDialogHeader>

        {/* Contenido Principal */}
        <div className="space-y-3">
          {/* Información de Paciente y Médico */}
          <div>
            <p className="font-semibold text-foreground">
              {nombrePaciente}
            </p>
            <p className="text-sm text-muted-foreground">
              con <span className="font-medium">{nombreOdontologo}</span>
            </p>
          </div>

          {/* Detalles de la Cita */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm">
              <span className="font-bold text-blue-700">Hora: </span>
              <span className="text-blue-600">{tiempoHasta}</span>
            </p>
            {proximaCita.motivo && (
              <p className="text-sm text-blue-600 mt-1">
                <span className="font-bold">Motivo: </span>
                {proximaCita.motivo}
              </p>
            )}
          </div>

          {/* Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-md p-2">
            <p className="text-xs text-amber-700">
              <span className="font-semibold">💡 Tip:</span> El paciente no ha llegado
              aún. Puedes:
            </p>
            <ul className="text-xs text-amber-600 mt-1 space-y-1 ml-3">
              <li>✓ Confirmar si ya llegó</li>
              <li>✓ Esperar 10 minutos más</li>
              <li>✗ Cancelar si no vino</li>
            </ul>
          </div>
        </div>

        {/* Botones de Acción */}
        <AlertDialogFooter className="gap-2 sm:gap-2 flex flex-col sm:flex-row">
          <Button
            variant="destructive"
            onClick={handleCancelar}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>

          <Button
            variant="outline"
            onClick={handleRecordatorio}
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            +10 min
          </Button>

          <Button
            onClick={handleConfirmar}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            Confirmar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
