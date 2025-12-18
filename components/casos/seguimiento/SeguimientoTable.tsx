"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Loader2, CalendarCheck, CalendarX, AlertCircle, AlertTriangle, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/lib/supabase/client";

interface SeguimientoRaw {
  id: string;
  fecha: string;
  titulo: string;
  descripcion: string;
  estado: string;
  saldo_pendiente_snapshot: number;
  tratamientos_realizados_ids: string[] | null;
  procedimientos_realizados?: string[] | null;
  presupuestos?: { id: string; nombre: string; correlativo?: number; costo_total: number; total_pagado: number; estado: string; monedas?: { codigo: string; simbolo: string } | null; } | null;
  citas?: { id: string; fecha_inicio: string; estado: string; } | null;
  personal?: { nombre_completo: string; } | null;
  pagos?: { monto: number; monedas?: { codigo: string; simbolo: string } | null; } | null;
}
 

interface ProcedimientoDelPresupuesto {
  id: string;
  nombre_procedimiento: string;
  descripcion?: string;
}
interface Props {
  casoId: string;
  numeroHistoria: string;
  pacienteId?: string;
}

interface SeguimientoRow {
    id: string;
    fecha: string;
    titulo: string;
    descripcion: string;
    estado: string;
    presupuesto_id?: string;
    presupuesto_nombre: string;
    presupuesto_correlativo: string;
    presupuesto_total: number;
    presupuesto_pendiente: number;
    presupuesto_estado: string;
    moneda_simbolo: string;
    pago_monto: number;
    cita_fecha?: string;
    cita_estado?: string;
    personal_nombre: string;
    diagnosticos_nombres: string[];
    procedimientos_nombres: string[];
  }


export default function SeguimientoTable({ casoId, numeroHistoria }: Props) {
  const [data, setData] = useState<SeguimientoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteCandidate, setDeleteCandidate] = useState<SeguimientoRow | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasFinancialImpact, setHasFinancialImpact] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const router = useRouter();
  const supabase = createClient();

  const fetchSeguimientos = useCallback(async () => {
    setLoading(true);
    try {
      const { data: presupuestosRes } = await supabase
        .from('presupuestos')
        .select('id, items_json')
        .eq('caso_id', casoId)
        .is('deleted_at', null);
      
      // Extraer items de items_json de todos los presupuestos
      const procedimientosMap = new Map<string, { nombre_procedimiento: string; descripcion?: string }>();
      const procedimientosByProcId = new Map<string, { nombre_procedimiento: string; descripcion?: string }>();
      (presupuestosRes || []).forEach((presupuesto) => {
        const itemsJson = presupuesto.items_json as unknown as Array<{
          procedimiento_id: string
          procedimiento_nombre: string
          descripcion?: string
          procedimiento_descripcion?: string
          notas?: string
        }> | null;
        (itemsJson || []).forEach((item, idx) => {
          const key = `${presupuesto.id}_${item.procedimiento_id}_${idx}`;
          const desc = (item.descripcion || item.procedimiento_descripcion || item.notas || '').trim();
          procedimientosMap.set(key, {
            nombre_procedimiento: item.procedimiento_nombre,
            descripcion: desc
          });
          // fallback por procedimiento_id directo
          procedimientosByProcId.set(item.procedimiento_id, { nombre_procedimiento: item.procedimiento_nombre, descripcion: desc });
        });
      });
      const res = await fetch(`/api/seguimientos?caso_id=${casoId}`);
      if (!res.ok) throw new Error('Error al cargar datos');
      
      const json = await res.json();
      const rawData = json.data as SeguimientoRaw[];

      const formattedData: SeguimientoRow[] = rawData.map((item) => {
        const symbol = item.presupuestos?.monedas?.simbolo || 'S/';
        const costoTotal = Number(item.presupuestos?.costo_total || 0);
        const pendiente = Number(item.saldo_pendiente_snapshot);
        const procIds = item.tratamientos_realizados_ids || item.procedimientos_realizados || [];
        const tratamientoTexto = (item.descripcion || '').trim();
        const formatNombre = (entry?: { nombre_procedimiento: string; descripcion?: string } | null) => {
          if (!entry) return null;
          const nombre = entry.nombre_procedimiento || '';
          const desc = (entry.descripcion || '').trim();
          const full = desc ? `${nombre} (${desc})` : nombre;
          return full.trim() || null;
        };

        const procNombres = tratamientoTexto
          ? [tratamientoTexto]
          : procIds.map(id => {
              return formatNombre(procedimientosMap.get(id))
                || formatNombre(procedimientosByProcId.get(id))
                || null;
            }).filter(Boolean) as string[];

        return {
          id: item.id,
          fecha: item.fecha,
          titulo: item.titulo,
          descripcion: item.descripcion,
          estado: item.estado,
          presupuesto_id: item.presupuestos?.id,
          presupuesto_nombre: item.presupuestos?.nombre || 'General',
          presupuesto_correlativo: item.presupuestos?.correlativo 
            ? `#${item.presupuestos.correlativo.toString().padStart(3, '0')}` 
            : 'S/N',
          presupuesto_total: costoTotal,
          presupuesto_pendiente: pendiente,
          presupuesto_estado: item.presupuestos?.estado || 'Desconocido',
          moneda_simbolo: symbol,
          pago_monto: item.pagos ? Number(item.pagos.monto) : 0,
          cita_fecha: item.citas?.fecha_inicio,
          cita_estado: item.citas?.estado,
          personal_nombre: item.personal?.nombre_completo || "Sistema",
          diagnosticos_nombres: [],
          procedimientos_nombres: procNombres
        };
      });

      setData(formattedData);
    } catch (err) {
      toast.error("Error al cargar la lista de seguimientos", { style: { backgroundColor: '#FF0000', color: 'white' } });
    } finally {
      setLoading(false);
    }
  }, [casoId, supabase]);

  useEffect(() => {
    fetchSeguimientos();
  }, [fetchSeguimientos]);

  const handleInitiateDelete = (row: SeguimientoRow) => {
      setDeleteCandidate(row);
      setHasFinancialImpact(row.pago_monto > 0);
      setIsDeleteDialogOpen(true);
  }

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
        const res = await fetch(`/api/seguimientos/${deleteCandidate.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Error al eliminar");
        
        toast.success("Seguimiento eliminado correctamente", { style: { backgroundColor: '#008000', color: 'white' } });
        // Forzar recarga completa para actualizar KPIs
        window.location.href = `/admin/ficha-odontologica/${numeroHistoria}/casos/${casoId}/seguimiento`;
    } catch (err) {
      toast.error("No se pudo eliminar el seguimiento.", { style: { backgroundColor: '#FF0000', color: 'white' } });
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setDeleteCandidate(null);
    }
  };

  const handleEdit = (seguimientoId: string) => {
    router.push(
      `/admin/ficha-odontologica/${numeroHistoria}/casos/${casoId}/seguimiento?action=editar&seguimientoId=${seguimientoId}`
    );
  };

  const normalized = (s: unknown) => String(s || "").toLowerCase();
  const matchesSearch = (row: SeguimientoRow) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const fecha = (() => {
      try { return format(new Date(row.fecha), "dd/MM/yyyy"); } catch { return ""; }
    })().toLowerCase();
    return (
      normalized(row.presupuesto_correlativo).includes(term) ||
      normalized(row.presupuesto_estado).includes(term) ||
      normalized(row.descripcion).includes(term) ||
      fecha.includes(term)
    );
  };
  const filteredData = data.filter(matchesSearch);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const pagedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getEstadoBadge = (estado: string) => {
      if(estado === 'Pagado') return "bg-emerald-100 text-emerald-700 border-emerald-200"
      if(estado === 'Parcial') return "bg-blue-100 text-blue-700 border-blue-200"
      return "bg-amber-100 text-amber-700 border-amber-200"
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16 bg-slate-50/50 rounded-lg border border-dashed">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex-1" />
        <div className="w-full max-w-sm relative">
          <Input
            placeholder="Buscar seguimiento o fecha (dd/MM/yyyy)"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="h-9 pr-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          />
          <ChevronRight className="absolute right-2 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white shadow-sm border-sky-100 dark:border-slate-800 dark:bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-sky-700 hover:bg-sky-700 border-b-sky-800 dark:bg-slate-800 dark:border-b-slate-700">
              <TableHead className="text-white font-semibold text-center w-[100px] dark:text-slate-100">Fecha</TableHead>
              <TableHead className="text-white font-semibold text-center dark:text-slate-100">Presupuesto</TableHead>
              <TableHead className="text-white font-semibold text-left pl-4 dark:text-slate-100">Tratamiento</TableHead>
              <TableHead className="text-white font-semibold text-left pl-4 w-[200px] dark:text-slate-100">Pagos</TableHead>
              <TableHead className="text-white font-semibold text-center dark:text-slate-100">Estado P.</TableHead>
              <TableHead className="text-white font-semibold text-center dark:text-slate-100">Próx. Cita</TableHead>
              <TableHead className="text-white font-semibold text-center dark:text-slate-100">Responsable</TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px] dark:text-slate-100">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow className="hover:bg-sky-50/30 dark:hover:bg-slate-700/30 transition-colors">
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="h-8 w-8 opacity-20"/>
                      No hay registros coincidentes.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pagedData.map((row) => (
                  <TableRow key={row.id} className="hover:bg-sky-50/30 dark:hover:bg-slate-700/30 transition-colors border-b-sky-50 dark:border-b-slate-700">
                    <TableCell className="text-center align-middle text-sm text-sky-900 dark:text-slate-200 font-medium">
                        {format(new Date(row.fecha), "dd/MM/yyyy")}
                    </TableCell>
                    
                    <TableCell className="text-center align-middle">
                       {row.presupuesto_correlativo !== 'S/N' ? (
                           <Badge variant="outline" className="font-mono bg-sky-50 text-sky-700 border-sky-200 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 text-sm hover:bg-sky-100 dark:hover:bg-slate-600">
                              {row.presupuesto_correlativo}
                           </Badge>
                       ) : (
                           <span className="text-xs text-slate-400">-</span>
                       )}
                    </TableCell>

                    <TableCell className="text-left pl-4 align-middle">
                      <div className="flex flex-col gap-2">
                        {(row.procedimientos_nombres && row.procedimientos_nombres.length > 0) ? (
                          <ul className="space-y-1">
                            {row.procedimientos_nombres.slice(0, 3).map((name, i) => (
                              <li
                                key={`p-${i}`}
                                className="text-xs text-slate-700 dark:text-slate-200 truncate"
                                title={name}
                              >
                                <span className="inline-flex items-center gap-1.5">
                                  <FileText className="h-3 w-3 text-sky-500 dark:text-sky-400 shrink-0" />
                                  <span className="truncate max-w-[200px]">{name}</span>
                                </span>
                              </li>
                            ))}
                            {row.procedimientos_nombres.length > 3 && (
                              <li className="text-xs text-slate-500 dark:text-slate-400 italic">
                                +{row.procedimientos_nombres.length - 3} más
                              </li>
                            )}
                          </ul>
                        ) : (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">Sin tratamientos</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-left pl-4 align-middle">
                        <div className="flex flex-col gap-1 text-xs w-full max-w-[180px]">
                            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                                <span>P.T:</span>
                                <span className="font-medium">{row.moneda_simbolo} {row.presupuesto_total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                                <span>P.R:</span>
                                <span className="font-bold">+ {row.pago_monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between items-center text-amber-600 dark:text-amber-400 border-t border-slate-100 dark:border-slate-700 pt-1 mt-0.5">
                                <span>P.P:</span>
                                <span className="font-bold">{row.moneda_simbolo} {row.presupuesto_pendiente.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </TableCell>
                    
                    <TableCell className="text-center align-middle">
                        <Badge variant="outline" className={`text-[10px] px-2 py-0.5 border ${getEstadoBadge(row.presupuesto_estado)}`}>
                            {row.presupuesto_estado}
                        </Badge>
                    </TableCell>

                    <TableCell className="text-center align-middle">
                      {row.cita_fecha ? (
                          <div className="flex flex-col items-center">
                              <div className="flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400">
                                  <CalendarCheck className="h-3 w-3" />
                                  {format(new Date(row.cita_fecha), "dd/MM/yyyy")}
                              </div>
                          </div>
                      ) : (
                          <div className="flex items-center justify-center gap-1 text-slate-300 dark:text-slate-600">
                              <CalendarX className="h-4 w-4" />
                          </div>
                      )}
                    </TableCell>

                    <TableCell className="text-center align-middle text-xs text-slate-600 dark:text-slate-400 truncate max-w-[100px]" title={row.personal_nombre}>
                      {row.personal_nombre}
                    </TableCell>

                    <TableCell className="text-center align-middle">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(row.id)}
                          className="h-8 w-8 text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 hover:bg-sky-100 dark:hover:bg-slate-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700" 
                            onClick={() => handleInitiateDelete(row)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
              ))
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
              {hasFinancialImpact ? (
                <span className="text-amber-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" /> Contiene Pagos
                </span>
              ) : (
                "¿Estás seguro?"
              )}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
                <div className="space-y-3 text-sm text-muted-foreground">
                  {isDeleting ? (
                    <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                  ) : (
                    <>
                      <div>Vas a eliminar un registro del <strong>{deleteCandidate?.fecha ? format(new Date(deleteCandidate.fecha), 'dd/MM/yyyy') : ''}</strong>.</div>
                      {hasFinancialImpact && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
                          <strong>¡Cuidado!</strong> Este seguimiento tiene un pago registrado de <span className="font-bold ml-1">{deleteCandidate?.moneda_simbolo} {deleteCandidate?.pago_monto.toFixed(2)}</span>.
                          <ul className="list-disc pl-5 mt-2 space-y-1"><li>El pago será anulado.</li><li>Se eliminarán las imágenes registradas.</li><li>Se eliminará la cita registrada.</li><li>Los totales se recalcularán.</li></ul>
                        </div>
                      )}
                      <div>Esta acción no se puede deshacer.</div>
                    </>
                  )}
                </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteCandidate(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={isDeleting}>
              {isDeleting ? 'Eliminando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}