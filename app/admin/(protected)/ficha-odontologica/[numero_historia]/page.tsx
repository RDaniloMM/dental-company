"use client";

import { useState, useEffect, use } from "react";
import { createClient } from "@/lib/supabase/client";
import FiliacionForm from "@/components/filiacion-form";
import HistoriaClinicaForm from "@/components/historia-clinica-form";
import FichaSidebar from "@/components/ficha-sidebar";
import Image from "next/image";

// Definición local del tipo Paciente para evitar errores de linting
type PatientData = {
  id: string;
  apellidos: string;
  nombres: string;
  fecha_nacimiento: string;
  dni: string;
  direccion: string;
  genero: string;
  estado_civil: string;
  ocupacion: string;
  grado_instruccion: string;
  telefono: string;
  email: string;
  pais: string;
  departamento: string;
  provincia: string;
  distrito: string;
  contacto_emergencia: {
    nombre: string;
    parentesco: string;
    domicilio: string;
    telefono: string;
  };
  recomendado_por: string;
  observaciones: string;
};

export default function FichaOdontologicaPage({
  params,
}: {
  params: Promise<{ numero_historia: string }>;
}) {
  const resolvedParams = use(params);
  const [activeView, setActiveView] = useState("welcome");
  const [patient, setPatient] = useState<Partial<PatientData>>({});
  const supabase = createClient();

  useEffect(() => {
    const fetchPatient = async () => {
      const { data, error } = await supabase
        .from("pacientes")
        .select("*")
        .eq("numero_historia", resolvedParams.numero_historia)
        .single();

      if (error) {
        console.error("Error fetching patient:", error);
      } else {
        setPatient(data);
      }
    };

    if (resolvedParams.numero_historia) {
      fetchPatient();
    }
  }, [resolvedParams.numero_historia, supabase]);

  const renderContent = () => {
    if (!patient.id) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <p>Cargando datos del paciente...</p>
        </div>
      );
    }

    switch (activeView) {
      case "filiacion":
        return <FiliacionForm patient={patient} />;
      case "historia-clinica":
        return <HistoriaClinicaForm pacienteId={patient.id} />;
      default:
        return (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="text-center">
              <Image
                src="/logo.png"
                alt="Logo de la clínica dental"
                width={200}
                height={200}
                className="mx-auto mb-4"
              />
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                Tu sonrisa es nuestra sonrisa
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <FichaSidebar
        patientId={patient.id || ""}
        numeroHistoria={resolvedParams.numero_historia}
        onSelectView={setActiveView}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4">{renderContent()}</div>
      </main>
    </div>
  );
}
