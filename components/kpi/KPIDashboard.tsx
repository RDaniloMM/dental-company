"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserCheck,
  ClipboardList,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface KPIData {
  pacientes: {
    total: number;
    nuevosEsteMes: number;
    crecimiento: number;
  };
  citas: {
    total: number;
    hoy: number;
    semana: number;
    porEstado: {
      programada: number;
      confirmada: number;
      cancelada: number;
      completada: number;
      noAsistio: number;
    };
    tasaAsistencia: number;
    proximas: Array<{
      id: string;
      fecha_inicio: string;
      motivo: string;
      estado: string;
      pacientes: { nombres: string; apellidos: string };
      personal: { nombres: string; apellidos: string };
    }>;
  };
  finanzas: {
    ingresosMes: number;
    ingresosMesAnterior: number;
    crecimiento: number;
  };
  tratamientos: {
    total: number;
    porEstado: {
      pendiente: number;
      enProgreso: number;
      completado: number;
      cancelado: number;
    };
    valorTotal: number;
    valorCompletado: number;
    topProcedimientos: Array<{ nombre: string; count: number }>;
  };
  personal: {
    totalActivo: number;
  };
}

function KPICardSkeleton() {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-4 w-4 rounded' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-8 w-16 mb-1' />
        <Skeleton className='h-3 w-32' />
      </CardContent>
    </Card>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(amount);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-PE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function KPIDashboard() {
  const [data, setData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchKPIData() {
      try {
        const response = await fetch("/api/kpi");
        if (!response.ok) {
          throw new Error("Error al cargar datos");
        }
        const kpiData = await response.json();
        setData(kpiData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    fetchKPIData();
  }, []);

  if (error) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <AlertCircle className='h-12 w-12 text-destructive mx-auto mb-4' />
          <p className='text-destructive font-medium'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Dashboard KPI</h2>
          <p className='text-muted-foreground'>
            Resumen de métricas clave de la clínica dental
          </p>
        </div>
        <Badge
          variant='outline'
          className='text-sm'
        >
          <Activity className='mr-1 h-3 w-3' />
          En tiempo real
        </Badge>
      </div>

      {/* Tarjetas principales de KPI */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {loading ? (
          <>
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
          </>
        ) : (
          <>
            {/* Total Pacientes */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Pacientes
                </CardTitle>
                <Users className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {data?.pacientes.total}
                </div>
                <div className='flex items-center text-xs text-muted-foreground'>
                  {data?.pacientes.crecimiento !== undefined &&
                  data.pacientes.crecimiento >= 0 ? (
                    <TrendingUp className='mr-1 h-3 w-3 text-green-500' />
                  ) : (
                    <TrendingDown className='mr-1 h-3 w-3 text-red-500' />
                  )}
                  <span
                    className={
                      data?.pacientes.crecimiento !== undefined &&
                      data.pacientes.crecimiento >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {data?.pacientes.crecimiento}%
                  </span>
                  <span className='ml-1'>vs. mes anterior</span>
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                  +{data?.pacientes.nuevosEsteMes} nuevos este mes
                </p>
              </CardContent>
            </Card>

            {/* Citas Hoy */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Citas Hoy</CardTitle>
                <Calendar className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{data?.citas.hoy}</div>
                <p className='text-xs text-muted-foreground'>
                  {data?.citas.semana} citas esta semana
                </p>
                <div className='flex items-center text-xs mt-1'>
                  <CheckCircle2 className='mr-1 h-3 w-3 text-green-500' />
                  <span>{data?.citas.tasaAsistencia}% tasa de asistencia</span>
                </div>
              </CardContent>
            </Card>

            {/* Ingresos del Mes */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Ingresos del Mes
                </CardTitle>
                <DollarSign className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {formatCurrency(data?.finanzas.ingresosMes || 0)}
                </div>
                <div className='flex items-center text-xs text-muted-foreground'>
                  {data?.finanzas.crecimiento !== undefined &&
                  data.finanzas.crecimiento >= 0 ? (
                    <TrendingUp className='mr-1 h-3 w-3 text-green-500' />
                  ) : (
                    <TrendingDown className='mr-1 h-3 w-3 text-red-500' />
                  )}
                  <span
                    className={
                      data?.finanzas.crecimiento !== undefined &&
                      data.finanzas.crecimiento >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {data?.finanzas.crecimiento}%
                  </span>
                  <span className='ml-1'>vs. mes anterior</span>
                </div>
              </CardContent>
            </Card>

            {/* Tratamientos Activos */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Tratamientos Activos
                </CardTitle>
                <ClipboardList className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {(data?.tratamientos.porEstado.pendiente || 0) +
                    (data?.tratamientos.porEstado.enProgreso || 0)}
                </div>
                <p className='text-xs text-muted-foreground'>
                  {data?.tratamientos.porEstado.completado} completados
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  Valor total:{" "}
                  {formatCurrency(data?.tratamientos.valorTotal || 0)}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Segunda fila - Estadísticas detalladas */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {/* Estado de Citas */}
        <Card className='col-span-1'>
          <CardHeader>
            <CardTitle className='text-lg'>Estado de Citas</CardTitle>
            <CardDescription>Distribución por estado actual</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {loading ? (
              <div className='space-y-3'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
              </div>
            ) : (
              <>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center'>
                      <div className='w-3 h-3 rounded-full bg-blue-500 mr-2' />
                      <span>Programadas</span>
                    </div>
                    <span className='font-medium'>
                      {data?.citas.porEstado.programada}
                    </span>
                  </div>
                  <Progress
                    value={
                      data?.citas.total
                        ? ((data?.citas.porEstado.programada || 0) /
                            data?.citas.total) *
                          100
                        : 0
                    }
                    className='h-2'
                  />
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center'>
                      <div className='w-3 h-3 rounded-full bg-green-500 mr-2' />
                      <span>Confirmadas</span>
                    </div>
                    <span className='font-medium'>
                      {data?.citas.porEstado.confirmada}
                    </span>
                  </div>
                  <Progress
                    value={
                      data?.citas.total
                        ? ((data?.citas.porEstado.confirmada || 0) /
                            data?.citas.total) *
                          100
                        : 0
                    }
                    className='h-2'
                  />
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center'>
                      <div className='w-3 h-3 rounded-full bg-emerald-500 mr-2' />
                      <span>Completadas</span>
                    </div>
                    <span className='font-medium'>
                      {data?.citas.porEstado.completada}
                    </span>
                  </div>
                  <Progress
                    value={
                      data?.citas.total
                        ? ((data?.citas.porEstado.completada || 0) /
                            data?.citas.total) *
                          100
                        : 0
                    }
                    className='h-2'
                  />
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center'>
                      <div className='w-3 h-3 rounded-full bg-red-500 mr-2' />
                      <span>Canceladas</span>
                    </div>
                    <span className='font-medium'>
                      {data?.citas.porEstado.cancelada}
                    </span>
                  </div>
                  <Progress
                    value={
                      data?.citas.total
                        ? ((data?.citas.porEstado.cancelada || 0) /
                            data?.citas.total) *
                          100
                        : 0
                    }
                    className='h-2'
                  />
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center'>
                      <div className='w-3 h-3 rounded-full bg-yellow-500 mr-2' />
                      <span>No Asistió</span>
                    </div>
                    <span className='font-medium'>
                      {data?.citas.porEstado.noAsistio}
                    </span>
                  </div>
                  <Progress
                    value={
                      data?.citas.total
                        ? ((data?.citas.porEstado.noAsistio || 0) /
                            data?.citas.total) *
                          100
                        : 0
                    }
                    className='h-2'
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Tratamientos por Estado */}
        <Card className='col-span-1'>
          <CardHeader>
            <CardTitle className='text-lg'>Estado de Tratamientos</CardTitle>
            <CardDescription>Planes de procedimientos actuales</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='space-y-3'>
                <Skeleton className='h-16 w-full' />
                <Skeleton className='h-16 w-full' />
              </div>
            ) : (
              <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col items-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg'>
                  <Clock className='h-8 w-8 text-yellow-600 mb-2' />
                  <span className='text-2xl font-bold'>
                    {data?.tratamientos.porEstado.pendiente}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    Pendientes
                  </span>
                </div>

                <div className='flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg'>
                  <Activity className='h-8 w-8 text-blue-600 mb-2' />
                  <span className='text-2xl font-bold'>
                    {data?.tratamientos.porEstado.enProgreso}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    En Progreso
                  </span>
                </div>

                <div className='flex flex-col items-center p-4 bg-green-50 dark:bg-green-950 rounded-lg'>
                  <CheckCircle2 className='h-8 w-8 text-green-600 mb-2' />
                  <span className='text-2xl font-bold'>
                    {data?.tratamientos.porEstado.completado}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    Completados
                  </span>
                </div>

                <div className='flex flex-col items-center p-4 bg-red-50 dark:bg-red-950 rounded-lg'>
                  <XCircle className='h-8 w-8 text-red-600 mb-2' />
                  <span className='text-2xl font-bold'>
                    {data?.tratamientos.porEstado.cancelado}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    Cancelados
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Procedimientos */}
        <Card className='col-span-1'>
          <CardHeader>
            <CardTitle className='text-lg'>Top Procedimientos</CardTitle>
            <CardDescription>
              Más realizados en los últimos 30 días
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='space-y-3'>
                <Skeleton className='h-8 w-full' />
                <Skeleton className='h-8 w-full' />
                <Skeleton className='h-8 w-full' />
              </div>
            ) : data?.tratamientos.topProcedimientos &&
              data.tratamientos.topProcedimientos.length > 0 ? (
              <div className='space-y-3'>
                {data.tratamientos.topProcedimientos.map((proc, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-2 rounded-lg bg-muted/50'
                  >
                    <div className='flex items-center'>
                      <span className='w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mr-3'>
                        {index + 1}
                      </span>
                      <span className='text-sm font-medium truncate max-w-[150px]'>
                        {proc.nombre}
                      </span>
                    </div>
                    <Badge variant='secondary'>{proc.count}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex items-center justify-center h-32 text-muted-foreground'>
                <p>No hay datos disponibles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tercera fila - Próximas Citas */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg flex items-center'>
            <Calendar className='mr-2 h-5 w-5' />
            Próximas Citas
          </CardTitle>
          <CardDescription>
            Citas programadas para los próximos 7 días
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='space-y-3'>
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
            </div>
          ) : data?.citas.proximas && data.citas.proximas.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b'>
                    <th className='text-left py-2 text-sm font-medium text-muted-foreground'>
                      Fecha y Hora
                    </th>
                    <th className='text-left py-2 text-sm font-medium text-muted-foreground'>
                      Paciente
                    </th>
                    <th className='text-left py-2 text-sm font-medium text-muted-foreground'>
                      Odontólogo
                    </th>
                    <th className='text-left py-2 text-sm font-medium text-muted-foreground'>
                      Motivo
                    </th>
                    <th className='text-left py-2 text-sm font-medium text-muted-foreground'>
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.citas.proximas.map((cita) => (
                    <tr
                      key={cita.id}
                      className='border-b last:border-0'
                    >
                      <td className='py-3 text-sm'>
                        {formatDate(cita.fecha_inicio)}
                      </td>
                      <td className='py-3 text-sm'>
                        <div className='flex items-center'>
                          <UserCheck className='h-4 w-4 mr-2 text-muted-foreground' />
                          {cita.pacientes?.nombres} {cita.pacientes?.apellidos}
                        </div>
                      </td>
                      <td className='py-3 text-sm'>
                        {cita.personal?.nombres} {cita.personal?.apellidos}
                      </td>
                      <td className='py-3 text-sm text-muted-foreground'>
                        {cita.motivo || "Sin especificar"}
                      </td>
                      <td className='py-3'>
                        <Badge
                          variant={
                            cita.estado === "Confirmada"
                              ? "default"
                              : cita.estado === "Programada"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {cita.estado}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='flex items-center justify-center h-32 text-muted-foreground'>
              <p>No hay citas programadas para los próximos días</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen del Personal */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg flex items-center'>
            <Users className='mr-2 h-5 w-5' />
            Resumen General
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className='h-24 w-full' />
          ) : (
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='text-center p-4 bg-muted/50 rounded-lg'>
                <p className='text-2xl font-bold'>
                  {data?.personal.totalActivo}
                </p>
                <p className='text-sm text-muted-foreground'>Personal Activo</p>
              </div>
              <div className='text-center p-4 bg-muted/50 rounded-lg'>
                <p className='text-2xl font-bold'>{data?.citas.total}</p>
                <p className='text-sm text-muted-foreground'>Total Citas</p>
              </div>
              <div className='text-center p-4 bg-muted/50 rounded-lg'>
                <p className='text-2xl font-bold'>{data?.tratamientos.total}</p>
                <p className='text-sm text-muted-foreground'>
                  Total Tratamientos
                </p>
              </div>
              <div className='text-center p-4 bg-muted/50 rounded-lg'>
                <p className='text-2xl font-bold'>
                  {formatCurrency(data?.tratamientos.valorCompletado || 0)}
                </p>
                <p className='text-sm text-muted-foreground'>
                  Valor Completado
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
