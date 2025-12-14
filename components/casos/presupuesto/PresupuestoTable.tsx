"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Loader2, ChevronLeft, ChevronRight, FileText, AlertTriangle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
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
import { deletePresupuesto, checkPresupuestoUso } from "@/app/admin/(protected)/ficha-odontologica/[numero_historia]/casos/[casoId]/presupuesto/actions";

interface Presupuesto {
  id: string;
  nombre: string;
  costo_total: number | null;
  fecha_creacion: string;
  medico_id: string | null;
  personal: {
    nombre_completo?: string;
  } | null;
  moneda_id?: string | null;
  moneda_codigo?: string | null;
  estado: string;
  observacion?: string | null;
  correlativo?: number | null;
  plan_items: Array<{
    estado: string;
  }>;
  items_json?: Array<{
    procedimiento_id?: string;
    procedimiento_nombre?: string;
    procedimiento_descripcion?: string;
    notas?: string;
    cantidad?: number;
    precio_unitario?: number;
  }> | null;
  creador_personal_id?: string | null;
  creador_nombre?: string | null;
  creador_rol?: string | null;
}

type PresupuestoItem = {
  procedimiento_id?: string;
  procedimiento_nombre?: string;
  notas?: string;
  cantidad?: number;
  precio_unitario?: number;
  procedimiento_descripcion?: string;
}

type PresupuestoRaw = Presupuesto & {
  items_json: PresupuestoItem[] | null;
}

interface PresupuestoTableProps {
  casoId: string;
  pacienteId: string;
  numeroHistoria: string;

}

export function PresupuestoTable({
  casoId,
  numeroHistoria,
}: PresupuestoTableProps) {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [currentPersonal, setCurrentPersonal] = useState<{
    id: string;
    nombre_completo: string;
    rol?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [deleteCandidate, setDeleteCandidate] = useState<{ id: string; nombre: string } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [checkingUsage, setCheckingUsage] = useState(false);
  const itemsPerPage = 10;
  const router = useRouter();
  const pathname = usePathname();
  const lastPathnameRef = useRef<string>(pathname);

  const getCurrencySymbol = (code?: string | null) => {
    if (!code) return "S/";
    const map: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      PEN: "S/",
      UYU: "$U",
    };
    return map[code] || code + " ";
  };

  const fetchPresupuestos = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);

    try {
      // Query simple sin joins para evitar problemas de RLS
      const { data, error } = await supabase
        .from("presupuestos")
        .select("*")
        .eq("caso_id", casoId)
        .is("deleted_at", null)
        .order("fecha_creacion", { ascending: false });

      if (error) {
        console.error("[PresupuestoTable] Error fetching presupuestos:", error);
        setPresupuestos([]);
        return;
      }

      if (!data || data.length === 0) {
        console.log(
          "[PresupuestoTable] No presupuestos found for casoId:",
          casoId
        );
        setPresupuestos([]);
        setLoading(false);
        return;
      }

      console.log(
        "[PresupuestoTable] Fetched presupuestos:",
        data.length,
        "for casoId:",
        casoId
      );

      // Obtener médicos (personal) por separado
      const medicoIds = Array.from(new Set(data.map((p: Presupuesto) => p.medico_id).filter(Boolean)))
      let medicoMap: Record<string, { nombre_completo: string }> = {}

      if (medicoIds.length > 0) {
        const { data: medicosData } = await supabase
          .from("personal")
          .select("id, nombre_completo")
          .in("id", medicoIds);
        if (medicosData) {
          medicoMap = medicosData.reduce((acc: Record<string, { nombre_completo: string }>, m: { id: string; nombre_completo: string }) => {
            acc[m.id] = { nombre_completo: m.nombre_completo }
            return acc
          }, {})
        }
      }

      // Obtener monedas por separado
      const monedaIds = Array.from(new Set(data.map((p: Presupuesto) => p.moneda_id).filter(Boolean)))
      let monedaMap: Record<string, string> = {}

      if (monedaIds.length > 0) {
        const { data: monedasData } = await supabase
          .from("monedas")
          .select("id, codigo")
          .in("id", monedaIds);
        if (monedasData) {
          monedaMap = monedasData.reduce((acc: Record<string, string>, m: { id: string; codigo: string }) => {
            acc[m.id] = m.codigo
            return acc
          }, {})
        }
      }

      // Obtener procedimientos por separado para enriquecer items_json
      const procedimientoIds = Array.from(
        new Set(
          data
            .flatMap((p: PresupuestoRaw) => (Array.isArray(p.items_json) ? p.items_json : []))
            .map((item: PresupuestoItem) => item.procedimiento_id)
            .filter(Boolean)
        )
      )
      let procedimientoMap: Record<string, string> = {}

      if (procedimientoIds.length > 0) {
        const { data: procedimientosData } = await supabase
          .from("procedimientos")
          .select("id, descripcion")
          .in("id", procedimientoIds);
        if (procedimientosData) {
          procedimientoMap = procedimientosData.reduce((acc: Record<string, string>, p: { id: string; descripcion: string | null }) => {
            acc[p.id] = p.descripcion || ""
            return acc
          }, {})
        }
      }

      const transformed = data.map((item: Presupuesto) => {
        // Enriquecer items_json con descripciones de procedimientos
        const enrichedItems = Array.isArray(item.items_json)
          ? item.items_json.map((proc: PresupuestoItem): Presupuesto['items_json'][number] => ({
              procedimiento_id: proc.procedimiento_id,
              procedimiento_nombre: proc.procedimiento_nombre,
              procedimiento_descripcion: proc.procedimiento_id 
                ? procedimientoMap[proc.procedimiento_id] || proc.procedimiento_nombre
                : proc.procedimiento_nombre,
              notas: proc.notas,
              cantidad: proc.cantidad,
              precio_unitario: proc.precio_unitario
            }))
          : null

        return {
          id: item.id,
          nombre: item.nombre,
          costo_total: item.costo_total,
          fecha_creacion: item.fecha_creacion,
          medico_id: item.medico_id,
          moneda_id: item.moneda_id,
          moneda_codigo: item.moneda_id
            ? monedaMap[item.moneda_id] || null
            : null,
          personal: item.medico_id ? medicoMap[item.medico_id] || null : null,
          estado: item.estado || "Por Cobrar",
          observacion: item.observacion || null,
          correlativo: item.correlativo || null,
          plan_items: [],
          items_json: enrichedItems,
          creador_personal_id: item.creador_personal_id || null,
          creador_nombre: item.creador_nombre || null,
          creador_rol: item.creador_rol || null,
        }
      });

      setPresupuestos(transformed);
    } catch (err) {
      console.error("[PresupuestoTable] Exception:", err);
      setPresupuestos([]);
    } finally {
      setLoading(false);
    }
  }, [casoId]);

  useEffect(() => {
    fetchPresupuestos();
  }, [fetchPresupuestos]);

  // Refetch cuando volvemos a esta ruta (detectar cambio de pathname)
  useEffect(() => {
    if (
      pathname.includes("presupuesto") &&
      lastPathnameRef.current !== pathname
    ) {
      // Solo refetch si la ruta actual es presupuesto pero la anterior NO era (volvimos)
      if (!lastPathnameRef.current.includes("presupuesto")) {
        fetchPresupuestos();
      }
    }
    lastPathnameRef.current = pathname;
  }, [pathname, fetchPresupuestos]);

  // Resolver usuario actual para controlar permisos (borrado)
  useEffect(() => {
    const resolveCurrent = async () => {
      const supabase = createClient();
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user?.email) {
          const { data: personalMatch } = await supabase
            .from("personal")
            .select("id, nombre_completo, rol, email")
            .ilike("email", user.email)
            .limit(1);
          if (personalMatch && personalMatch.length > 0)
            setCurrentPersonal({
              id: personalMatch[0].id,
              nombre_completo: personalMatch[0].nombre_completo,
              rol: personalMatch[0].rol,
            });
        }
      } catch (e) {
        console.error("Error resolving current personal", e);
      }
    };
    resolveCurrent();
  }, []);

  const getEstadoPago = (estadoPresupuesto: string) => {
    if (estadoPresupuesto === "Pagado") return { label: "Pagado", color: "default" };
    if (estadoPresupuesto === "Parcial") return { label: "Parcial", color: "secondary" };
    if (estadoPresupuesto === "Cancelado") return { label: "Cancelado", color: "destructive" };
    return { label: "Por Cobrar", color: "destructive" };
  };

  const handleInitiateDelete = async (presupuestoId: string, nombre: string) => {
    setDeleteCandidate({ id: presupuestoId, nombre })
    setUsageCount(0)
    setCheckingUsage(true)
    setIsDeleteDialogOpen(true)
    try {
      const { count } = await checkPresupuestoUso(presupuestoId)
      setUsageCount(count || 0)
    } catch (e) { } finally { setCheckingUsage(false) }
  }

  const performDelete = async () => {
    if (!deleteCandidate) return
    setDeleting(deleteCandidate.id);
    const result = await deletePresupuesto(deleteCandidate.id);

    if (result.success) {
      toast.success("El presupuesto ha sido eliminado.", {
        style: { backgroundColor: "#008000", color: "white" },
      });
      window.location.href = `/admin/ficha-odontologica/${numeroHistoria}/casos/${casoId}/presupuesto`;
    } else {
      toast.error(result.error?.message || "Error al eliminar", {
        style: { backgroundColor: "#FF0000", color: "white" },
      });
      setDeleting(null);
      setIsDeleteDialogOpen(false);
      setDeleteCandidate(null);
    }
  };

  const handleEdit = (presupuestoId: string) => {
    router.push(
      `/admin/ficha-odontologica/${numeroHistoria}/casos/${casoId}/presupuesto?action=editar&presupuestoId=${presupuestoId}`
    );
  };

  const handlePrint = (presupuestoId: string) => {
    window.open(
      `/admin/ficha-odontologica/${numeroHistoria}/casos/${casoId}/presupuesto/${presupuestoId}/print`,
      "_blank"
    );
  };

  const normalized = (s: unknown) => String(s || "").toLowerCase();

  const matchesSearch = (p: Presupuesto) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const fecha = (() => {
      try { return format(new Date(p.fecha_creacion), "dd/MM/yyyy"); } 
      catch { return ""; }
    })().toLowerCase();
    return (
      normalized(p.nombre).includes(term) ||
      // normalized(p.observacion).includes(term) || // no incluir observación en búsqueda
      fecha.includes(term)
    );
  };

  const filteredData = presupuestos.filter(matchesSearch);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const pagedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className='flex justify-center items-center py-8'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex-1" />
        <div className="w-full max-w-sm relative">
          <Input
            placeholder="Buscar presupuesto o fecha (dd/MM/yyyy)"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="h-9 pr-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          />
          <ChevronRight className="absolute right-2 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        </div>
      </div>
      
      <div className='border rounded-lg overflow-hidden bg-white shadow-sm border-sky-100 dark:border-slate-800 dark:bg-card'>
      <Table>
        <TableHeader>
          <TableRow className="bg-sky-700 hover:bg-sky-700 border-b-sky-800 dark:bg-slate-800 dark:border-b-slate-700">
            <TableHead className='text-white font-semibold text-center w-[100px] dark:text-slate-100'>
              Fecha
            </TableHead>
            <TableHead className='text-white font-semibold text-center w-[80px] dark:text-slate-100'>
              N°
            </TableHead>
            <TableHead className='text-white font-semibold text-left pl-4 dark:text-slate-100'>
              Tratamiento
            </TableHead>
            <TableHead className='text-white font-semibold text-right dark:text-slate-100'>
              Total
            </TableHead>
            <TableHead className='text-white font-semibold text-center dark:text-slate-100'>
              Estado
            </TableHead>
            <TableHead className='text-white font-semibold text-center dark:text-slate-100'>
              Médico
            </TableHead>
            <TableHead className='text-white text-right font-semibold w-[100px] dark:text-slate-100'>
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className='text-center py-8 text-muted-foreground'
              >
                No hay presupuestos registrados.
              </TableCell>
            </TableRow>
          ) : (
            pagedData.map((presupuesto, index) => {
              const estado = getEstadoPago(presupuesto.estado || "Por Cobrar");
              const canDelete =
                currentPersonal?.rol === "Admin" ||
                (currentPersonal?.id &&
                  presupuesto.creador_personal_id &&
                  currentPersonal.id === presupuesto.creador_personal_id);
              return (
                <TableRow
                  key={presupuesto.id}
                  className='hover:bg-sky-50/30 dark:hover:bg-slate-700/30 transition-colors border-b-sky-50 dark:border-b-slate-700'
                >
                  <TableCell className='text-center text-sm text-sky-900 dark:text-slate-200 font-medium'>
                    {presupuesto.fecha_creacion
                      ? format(
                          new Date(presupuesto.fecha_creacion),
                          "dd/MM/yyyy",
                          { locale: es }
                        )
                      : "-"}
                  </TableCell>
                  <TableCell className='text-center font-mono text-sky-900 dark:text-slate-200 font-medium'>
                    #{String(presupuesto.correlativo || 1).padStart(3, '0')}
                  </TableCell>
                  <TableCell className='text-left pl-4 align-middle'>
                    <div className='flex flex-col gap-2'>
                      {Array.isArray(presupuesto.items_json) && presupuesto.items_json.length > 0 ? (
                        <ul className='space-y-1'>
                          {presupuesto.items_json.slice(0, 3).map((item: PresupuestoItem, idx: number) => (
                            <li 
                              key={idx} 
                              className='text-xs text-slate-700 dark:text-slate-200 truncate' 
                              title={`${item.procedimiento_nombre}${item.notas ? ` (${item.notas})` : ""}`}
                            >
                              <span className='inline-flex items-center gap-1.5'>
                                <FileText className='h-3 w-3 text-sky-500 dark:text-sky-400 shrink-0' />
                                <span className='truncate'>
                                  {item.procedimiento_nombre}{item.notas ? ` (${item.notas})` : ""}
                                </span>
                              </span>
                            </li>
                          ))}
                          {presupuesto.items_json.length > 3 && (
                            <li className='text-xs text-slate-500 dark:text-slate-400 italic'>
                              +{presupuesto.items_json.length - 3} más
                            </li>
                          )}
                        </ul>
                      ) : (
                        <span className='text-xs text-slate-500 dark:text-slate-400 italic'>
                          {presupuesto.nombre}
                        </span>
                      )}
                      {/* No mostrar observación aquí */}
                    </div>
                  </TableCell>
                  <TableCell className='text-right font-semibold text-sky-900 dark:text-slate-200'>
                    {getCurrencySymbol(presupuesto.moneda_codigo)}
                    {(presupuesto.costo_total ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell className='text-center'>
                    <Badge
                      variant={
                        estado.color as "default" | "secondary" | "destructive"
                      }
                      className={
                        estado.color === "destructive"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : estado.color === "secondary"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }
                    >
                      {estado.label}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-center text-sm text-slate-600 dark:text-slate-400'>
                    {presupuesto.personal?.nombre_completo || "No asignado"}
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      {/* Botón de imprimir removido por solicitud */}
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleEdit(presupuesto.id)}
                        title='Editar presupuesto'
                        className='h-8 w-8 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-slate-700'
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        disabled={deleting === presupuesto.id || !canDelete}
                        onClick={() => handleInitiateDelete(presupuesto.id, presupuesto.nombre)}
                        title={
                          !canDelete
                            ? "Solo el creador o un Admin puede eliminar"
                            : "Eliminar presupuesto"
                        }
                        className='h-8 w-8 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>

    {totalPages > 1 && (
      <div className="flex justify-center gap-2 items-center py-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground font-medium">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )}
    
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {checkingUsage ? "Verificando..." : usageCount > 0 ? <span className="text-amber-600 flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> En uso</span> : "¿Estás seguro?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {usageCount > 0 ? `Este presupuesto está vinculado a ${usageCount} seguimiento(s). No se puede eliminar.` : `Vas a eliminar: ${deleteCandidate?.nombre}. Esta acción no se puede deshacer.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setDeleteCandidate(null)}>Cancelar</AlertDialogCancel>
          {!checkingUsage && usageCount === 0 && <AlertDialogAction onClick={performDelete} className="bg-destructive hover:bg-destructive/90">{deleting === deleteCandidate?.id ? 'Eliminando...' : 'Confirmar'}</AlertDialogAction>}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
  );
}
