"use client";

import React, { useState, useEffect } from "react";
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
import { ChevronLeft, Plus, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { upsertPresupuesto } from '@/app/admin/(protected)/ficha-odontologica/[numero_historia]/casos/[casoId]/presupuesto/actions'
import { ProcedimientosModal } from './ProcedimientosModal'

// Especialidades odontológicas comunes
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

interface PlanItem {
  procedimiento_id: string;
  procedimiento_nombre: string;
  moneda_id: string;
  costo: number;
  cantidad: number;
  pieza_dental: string;
  descuento_porcentaje: number;
  total: number;
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

interface PresupuestoFormProps {
  casoId: string;
  pacienteId: string;
  numeroHistoria: string;
  presupuesto?: {
    id: string
    nombre: string
    medico_id: string | null
    observacion: string | null
    especialidad?: string | null
    costo_total: number | null
    moneda_id: string | null
    items_json?: Array<{
      procedimiento_id: string;
      procedimiento_nombre: string;
      costo: number;
      cantidad: number;
      pieza_dental: string | null;
      notas: string | null;
      orden_ejecucion: number;
    }> | null;
    plan_items?: Array<{
      id: string
      procedimiento_id: string
      costo: number
      cantidad: number
      pieza_dental: string | null
      procedimientos: { nombre: string }
    }>
  }
}

export function PresupuestoForm({
  casoId,
  pacienteId,
  numeroHistoria,
  presupuesto,
}: PresupuestoFormProps) {
  const router = useRouter();
  const supabase = createClient();

  // Form State
  const [fecha, setFecha] = useState(presupuesto ? new Date(presupuesto.costo_total || 0).toISOString().split('T')[0] : format(new Date(), 'yyyy-MM-dd'))
  const [medicId, setMedicId] = useState(presupuesto?.medico_id || '')
  const [asunto, setAsunto] = useState(presupuesto?.nombre || '')
  const [especialidad, setEspecialidad] = useState(presupuesto?.especialidad || '')
  const [observacion, setObservacion] = useState(presupuesto?.observacion || '')
  const [monedaId, setMonedaId] = useState(presupuesto?.moneda_id || '')
  const [items, setItems] = useState<PlanItem[]>(
    presupuesto?.items_json?.map((item) => ({
      procedimiento_id: item.procedimiento_id,
      procedimiento_nombre: item.procedimiento_nombre || `Procedimiento ${item.procedimiento_id.slice(0, 8)}`, 
      moneda_id: presupuesto.moneda_id || '',
      costo: item.costo,
      cantidad: item.cantidad,
      pieza_dental: item.pieza_dental || "",
      descuento_porcentaje: 0,
      total: item.costo * item.cantidad,
    })) ||
      presupuesto?.plan_items?.map((item) => ({
        procedimiento_id: item.procedimiento_id,
        procedimiento_nombre: item.procedimientos.nombre,
        moneda_id: presupuesto.moneda_id || "",
        costo: item.costo,
        cantidad: item.cantidad,
        pieza_dental: item.pieza_dental || "",
        descuento_porcentaje: 0,
        total: item.costo * item.cantidad,
      })) ||
      []
  );

  // UI State
  const [monedas, setMonedas] = useState<Array<{ id: string; nombre: string; codigo: string }>>([])
  const [currencySymbol, setCurrencySymbol] = useState<string>('S/')
  const [currentPersonal, setCurrentPersonal] = useState<{ id: string; nombre_completo: string; rol?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  // Sincronizar items cuando presupuesto cambia (modo editar)
  useEffect(() => {
    if (presupuesto?.items_json && Array.isArray(presupuesto.items_json)) {
      interface StoredItem {
        procedimiento_id: string
        procedimiento_nombre?: string
        moneda_id?: string
        costo?: number
        cantidad?: number
        pieza_dental?: string | null
        protocolo?: string | null
      }
      const loadedItems: PlanItem[] = presupuesto.items_json.map((item: StoredItem) => ({
        procedimiento_id: item.procedimiento_id,
        procedimiento_nombre: item.procedimiento_nombre,
        moneda_id: presupuesto.moneda_id || '', 
        costo: item.costo,
        cantidad: item.cantidad,
        pieza_dental: item.pieza_dental || '',
        descuento_porcentaje: 0,
        total: item.costo * item.cantidad,
      }))
      setItems(loadedItems)
    }
  }, [presupuesto?.id, presupuesto?.items_json, presupuesto?.moneda_id]) // Solo cuando el ID del presupuesto cambia (edit mode)

  // Load initial data (monedas)
  useEffect(() => {
    const loadData = async () => {
      try {
        const [, monedasData] = await Promise.all([
          supabase.from('personal').select('id, nombre_completo').eq('activo', true),
          supabase.from('monedas').select('id, nombre, codigo'),
        ])

        if (monedasData.data) setMonedas(monedasData.data as Array<{id: string; nombre: string; codigo: string}>)
        // Si hay moneda por defecto en el presupuesto, setear símbolo
        if (presupuesto?.moneda_id && monedasData.data) {
          const found = (
            monedasData.data as Array<{ id: string; nombre: string; codigo: string }>
          ).find((m) => m.id === presupuesto.moneda_id);
          if (found) setCurrencySymbol(getCurrencySymbol(found.codigo));
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [supabase, presupuesto?.moneda_id]);

  // Obtener usuario actual y su registro en tabla personal (para autocompletar creador)
  useEffect(() => {
    const resolveCurrentPersonal = async () => {
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

          if (personalMatch && personalMatch.length > 0) {
            setCurrentPersonal({
              id: personalMatch[0].id,
              nombre_completo: personalMatch[0].nombre_completo,
              rol: personalMatch[0].rol,
            });
            // Si no hay medicId establecido, usar el actual
            if (!medicId) setMedicId(personalMatch[0].id);
          }
        }
      } catch (e) {
        console.error("Error resolving current personal:", e);
      }
    };

    resolveCurrentPersonal()
  }, [supabase, medicId])

  // Helper para símbolos
  const getCurrencySymbol = (code: string | undefined) => {
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

  // Actualizar símbolo cuando cambia la moneda seleccionada
  useEffect(() => {
    if (!monedaId || monedas.length === 0) return;
    const target = monedas.find((m) => m.id === monedaId);
    if (target?.codigo) {
      setCurrencySymbol(getCurrencySymbol(target.codigo));
    }
  }, [monedaId, monedas]);

  // Convertir precios de items cuando cambia la moneda seleccionada (disparador único)
  useEffect(() => {
    const convertPrices = async (newMonedaId: string) => {
      if (!newMonedaId) return;
      try {
        const procIds = Array.from(
          new Set(items.map((i) => i.procedimiento_id))
        );
        if (procIds.length === 0) return;

        const { data: preciosData, error: preciosError } = await supabase
          .from("procedimiento_precios")
          .select("procedimiento_id, moneda_id, precio, created_at")
          .in("procedimiento_id", procIds)
          .eq("moneda_id", newMonedaId);

        if (preciosError) {
          console.error("Error fetching procedimiento_precios:", preciosError);
          toast.error(
            "No se pudieron obtener precios para la moneda seleccionada."
          );
          return;
        }

        interface PrecioData { procedimiento_id: string; precio: number }
        const priceMap: Record<string, number> = {}
        ;(preciosData || []).forEach((p: PrecioData) => {
          if (p && p.procedimiento_id) priceMap[p.procedimiento_id] = Number(p.precio)
        })

        setItems((prev) =>
          prev.map((it) => {
            const price = priceMap[it.procedimiento_id];
            if (price !== undefined) {
              const rounded =
                Math.round((Number(price) + Number.EPSILON) * 100) / 100;
              return {
                ...it,
                costo: rounded,
                moneda_id: newMonedaId,
                total:
                  rounded * it.cantidad -
                  (rounded * it.cantidad * it.descuento_porcentaje) / 100,
              };
            }
            return { ...it, moneda_id: newMonedaId };
          })
        );
      } catch (e) {
        console.error("Error converting prices:", e);
      }
    };

    // Ejecutar conversión solo cuando monedaId cambie
    if (monedaId) convertPrices(monedaId)
  }, [monedaId, supabase, items])

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  const handleAddProcedimiento = (
    procedimientos: Array<{
      id: string;
      nombre: string;
      precioDefault: number;
      cantidad: number;
    }>
  ) => {
    const newItems: PlanItem[] = [];

    procedimientos.forEach((proc) => {
      for (let i = 0; i < proc.cantidad; i++) {
        newItems.push({
          procedimiento_id: proc.id,
          procedimiento_nombre: proc.nombre,
          moneda_id: monedaId,
          costo: proc.precioDefault,
          cantidad: 1,
          pieza_dental: "",
          descuento_porcentaje: 0,
          total: proc.precioDefault,
        });
      }
    });

    setItems((prevItems) => [...prevItems, ...newItems]);
    const addedCount = newItems.length;
    toast.success(
      addedCount > 1
        ? `${addedCount} procedimientos insertados correctamente.`
        : "Procedimiento insertado correctamente.",
      { style: { backgroundColor: "#008000", color: "white" } }
    );
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updated = [...items];
    const item = updated[index];

    if (field === "costo") {
      item.costo = Number(value);
      item.total =
        item.costo * item.cantidad -
        (item.costo * item.cantidad * item.descuento_porcentaje) / 100;
    } else if (field === "cantidad") {
      item.cantidad = Number(value);
      item.total =
        item.costo * item.cantidad -
        (item.costo * item.cantidad * item.descuento_porcentaje) / 100;
    } else if (field === "pieza_dental") {
      item.pieza_dental = value as string;
    } else if (field === "descuento_porcentaje") {
      item.descuento_porcentaje = Number(value);
      item.total =
        item.costo * item.cantidad -
        (item.costo * item.cantidad * item.descuento_porcentaje) / 100;
    }

    setItems(updated);
  };

  const handleSave = async () => {
    if (!asunto.trim()) {
      toast.error("El asunto es requerido.", {
        style: { backgroundColor: "#FF0000", color: "white" },
      });
      return;
    }

    // medicId debe estar presente (se autocompleta con el usuario actual)
    if (!medicId) {
      toast.error(
        "No se pudo determinar el usuario actual. Intenta refrescar la página.",
        { style: { backgroundColor: "#FF0000", color: "white" } }
      );
      return;
    }

    if (!monedaId) {
      toast.error("Debe seleccionar una moneda.", {
        style: { backgroundColor: "#FF0000", color: "white" },
      });
      return;
    }

    if (items.length === 0) {
      toast.error("Debe agregar al menos un procedimiento.", {
        style: { backgroundColor: "#FF0000", color: "white" },
      });
      return;
    }

    setLoading(true);

    const formData = {
      id: presupuesto?.id || null,
      caso_id: casoId,
      paciente_id: pacienteId,
      nombre: asunto,
      medico_id: medicId,
      observacion: observacion || null,
      especialidad: especialidad || null,
      costo_total: subtotal,
      moneda_id: monedaId,
      estado: "Propuesto",
    };

    const itemsData: StoredPlanItem[] = items.map((item, index) => ({
      procedimiento_id: item.procedimiento_id,
      procedimiento_nombre: item.procedimiento_nombre,
      moneda_id: monedaId,
      costo: item.costo,
      cantidad: item.cantidad,
      pieza_dental: item.pieza_dental || null,
      notas: null,
      orden_ejecucion: index + 1,
    }));

    const result = await upsertPresupuesto(formData, itemsData);

    if (result.success) {
      toast.success("Presupuesto guardado exitosamente.", {
        style: { backgroundColor: "#008000", color: "white" },
      });
      // Refrescar el servidor y volver a la lista
      router.refresh();
      router.push(
        `/admin/ficha-odontologica/${numeroHistoria}/casos/${casoId}/presupuesto`
      );
    } else {
      toast.error(result.error?.message || "Error al guardar", {
        style: { backgroundColor: "#FF0000", color: "white" },
      });
    }

    setLoading(false);
  };

  if (loadingData) {
    return (
      <div className='flex justify-center items-center py-16'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4 max-w-6xl'>
      <div className='flex items-center mb-6'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => router.back()}
          className='mr-4'
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <h1 className='text-2xl font-bold'>
          {presupuesto ? "Editar" : "Nuevo"} Presupuesto
        </h1>
      </div>

      <div className='grid grid-cols-1 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Datos del Presupuesto</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div>
                <Label htmlFor='fecha'>Fecha</Label>
                <Input
                  id='fecha'
                  type='date'
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className='mt-1'
                />
              </div>

              <div>
                <Label htmlFor='medico'>Médico *</Label>
                <Input
                  id='medico'
                  value={currentPersonal?.nombre_completo || ""}
                  readOnly
                  className='mt-1'
                />
                {currentPersonal?.rol && (
                  <p className='text-xs text-muted-foreground mt-1'>
                    Rol: {currentPersonal.rol}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor='moneda'>Moneda *</Label>
                <Select
                  value={monedaId}
                  onValueChange={setMonedaId}
                >
                  <SelectTrigger
                    id='moneda'
                    className='mt-1'
                  >
                    <SelectValue placeholder='Seleccionar moneda...' />
                  </SelectTrigger>
                  <SelectContent>
                    {monedas.map((m) => (
                      <SelectItem
                        key={m.id}
                        value={m.id}
                      >
                        {m.codigo} - {m.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="especialidad">Especialidad</Label>
                <Select value={especialidad} onValueChange={setEspecialidad}>
                  <SelectTrigger id="especialidad" className="mt-1">
                    <SelectValue placeholder="Seleccionar especialidad..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ESPECIALIDADES_COMUNES.map((esp) => (
                      <SelectItem key={esp} value={esp}>
                        {esp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor='asunto'>Asunto *</Label>
              <Input
                id='asunto'
                autoComplete='off'
                placeholder='Ej: Tratamiento integral'
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                className='mt-1'
              />
            </div>

            <div>
              <Label htmlFor='observacion'>Observación</Label>
              <Textarea
                id='observacion'
                placeholder='Notas adicionales...'
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                className='mt-1 min-h-[100px]'
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabla de procedimientos */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Procedimientos</CardTitle>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant='default'
              size='sm'
            >
              <Plus className='mr-2 h-4 w-4' /> Agregar Procedimiento
            </Button>
          </CardHeader>
          <CardContent>
            <div className='border rounded-lg overflow-hidden'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='bg-sky-700 text-white'>
                      Nombre
                    </TableHead>
                    <TableHead className='bg-sky-700 text-white'>
                      Pieza
                    </TableHead>
                    <TableHead className='bg-sky-700 text-white text-center'>
                      Cantidad
                    </TableHead>
                    <TableHead className='bg-sky-700 text-white text-right'>
                      P. Unitario
                    </TableHead>
                    <TableHead className='bg-sky-700 text-white text-center'>
                      Descuento %
                    </TableHead>
                    <TableHead className='bg-sky-700 text-white text-right'>
                      Total
                    </TableHead>
                    <TableHead className='bg-sky-700 text-white text-center'>
                      Eliminar
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow
                      key={index}
                      className='hover:bg-muted'
                    >
                      <TableCell className='font-medium text-sm'>
                        {item.procedimiento_nombre}
                      </TableCell>
                      <TableCell>
                        <Input
                          type='text'
                          autoComplete='off'
                          value={item.pieza_dental}
                          onChange={(e) =>
                            handleUpdateItem(
                              index,
                              "pieza_dental",
                              e.target.value
                            )
                          }
                          placeholder='Ej: 1.1'
                          className='h-8 text-xs'
                        />
                      </TableCell>
                      <TableCell>
                        <div className='text-center'>
                          <Input
                            type='number'
                            autoComplete='off'
                            value={item.cantidad}
                            onChange={(e) =>
                              handleUpdateItem(
                                index,
                                "cantidad",
                                e.target.value
                              )
                            }
                            min='1'
                            className='h-8 text-xs text-center'
                          />
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        <Input
                          type='number'
                          autoComplete='off'
                          step='0.01'
                          value={item.costo}
                          onChange={(e) =>
                            handleUpdateItem(index, "costo", e.target.value)
                          }
                          className='h-8 text-xs text-right'
                        />
                      </TableCell>
                      <TableCell>
                        <div className='text-center'>
                          <Input
                            type='number'
                            autoComplete='off'
                            value={item.descuento_porcentaje}
                            onChange={(e) =>
                              handleUpdateItem(
                                index,
                                "descuento_porcentaje",
                                e.target.value
                              )
                            }
                            min='0'
                            max='100'
                            className='h-8 text-xs text-center'
                          />
                        </div>
                      </TableCell>
                      <TableCell className='text-right font-semibold text-sm'>
                        {currencySymbol}
                        {item.total.toFixed(2)}
                      </TableCell>
                      <TableCell className='text-center'>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleDeleteItem(index)}
                          className='h-8 w-8'
                        >
                          <Trash2 className='h-4 w-4 text-destructive' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {items.length === 0 && (
              <div className='text-center py-8 text-muted-foreground'>
                No hay procedimientos. Haz clic en &quot;Agregar
                Procedimiento&quot; para comenzar.
              </div>
            )}

            {items.length > 0 && (
              <div className='mt-4 flex justify-end'>
                <div className='text-right'>
                  <p className='text-sm text-muted-foreground mb-2'>
                    Subtotal:
                  </p>
                  <p className='text-2xl font-bold'>
                    {currencySymbol}
                    {subtotal.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className='flex justify-end gap-2'>
          <Button
            variant='outline'
            onClick={() =>
              router.push(
                `/admin/ficha-odontologica/${numeroHistoria}/casos/${casoId}/presupuesto`
              )
            }
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Guardando...
              </>
            ) : (
              "Guardar Presupuesto"
            )}
          </Button>
        </div>
      </div>

      {/* Modal de procedimientos */}
      {isModalOpen && (
        <ProcedimientosModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectProcedimientos={handleAddProcedimiento}
          monedaId={monedaId}
        />
      )}
    </div>
  );
}
