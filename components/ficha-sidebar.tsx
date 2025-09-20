"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import {
  User,
  FileText,
  ClipboardList,
  Wallet,
  Stethoscope,
  MessageSquare,
  Image,
  PenSquare,
  FileSignature,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Patient = {
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  numero_historia: string;
};

// Función para calcular la edad
const calculateAge = (birthDate: string) => {
  if (!birthDate) return null;
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDifference = today.getMonth() - birthDateObj.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  return age;
};

const navItems = [
  { href: "filiacion", label: "Filiación", icon: User },
  { href: "historia-clinica", label: "Historia Clínica", icon: FileText },
  { href: "odontograma", label: "Odontograma", icon: ClipboardList },
  { href: "presupuesto", label: "Presupuesto", icon: Wallet },
  { href: "diagnostico", label: "Diagnóstico", icon: Stethoscope },
  { href: "evolucion", label: "Evolución", icon: MessageSquare },
  { href: "imagenes", label: "Imágenes", icon: Image },
  { href: "consentimiento", label: "Consentimiento", icon: FileSignature },
  { href: "recetas", label: "Recetas", icon: PenSquare },
];

export default function FichaSidebar({ 
  patientId, 
  numeroHistoria 
}: { 
  patientId: string; 
  numeroHistoria?: string; 
}) {
  const pathname = usePathname();
  const supabase = createClient();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      const { data, error } = await supabase
        .from("pacientes")
        .select("nombres, apellidos, fecha_nacimiento, numero_historia")
        .eq("id", patientId)
        .single();

      if (error) {
        console.error("Error fetching patient:", error);
      } else {
        setPatient(data);
        setAge(calculateAge(data.fecha_nacimiento));
      }
    };

    if (patientId) {
      fetchPatient();
    }
  }, [patientId, supabase]);

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-background p-4">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold uppercase">
          {patient ? `${patient.nombres} ${patient.apellidos}` : "Cargando..."}
        </h2>
        <p className="text-sm text-muted-foreground">
          {age !== null ? `${age} años` : ""}
        </p>
        <p className="text-sm text-muted-foreground">
          N° Historia: {patient ? patient.numero_historia : "..."}
        </p>
      </div>
      <hr className="my-4" />
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.includes(`/ficha-odontologica/${numeroHistoria}/${item.href}`);
          return (
            <Link
              key={item.href}
              href={`/admin/ficha-odontologica/${numeroHistoria}/${item.href}`}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-primary text-primary-foreground hover:text-primary-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
