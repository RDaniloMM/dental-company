"use client";

import { useEffect, useState, useCallback, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarDays,
  Plus,
  Link as LinkIcon,
  Clock,
  Stethoscope,
  Loader2,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Unlink,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Cita {
  id: string;
  paciente_id: string;
  odontologo_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  motivo: string | null;
  costo_total: number | null;
  notas: string | null;
  nombre_cita: string | null;
  caso_id: string | null;
  google_calendar_event_id: string | null;
}

interface Odontologo {
  id: string;
  nombre_completo: string;
}

interface Moneda {
  id: string;
  nombre: string;
  simbolo: string;
}

interface PageProps {
  params: Promise<{ numero_historia: string; casoId: string }>;
}

export default function CitasCasoPage({ params }: PageProps) {
  const { numero_historia, casoId } = use(params);
  const supabase = createClient();

  const [citas, setCitas] = useState<Cita[]>([]);
  const [citasSinVincular, setCitasSinVincular] = useState<Cita[]>([]);
  const [odontologos, setOdontologos] = useState<Odontologo[]>([]);
  const [monedas, setMonedas] = useState<Moneda[]>([]);
  const [pacienteId, setPacienteId] = useState<string | null>(null);
  const [pacienteNombre, setPacienteNombre] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [vincularDialogOpen, setVincularDialogOpen] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);

  // Estado del formulario de nueva cita
  const [formData, setFormData] = useState({
    odontologo_id: "",
    fecha_inicio: "",
    hora_inicio: "",
    duracion: "60",
    estado: "Programada",
    motivo: "",
    notas: "",
    moneda_id: "",
    costo_total: "",
  });

  // Actualizar odontólogo por defecto cuando se carga el usuario actual
  useEffect(() => {
    if (currentUserId && !formData.odontologo_id) {
      // Verificar si el usuario actual está en la lista de odontólogos
      const isOdontologo = odontologos.some((o) => o.id === currentUserId);
      if (isOdontologo) {
        setFormData((prev) => ({ ...prev, odontologo_id: currentUserId }));
      }
    }
  }, [currentUserId, odontologos, formData.odontologo_id]);

  // Verificar conexión con Google Calendar
  useEffect(() => {
    fetch("/api/calendar/create-event")
      .then((res) => res.json())
      .then((data) => setGoogleConnected(Boolean(data?.connected)))
      .catch(() => setGoogleConnected(false));
  }, []);

  // Cargar datos
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Obtener usuario actual
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }

      // Obtener paciente_id desde historia clínica
      const { data: historia } = await supabase
        .from("historias_clinicas")
        .select("paciente_id, pacientes(id, nombres, apellidos)")
        .eq("numero_historia", numero_historia)
        .single();

      if (historia?.paciente_id) {
        setPacienteId(historia.paciente_id);
        const paciente = historia.pacientes as unknown as {
          nombres: string;
          apellidos: string;
        };
        setPacienteNombre(`${paciente.nombres} ${paciente.apellidos}`);
      }

      // Citas vinculadas a este caso
      const { data: citasVinculadas } = await supabase
        .from("citas")
        .select("*")
        .eq("caso_id", casoId)
        .order("fecha_inicio", { ascending: false });

      if (citasVinculadas) {
        setCitas(citasVinculadas);
      }

      // Citas del paciente sin vincular a ningún caso
      if (historia?.paciente_id) {
        const { data: citasPaciente } = await supabase
          .from("citas")
          .select("*")
          .eq("paciente_id", historia.paciente_id)
          .is("caso_id", null)
          .order("fecha_inicio", { ascending: false });

        if (citasPaciente) {
          setCitasSinVincular(citasPaciente);
        }
      }

      // Odontólogos
      const { data: odontologosData } = await supabase
        .from("personal")
        .select("id, nombre_completo")
        .eq("activo", true);

      if (odontologosData) {
        setOdontologos(odontologosData);
      }

      // Monedas
      const { data: monedasData } = await supabase
        .from("monedas")
        .select("id, nombre, simbolo");

      if (monedasData) {
        setMonedas(monedasData);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
      toast.error("Error al cargar las citas");
    } finally {
      setLoading(false);
    }
  }, [supabase, casoId, numero_historia]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Obtener nombre del odontólogo
  const getOdontologoName = (id: string) => {
    const odontologo = odontologos.find((o) => o.id === id);
    return odontologo?.nombre_completo || "Sin asignar";
  };

  // Badge de estado
  const getEstadoBadge = (estado: string) => {
    const config: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        icon: React.ReactNode;
        className: string;
      }
    > = {
      Programada: {
        variant: "secondary",
        icon: <Clock className='h-3 w-3' />,
        className: "bg-blue-100 text-blue-800 border-blue-200",
      },
      Confirmada: {
        variant: "outline",
        icon: <CheckCircle className='h-3 w-3' />,
        className: "bg-green-100 text-green-800 border-green-200",
      },
      Completada: {
        variant: "outline",
        icon: <CheckCircle className='h-3 w-3' />,
        className: "bg-purple-100 text-purple-800 border-purple-200",
      },
      Cancelada: {
        variant: "destructive",
        icon: <XCircle className='h-3 w-3' />,
        className: "bg-red-100 text-red-800 border-red-200",
      },
      "No Asistió": {
        variant: "outline",
        icon: <AlertCircle className='h-3 w-3' />,
        className: "bg-orange-100 text-orange-800 border-orange-200",
      },
    };

    const { icon, className } = config[estado] || config["Programada"];

    return (
      <Badge
        variant='outline'
        className={`gap-1 ${className}`}
      >
        {icon}
        {estado}
      </Badge>
    );
  };

  // Crear nueva cita
  const handleCreateCita = async () => {
    if (
      !formData.odontologo_id ||
      !formData.fecha_inicio ||
      !formData.hora_inicio
    ) {
      toast.error("Complete los campos obligatorios");
      return;
    }

    if (!pacienteId) {
      toast.error("No se pudo obtener el paciente");
      return;
    }

    setSaving(true);
    try {
      const startDate = new Date(
        `${formData.fecha_inicio}T${formData.hora_inicio}`
      );
      const endDate = new Date(
        startDate.getTime() + parseInt(formData.duracion) * 60000
      );

      let googleEventId = null;

      // Crear en Google Calendar si está conectado
      if (googleConnected) {
        const res = await fetch("/api/calendar/create-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            summary: `Cita: ${formData.motivo || "Consulta odontológica"}`,
            description: `Paciente: ${pacienteNombre}\nOdontólogo: ${getOdontologoName(
              formData.odontologo_id
            )}\nNotas: ${formData.notas || "Sin notas"}`,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          }),
        });
        const result = await res.json();
        if (result.success) {
          googleEventId = result.eventId;
        }
      }

      // Insertar en Supabase
      const { error } = await supabase.from("citas").insert([
        {
          paciente_id: pacienteId,
          odontologo_id: formData.odontologo_id,
          fecha_inicio: startDate.toISOString(),
          fecha_fin: endDate.toISOString(),
          estado: formData.estado,
          motivo: formData.motivo,
          notas: formData.notas,
          costo_total: formData.costo_total
            ? parseFloat(formData.costo_total)
            : null,
          moneda_id: formData.moneda_id || null,
          caso_id: casoId,
          nombre_cita: formData.motivo || "Consulta odontológica",
          google_calendar_event_id: googleEventId,
        },
      ]);

      if (error) throw error;

      toast.success("Cita creada correctamente");
      setDialogOpen(false);
      // Mantener el odontólogo por defecto al resetear
      const defaultOdontologoId =
        currentUserId && odontologos.some((o) => o.id === currentUserId)
          ? currentUserId
          : "";
      setFormData({
        odontologo_id: defaultOdontologoId,
        fecha_inicio: "",
        hora_inicio: "",
        duracion: "60",
        estado: "Programada",
        motivo: "",
        notas: "",
        moneda_id: "",
        costo_total: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error creando cita:", error);
      toast.error("Error al crear la cita");
    } finally {
      setSaving(false);
    }
  };

  // Vincular cita existente al caso
  const handleVincularCita = async (citaId: string) => {
    try {
      const { error } = await supabase
        .from("citas")
        .update({ caso_id: casoId })
        .eq("id", citaId);

      if (error) throw error;

      toast.success("Cita vinculada al caso");
      fetchData();
    } catch (error) {
      console.error("Error vinculando cita:", error);
      toast.error("Error al vincular la cita");
    }
  };

  // Desvincular cita del caso
  const handleDesvincularCita = async (citaId: string) => {
    try {
      const { error } = await supabase
        .from("citas")
        .update({ caso_id: null })
        .eq("id", citaId);

      if (error) throw error;

      toast.success("Cita desvinculada del caso");
      fetchData();
    } catch (error) {
      console.error("Error desvinculando cita:", error);
      toast.error("Error al desvincular la cita");
    }
  };

  // Estadísticas
  const stats = {
    total: citas.length,
    programadas: citas.filter((c) => c.estado === "Programada").length,
    confirmadas: citas.filter((c) => c.estado === "Confirmada").length,
    completadas: citas.filter((c) => c.estado === "Completada").length,
    canceladas: citas.filter((c) => c.estado === "Cancelada").length,
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    );
  }

  return (
    <div className='p-4 space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h2 className='text-xl font-semibold flex items-center gap-2'>
            <CalendarDays className='h-5 w-5' />
            Citas del Caso
          </h2>
          <p className='text-sm text-muted-foreground'>
            Gestiona las citas asociadas a este tratamiento
          </p>
        </div>

        <div className='flex gap-2'>
          {/* Botón vincular cita existente */}
          <Dialog
            open={vincularDialogOpen}
            onOpenChange={setVincularDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                disabled={citasSinVincular.length === 0}
              >
                <LinkIcon className='h-4 w-4 mr-2' />
                Vincular Cita
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl'>
              <DialogHeader>
                <DialogTitle>Vincular Cita Existente</DialogTitle>
                <DialogDescription>
                  Selecciona una cita del paciente para vincularla a este caso
                  clínico
                </DialogDescription>
              </DialogHeader>
              <div className='max-h-[400px] overflow-y-auto'>
                {citasSinVincular.length === 0 ? (
                  <p className='text-center py-8 text-muted-foreground'>
                    No hay citas sin vincular para este paciente
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {citasSinVincular.map((cita) => (
                        <TableRow key={cita.id}>
                          <TableCell>
                            <div className='font-medium'>
                              {format(
                                new Date(cita.fecha_inicio),
                                "dd MMM yyyy",
                                { locale: es }
                              )}
                            </div>
                            <div className='text-sm text-muted-foreground'>
                              {format(new Date(cita.fecha_inicio), "HH:mm")}
                            </div>
                          </TableCell>
                          <TableCell>{cita.motivo || "-"}</TableCell>
                          <TableCell>{getEstadoBadge(cita.estado)}</TableCell>
                          <TableCell>
                            <Button
                              size='sm'
                              onClick={() => {
                                handleVincularCita(cita.id);
                                setVincularDialogOpen(false);
                              }}
                            >
                              <LinkIcon className='h-4 w-4 mr-1' />
                              Vincular
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Botón nueva cita */}
          <Dialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size='sm'>
                <Plus className='h-4 w-4 mr-2' />
                Nueva Cita
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-lg'>
              <DialogHeader>
                <DialogTitle>Registrar Nueva Cita</DialogTitle>
                <DialogDescription>
                  La cita se vinculará automáticamente a este caso clínico
                  {googleConnected && (
                    <span className='block mt-1 text-green-600'>
                      ✓ Se sincronizará con Google Calendar
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='col-span-2'>
                    <Label>Paciente</Label>
                    <Input
                      value={pacienteNombre}
                      disabled
                      className='bg-muted'
                    />
                  </div>

                  <div className='col-span-2'>
                    <Label>Odontólogo *</Label>
                    <Select
                      value={formData.odontologo_id}
                      onValueChange={(v) =>
                        setFormData({ ...formData, odontologo_id: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Seleccione...' />
                      </SelectTrigger>
                      <SelectContent>
                        {odontologos.map((o) => (
                          <SelectItem
                            key={o.id}
                            value={o.id}
                          >
                            {o.nombre_completo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Fecha *</Label>
                    <Input
                      type='date'
                      value={formData.fecha_inicio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fecha_inicio: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div>
                    <Label>Hora *</Label>
                    <Input
                      type='time'
                      step='300'
                      value={formData.hora_inicio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hora_inicio: e.target.value,
                        })
                      }
                      list='horas-sugeridas'
                    />
                    <datalist id='horas-sugeridas'>
                      <option value='08:00' />
                      <option value='08:30' />
                      <option value='09:00' />
                      <option value='09:30' />
                      <option value='10:00' />
                      <option value='10:30' />
                      <option value='11:00' />
                      <option value='11:30' />
                      <option value='12:00' />
                      <option value='14:00' />
                      <option value='14:30' />
                      <option value='15:00' />
                      <option value='15:30' />
                      <option value='16:00' />
                      <option value='16:30' />
                      <option value='17:00' />
                      <option value='17:30' />
                      <option value='18:00' />
                      <option value='18:30' />
                      <option value='19:00' />
                    </datalist>
                  </div>

                  <div>
                    <Label>Duración</Label>
                    <Select
                      value={formData.duracion}
                      onValueChange={(v) =>
                        setFormData({ ...formData, duracion: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='15'>15 min</SelectItem>
                        <SelectItem value='20'>20 min</SelectItem>
                        <SelectItem value='30'>30 min</SelectItem>
                        <SelectItem value='45'>45 min</SelectItem>
                        <SelectItem value='60'>1 hora</SelectItem>
                        <SelectItem value='75'>1h 15min</SelectItem>
                        <SelectItem value='90'>1h 30min</SelectItem>
                        <SelectItem value='120'>2 horas</SelectItem>
                        <SelectItem value='150'>2h 30min</SelectItem>
                        <SelectItem value='180'>3 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Estado</Label>
                    <Select
                      value={formData.estado}
                      onValueChange={(v) =>
                        setFormData({ ...formData, estado: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Programada'>Programada</SelectItem>
                        <SelectItem value='Confirmada'>Confirmada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='col-span-2'>
                    <Label>Motivo de la cita</Label>
                    <Input
                      value={formData.motivo}
                      onChange={(e) =>
                        setFormData({ ...formData, motivo: e.target.value })
                      }
                      placeholder='Ej. Control, Limpieza, Revisión...'
                    />
                  </div>

                  <div>
                    <Label>Moneda</Label>
                    <Select
                      value={formData.moneda_id}
                      onValueChange={(v) =>
                        setFormData({ ...formData, moneda_id: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Seleccione...' />
                      </SelectTrigger>
                      <SelectContent>
                        {monedas.map((m) => (
                          <SelectItem
                            key={m.id}
                            value={m.id}
                          >
                            {m.nombre} ({m.simbolo})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Costo</Label>
                    <Input
                      type='number'
                      step='0.01'
                      value={formData.costo_total}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          costo_total: e.target.value,
                        })
                      }
                      placeholder='0.00'
                    />
                  </div>

                  <div className='col-span-2'>
                    <Label>Notas</Label>
                    <Textarea
                      value={formData.notas}
                      onChange={(e) =>
                        setFormData({ ...formData, notas: e.target.value })
                      }
                      placeholder='Observaciones adicionales...'
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateCita}
                  disabled={saving}
                >
                  {saving && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
                  Guardar Cita
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
        <Card>
          <CardContent className='pt-4'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm text-muted-foreground'>Total</span>
            </div>
            <p className='text-2xl font-bold'>{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-4'>
            <div className='flex items-center gap-2'>
              <Clock className='h-4 w-4 text-blue-500' />
              <span className='text-sm text-muted-foreground'>Programadas</span>
            </div>
            <p className='text-2xl font-bold text-blue-600'>
              {stats.programadas}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-4'>
            <div className='flex items-center gap-2'>
              <CheckCircle className='h-4 w-4 text-green-500' />
              <span className='text-sm text-muted-foreground'>Confirmadas</span>
            </div>
            <p className='text-2xl font-bold text-green-600'>
              {stats.confirmadas}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-4'>
            <div className='flex items-center gap-2'>
              <CheckCircle className='h-4 w-4 text-purple-500' />
              <span className='text-sm text-muted-foreground'>Completadas</span>
            </div>
            <p className='text-2xl font-bold text-purple-600'>
              {stats.completadas}
            </p>
          </CardContent>
        </Card>
        <Card className='col-span-2 md:col-span-1'>
          <CardContent className='pt-4'>
            <div className='flex items-center gap-2'>
              <XCircle className='h-4 w-4 text-red-500' />
              <span className='text-sm text-muted-foreground'>Canceladas</span>
            </div>
            <p className='text-2xl font-bold text-red-600'>
              {stats.canceladas}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de citas */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Historial de Citas</CardTitle>
          <CardDescription>
            Todas las citas vinculadas a este caso clínico
          </CardDescription>
        </CardHeader>
        <CardContent>
          {citas.length === 0 ? (
            <div className='text-center py-12 text-muted-foreground'>
              <CalendarDays className='h-12 w-12 mx-auto mb-4 opacity-50' />
              <p className='font-medium'>No hay citas vinculadas</p>
              <p className='text-sm mt-1'>
                Crea una nueva cita o vincula una existente para comenzar
              </p>
            </div>
          ) : (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Odontólogo</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Costo</TableHead>
                    <TableHead className='text-right'>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {citas.map((cita) => (
                    <TableRow key={cita.id}>
                      <TableCell>
                        <div className='font-medium'>
                          {format(
                            new Date(cita.fecha_inicio),
                            "EEEE dd MMM yyyy",
                            { locale: es }
                          )}
                        </div>
                        <div className='text-sm text-muted-foreground flex items-center gap-1'>
                          <Clock className='h-3 w-3' />
                          {format(new Date(cita.fecha_inicio), "HH:mm")} -{" "}
                          {format(new Date(cita.fecha_fin), "HH:mm")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Stethoscope className='h-4 w-4 text-muted-foreground' />
                          {getOdontologoName(cita.odontologo_id)}
                        </div>
                      </TableCell>
                      <TableCell>{cita.motivo || "-"}</TableCell>
                      <TableCell>{getEstadoBadge(cita.estado)}</TableCell>
                      <TableCell>
                        {cita.costo_total
                          ? `S/ ${cita.costo_total.toFixed(2)}`
                          : "-"}
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex justify-end gap-1'>
                          {cita.google_calendar_event_id && (
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8'
                              title='Ver en Google Calendar'
                              asChild
                            >
                              <a
                                href={`https://calendar.google.com/calendar/r/eventedit/${cita.google_calendar_event_id}`}
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                <ExternalLink className='h-4 w-4' />
                              </a>
                            </Button>
                          )}
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-muted-foreground hover:text-destructive'
                            title='Desvincular del caso'
                            onClick={() => handleDesvincularCita(cita.id)}
                          >
                            <Unlink className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
