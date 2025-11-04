"use client";

import { useState, useEffect } from "react"; // Eliminar Suspense si no se usa
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // Importar createClient de cliente para Client Component
import FiliacionForm from "@/components/filiacion-form";
import HistoriaClinicaForm from "@/components/historia-clinica-form";
import ImageManager from "@/components/imagenes/ImageManager";
import Image from "next/image";

// Definición local del tipo Paciente
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

// Componente de cliente para el contenido de la ficha
export default function FichaOdontologicaContent({
  patientId,
}: {
  patientId: string;
}) {
  const searchParams = useSearchParams();
  const activeView = searchParams.get("view") || "welcome";
  const [patient, setPatient] = useState<PatientData | null>(null); // Cambiar a PatientData | null
  const supabase = createClient();

  useEffect(() => {
    const fetchPatient = async () => {
      const { data, error } = await supabase
        .from("pacientes")
        .select("*")
        .eq("id", patientId)
        .single();

      if (error) {
        console.error("Error fetching patient in FichaOdontologicaContent:", JSON.stringify(error, null, 2));
      } else if (data) {
        setPatient(data);
      }
    };

    if (patientId) {
      fetchPatient();
    }
  }, [patientId, supabase]); // Añadir supabase como dependencia

  const renderContent = () => {
    if (!patient) {
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
      case "imagenes":
        return <ImageManager pacienteId={patient.id} />;
      default:
        return (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="text-center">
              <Image
                src="/logo.png"
                alt="Logo de la clínica dental"
                width={200}
                height={200}
                className="mx-auto mb-4 h-auto"
                priority
              />
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                Tu sonrisa es nuestra sonrisa
              </p>
            </div>
          </div>
        );
    }
  };

  return <>{renderContent()}</>;
}
