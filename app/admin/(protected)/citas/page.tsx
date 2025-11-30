"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import CalendarioHome from "@/components/calendar/CalendarHome";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  History,
  Search,
  Calendar,
  Users,
  Clock,
  DollarSign,
} from "lucide-react";

interface Cita {
  id: string;
  paciente_id: string | null;
  odontologo_id: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  motivo?: string | null;
  costo_total?: number | null;
  moneda_id?: string | null;
  notas?: string | null;
  nombre_cita?: string | null;
}

interface Paciente {
  id: string;
  nombres: string;
  apellidos: string;
}

interface Odontologo {
  id: string;
  nombre_completo: string;
}

export default function CitasPage() {
  const supabase = createClient();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [odontologos, setOdontologos] = useState<Odontologo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [stats, setStats] = useState({
    total: 0,
    programadas: 0,
    confirmadas: 0,
    canceladas: 0,
    completadas: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [citasRes, pacientesRes, odontologosRes] = await Promise.all([
      supabase
        .from("citas")
        .select("*")
        .order("fecha_inicio", { ascending: false }),
      supabase.from("pacientes").select("id,nombres,apellidos"),
      supabase.from("personal").select("id,nombre_completo"),
    ]);

    if (citasRes.data) {
      setCitas(citasRes.data);
      // Calcular estadísticas
      const total = citasRes.data.length;
      const programadas = citasRes.data.filter(
        (c) => c.estado === "Programada"
      ).length;
      const confirmadas = citasRes.data.filter(
        (c) => c.estado === "Confirmada"
      ).length;
      const canceladas = citasRes.data.filter(
        (c) => c.estado === "Cancelada"
      ).length;
      const completadas = citasRes.data.filter(
        (c) => c.estado === "Completada"
      ).length;
      setStats({ total, programadas, confirmadas, canceladas, completadas });
    }
    if (pacientesRes.data) setPacientes(pacientesRes.data);
    if (odontologosRes.data) setOdontologos(odontologosRes.data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getPacienteName = (id: string | null) => {
    if (!id) return "Sin paciente";
    const paciente = pacientes.find((p) => p.id === id);
    return paciente
      ? `${paciente.nombres} ${paciente.apellidos}`
      : "Desconocido";
  };

  const getOdontologoName = (id: string | null) => {
    if (!id) return "Sin asignar";
    const odontologo = odontologos.find((o) => o.id === id);
    return odontologo ? odontologo.nombre_completo : "Desconocido";
  };

  const getEstadoBadge = (estado: string) => {
    const styles: Record<string, string> = {
      Programada: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      Confirmada: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
      Cancelada: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
      Completada: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
    };

    // const variants: Record<
    //   string,
    //   "default" | "secondary" | "destructive" | "outline"
    // > = {
    //   Programada: "secondary",
    //   Confirmada: "outline", // Changed to outline to allow custom colors to show better or use default if preferred, but custom class overrides
    //   Cancelada: "destructive",
    //   Completada: "outline",
    // };

    return (
      <Badge
        variant="outline"
        className={`${styles[estado] || ""} border-0`}
      >
        {estado}
      </Badge>
    );
  };

  // Filtrar citas
  const filteredCitas = citas.filter((cita) => {
    const pacienteName = getPacienteName(cita.paciente_id).toLowerCase();
    const odontologoName = getOdontologoName(cita.odontologo_id).toLowerCase();
    const matchesSearch =
      pacienteName.includes(searchTerm.toLowerCase()) ||
      odontologoName.includes(searchTerm.toLowerCase()) ||
      cita.motivo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado =
      estadoFilter === "todos" || cita.estado === estadoFilter;
    return matchesSearch && matchesEstado;
  });

  // Separar citas pasadas y futuras
  const now = new Date();
  const citasPasadas = filteredCitas.filter(
    (c) => new Date(c.fecha_inicio) < now
  );
  const citasFuturas = filteredCitas.filter(
    (c) => new Date(c.fecha_inicio) >= now
  );

  return (
    <div className='container mx-auto py-2 sm:py-6 px-0 sm:px-6 space-y-2 sm:space-y-6'>
      <div className='flex flex-col gap-2 px-2 sm:px-0'>
        <div>
          <h1 className='text-xl sm:text-3xl font-bold'>Gestión de Citas</h1>
          <p className='text-sm text-muted-foreground'>
            Administra las citas de la clínica
          </p>
        </div>
      </div>

      {/* Stats Cards - ocultas en móvil para dar más espacio al calendario */}
      <div className='hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs sm:text-sm font-medium'>
              Total Citas
            </CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground hidden sm:block' />
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold'>{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs sm:text-sm font-medium'>
              Programadas
            </CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground hidden sm:block' />
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold text-blue-600'>
              {stats.programadas}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs sm:text-sm font-medium'>
              Confirmadas
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground hidden sm:block' />
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold text-green-600'>
              {stats.confirmadas}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs sm:text-sm font-medium'>
              Completadas
            </CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground hidden sm:block' />
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold text-purple-600'>
              {stats.completadas}
            </div>
          </CardContent>
        </Card>
        <Card className='col-span-2 sm:col-span-1'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs sm:text-sm font-medium'>
              Canceladas
            </CardTitle>
            <CalendarDays className='h-4 w-4 text-muted-foreground hidden sm:block' />
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold text-red-600'>
              {stats.canceladas}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue='calendario'
        className='space-y-4'
      >
        <TabsList>
          <TabsTrigger
            value='calendario'
            className='flex items-center gap-2'
          >
            <CalendarDays className='h-4 w-4' />
            Calendario
          </TabsTrigger>
          <TabsTrigger
            value='historial'
            className='flex items-center gap-2'
          >
            <History className='h-4 w-4' />
            Historial
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value='calendario'
          className='space-y-0 sm:space-y-4'
        >
          <Card className='border-0 sm:border rounded-none sm:rounded-lg shadow-none sm:shadow'>
            <CardHeader className='hidden sm:block'>
              <CardTitle>Calendario de Citas</CardTitle>
              <CardDescription>
                Vista del calendario con Google Calendar integrado
              </CardDescription>
            </CardHeader>
            <CardContent className='h-[80vh] sm:h-[75vh] lg:h-[80vh] min-h-[500px] p-0 sm:p-6'>
              <CalendarioHome />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value='historial'
          className='space-y-4'
        >
          <Card>
            <CardHeader>
              <CardTitle>Historial de Citas</CardTitle>
              <CardDescription>
                Lista completa de todas las citas registradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className='flex flex-col md:flex-row gap-4 mb-6'>
                <div className='relative flex-1'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    placeholder='Buscar por paciente, odontólogo o motivo...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-10'
                  />
                </div>
                <Select
                  value={estadoFilter}
                  onValueChange={setEstadoFilter}
                >
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Filtrar por estado' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='todos'>Todos los estados</SelectItem>
                    <SelectItem value='Programada'>Programada</SelectItem>
                    <SelectItem value='Confirmada'>Confirmada</SelectItem>
                    <SelectItem value='Completada'>Completada</SelectItem>
                    <SelectItem value='Cancelada'>Cancelada</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant='outline'
                  onClick={fetchData}
                >
                  Actualizar
                </Button>
              </div>

              {/* Citas Futuras */}
              {citasFuturas.length > 0 && (
                <div className='mb-8'>
                  <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                    <CalendarDays className='h-5 w-5 text-green-600' />
                    Próximas Citas ({citasFuturas.length})
                  </h3>
                  <div className='rounded-md border'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Paciente</TableHead>
                          <TableHead>Odontólogo</TableHead>
                          <TableHead>Motivo</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Costo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {citasFuturas.map((cita) => (
                          <TableRow key={cita.id}>
                            <TableCell>
                              <div className='font-medium'>
                                {new Date(cita.fecha_inicio).toLocaleDateString(
                                  "es-PE",
                                  {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </div>
                              <div className='text-sm text-muted-foreground'>
                                {new Date(cita.fecha_inicio).toLocaleTimeString(
                                  "es-PE",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getPacienteName(cita.paciente_id)}
                            </TableCell>
                            <TableCell>
                              {getOdontologoName(cita.odontologo_id)}
                            </TableCell>
                            <TableCell>{cita.motivo || "-"}</TableCell>
                            <TableCell>{getEstadoBadge(cita.estado)}</TableCell>
                            <TableCell>
                              {cita.costo_total
                                ? `S/ ${cita.costo_total.toFixed(2)}`
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Citas Pasadas */}
              <div>
                <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                  <History className='h-5 w-5 text-gray-600' />
                  Citas Pasadas ({citasPasadas.length})
                </h3>
                {loading ? (
                  <p className='text-center py-8 text-muted-foreground'>
                    Cargando citas...
                  </p>
                ) : citasPasadas.length === 0 ? (
                  <p className='text-center py-8 text-muted-foreground'>
                    No se encontraron citas pasadas
                  </p>
                ) : (
                  <div className='rounded-md border'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Paciente</TableHead>
                          <TableHead>Odontólogo</TableHead>
                          <TableHead>Motivo</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Costo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {citasPasadas.slice(0, 50).map((cita) => (
                          <TableRow
                            key={cita.id}
                            className='opacity-75'
                          >
                            <TableCell>
                              <div className='font-medium'>
                                {new Date(cita.fecha_inicio).toLocaleDateString(
                                  "es-PE",
                                  {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </div>
                              <div className='text-sm text-muted-foreground'>
                                {new Date(cita.fecha_inicio).toLocaleTimeString(
                                  "es-PE",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getPacienteName(cita.paciente_id)}
                            </TableCell>
                            <TableCell>
                              {getOdontologoName(cita.odontologo_id)}
                            </TableCell>
                            <TableCell>{cita.motivo || "-"}</TableCell>
                            <TableCell>{getEstadoBadge(cita.estado)}</TableCell>
                            <TableCell>
                              {cita.costo_total
                                ? `S/ ${cita.costo_total.toFixed(2)}`
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
