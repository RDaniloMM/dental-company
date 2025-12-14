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
import CasoFormModal from "./CasoFormModal";
import { Plus, AlertTriangle, Loader2, FileText, Clock, BookOpen, Eye, Edit, XCircle, CheckCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase/client";
import { toast } from 'sonner'
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
  profesional: string;
  rol_profesional: string;
  ultimo_seguimiento: { id: string; fecha: string; titulo: string } | null;
  total_presupuesto: number;
  total_pagado: number;
  porcentaje_pago: number;
  estado_pago: string;
  moneda: { codigo: string; simbolo: string } | null;
  monedas: Array<{ codigo: string; simbolo: string; total: number; pagado: number }>;
  diagnosticos_count: number;
  presupuestos_count: number;
  seguimientos_count: number;
};

type CasosListProps = {
  casos: Caso[];
  historiaId: string;
  numeroHistoria: string;
};

const ESTADO_OPCIONES = ["Abierto", "En progreso", "Cerrado"] as const;

type CasoFormData = {
  nombre_caso: string;
  diagnostico_preliminar: string;
  descripcion: string;
  fecha_inicio: string;
  estado: "Abierto" | "En progreso" | "Cerrado";
};

export default function CasosList({
  casos: initialCasos,
  historiaId,
  numeroHistoria,
}: CasosListProps) {
  const router = useRouter();
  const supabase = createClient();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoadingRole, setIsLoadingRole] = useState(true);

  React.useEffect(() => {
    const fetchUserRole = async () => {
      setIsLoadingRole(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.user_metadata) {
          const role = (session.user.user_metadata as Record<string, unknown>).role as string | undefined;
          setUserRole(role || "odontologo");
        } else {
          setUserRole("odontologo");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("odontologo");
      } finally {
        setIsLoadingRole(false);
      }
    };
    
    fetchUserRole();
  }, [supabase]);

  const canEdit = userRole === "odontologo" || userRole === "admin";

  const [casos, setCasos] = useState<Caso[]>(initialCasos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCaso, setEditingCaso] = useState<Caso | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Todos");
  
  const [deleteCandidate, setDeleteCandidate] = useState<Caso | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [usageCount, setUsageCount] = useState<number>(0); 
  const [checkingUsage, setCheckingUsage] = useState(false);

  const filteredCasos = casos.filter((caso) => {
    const matchesSearch =
      caso.nombre_caso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (caso.diagnostico_preliminar?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "Todos" || caso.estado === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrUpdateCaso = async (payload: CasoFormData) => {
    if (editingCaso) {
      const { error } = await supabase
        .from("casos_clinicos")
        .update(payload)
        .eq("id", editingCaso.id);

      if (error) {
        toast.error(error.message || 'Error al actualizar caso', { style: { backgroundColor: '#FF0000', color: 'white' } });
      } else {
        setCasos(
          casos.map((c) => (c.id === editingCaso.id ? { ...c, ...payload, monedas: c.monedas } : c))
        );
        toast.success('El caso clínico ha sido actualizado exitosamente.', { style: { backgroundColor: '#008000', color: 'white' } });
      }
    } else {
      const { data, error } = await supabase
        .from("casos_clinicos")
        .insert([{ ...payload, historia_id: historiaId }])
        .select()
        .single();

      if (error) {
        toast.error(error.message || 'Error al crear caso', { style: { backgroundColor: '#FF0000', color: 'white' } });
      } else {
        const newCaso: Caso = {
          ...data,
          ultima_cita: null,
          ultimo_seguimiento: null,
          total_presupuesto: 0,
          total_pagado: 0,
          porcentaje_pago: 0,
          estado_pago: 'Por Cobrar',
          moneda: null,
          monedas: [],
          diagnosticos_count: 0,
          presupuestos_count: 0,
          seguimientos_count: 0,
        };
        setCasos([...casos, newCaso]);
        toast.success('El nuevo caso clínico ha sido creado exitosamente.', { style: { backgroundColor: '#008000', color: 'white' } });
      }
    }
    setIsModalOpen(false);
    setEditingCaso(null);
  };

  const handleInitiateDelete = async (caso: Caso) => {
    setDeleteCandidate(caso);
    setUsageCount(0);
    setCheckingUsage(true);
    setIsDeleteDialogOpen(true);

    const { count } = await supabase
        .from('citas')
        .select('*', { count: 'exact', head: true })
        .eq('caso_id', caso.id)
        .is('deleted_at', null);
    
    setUsageCount(count || 0);
    setCheckingUsage(false);
  };

  const handleDeleteCaso = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("casos_clinicos")
      .update({ 
          deleted_at: new Date().toISOString(),
          deleted_by: user?.id 
      })
      .eq("id", deleteCandidate.id);

    if (error) {
      toast.error('Error al eliminar el caso clínico.', { style: { backgroundColor: '#FF0000', color: 'white' } });
    } else {
      setCasos(casos.filter((c) => c.id !== deleteCandidate.id));
      toast.success('El caso clínico ha sido eliminado.', { style: { backgroundColor: '#008000', color: 'white' } });
    }
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
    setDeleteCandidate(null);
  };

  const handleCloseCaso = async (casoId: string) => {
    const { error } = await supabase
        .from("casos_clinicos")
        .update({ estado: "Cerrado", fecha_cierre: new Date().toISOString() })
        .eq("id", casoId);

    if (error) {
        toast.error('Error al cerrar caso', { style: { backgroundColor: '#FF0000', color: 'white' } });
    } else {
        setCasos(casos.map(c => c.id === casoId ? { ...c, estado: "Cerrado" } : c));
        toast.success('Caso cerrado exitosamente', { style: { backgroundColor: '#008000', color: 'white' } });
    }
  }

  return (
    <div className='border rounded-lg overflow-hidden shadow-sm border-sky-100 dark:border-slate-800'>
      {/* Header azul */}
      <div className='bg-sky-700 dark:bg-slate-800 p-4 text-center'>
        <h2 className='text-2xl font-bold text-white'>
          Casos Clínicos del Paciente
        </h2>
      </div>
      
      {/* Contenido con padding */}
      <div className="bg-white dark:bg-card p-4 space-y-4">
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
        variant="default" 
        >
          <Plus className="mr-2 h-4 w-4" /> Nuevo caso clínico
        </Button>
      </div>

      {isLoadingRole ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
      ) : (
        <TooltipProvider>
        <div className="w-full max-w-full overflow-x-auto">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow className="bg-sky-700 dark:bg-sky-900 border-b-sky-800">
              <TableHead className="text-white font-semibold text-left w-[100px]">Fecha Inicio</TableHead>
              <TableHead className="text-white font-semibold text-left w-[220px]">Caso</TableHead>
              <TableHead className="text-white font-semibold text-left w-[140px]">Profesional</TableHead>
              <TableHead className="text-white font-semibold text-center w-[90px]">Estado</TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px]">U. Actividad</TableHead>
              <TableHead className="text-white font-semibold text-center w-[110px]">Presupuesto</TableHead>
              <TableHead className="text-white font-semibold text-center w-[80px]">% Pago</TableHead>
              <TableHead className="text-white font-semibold text-center w-[70px]">Docs</TableHead>
              <TableHead className="text-white font-semibold text-center w-[120px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCasos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <p className="text-lg text-muted-foreground mb-4">No hay casos clínicos para mostrar.</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredCasos.map((caso) => {
                // Determinar color del indicador de estado según dias de inactividad
                const getActivityColor = () => {
                  if (!caso.ultimo_seguimiento) return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300";
                  const daysSince = Math.floor((Date.now() - new Date(caso.ultimo_seguimiento.fecha).getTime()) / (1000 * 60 * 60 * 24));
                  if (daysSince > 60) return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300";
                  if (daysSince > 30) return "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300";
                  return "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300";
                };

                // Color para estado de pago
                const getPaymentColor = () => {
                  if (caso.estado_pago === "Pagado") return "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
                  if (caso.estado_pago === "Parcial") return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
                  return "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
                };

                return (
                <TableRow key={caso.id} className="hover:bg-sky-50/30 dark:hover:bg-slate-800/30 transition-colors border-b-slate-100 dark:border-b-slate-800">
                  {/* Fecha de inicio */}
                  <TableCell className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {format(new Date(caso.fecha_inicio), "dd/MM/yyyy", { locale: es })}
                  </TableCell>

                  {/* Caso (sin descripción, truncate, centrado verticalmente) */}
                  <TableCell className="text-left align-middle">
                    <Button
                      variant="link"
                      className="p-0 h-auto font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 text-left justify-start"
                      onClick={() =>
                        router.push(
                          `/admin/ficha-odontologica/${numeroHistoria}/casos/${caso.id}`
                        )
                      }
                    >
                      <span className="truncate block max-w-[200px]" title={caso.nombre_caso}>{caso.nombre_caso}</span>
                    </Button>
                  </TableCell>

                  {/* Profesional */}
                  <TableCell className="text-sm text-slate-700 dark:text-slate-300">
                    <div className="font-medium">{caso.profesional}</div>
                    {caso.rol_profesional && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">{caso.rol_profesional}</p>
                    )}
                  </TableCell>

                  {/* Estado Clínico */}
                  <TableCell className="text-center">
                    <div
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        caso.estado === "Abierto"
                          ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          : caso.estado === "En progreso"
                          ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {caso.estado}
                    </div>
                  </TableCell>

                  {/* Última Actividad */}
                  <TableCell className="text-center">
                    {caso.ultimo_seguimiento ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${getActivityColor()}`}>
                            <Clock className="h-3 w-3" />
                            {format(new Date(caso.ultimo_seguimiento.fecha), "dd/MM", { locale: es })}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">{caso.ultimo_seguimiento.titulo}</p>
                          <p className="text-xs text-slate-400">
                            {format(new Date(caso.ultimo_seguimiento.fecha), "dd/MM/yyyy HH:mm", { locale: es })}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500">Sin actividad</span>
                    )}
                  </TableCell>

                  {/* Presupuesto */}
                  <TableCell className="text-center align-top">
                    <div className="space-y-0.5">
                      {caso.monedas && caso.monedas.length > 0 ? (
                        caso.monedas.map((m, idx) => (
                          <div key={idx} className="text-xs font-mono text-slate-700 dark:text-slate-300 leading-tight">
                            <span className="font-medium">{m.simbolo} {m.total.toFixed(0)}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs font-mono text-slate-700 dark:text-slate-300 leading-tight">
                          <span className="font-medium">{caso.moneda?.simbolo || 'S/'} {caso.total_presupuesto.toFixed(0)}</span>
                        </div>
                      )}
                    </div>
                    <div
                      className={
                        `mt-2 inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          caso.estado_pago === 'Pagado'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : caso.estado_pago === 'Parcial'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        }`
                      }>
                      {caso.estado_pago}
                    </div>
                  </TableCell>

                  {/* % Pago - Barra visual centrada */}
                  <TableCell className="text-center align-middle">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="w-14 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${
                            caso.porcentaje_pago >= 100 ? 'bg-emerald-500' :
                            caso.porcentaje_pago >= 75 ? 'bg-blue-500' :
                            caso.porcentaje_pago >= 50 ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(caso.porcentaje_pago, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {caso.porcentaje_pago}%
                      </span>
                    </div>
                  </TableCell>

                  {/* Documentos */}
                  <TableCell className="text-center align-top">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center justify-center gap-1 text-xs cursor-help">
                          {caso.diagnosticos_count > 0 && (
                            <div className="px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" title={`${caso.diagnosticos_count} diagnóstico(s)`}>
                              D: {caso.diagnosticos_count}
                            </div>
                          )}
                          {caso.presupuestos_count > 0 && (
                            <div className="px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" title={`${caso.presupuestos_count} presupuesto(s)`}>
                              P: {caso.presupuestos_count}
                            </div>
                          )}
                          {caso.seguimientos_count > 0 && (
                            <div className="px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" title={`${caso.seguimientos_count} seguimiento(s)`}>
                              S: {caso.seguimientos_count}
                            </div>
                          )}
                          {caso.diagnosticos_count + caso.presupuestos_count + caso.seguimientos_count === 0 && (
                            <span className="text-slate-400 dark:text-slate-500 text-xs">-</span>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Diagnósticos: {caso.diagnosticos_count}</p>
                        <p>Presupuestos: {caso.presupuestos_count}</p>
                        <p>Seguimientos: {caso.seguimientos_count}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>

                  {/* Acciones - 4 iconos en grid 2x2 */}
                  <TableCell className="text-center align-middle">
                    <div className="grid grid-cols-2 gap-1 w-fit mx-auto">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              router.push(
                                `/admin/ficha-odontologica/${numeroHistoria}/casos/${caso.id}`
                              )
                            }
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Ver detalles</TooltipContent>
                      </Tooltip>
                      {canEdit && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => {
                                setEditingCaso(caso);
                                setIsModalOpen(true);
                              }}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar</TooltipContent>
                        </Tooltip>
                      )}
                      {canEdit && caso.estado !== "Cerrado" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleCloseCaso(caso.id)}
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Cerrar caso</TooltipContent>
                        </Tooltip>
                      )}
                      {canEdit && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() => handleInitiateDelete(caso)}
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Eliminar</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );})
            )}
          </TableBody>
        </Table>
        </div>
        </TooltipProvider>
      )}

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

    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {checkingUsage ? (
                "Verificando..."
              ) : usageCount > 0 ? (
                <span className="text-amber-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" /> Caso en uso
                </span>
              ) : (
                "¿Estás seguro?"
              )}
            </AlertDialogTitle>
            
            <AlertDialogDescription asChild>
                <div className="space-y-3 text-sm text-muted-foreground">
                  {checkingUsage ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      <div>
                        Vas a eliminar el caso <strong>{deleteCandidate?.nombre_caso}</strong>.
                      </div>
                      
                      {usageCount > 0 && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
                          <strong>¡Atención!</strong> Este caso tiene <span className="font-bold">{usageCount} cita(s)</span> registradas.
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Se ocultarán las citas asociadas.</li>
                            <li>Se ocultarán los presupuestos y seguimientos.</li>
                          </ul>
                        </div>
                      )}
                      
                      <div>Esta acción no se puede deshacer (requiere administrador para restaurar).</div>
                    </>
                  )}
                </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteCandidate(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCaso}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting || checkingUsage}
            >
              {isDeleting ? 'Eliminando...' : 'Confirmar Eliminación'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </div>
  );
}
