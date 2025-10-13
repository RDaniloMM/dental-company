"use client";

"use client";

import { useState, useEffect, use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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

function FichaOdontologicaContent({
  params,
}: {
  params: { numero_historia: string };
}) {
  const searchParams = useSearchParams();
  const activeView = searchParams.get("view") || "welcome";
  const [patient, setPatient] = useState<Partial<PatientData>>({});
  const supabase = createClient();

  useEffect(() => {
    const fetchPatient = async () => {
      const { data, error } = await supabase
        .from("pacientes")
        .select("*")
        .eq("numero_historia", params.numero_historia)
        .single();

      if (error) {
        console.error("Error fetching patient:", error);
      } else if (data) {
        setPatient(data);
      }
    };

    if (params.numero_historia) {
      fetchPatient();
    }
  }, [params.numero_historia, supabase]);

  const renderContent = () => {
    // La comprobación de patient.id asegura a TypeScript que patient.id existe en las ramas inferiores
    if (!patient.id) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <p>Cargando datos del paciente...</p>
        </div>
      );
    }

    switch (activeView) {
      case "filiacion":
        // patient aquí es de tipo PatientData (completo), no parcial
        return <FiliacionForm patient={patient as PatientData} />;
      case "historia-clinica":
        // patient.id está garantizado que existe por el chequeo anterior
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

export default function FichaOdontologicaPage({
  params,
}: {
  params: Promise<{ numero_historia: string }>;
}) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <FichaOdontologicaContent params={resolvedParams} />
    </Suspense>
  );
}
