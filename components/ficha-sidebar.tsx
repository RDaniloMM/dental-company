"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import {
  User,
  FileText,
  ClipboardList,
  Image,
  FolderKanban,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Patient = {
  id?: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  numero_historia: string;
};

const calculateAge = (birthDate: string) => {
  if (!birthDate) return null;
  const birthDateObj = new Date(birthDate + 'T00:00:00');
  const today = new Date();
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDifference = today.getMonth() - birthDateObj.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
};

const navItems = [
  { href: "filiacion", label: "Filiación", icon: User },
  { href: "historia-clinica", label: "Historia Clínica", icon: FileText },
  { href: "odontograma", label: "Odontograma", icon: ClipboardList },
  { href: "casos", label: "Casos Clínicos", icon: FolderKanban },
  { href: "imagenes", label: "Imágenes", icon: Image },
];

export default function FichaSidebar({
  patientId,
}: {
  patientId: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      const { data, error } = await supabase
        .from("pacientes")
        .select("id, nombres, apellidos, fecha_nacimiento, numero_historia")
        .eq("id", patientId)
        .single();

      if (error) {
        console.error("Error fetching patient:", JSON.stringify(error, null, 2));
      } else {
        setPatient(data);
        setAge(calculateAge(data.fecha_nacimiento));
      }
    };

    if (patientId) {
      fetchPatient();
    }
  }, [patientId, supabase]);
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const custom = e as CustomEvent;
        const updated = custom.detail as Patient | undefined;
        if (!updated) return;
        if ((updated.id && updated.id === patientId) || (updated.numero_historia && updated.numero_historia === patient?.numero_historia)) {
          setPatient(updated);
          setAge(calculateAge(updated.fecha_nacimiento));
        }
      } catch {
        // ignore malformed events
      }
    };

    window.addEventListener("paciente-updated", handler as EventListener);
    return () => window.removeEventListener("paciente-updated", handler as EventListener);
  }, [patientId, patient]);

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-background p-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold uppercase">
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
          const isActive = pathname.includes(item.href);
          return (
            <button
              key={item.href}
              onClick={() => {
                const pathSegments = pathname.split('/');
                if (pathSegments.length >= 4) {
                  const numeroHistoria = pathSegments[3];
                  router.push(`/admin/ficha-odontologica/${numeroHistoria}/${item.href}`);
                }
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-muted-foreground transition-all hover:text-primary",
                isActive &&
                  "bg-primary text-primary-foreground hover:text-primary-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
