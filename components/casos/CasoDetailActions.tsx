"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, XCircle } from "lucide-react";
import CasoFormModal from "./CasoFormModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner'
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type CasoDetailActionsProps = {
  caso: {
    id: string;
    nombre_caso: string;
    diagnostico_preliminar: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_cierre: string | null;
    estado: "Abierto" | "En progreso" | "Cerrado";
  };
  numeroHistoria: string;
};

export default function CasoDetailActions({
  caso,
  numeroHistoria,
  showBack = true,
}: CasoDetailActionsProps & { showBack?: boolean }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const [userRole, setUserRole] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserRole(session.user?.user_metadata?.role || null);
      }
    };
    fetchUserRole();
  }, [supabase.auth]);

  const canEdit = userRole === "odontologo" || userRole === "admin";

  type CasoUpdatePayload = {
    nombre_caso?: string;
    diagnostico_preliminar?: string;
    descripcion?: string;
    estado?: "Abierto" | "En progreso" | "Cerrado";
  };

  const handleUpdateCaso = async (payload: CasoUpdatePayload) => {
    const { error } = await supabase
      .from("casos_clinicos")
      .update(payload)
      .eq("id", caso.id);

    if (error) {
      toast.error(error.message || 'Error al actualizar caso', { style: { backgroundColor: '#FF0000', color: 'white' } })
    } else {
      toast.success('El caso clínico ha sido actualizado exitosamente.', { style: { backgroundColor: '#008000', color: 'white' } })
      setIsEditModalOpen(false);
      router.refresh();
    }
  };

  const handleCloseCaso = async () => {
    const { error } = await supabase
      .from("casos_clinicos")
      .update({ estado: "Cerrado", fecha_cierre: new Date().toISOString() })
      .eq("id", caso.id);

    if (error) {
      toast.error(error.message || 'Error al cerrar caso', { style: { backgroundColor: '#FF0000', color: 'white' } })
    } else {
      toast.success('El caso clínico ha sido cerrado exitosamente.', { style: { backgroundColor: '#008000', color: 'white' } })
      router.push(`/admin/ficha-odontologica/${numeroHistoria}/casos`);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      {showBack && (
        <Button variant="outline" asChild>
          <Link href={`/admin/ficha-odontologica/${numeroHistoria}/casos`}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Volver a Casos
          </Link>
        </Button>
      )}
      {canEdit && (
        <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
          <Edit className="mr-2 h-4 w-4" /> Editar Caso
        </Button>
      )}
      {canEdit && caso.estado !== "Cerrado" && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <XCircle className="mr-2 h-4 w-4" /> Cerrar Caso
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción cerrará el caso clínico y registrará la fecha de cierre. No podrás revertir esta acción fácilmente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleCloseCaso}>
                Confirmar Cierre
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {isEditModalOpen && (
        <CasoFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateCaso}
          initialData={caso}
        />
      )}
    </div>
  );
}
