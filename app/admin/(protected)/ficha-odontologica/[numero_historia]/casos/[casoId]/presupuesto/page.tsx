"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Loader2,
  Trash2,
  DollarSign,
  CreditCard,
  Receipt,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Procedimiento {
  id: string;
  nombre: string;
  descripcion: string | null;
  precios: {
    id: string;
    precio: number;
    moneda:
      | { id: string; codigo: string; simbolo: string }
      | { id: string; codigo: string; simbolo: string }[]
      | null;
  }[];
}

interface PresupuestoItem {
  id: string;
  presupuesto_id: string;
  procedimiento_id: string | null;
  nombre_procedimiento: string;
  pieza_dental: string | null;
  cantidad: number;
  costo_unitario: number;
  descuento_porcentaje: number;
  costo_final: number;
  estado: string;
  orden_ejecucion: number | null;
}

interface Presupuesto {
  id: string;
  nombre: string;
  observacion: string | null;
  especialidad: string | null;
  costo_total: number;
  estado: string;
  fecha_creacion: string;
  moneda_id: string | null;
  descuento_global: number;
  total_pagado: number;
  saldo_pendiente: number;
  moneda?: { id: string; codigo: string; simbolo: string };
  items?: PresupuestoItem[];
  medico?: { id: string; nombre_completo: string };
}

interface Pago {
  id: string;
  monto: number;
  metodo_pago: string;
  tipo_comprobante: string;
  numero_comprobante: string | null;
  notas: string | null;
  fecha_pago: string;
  recibido_por: { id: string; nombre_completo: string } | null;
  moneda: { id: string; codigo: string; simbolo: string };
}

interface Moneda {
  id: string;
  codigo: string;
  simbolo: string;
  nombre: string;
}

const metodosPago = [
  { value: "efectivo", label: "Efectivo", icon: "💵" },
  { value: "tarjeta", label: "Tarjeta", icon: "💳" },
  { value: "transferencia", label: "Transferencia", icon: "🏦" },
  { value: "yape", label: "Yape", icon: "" },
  { value: "plin", label: "Plin", icon: "" },
];

const tiposComprobante = [
  { value: "boleta", label: "Boleta" },
  { value: "factura", label: "Factura" },
  { value: "ticket", label: "Ticket" },
];

export default function PresupuestoPage() {
  const params = useParams();
  const casoId = params.casoId as string;
  const numeroHistoria = params.numero_historia as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [procedimientos, setProcedimientos] = useState<Procedimiento[]>([]);
  const [monedas, setMonedas] = useState<Moneda[]>([]);
  const [pacienteId, setPacienteId] = useState<string | null>(null);

  // Dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [pagoDialogOpen, setPagoDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingPago, setEditingPago] = useState<Pago | null>(null);

  // Form states
  const [presupuestoForm, setPresupuestoForm] = useState({
    nombre: "",
    observacion: "",
    especialidad: "",
    moneda_id: "",
  });

  const [itemForm, setItemForm] = useState({
    procedimiento_id: "",
    nombre_procedimiento: "",
    pieza_dental: "",
    cantidad: 1,
    costo_unitario: 0,
    descuento_porcentaje: 0,
  });

  const [pagoForm, setPagoForm] = useState({
    monto: 0,
    metodo_pago: "efectivo",
    tipo_comprobante: "boleta",
    numero_comprobante: "",
    notas: "",
  });

  // Obtener paciente_id
  useEffect(() => {
    const fetchPacienteId = async () => {
      const { data: paciente } = await supabase
        .from("pacientes")
        .select("id")
        .eq("numero_historia", numeroHistoria)
        .single();

      if (paciente) {
        setPacienteId(paciente.id);
      }
    };

    fetchPacienteId();
  }, [numeroHistoria, supabase]);

  // Cargar datos iniciales
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Cargar monedas
      const { data: monedasData } = await supabase
        .from("monedas")
        .select("*")
        .order("codigo");
      setMonedas(monedasData || []);

      // Cargar procedimientos con precios
      const { data: procsData } = await supabase
        .from("procedimientos")
        .select(
          `
          id, nombre, descripcion,
          precios:procedimiento_precios(
            id, precio,
            moneda:monedas(id, codigo, simbolo)
          )
        `
        )
        .eq("activo", true)
        .order("nombre");
      setProcedimientos(procsData || []);

      // Cargar presupuesto del caso
      const { data: presupuestoData } = await supabase
        .from("presupuestos")
        .select(
          `
          *,
          moneda:monedas(id, codigo, simbolo),
          medico:personal(id, nombre_completo),
          items:presupuesto_items(*)
        `
        )
        .eq("caso_id", casoId)
        .single();

      if (presupuestoData) {
        // Cargar pagos
        const { data: pagosData } = await supabase
          .from("pagos")
          .select(
            `
            *,
            moneda:monedas(id, codigo, simbolo),
            recibido_por:personal(id, nombre_completo)
          `
          )
          .eq("presupuesto_id", presupuestoData.id)
          .order("fecha_pago", { ascending: false });

        setPagos(pagosData || []);

        // Calcular total pagado desde los pagos
        const totalPagado = (pagosData || []).reduce(
          (sum, pago) => sum + Number(pago.monto),
          0
        );
        const saldoPendiente = (presupuestoData.costo_total || 0) - totalPagado;

        // Actualizar presupuesto con totales calculados
        setPresupuesto({
          ...presupuestoData,
          total_pagado: totalPagado,
          saldo_pendiente: saldoPendiente,
        });
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  }, [casoId, supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Crear presupuesto
  const handleCreatePresupuesto = async () => {
    if (!pacienteId || !presupuestoForm.nombre || !presupuestoForm.moneda_id) {
      toast.error("Completa los campos obligatorios");
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("presupuestos")
        .insert({
          paciente_id: pacienteId,
          caso_id: casoId,
          nombre: presupuestoForm.nombre,
          observacion: presupuestoForm.observacion || null,
          especialidad: presupuestoForm.especialidad || null,
          moneda_id: presupuestoForm.moneda_id,
          costo_total: 0,
          estado: "Por Cobrar",
        })
        .select(
          `
          *,
          moneda:monedas(id, codigo, simbolo)
        `
        )
        .single();

      if (error) throw error;

      setPresupuesto({
        ...data,
        items: [],
        total_pagado: 0,
        saldo_pendiente: 0,
      });
      setCreateDialogOpen(false);
      toast.success("Presupuesto creado");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al crear el presupuesto");
    } finally {
      setSaving(false);
    }
  };

  // Agregar item al presupuesto
  const handleAddItem = async () => {
    if (
      !presupuesto ||
      !itemForm.nombre_procedimiento ||
      itemForm.costo_unitario <= 0
    ) {
      toast.error("Completa los campos obligatorios");
      return;
    }

    setSaving(true);
    try {
      const descuento = itemForm.descuento_porcentaje / 100;
      const costoFinal =
        itemForm.cantidad * itemForm.costo_unitario * (1 - descuento);

      const { error } = await supabase.from("presupuesto_items").insert({
        presupuesto_id: presupuesto.id,
        procedimiento_id: itemForm.procedimiento_id || null,
        nombre_procedimiento: itemForm.nombre_procedimiento,
        pieza_dental: itemForm.pieza_dental || null,
        cantidad: itemForm.cantidad,
        costo_unitario: itemForm.costo_unitario,
        descuento_porcentaje: itemForm.descuento_porcentaje,
        costo_final: costoFinal,
        estado: "Pendiente",
      });

      if (error) throw error;

      // Actualizar costo total
      const nuevoTotal = (presupuesto.costo_total || 0) + costoFinal;
      await supabase
        .from("presupuestos")
        .update({ costo_total: nuevoTotal })
        .eq("id", presupuesto.id);

      setItemDialogOpen(false);
      setItemForm({
        procedimiento_id: "",
        nombre_procedimiento: "",
        pieza_dental: "",
        cantidad: 1,
        costo_unitario: 0,
        descuento_porcentaje: 0,
      });
      loadData();
      toast.success("Procedimiento agregado");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al agregar el procedimiento");
    } finally {
      setSaving(false);
    }
  };

  // Eliminar item
  const handleDeleteItem = async (item: PresupuestoItem) => {
    if (!confirm("¿Eliminar este procedimiento del presupuesto?")) return;

    try {
      const { error } = await supabase
        .from("presupuesto_items")
        .delete()
        .eq("id", item.id);

      if (error) throw error;

      // Actualizar costo total
      if (presupuesto) {
        const nuevoTotal = (presupuesto.costo_total || 0) - item.costo_final;
        await supabase
          .from("presupuestos")
          .update({ costo_total: Math.max(0, nuevoTotal) })
          .eq("id", presupuesto.id);
      }

      loadData();
      toast.success("Procedimiento eliminado");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar");
    }
  };

  // Registrar pago
  // Función para actualizar el estado del presupuesto según pagos
  const actualizarEstadoPresupuesto = async (nuevoTotalPagado: number) => {
    if (!presupuesto) return;

    let nuevoEstado: string;
    const costoTotal = presupuesto.costo_total || 0;

    if (nuevoTotalPagado >= costoTotal) {
      nuevoEstado = "Pagado";
    } else if (nuevoTotalPagado > 0) {
      nuevoEstado = "Parcial";
    } else {
      nuevoEstado = "Por Cobrar";
    }

    if (nuevoEstado !== presupuesto.estado) {
      await supabase
        .from("presupuestos")
        .update({ estado: nuevoEstado })
        .eq("id", presupuesto.id);
    }
  };

  const handleAddPago = async () => {
    if (!presupuesto || !pacienteId || pagoForm.monto <= 0) {
      toast.error("Ingresa un monto válido");
      return;
    }

    // Calcular saldo pendiente real en tiempo real (excluyendo el pago que se está editando)
    const totalPagadoActual = pagos
      .filter((p) => (editingPago ? p.id !== editingPago.id : true))
      .reduce((sum, p) => sum + Number(p.monto), 0);
    const saldoReal = (presupuesto.costo_total || 0) - totalPagadoActual;

    if (!editingPago && saldoReal <= 0) {
      toast.error("El presupuesto ya está completamente pagado");
      setPagoDialogOpen(false);
      return;
    }

    if (pagoForm.monto > saldoReal) {
      toast.error(
        `El monto excede el saldo pendiente (${
          presupuesto.moneda?.simbolo
        } ${saldoReal.toFixed(2)})`
      );
      return;
    }

    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let error;

      if (editingPago) {
        // Actualizar pago existente
        const result = await supabase
          .from("pagos")
          .update({
            monto: pagoForm.monto,
            metodo_pago: pagoForm.metodo_pago,
            tipo_comprobante: pagoForm.tipo_comprobante,
            numero_comprobante: pagoForm.numero_comprobante || null,
            notas: pagoForm.notas || null,
          })
          .eq("id", editingPago.id);
        error = result.error;
      } else {
        // Insertar nuevo pago
        const result = await supabase.from("pagos").insert({
          presupuesto_id: presupuesto.id,
          paciente_id: pacienteId,
          monto: pagoForm.monto,
          moneda_id: presupuesto.moneda_id,
          metodo_pago: pagoForm.metodo_pago,
          tipo_comprobante: pagoForm.tipo_comprobante,
          numero_comprobante: pagoForm.numero_comprobante || null,
          notas: pagoForm.notas || null,
          recibido_por: user?.id || null,
        });
        error = result.error;
      }

      if (error) throw error;

      // Actualizar estado del presupuesto
      const nuevoTotalPagado = totalPagadoActual + pagoForm.monto;
      await actualizarEstadoPresupuesto(nuevoTotalPagado);

      setPagoDialogOpen(false);
      setEditingPago(null);
      setPagoForm({
        monto: 0,
        metodo_pago: "efectivo",
        tipo_comprobante: "boleta",
        numero_comprobante: "",
        notas: "",
      });
      loadData();
      toast.success(editingPago ? "Pago actualizado" : "Pago registrado");
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        editingPago
          ? "Error al actualizar el pago"
          : "Error al registrar el pago"
      );
    } finally {
      setSaving(false);
    }
  };

  // Editar pago existente
  const handleEditPago = (pago: Pago) => {
    setEditingPago(pago);
    setPagoForm({
      monto: pago.monto,
      metodo_pago: pago.metodo_pago,
      tipo_comprobante: pago.tipo_comprobante,
      numero_comprobante: pago.numero_comprobante || "",
      notas: pago.notas || "",
    });
    setPagoDialogOpen(true);
  };

  // Eliminar pago
  const handleDeletePago = async (pago: Pago) => {
    if (
      !confirm(
        `¿Estás seguro de eliminar este pago de ${
          pago.moneda?.simbolo
        } ${pago.monto.toFixed(2)}?`
      )
    )
      return;

    try {
      const { error } = await supabase.from("pagos").delete().eq("id", pago.id);

      if (error) throw error;

      // Calcular nuevo total pagado sin este pago
      const nuevoTotalPagado = pagos
        .filter((p) => p.id !== pago.id)
        .reduce((sum, p) => sum + Number(p.monto), 0);
      await actualizarEstadoPresupuesto(nuevoTotalPagado);

      loadData();
      toast.success("Pago eliminado");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar el pago");
    }
  };

  // Cuando selecciona un procedimiento
  const onSelectProcedimiento = (procId: string) => {
    const proc = procedimientos.find((p) => p.id === procId);
    if (proc) {
      const precio = proc.precios?.find((p) => {
        const moneda = Array.isArray(p.moneda) ? p.moneda[0] : p.moneda;
        return moneda?.id === presupuesto?.moneda_id;
      });
      setItemForm({
        ...itemForm,
        procedimiento_id: procId,
        nombre_procedimiento: proc.nombre,
        costo_unitario: precio?.precio || 0,
      });
    }
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { color: string; icon: React.ReactNode }> = {
      "Por Cobrar": {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock className='h-3 w-3' />,
      },
      Parcial: {
        color: "bg-blue-100 text-blue-800",
        icon: <CreditCard className='h-3 w-3' />,
      },
      Pagado: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle2 className='h-3 w-3' />,
      },
      Cancelado: {
        color: "bg-red-100 text-red-800",
        icon: <AlertCircle className='h-3 w-3' />,
      },
    };
    const info = estados[estado] || estados["Por Cobrar"];
    return (
      <Badge className={`${info.color} gap-1`}>
        {info.icon}
        {estado}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  // Si no hay presupuesto, mostrar botón para crear
  if (!presupuesto) {
    return (
      <div className='space-y-6'>
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <FileText className='h-12 w-12 text-muted-foreground mb-4' />
            <h3 className='text-lg font-semibold mb-2'>Sin presupuesto</h3>
            <p className='text-muted-foreground text-center mb-4'>
              Este caso aún no tiene un presupuesto asociado.
              <br />
              Crea uno para registrar los procedimientos y pagos.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className='h-4 w-4 mr-2' />
              Crear Presupuesto
            </Button>
          </CardContent>
        </Card>

        {/* Dialog crear presupuesto */}
        <Dialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Presupuesto</DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label>Nombre del presupuesto *</Label>
                <Input
                  value={presupuestoForm.nombre}
                  onChange={(e) =>
                    setPresupuestoForm({
                      ...presupuestoForm,
                      nombre: e.target.value,
                    })
                  }
                  placeholder='Ej: Tratamiento de ortodoncia'
                />
              </div>
              <div className='space-y-2'>
                <Label>Moneda *</Label>
                <Select
                  value={presupuestoForm.moneda_id}
                  onValueChange={(value) =>
                    setPresupuestoForm({ ...presupuestoForm, moneda_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccionar moneda' />
                  </SelectTrigger>
                  <SelectContent>
                    {monedas.map((m) => (
                      <SelectItem
                        key={m.id}
                        value={m.id}
                      >
                        {m.simbolo} - {m.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>Especialidad</Label>
                <Input
                  value={presupuestoForm.especialidad}
                  onChange={(e) =>
                    setPresupuestoForm({
                      ...presupuestoForm,
                      especialidad: e.target.value,
                    })
                  }
                  placeholder='Ej: Ortodoncia, Endodoncia...'
                />
              </div>
              <div className='space-y-2'>
                <Label>Observaciones</Label>
                <Textarea
                  value={presupuestoForm.observacion}
                  onChange={(e) =>
                    setPresupuestoForm({
                      ...presupuestoForm,
                      observacion: e.target.value,
                    })
                  }
                  placeholder='Notas adicionales...'
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreatePresupuesto}
                disabled={saving}
              >
                {saving && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
                Crear Presupuesto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Vista con presupuesto existente
  const porcentajePagado =
    presupuesto.costo_total > 0
      ? Math.min(
          100,
          Math.round(
            ((presupuesto.total_pagado || 0) / presupuesto.costo_total) * 100
          )
        )
      : 0;

  return (
    <div className='space-y-6'>
      {/* Resumen del presupuesto */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>Total</p>
                <p className='text-2xl font-bold'>
                  {presupuesto.moneda?.simbolo}{" "}
                  {presupuesto.costo_total?.toFixed(2)}
                </p>
              </div>
              <DollarSign className='h-8 w-8 text-muted-foreground' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>Pagado</p>
                <p className='text-2xl font-bold text-green-600'>
                  {presupuesto.moneda?.simbolo}{" "}
                  {(presupuesto.total_pagado || 0).toFixed(2)}
                </p>
              </div>
              <CheckCircle2 className='h-8 w-8 text-green-500' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>Pendiente</p>
                <p
                  className={`text-2xl font-bold ${
                    (presupuesto.saldo_pendiente ?? presupuesto.costo_total) <=
                    0
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {presupuesto.moneda?.simbolo}{" "}
                  {Math.max(
                    0,
                    presupuesto.saldo_pendiente ?? presupuesto.costo_total
                  ).toFixed(2)}
                </p>
              </div>
              {(presupuesto.saldo_pendiente ?? presupuesto.costo_total) <= 0 ? (
                <CheckCircle2 className='h-8 w-8 text-green-500' />
              ) : (
                <Clock className='h-8 w-8 text-orange-500' />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>Progreso</p>
                <p className='text-2xl font-bold'>{porcentajePagado}%</p>
              </div>
              <div className='w-16 h-16 relative'>
                <svg className='w-full h-full transform -rotate-90'>
                  <circle
                    cx='32'
                    cy='32'
                    r='28'
                    stroke='currentColor'
                    strokeWidth='8'
                    fill='none'
                    className='text-gray-200'
                  />
                  <circle
                    cx='32'
                    cy='32'
                    r='28'
                    stroke='currentColor'
                    strokeWidth='8'
                    fill='none'
                    strokeDasharray={`${porcentajePagado * 1.76} 176`}
                    className='text-primary'
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info y estado */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              {presupuesto.nombre}
              {getEstadoBadge(presupuesto.estado)}
            </CardTitle>
            <p className='text-sm text-muted-foreground mt-1'>
              Creado el{" "}
              {format(new Date(presupuesto.fecha_creacion), "dd/MM/yyyy", {
                locale: es,
              })}
              {presupuesto.especialidad && ` • ${presupuesto.especialidad}`}
            </p>
          </div>
          <Button
            onClick={() => {
              const saldoActual = Math.max(
                0,
                presupuesto.saldo_pendiente ?? presupuesto.costo_total
              );
              setPagoForm((prev) => ({ ...prev, monto: saldoActual }));
              setPagoDialogOpen(true);
            }}
            disabled={
              (presupuesto.saldo_pendiente ?? presupuesto.costo_total) <= 0
            }
          >
            <CreditCard className='h-4 w-4 mr-2' />
            Registrar Pago
          </Button>
        </CardHeader>
      </Card>

      {/* Procedimientos */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-lg'>Procedimientos</CardTitle>
          <Button
            size='sm'
            onClick={() => setItemDialogOpen(true)}
          >
            <Plus className='h-4 w-4 mr-2' />
            Agregar
          </Button>
        </CardHeader>
        <CardContent>
          {presupuesto.items && presupuesto.items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Procedimiento</TableHead>
                  <TableHead>Pieza</TableHead>
                  <TableHead className='text-center'>Cant.</TableHead>
                  <TableHead className='text-right'>P. Unit.</TableHead>
                  <TableHead className='text-right'>Desc.</TableHead>
                  <TableHead className='text-right'>Total</TableHead>
                  <TableHead className='text-center'>Estado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {presupuesto.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className='font-medium'>
                      {item.nombre_procedimiento}
                    </TableCell>
                    <TableCell>{item.pieza_dental || "-"}</TableCell>
                    <TableCell className='text-center'>
                      {item.cantidad}
                    </TableCell>
                    <TableCell className='text-right'>
                      {presupuesto.moneda?.simbolo}{" "}
                      {item.costo_unitario.toFixed(2)}
                    </TableCell>
                    <TableCell className='text-right'>
                      {item.descuento_porcentaje > 0
                        ? `${item.descuento_porcentaje}%`
                        : "-"}
                    </TableCell>
                    <TableCell className='text-right font-medium'>
                      {presupuesto.moneda?.simbolo}{" "}
                      {item.costo_final.toFixed(2)}
                    </TableCell>
                    <TableCell className='text-center'>
                      <Badge
                        variant={
                          item.estado === "Realizado" ? "default" : "secondary"
                        }
                      >
                        {item.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size='icon'
                        variant='ghost'
                        className='h-8 w-8 text-red-500'
                        onClick={() => handleDeleteItem(item)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className='text-center text-muted-foreground py-8'>
              No hay procedimientos agregados al presupuesto
            </p>
          )}
        </CardContent>
      </Card>

      {/* Historial de pagos */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg flex items-center gap-2'>
            <Receipt className='h-5 w-5' />
            Historial de Pagos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pagos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Comprobante</TableHead>
                  <TableHead className='text-right'>Monto</TableHead>
                  <TableHead>Recibido por</TableHead>
                  <TableHead>Notas</TableHead>
                  <TableHead className='text-center'>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagos.map((pago) => (
                  <TableRow key={pago.id}>
                    <TableCell>
                      {format(new Date(pago.fecha_pago), "dd/MM/yyyy HH:mm", {
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>
                        {
                          metodosPago.find((m) => m.value === pago.metodo_pago)
                            ?.icon
                        }{" "}
                        {
                          metodosPago.find((m) => m.value === pago.metodo_pago)
                            ?.label
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {pago.tipo_comprobante}
                      {pago.numero_comprobante &&
                        ` #${pago.numero_comprobante}`}
                    </TableCell>
                    <TableCell className='text-right font-medium text-green-600'>
                      {pago.moneda?.simbolo} {pago.monto.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {pago.recibido_por?.nombre_completo || "-"}
                    </TableCell>
                    <TableCell className='max-w-[200px] truncate'>
                      {pago.notas || "-"}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-8 w-8'
                          onClick={() => handleEditPago(pago)}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-8 w-8 text-red-500 hover:text-red-700'
                          onClick={() => handleDeletePago(pago)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className='text-center text-muted-foreground py-8'>
              No hay pagos registrados
            </p>
          )}
        </CardContent>
      </Card>

      {/* Dialog agregar item */}
      <Dialog
        open={itemDialogOpen}
        onOpenChange={setItemDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Procedimiento</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label>Procedimiento</Label>
              <Select onValueChange={onSelectProcedimiento}>
                <SelectTrigger>
                  <SelectValue placeholder='Seleccionar procedimiento...' />
                </SelectTrigger>
                <SelectContent>
                  {procedimientos.map((p) => (
                    <SelectItem
                      key={p.id}
                      value={p.id}
                    >
                      {p.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label>Nombre (editable) *</Label>
              <Input
                value={itemForm.nombre_procedimiento}
                onChange={(e) =>
                  setItemForm({
                    ...itemForm,
                    nombre_procedimiento: e.target.value,
                  })
                }
                placeholder='Nombre del procedimiento'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Pieza dental</Label>
                <Input
                  value={itemForm.pieza_dental}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, pieza_dental: e.target.value })
                  }
                  placeholder='Ej: 1.1, 2.4'
                />
              </div>
              <div className='space-y-2'>
                <Label>Cantidad</Label>
                <Input
                  type='number'
                  min={1}
                  value={itemForm.cantidad}
                  onChange={(e) =>
                    setItemForm({
                      ...itemForm,
                      cantidad: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Costo unitario *</Label>
                <Input
                  type='number'
                  min={0}
                  step='0.01'
                  value={itemForm.costo_unitario}
                  onChange={(e) =>
                    setItemForm({
                      ...itemForm,
                      costo_unitario: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label>Descuento (%)</Label>
                <Input
                  type='number'
                  min={0}
                  max={100}
                  value={itemForm.descuento_porcentaje}
                  onChange={(e) =>
                    setItemForm({
                      ...itemForm,
                      descuento_porcentaje: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <Separator />
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Total:</span>
              <span className='font-bold'>
                {presupuesto.moneda?.simbolo}{" "}
                {(
                  itemForm.cantidad *
                  itemForm.costo_unitario *
                  (1 - itemForm.descuento_porcentaje / 100)
                ).toFixed(2)}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setItemDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddItem}
              disabled={saving}
            >
              {saving && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog registrar pago */}
      <Dialog
        open={pagoDialogOpen}
        onOpenChange={(open) => {
          setPagoDialogOpen(open);
          if (!open) {
            setEditingPago(null);
            setPagoForm({
              monto: 0,
              metodo_pago: "efectivo",
              tipo_comprobante: "boleta",
              numero_comprobante: "",
              notas: "",
            });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPago ? "Editar Pago" : "Registrar Pago"}
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            {!editingPago && (
              <div className='bg-blue-50 p-3 rounded-lg'>
                <p className='text-sm text-blue-800'>
                  Saldo pendiente:{" "}
                  <span className='font-bold'>
                    {presupuesto.moneda?.simbolo}{" "}
                    {Math.max(
                      0,
                      presupuesto.saldo_pendiente ?? presupuesto.costo_total
                    ).toFixed(2)}
                  </span>
                </p>
              </div>
            )}

            <div className='space-y-2'>
              <Label>Monto a pagar *</Label>
              <Input
                type='number'
                min={0}
                step='0.01'
                max={presupuesto.saldo_pendiente || presupuesto.costo_total}
                value={pagoForm.monto}
                onChange={(e) =>
                  setPagoForm({
                    ...pagoForm,
                    monto: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Método de pago</Label>
                <Select
                  value={pagoForm.metodo_pago}
                  onValueChange={(value) =>
                    setPagoForm({ ...pagoForm, metodo_pago: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {metodosPago.map((m) => (
                      <SelectItem
                        key={m.value}
                        value={m.value}
                      >
                        {m.icon} {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>Tipo de comprobante</Label>
                <Select
                  value={pagoForm.tipo_comprobante}
                  onValueChange={(value) =>
                    setPagoForm({ ...pagoForm, tipo_comprobante: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposComprobante.map((t) => (
                      <SelectItem
                        key={t.value}
                        value={t.value}
                      >
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-2'>
              <Label>Número de comprobante</Label>
              <Input
                value={pagoForm.numero_comprobante}
                onChange={(e) =>
                  setPagoForm({
                    ...pagoForm,
                    numero_comprobante: e.target.value,
                  })
                }
                placeholder='Opcional'
              />
            </div>

            <div className='space-y-2'>
              <Label>Notas</Label>
              <Textarea
                value={pagoForm.notas}
                onChange={(e) =>
                  setPagoForm({ ...pagoForm, notas: e.target.value })
                }
                placeholder='Observaciones del pago...'
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setPagoDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddPago}
              disabled={saving}
            >
              {saving && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
              {editingPago ? "Guardar Cambios" : "Registrar Pago"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
