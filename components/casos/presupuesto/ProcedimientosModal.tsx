"use client";

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Loader2, ChevronLeft, ChevronRight, AlertCircle, Search } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Procedimiento {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  grupo_nombre: string;
}

interface ProcedimientoRaw {
  id: string;
  nombre: string;
  descripcion: string | null;
  grupo_id: string | null;
  grupos_procedimiento: {
    nombre: string;
  } | null;
  procedimiento_precios: Array<{
    precio: number;
    vigente_hasta: string | null;
    vigente_desde: string;
  }>;
}

interface ProcedimientosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProcedimientos: (
    procedimientos: Array<{ id: string; nombre: string; precioDefault: number; cantidad: number; descripcion?: string }>
  ) => void
  monedaId: string
}

export function ProcedimientosModal({
  isOpen,
  onClose,
  onSelectProcedimientos,
  monedaId,
}: ProcedimientosModalProps) {
  const supabase = createClient()
  const [procedimientos, setProcedimientos] = useState<Procedimiento[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [grupos, setGrupos] = useState<Array<{id: string; nombre: string}>>([])
  const [selectedGrupoId, setSelectedGrupoId] = useState<string | null>(null)
  const [missingMoneda, setMissingMoneda] = useState(false)
  
  const [cantidades, setCantidades] = useState<Record<string, number>>({})
  const [descriptions, setDescriptions] = useState<Record<string, string>>({})
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 7

  const [currencySymbol, setCurrencySymbol] = useState<string>("S/");

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

  useEffect(() => {
    if (!isOpen) return

    const loadGrupos = async () => {
      try {
        const { data: gruposData } = await supabase
          .from('grupos_procedimiento')
          .select('id, nombre')
          .order('nombre', { ascending: true })

        if (gruposData) setGrupos(gruposData)
      } catch (e) {
        console.error('Error loading grupos:', e)
      }
    }

    loadGrupos()

    const loadProcedimientos = async () => {
      setLoading(true);
      try {
        if (!monedaId) {
          setMissingMoneda(true);
          setProcedimientos([]);
          setTotalPages(1);
          setLoading(false);
          return;
        }
        setMissingMoneda(false);

        let query = supabase
          .from("procedimientos")
          .select(
            `
            id,
            nombre,
            descripcion,
            grupo_id,
            grupos_procedimiento ( nombre ),
            procedimiento_precios!inner(precio, vigente_hasta, vigente_desde)
          `,
            { count: "exact" }
          )
          .eq('activo', true)
          .eq('procedimiento_precios.moneda_id', monedaId)
          .is('procedimiento_precios.vigente_hasta', null) 

        if (selectedGrupoId) {
          query = query.eq('grupo_id', selectedGrupoId)
        }

        if (searchTerm.trim()) {
          query = query.or(
            `nombre.ilike.%${searchTerm}%`
          );
        }

        const { data, count, error } = await query
          .range(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage - 1
          )
          .order("nombre", { ascending: true });

        if (error) throw error;

        const rawData = (data || []) as unknown as ProcedimientoRaw[];

        const formatted: Procedimiento[] = rawData.map((p) => {
          const preciosSorted = [...p.procedimiento_precios].sort((a, b) => {
            return new Date(b.vigente_desde).getTime() - new Date(a.vigente_desde).getTime();
          });

          return {
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion || "",
            precio: preciosSorted[0]?.precio || 0,
            grupo_nombre: p.grupos_procedimiento?.nombre || "General"
          };
        });

        setProcedimientos(formatted);
        setTotalPages(Math.ceil((count || 0) / itemsPerPage));
      } catch (error) {
        console.error("Error loading procedimientos:", error);
        if (!missingMoneda) {
          toast.error("Error al cargar procedimientos.", {
            style: { backgroundColor: "#FF0000", color: "white" },
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadProcedimientos()
  }, [isOpen, monedaId, searchTerm, currentPage, supabase, missingMoneda, selectedGrupoId])

  useEffect(() => {
    if (!isOpen) {
      setSelectedGrupoId(null)
      setDescriptions({})
      setCantidades({})
      setExpandedRows({})
    }
  }, [isOpen])

  useEffect(() => {
    const loadMoneda = async () => {
      if (!monedaId) {
        setCurrencySymbol(getCurrencySymbol(null));
        return;
      }
      try {
        const { data, error } = await supabase
          .from("monedas")
          .select("codigo")
          .eq("id", monedaId)
          .single();
        if (!error && data) {
          setCurrencySymbol(getCurrencySymbol(data.codigo));
        }
      } catch (e) {
        console.error("Error loading moneda code", e);
      }
    };

    loadMoneda();
  }, [monedaId, supabase]);

  const handleAddProcedimiento = (procedimiento: Procedimiento) => {
    const cantidad = cantidades[procedimiento.id] || 1;
    const finalDescription = descriptions[procedimiento.id] !== undefined 
      ? descriptions[procedimiento.id] 
      : procedimiento.descripcion;

    onSelectProcedimientos([
      {
        id: procedimiento.id,
        nombre: procedimiento.nombre,
        precioDefault: procedimiento.precio,
        cantidad,
        descripcion: finalDescription
      },
    ]);
    
    setCantidades(prev => ({ ...prev, [procedimiento.id]: 1 }));
  };

  const toggleDescription = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='!w-[70vw] !max-w-none max-h-[85vh] flex flex-col p-6'>
        <DialogHeader>
          <DialogTitle>Agregar Procedimientos</DialogTitle>
          <DialogDescription>
            Selecciona tratamientos para agregarlos al presupuesto.
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-4 flex-1 overflow-hidden'>
          <div className="flex flex-col md:flex-row gap-4 justify-between pt-2">
            <div className="flex gap-2 flex-1">
              <Select value={selectedGrupoId ?? '__all__'} onValueChange={(value) => { setSelectedGrupoId(value === '__all__' ? null : value); setCurrentPage(1) }}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Todos los grupos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todos los grupos</SelectItem>
                  {grupos.map(g => (
                    <SelectItem key={g.id} value={g.id}>{g.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder='Buscar por nombre...'
                  value={searchTerm}
                  autoComplete='off'
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className='flex justify-center items-center flex-1 border rounded-lg bg-muted/10'>
              <Loader2 className='h-8 w-8 animate-spin text-sky-700' />
            </div>
          ) : (
            <>
              {missingMoneda && (
                <div className='p-4 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 text-sm flex items-center justify-center gap-2'>
                  <AlertCircle className="h-5 w-5" />
                  Selecciona una moneda en el formulario para ver los precios disponibles.
                </div>
              )}
              
              <div className='border rounded-lg overflow-hidden flex-1 relative bg-card flex flex-col'>
                <div className="flex-1 overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 z-10 shadow-sm">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className='bg-sky-700 text-white font-semibold text-center w-[20%]'>Procedimiento</TableHead>
                        <TableHead className='bg-sky-700 text-white font-semibold text-left w-[45%] pl-8'>Tratamiento</TableHead>
                        <TableHead className='bg-sky-700 text-white font-semibold text-center w-[10%]'>Cant. Pieza</TableHead>
                        <TableHead className='bg-sky-700 text-white font-semibold text-right w-[15%] pr-4'>Precio</TableHead>
                        <TableHead className='bg-sky-700 text-white font-semibold text-center w-[10%]'>Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {procedimientos.map((proc) => {
                        const isExpanded = expandedRows[proc.id];
                        return (
                          <TableRow key={proc.id} className='hover:bg-sky-50/50 dark:hover:bg-sky-900/20 transition-colors border-b border-border'>
                            
                            <TableCell className='text-center text-sm text-muted-foreground align-middle py-3'>
                              <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs border">
                                {proc.grupo_nombre}
                              </span>
                            </TableCell>

                            <TableCell className='align-middle py-2'>
                              <div className="flex items-center gap-2 w-full">
                                <span className='font-medium text-sm text-foreground whitespace-nowrap'>
                                  {proc.nombre}
                                </span>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full shrink-0"
                                  onClick={() => toggleDescription(proc.id)}
                                >
                                  <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                                </Button>

                                <div 
                                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'w-[250px] opacity-100 ml-2' : 'w-0 opacity-0 ml-0'}`}
                                >
                                  <Input 
                                    className="h-7 text-xs bg-background border-input"
                                    placeholder="Descripción (opcional)"
                                    value={descriptions[proc.id] !== undefined ? descriptions[proc.id] : proc.descripcion}
                                    onChange={(e) => setDescriptions({...descriptions, [proc.id]: e.target.value})}
                                  />
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className='text-center align-middle'>
                              <Input
                                type='number'
                                min='1'
                                max='10'
                                value={cantidades[proc.id] || 1}
                                onChange={(e) =>
                                  setCantidades({
                                    ...cantidades,
                                    [proc.id]: Math.max(1, parseInt(e.target.value) || 1),
                                  })
                                }
                                className='h-8 text-center text-sm w-16 mx-auto bg-background'
                              />
                            </TableCell>

                            <TableCell className='text-right font-semibold text-foreground align-middle pr-4'>
                              {currencySymbol} {proc.precio.toFixed(2)}
                            </TableCell>

                            <TableCell className='text-center align-middle'>
                              <Button
                                size='icon'
                                variant='ghost'
                                className='h-8 w-8 hover:bg-sky-100 dark:hover:bg-sky-800 text-sky-700 dark:text-sky-400'
                                onClick={() => handleAddProcedimiento(proc)}
                                title="Agregar al presupuesto"
                              >
                                <Plus className='h-5 w-5' />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      
                      {procedimientos.length === 0 && !missingMoneda && (
                        <TableRow>
                          <TableCell colSpan={5} className='h-32 text-center text-muted-foreground'>
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Search className="h-8 w-8 opacity-20" />
                              <p>No se encontraron procedimientos</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className='flex justify-center gap-2 items-center py-4 border-t bg-background shrink-0'>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="h-8 w-8"
                    >
                      <ChevronLeft className='h-4 w-4' />
                    </Button>
                    <span className='text-sm text-muted-foreground font-medium'>
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8"
                    >
                      <ChevronRight className='h-4 w-4' />
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}