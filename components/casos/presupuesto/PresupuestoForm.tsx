"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, Plus, Trash2, Loader2, X, CalendarIcon, ChevronsUpDown } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { upsertPresupuesto } from '@/app/admin/(protected)/ficha-odontologica/[numero_historia]/casos/[casoId]/presupuesto/actions'
import { ProcedimientosModal } from './ProcedimientosModal'

const ESPECIALIDADES_COMUNES = [
  'Endodoncia',
  'Periodoncia',
  'Ortodoncia',
  'Prostodoncia',
  'Odontología Pediátrica',
  'Odontología General',
  'Cirugía Oral',
  'Implantología',
  'Estética Dental',
  'Operatoria Dental',
  'Radiología Odontológica',
  'Patología Oral',
]

interface ProcedimientoModalData {
  id: string;
  nombre: string;
  precioDefault: number;
  cantidad: number;
  descripcion?: string;
}

interface ItemJson {
  procedimiento_id: string;
  procedimiento_nombre: string;
  costo: number;
  cantidad: number;
  pieza_dental: string | null;
  notas: string | null;
  orden_ejecucion: number;
  moneda_id?: string;
}

interface PlanItem {
  procedimiento_id: string;
  procedimiento_nombre: string;
  moneda_id: string;
  costo: number;
  cantidad: number;
  pieza_dental: string;
  descuento_porcentaje: number;
  total: number;
  descripcion: string; 
}

interface StoredPlanItem {
  procedimiento_id: string;
  procedimiento_nombre: string;
  costo: number;
  cantidad: number;
  pieza_dental: string | null;
  notas: string | null; 
  orden_ejecucion: number;
}

interface DiagnosticoOption {
  id: string;
  fecha: string;
  nombre: string;
}

interface MonedaOption {
  id: string;
  nombre: string;
  codigo: string;
}

interface PersonalData {
  id: string;
  nombre_completo: string;
  rol: string;
}

interface PrecioProcedimientoResponse {
  procedimiento_id: string;
  precio: number;
}

interface PresupuestoFormProps {
  casoId: string;
  pacienteId: string;
  numeroHistoria: string;
  presupuesto?: {
    id: string;
    nombre: string;
    medico_id: string | null;
    observacion: string | null;
    especialidad?: string | null;
    costo_total: number | null;
    moneda_id: string | null;
    diagnostico_ids?: string[];
    items_json?: ItemJson[] | null; 
    plan_items?: ItemJson[];
  };
}

const DiagnosticoRow = ({ 
  value, 
  options, 
  onChange, 
  onRemove, 
  isLast, 
  onAdd 
}: { 
  value: string, 
  options: DiagnosticoOption[], 
  onChange: (val: string) => void, 
  onRemove: () => void, 
  isLast: boolean, 
  onAdd: () => void 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const selected = options.find((d) => d.id === value)
    if (selected) {
        setSearchTerm(selected.nombre)
    } else if (!value) {
        setSearchTerm("")
    }
  }, [value, options])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        const selected = options.find((d) => d.id === value)
        setSearchTerm(selected ? selected.nombre : "")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [wrapperRef, value, options])

  const filteredOptions = options.filter(opt => 
    opt.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex gap-2 items-center" ref={wrapperRef}>
        <div className="flex-1 min-w-0 relative">
            <div className="relative">
                <Input
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setIsOpen(true)
                        if (value) onChange("")
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Buscar diagnóstico..."
                    className="w-full pr-8 truncate"
                    autoComplete="off"
                />
                <ChevronsUpDown className="absolute right-2 top-2.5 h-4 w-4 opacity-50 pointer-events-none" />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((opt) => (
                            <div
                                key={opt.id}
                                className={`px-3 py-2 text-sm cursor-pointer flex flex-col hover:bg-sky-50 ${value === opt.id ? 'bg-sky-50' : ''}`}
                                onClick={() => {
                                    onChange(opt.id)
                                    setSearchTerm(opt.nombre)
                                    setIsOpen(false)
                                }}
                            >
                                <span className="font-medium text-slate-700">{opt.nombre}</span>
                                <span className="text-[10px] text-muted-foreground">{new Date(opt.fecha).toLocaleDateString()}</span>
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-2 text-sm text-muted-foreground italic text-center">
                            No se encontraron resultados
                        </div>
                    )}
                </div>
            )}
        </div>
        
        {isLast && (
            <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 shrink-0 border-dashed border-slate-300 hover:border-sky-500 hover:bg-sky-50 text-slate-500 hover:text-sky-600"
                onClick={onAdd}
                title="Agregar otro diagnóstico"
            >
                <Plus className="h-4 w-4" />
            </Button>
        )}

        <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 text-slate-400 hover:text-destructive hover:bg-red-50 shrink-0"
            onClick={onRemove}
        >
            <X className="h-4 w-4" />
        </Button>
    </div>
  )
}

export function PresupuestoForm({
  casoId,
  pacienteId,
  numeroHistoria,
  presupuesto,
}: PresupuestoFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [fecha, setFecha] = useState(presupuesto ? new Date(presupuesto.costo_total || 0).toISOString().split('T')[0] : format(new Date(), 'yyyy-MM-dd'))
  const [medicId, setMedicId] = useState(presupuesto?.medico_id || '')
  
  const [selectedDiagnosticos, setSelectedDiagnosticos] = useState<string[]>(
    presupuesto?.diagnostico_ids && presupuesto.diagnostico_ids.length > 0 
      ? presupuesto.diagnostico_ids 
      : ['']
  );
  
  const [especialidad, setEspecialidad] = useState(presupuesto?.especialidad || '')
  const [observacion, setObservacion] = useState(presupuesto?.observacion || '')
  const [monedaId, setMonedaId] = useState(presupuesto?.moneda_id || '')
  
  const [items, setItems] = useState<PlanItem[]>(() => {
    const rawItems = (presupuesto?.items_json) || [];
    return rawItems.map((item) => ({
      procedimiento_id: item.procedimiento_id,
      procedimiento_nombre: item.procedimiento_nombre || `Procedimiento ${item.procedimiento_id.slice(0, 8)}`, 
      moneda_id: presupuesto?.moneda_id || '',
      costo: item.costo,
      cantidad: item.cantidad,
      pieza_dental: item.pieza_dental || "",
      descuento_porcentaje: 0,
      total: item.costo * item.cantidad,
      descripcion: item.notas || "" 
    }));
  });

  const [monedas, setMonedas] = useState<MonedaOption[]>([])
  const [diagnosticos, setDiagnosticos] = useState<DiagnosticoOption[]>([])
  const [currencySymbol, setCurrencySymbol] = useState<string>('S/')
  const [currentPersonal, setCurrentPersonal] = useState<PersonalData | null>(null)
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (!val) {
      setFecha('')
      return
    }
    const yearPart = val.split('-')[0]
    if (yearPart.length > 4) return
    setFecha(val)
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const [monedasRes, diagnosticosRes] = await Promise.all([
          supabase.from('monedas').select('id, nombre, codigo'),
          supabase
            .from('diagnosticos')
            .select('id, fecha, nombre')
            .eq('caso_id', casoId)
            .order('fecha', { ascending: false })
        ])

        if (monedasRes.data) {
            setMonedas(monedasRes.data)
        }
        
        const fetchedDiagnosticos: DiagnosticoOption[] = ((diagnosticosRes.data || []) as unknown as Array<Record<string, unknown>>).map((d) => {
          const record = d || {} as Record<string, unknown>
          return {
            id: String(record.id || ""),
            fecha: String(record.fecha || ""),
            nombre: String(record.nombre || "")
          }
        })
        setDiagnosticos(fetchedDiagnosticos)

        if (presupuesto?.moneda_id && monedasRes.data) {
          const found = monedasRes.data.find((m) => m.id === presupuesto.moneda_id);
          if (found) setCurrencySymbol(getCurrencySymbol(found.codigo));
        }
      } catch (error) {
        // ignore
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [supabase, presupuesto, casoId]);

  useEffect(() => {
    const resolveCurrentPersonal = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          const { data: personalMatch } = await supabase
            .from("personal")
            .select("id, nombre_completo, rol")
            .ilike("email", user.email)
            .single();

          if (personalMatch) {
            setCurrentPersonal(personalMatch);
            if (!medicId) setMedicId(personalMatch.id);
          }
        }
      } catch (e) { }
    };
    resolveCurrentPersonal()
  }, [supabase, medicId])

  const getCurrencySymbol = (code: string | undefined) => {
    if (!code) return "S/";
    const map: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", PEN: "S/", UYU: "$U" };
    return map[code] || code + " ";
  };

  useEffect(() => {
    if (!monedaId || monedas.length === 0) return;
    const target = monedas.find((m) => m.id === monedaId);
    if (target?.codigo) setCurrencySymbol(getCurrencySymbol(target.codigo));
  }, [monedaId, monedas]);

  useEffect(() => {
    const updatePrices = async () => {
      if (!monedaId || items.length === 0) return;

      const procIds = Array.from(new Set(items.map((i) => i.procedimiento_id)));
      
      const { data } = await supabase
        .from('procedimiento_precios')
        .select('procedimiento_id, precio')
        .eq('moneda_id', monedaId)
        .in('procedimiento_id', procIds)
        .is('vigente_hasta', null);

      if (data) {
        const pricesData = data as unknown as PrecioProcedimientoResponse[];
        const pricesMap: Record<string, number> = {};
        
        pricesData.forEach((p) => {
            pricesMap[p.procedimiento_id] = Number(p.precio)
        });

        setItems((currentItems) => 
            currentItems.map((item) => {
                if (item.moneda_id === monedaId) {
                    return item;
                }

                const newPrice = pricesMap[item.procedimiento_id];
                
                if (newPrice !== undefined) {
                    const newTotal = newPrice * item.cantidad - (newPrice * item.cantidad * item.descuento_porcentaje) / 100;
                    return {
                        ...item,
                        moneda_id: monedaId,
                        costo: newPrice,
                        total: newTotal
                    }
                }
                return { ...item, moneda_id: monedaId }
            })
        )
      }
    }

    updatePrices();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monedaId, supabase]);

  const handleDiagnosticoChange = (index: number, value: string) => {
    const newDiags = [...selectedDiagnosticos];
    newDiags[index] = value;
    setSelectedDiagnosticos(newDiags);
  };

  const addDiagnosticoRow = () => {
    setSelectedDiagnosticos([...selectedDiagnosticos, '']);
  };

  const removeDiagnosticoRow = (index: number) => {
    if (selectedDiagnosticos.length === 1) {
        setSelectedDiagnosticos(['']);
    } else {
        const newDiags = selectedDiagnosticos.filter((_, i) => i !== index);
        setSelectedDiagnosticos(newDiags);
    }
  };

  const handleAddProcedimiento = (procedimientos: ProcedimientoModalData[]) => {
    const newItems: PlanItem[] = [];
    procedimientos.forEach((proc) => {
      newItems.push({
        procedimiento_id: proc.id,
        procedimiento_nombre: proc.nombre,
        moneda_id: monedaId,
        costo: proc.precioDefault,
        cantidad: proc.cantidad || 1,
        pieza_dental: "",
        descuento_porcentaje: 0,
        total: proc.precioDefault * (proc.cantidad || 1),
        descripcion: proc.descripcion || "" 
      });
    });
    setItems((prevItems) => [...prevItems, ...newItems]);
    toast.success("Procedimiento(s) agregado(s).", { style: { backgroundColor: "#008000", color: "white" } });
  };

  const handleDeleteItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const handleUpdateItem = (index: number, field: string, value: string | number) => {
    const updated = [...items];
    const item = updated[index];

    if (field === "costo") {
      const val = Number(value);
      item.costo = val < 0 ? 0 : val;
    } else if (field === "cantidad") {
      const val = Number(value);
      item.cantidad = val < 1 ? 1 : val;
    } else if (field === "pieza_dental") {
      item.pieza_dental = value as string;
    } else if (field === "descuento_porcentaje") {
      const val = Number(value);
      item.descuento_porcentaje = val < 0 ? 0 : (val > 100 ? 100 : val);
    } else if (field === "descripcion") {
      item.descripcion = value as string;
    }
    
    item.total = item.costo * item.cantidad - (item.costo * item.cantidad * item.descuento_porcentaje) / 100;
    setItems(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  const handleSave = async () => {
    const validDiagnosticos = selectedDiagnosticos.filter(d => d.trim() !== '');

    if (validDiagnosticos.length === 0) {
      toast.error("Debe seleccionar al menos un diagnóstico.", { style: { backgroundColor: "#FF0000", color: "white" } });
      return;
    }

    if (!monedaId) {
      toast.error("Debe seleccionar una moneda.", { style: { backgroundColor: "#FF0000", color: "white" } });
      return;
    }

    if (items.length === 0) {
      toast.error("Debe agregar al menos un procedimiento.", { style: { backgroundColor: "#FF0000", color: "white" } });
      return;
    }

    setLoading(true);

    const formData = {
      id: presupuesto?.id || null,
      caso_id: casoId,
      paciente_id: pacienteId,
      diagnostico_ids: validDiagnosticos,
      medico_id: medicId,
      observacion: observacion || null,
      especialidad: especialidad || null,
      costo_total: subtotal,
      moneda_id: monedaId,
      estado: "Por Cobrar",
    };

    const itemsData: StoredPlanItem[] = items.map((item, index) => ({
      procedimiento_id: item.procedimiento_id,
      procedimiento_nombre: item.procedimiento_nombre,
      moneda_id: monedaId,
      costo: item.costo,
      cantidad: item.cantidad,
      pieza_dental: item.pieza_dental || null,
      notas: item.descripcion || null, 
      orden_ejecucion: index + 1,
    }));

    const result = await upsertPresupuesto(formData, itemsData);

    if (result.success) {
      toast.success("Presupuesto guardado exitosamente.", { style: { backgroundColor: "#008000", color: "white" } });
      
      // Forzar recarga completa de la página para actualizar KPIs y tabla
      window.location.href = `/admin/ficha-odontologica/${numeroHistoria}/casos/${casoId}/presupuesto`;
    } else {
      toast.error(result.error?.message || "Error al guardar", { style: { backgroundColor: "#FF0000", color: "white" } });
      setLoading(false);
    }
  };

  if (loadingData) return <div className='flex justify-center items-center py-16'><Loader2 className='h-8 w-8 animate-spin text-muted-foreground' /></div>;

  return (
    <div className='container mx-auto p-4 max-w-6xl'>
      <div className='flex items-center mb-6'>
        <Button variant='ghost' size='icon' onClick={() => router.back()} className='mr-4'>
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <h1 className='text-2xl font-bold'>{presupuesto ? "Editar" : "Nuevo"} Presupuesto</h1>
      </div>

      <div className='grid grid-cols-1 gap-6'>
        <Card>
          <CardHeader><CardTitle>Datos del Presupuesto</CardTitle></CardHeader>
          <CardContent className='space-y-4'>
            
            <div className='flex flex-col md:flex-row gap-4 w-full'>
              <div className="w-auto min-w-[140px]">
                <Label htmlFor='fecha'>Fecha</Label>
                <div className="relative mt-1">
                  <Input 
                    id='fecha' 
                    type='date' 
                    value={fecha} 
                    onChange={handleDateChange} 
                    className='w-full'
                    style={{ backgroundImage: 'none' }}
                  />
                  {!fecha && <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <Label htmlFor='moneda'>Moneda *</Label>
                <Select value={monedaId} onValueChange={setMonedaId}>
                  <SelectTrigger id='moneda' className='mt-1 w-full [&>span]:min-w-0 [&>span]:truncate'>
                    <SelectValue placeholder='Seleccionar...' />
                  </SelectTrigger>
                  <SelectContent>
                    {monedas.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.codigo} - {m.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-0">
                <Label htmlFor="especialidad">Especialidad</Label>
                <Select value={especialidad} onValueChange={setEspecialidad}>
                  <SelectTrigger id="especialidad" className="mt-1 w-full [&>span]:min-w-0 [&>span]:truncate">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>{ESPECIALIDADES_COMUNES.map((esp) => (<SelectItem key={esp} value={esp}>{esp}</SelectItem>))}</SelectContent>
                </Select>
              </div>

              <div className="flex-[1.5] min-w-0">
                <Label htmlFor='medico'>Médico</Label>
                <Input id='medico' value={currentPersonal?.nombre_completo || "Cargando..."} readOnly className='mt-1 bg-muted/50 w-full truncate' />
              </div>
            </div>

            <div className="border-b my-6" />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              
              <div>
                <Label className="mb-2 block">Diagnóstico(s) *</Label>
                <div className="space-y-2">
                    {selectedDiagnosticos.map((diagValue, index) => (
                        <DiagnosticoRow 
                            key={index}
                            value={diagValue}
                            options={diagnosticos}
                            onChange={(val) => handleDiagnosticoChange(index, val)}
                            onRemove={() => removeDiagnosticoRow(index)}
                            isLast={index === selectedDiagnosticos.length - 1}
                            onAdd={addDiagnosticoRow}
                        />
                    ))}
                </div>
              </div>

              <div className="flex flex-col h-full mb-4">
                <Label htmlFor='observacion' className="mb-2">Observación</Label>
                <Textarea
                  id='observacion'
                  placeholder='Notas adicionales sobre el presupuesto...'
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  className='flex-1 min-h-[100px] resize-none'
                />
              </div>
            </div>

          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Procedimientos</CardTitle>
            <Button onClick={() => setIsModalOpen(true)} variant='default' size='sm'>
              <Plus className='mr-2 h-4 w-4' /> Agregar Procedimiento
            </Button>
          </CardHeader>
          <CardContent>
            <div className='border rounded-lg overflow-hidden'>
              <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='bg-sky-700 text-white pl-4 w-[35%]'>Nombre / Descripción</TableHead>
                        <TableHead className='bg-sky-700 text-white text-center'>Pieza</TableHead>
                        <TableHead className='bg-sky-700 text-white text-center'>Cant.</TableHead>
                        <TableHead className='bg-sky-700 text-white text-right'>P. Unit</TableHead>
                        <TableHead className='bg-sky-700 text-white text-center'>Desc %</TableHead>
                        <TableHead className='bg-sky-700 text-white text-right pr-4'>Total</TableHead>
                        <TableHead className='bg-sky-700 text-white text-center'>Acción</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index} className='hover:bg-sky-50/50 border-b'>
                      <TableCell className='pl-4 align-top py-3'>
                        <div className="flex flex-col gap-1.5">
                            <span className="font-medium text-sm">{item.procedimiento_nombre}</span>
                            <Input 
                                value={item.descripcion} 
                                onChange={(e) => handleUpdateItem(index, "descripcion", e.target.value)}
                                placeholder="Añadir descripción..."
                                className="h-7 text-xs text-muted-foreground bg-slate-50 border-slate-200"
                            />
                        </div>
                      </TableCell>
                      <TableCell className="align-middle text-center">
                        <Input value={item.pieza_dental} onChange={(e) => handleUpdateItem(index, "pieza_dental", e.target.value)} className='h-8 w-16 mx-auto text-center' />
                      </TableCell>
                      <TableCell className="align-middle text-center">
                        <Input type='number' value={item.cantidad} onChange={(e) => handleUpdateItem(index, "cantidad", e.target.value)} min='1' className='h-8 w-16 mx-auto text-center' />
                      </TableCell>
                      <TableCell className='align-middle text-right'>
                        <Input type='number' step='0.01' value={item.costo} onChange={(e) => handleUpdateItem(index, "costo", e.target.value)} className='h-8 w-24 ml-auto text-right' />
                      </TableCell>
                      <TableCell className="align-middle text-center">
                         <Input type='number' value={item.descuento_porcentaje} onChange={(e) => handleUpdateItem(index, "descuento_porcentaje", e.target.value)} min='0' max='100' className='h-8 w-16 mx-auto text-center' />
                      </TableCell>
                      <TableCell className='align-middle text-right font-semibold pr-4'>
                        {currencySymbol} {item.total.toFixed(2)}
                      </TableCell>
                      <TableCell className='align-middle text-center'>
                        <Button variant='ghost' size='icon' onClick={() => handleDeleteItem(index)} className='h-8 w-8 hover:text-destructive'>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {items.length > 0 && (
              <div className='mt-6 flex justify-end'>
                <div className='flex flex-col items-end gap-1 p-4 bg-muted/20 rounded-lg border'>
                  <p className='text-sm text-muted-foreground'>Total Presupuesto:</p>
                  <p className='text-3xl font-bold text-sky-700 dark:text-sky-400'>
                    {currencySymbol} {subtotal.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className='flex justify-end gap-3'>
          <Button variant='outline' onClick={() => router.back()}>Cancelar</Button>
          <Button onClick={handleSave} disabled={loading} className="min-w-[150px]">
            {loading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : "Guardar Presupuesto"}
          </Button>
        </div>
      </div>
      
      {isModalOpen && <ProcedimientosModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelectProcedimientos={handleAddProcedimiento} monedaId={monedaId} />}
    </div>
  );
}