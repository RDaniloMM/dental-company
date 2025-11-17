"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CasoFormModal from "./CasoFormModal";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


type Caso = {
  id: string;
  nombre_caso: string;
  diagnostico_preliminar: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_cierre: string | null;
  estado: "Abierto" | "En progreso" | "Cerrado";
  ultima_cita: string | null;
};

type CasosListProps = {
  casos: Caso[];
  historiaId: string;
  numeroHistoria: string;
};

export default function CasosList({
  casos: initialCasos,
  historiaId,
  numeroHistoria,
}: CasosListProps) {
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  React.useEffect(() => {
    const fetchUserRole = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const userRole = session.user?.user_metadata?.role;
        if (userRole === "odontologo" || userRole === "admin") {
          setUserRole(userRole);
        } else {
          setUserRole("odontologo"); // Asignar rol por defecto si no es admin u odontólogo
        }
      }
      setIsLoading(false);
    };
    fetchUserRole();
  }, [supabase.auth]);

  const canEdit = userRole === "odontologo" || userRole === "admin";

  const [casos, setCasos] = useState<Caso[]>(initialCasos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCaso, setEditingCaso] = useState<Caso | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Definir el número de elementos por página

  const filteredCasos = casos.filter((caso) => {
    const matchesSearch =
      caso.nombre_caso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.diagnostico_preliminar?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "Todos" || caso.estado === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Aplicar paginación
  const totalPages = Math.ceil(filteredCasos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCasos = filteredCasos.slice(startIndex, endIndex);

  type CasoFormData = {
    nombre_caso: string;
    diagnostico_preliminar: string;
    descripcion: string;
    fecha_inicio: string;
    estado: "Abierto" | "En progreso" | "Cerrado";
  };

  const handleCreateOrUpdateCaso = async (payload: CasoFormData) => {
    if (editingCaso) {
      // Actualizar caso
      const { error } = await supabase
        .from("casos_clinicos")
        .update(payload)
        .eq("id", editingCaso.id);

      if (error) {
        toast({
          title: "Error al actualizar caso",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setCasos(
          casos.map((c) => (c.id === editingCaso.id ? { ...c, ...payload } : c))
        );
        toast({
          title: "Caso actualizado",
          description: "El caso clínico ha sido actualizado exitosamente.",
        });
      }
    } else {
      // Crear caso
      const { data, error } = await supabase
        .from("casos_clinicos")
        .insert([{ ...payload, historia_id: historiaId }])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error al crear caso",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setCasos([...casos, data]);
        toast({
          title: "Caso creado",
          description: "El nuevo caso clínico ha sido creado exitosamente.",
        });
      }
    }
    setIsModalOpen(false);
    setEditingCaso(null);
  };

  const handleCloseCaso = async (casoId: string) => {
    const { error } = await supabase
      .from("casos_clinicos")
      .update({ estado: "Cerrado", fecha_cierre: new Date().toISOString() })
      .eq("id", casoId);

    if (error) {
      toast({
        title: "Error al cerrar caso",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setCasos(
        casos.map((c) =>
          c.id === casoId
            ? { ...c, estado: "Cerrado", fecha_cierre: new Date().toISOString() }
            : c
        )
      );
      toast({
        title: "Caso cerrado",
        description: "El caso clínico ha sido cerrado exitosamente.",
      });
    }
  };

  const handleDeleteCaso = async (casoId: string) => {
    // Implementar soft-delete
    const { error } = await supabase
      .from("casos_clinicos")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", casoId);

    if (error) {
      toast({
        title: "Error al eliminar caso",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setCasos(casos.filter((c) => c.id !== casoId));
      toast({
        title: "Caso eliminado",
        description: "El caso clínico ha sido eliminado exitosamente (soft-delete).",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Input
            placeholder="Buscar por nombre o diagnóstico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos los estados</SelectItem>
              <SelectItem value="Abierto">Abierto</SelectItem>
              <SelectItem value="En progreso">En progreso</SelectItem>
              <SelectItem value="Cerrado">Cerrado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => {
          setEditingCaso(null);
          setIsModalOpen(true);
        }}
        disabled={!canEdit}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Nuevo caso clínico
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha de inicio</TableHead>
                  <TableHead>Nombre del caso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Diagnóstico preliminar</TableHead>
                  <TableHead>Última cita</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(itemsPerPage)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-4 bg-gray-200 rounded w-16 ml-auto animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha de inicio</TableHead>
              <TableHead>Nombre del caso</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Diagnóstico preliminar</TableHead>
              <TableHead>Última cita</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCasos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-lg text-muted-foreground mb-4">No hay casos clínicos para mostrar.</p>
                  {canEdit && (
                    <Button onClick={() => {
                      setEditingCaso(null);
                      setIsModalOpen(true);
                    }}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Crear Nuevo Caso
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              paginatedCasos.map((caso) => (
                <TableRow key={caso.id}>
                  <TableCell>
                    {format(new Date(caso.fecha_inicio), "dd/MM/yyyy", { locale: es })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      onClick={() =>
                        router.push(
                          `/admin/ficha-odontologica/${numeroHistoria}/casos/${caso.id}`
                        )
                      }
                    >
                      {caso.nombre_caso}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        caso.estado === "Abierto"
                          ? "default"
                          : caso.estado === "En progreso"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {caso.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {caso.diagnostico_preliminar}
                  </TableCell>
                  <TableCell>
                    {caso.ultima_cita
                      ? format(new Date(caso.ultima_cita), "dd/MM/yyyy", { locale: es })
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/admin/ficha-odontologica/${numeroHistoria}/casos/${caso.id}`
                            )
                          }
                        >
                          Ver
                        </DropdownMenuItem>
                        {canEdit && (
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingCaso(caso);
                              setIsModalOpen(true);
                            }}
                          >
                            Editar
                          </DropdownMenuItem>
                        )}
                        {canEdit && caso.estado !== "Cerrado" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                Cerrar
                              </DropdownMenuItem>
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
                                <AlertDialogAction onClick={() => handleCloseCaso(caso.id)}>
                                  Confirmar Cierre
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        {canEdit && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                Eliminar
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción eliminará el caso clínico de forma lógica (soft-delete). No podrás acceder a él después.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteCaso(caso.id)}>
                                  Confirmar Eliminación
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <div className="flex justify-end space-x-2 mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
        >
          Anterior
        </Button>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Siguiente
        </Button>
      </div>

      {isModalOpen && (
        <CasoFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCaso(null);
          }}
          onSubmit={handleCreateOrUpdateCaso}
          initialData={editingCaso ? {
            id: editingCaso.id,
            nombre_caso: editingCaso.nombre_caso,
            diagnostico_preliminar: editingCaso.diagnostico_preliminar,
            descripcion: editingCaso.descripcion,
            fecha_inicio: editingCaso.fecha_inicio,
            estado: editingCaso.estado,
          } : undefined}
        />
      )}
    </div>
  );
}
