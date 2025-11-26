"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Settings2, Eye, EyeOff, RotateCcw } from "lucide-react";

interface KPIData {
  pacientes: {
    total: number;
    nuevosEsteMes: number;
    crecimiento: number;
    historico: Array<{ mes: string; pacientes: number }>;
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
    historico: Array<{ mes: string; citas: number }>;
  };
  finanzas: {
    ingresosMes: number;
    ingresosMesAnterior: number;
    crecimiento: number;
    historico: Array<{ mes: string; ingresos: number }>;
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
}

interface ChartVisibility {
  ingresos: boolean;
  pacientes: boolean;
  citasMes: boolean;
  citasEstado: boolean;
  tratamientosEstado: boolean;
  topProcedimientos: boolean;
}

const CHART_LABELS: Record<keyof ChartVisibility, string> = {
  ingresos: "Ingresos Mensuales",
  pacientes: "Pacientes Nuevos",
  citasMes: "Citas por Mes",
  citasEstado: "Estado de Citas",
  tratamientosEstado: "Estado de Tratamientos",
  topProcedimientos: "Top Procedimientos",
};

const DEFAULT_VISIBILITY: ChartVisibility = {
  ingresos: true,
  pacientes: true,
  citasMes: true,
  citasEstado: true,
  tratamientosEstado: true,
  topProcedimientos: true,
};

const STORAGE_KEY = "kpi-charts-visibility";

const COLORS_CITAS = ["#3b82f6", "#22c55e", "#10b981", "#ef4444", "#f59e0b"];
const COLORS_TRATAMIENTOS = ["#f59e0b", "#3b82f6", "#22c55e", "#ef4444"];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function KPICharts() {
  const [data, setData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibility, setVisibility] =
    useState<ChartVisibility>(DEFAULT_VISIBILITY);
  const [mounted, setMounted] = useState(false);

  // Cargar preferencias de localStorage al montar
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setVisibility({ ...DEFAULT_VISIBILITY, ...parsed });
      } catch {
        setVisibility(DEFAULT_VISIBILITY);
      }
    }
  }, []);

  // Guardar preferencias en localStorage cuando cambian
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visibility));
    }
  }, [visibility, mounted]);

  useEffect(() => {
    async function fetchKPIData() {
      try {
        const response = await fetch("/api/kpi");
        if (response.ok) {
          const kpiData = await response.json();
          setData(kpiData);
        }
      } catch (err) {
        console.error("Error fetching KPI:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchKPIData();
  }, []);

  const toggleChart = (chart: keyof ChartVisibility) => {
    setVisibility((prev) => ({ ...prev, [chart]: !prev[chart] }));
  };

  const resetVisibility = () => {
    setVisibility(DEFAULT_VISIBILITY);
  };

  const showAll = () => {
    setVisibility({
      ingresos: true,
      pacientes: true,
      citasMes: true,
      citasEstado: true,
      tratamientosEstado: true,
      topProcedimientos: true,
    });
  };

  const hideAll = () => {
    setVisibility({
      ingresos: false,
      pacientes: false,
      citasMes: false,
      citasEstado: false,
      tratamientosEstado: false,
      topProcedimientos: false,
    });
  };

  const visibleCount = Object.values(visibility).filter(Boolean).length;
  const totalCharts = Object.keys(visibility).length;

  if (loading) {
    return (
      <div className='space-y-4'>
        <div className='flex justify-end'>
          <Skeleton className='h-9 w-32' />
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-5 w-40' />
                <Skeleton className='h-4 w-60' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-[250px] w-full' />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Preparar datos para gráfico de pastel de citas
  const dataCitasEstado = [
    { name: "Programadas", value: data?.citas.porEstado.programada || 0 },
    { name: "Confirmadas", value: data?.citas.porEstado.confirmada || 0 },
    { name: "Completadas", value: data?.citas.porEstado.completada || 0 },
    { name: "Canceladas", value: data?.citas.porEstado.cancelada || 0 },
    { name: "No Asistió", value: data?.citas.porEstado.noAsistio || 0 },
  ].filter((item) => item.value > 0);

  // Preparar datos para gráfico de pastel de tratamientos
  const dataTratamientosEstado = [
    { name: "Pendientes", value: data?.tratamientos.porEstado.pendiente || 0 },
    {
      name: "En Progreso",
      value: data?.tratamientos.porEstado.enProgreso || 0,
    },
    {
      name: "Completados",
      value: data?.tratamientos.porEstado.completado || 0,
    },
    { name: "Cancelados", value: data?.tratamientos.porEstado.cancelado || 0 },
  ].filter((item) => item.value > 0);

  return (
    <div className='space-y-4'>
      {/* Controles de personalización */}
      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>
          Mostrando {visibleCount} de {totalCharts} gráficos
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className='gap-2'
            >
              <Settings2 className='h-4 w-4' />
              Personalizar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='w-56'
          >
            <DropdownMenuLabel>Gráficos visibles</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.keys(visibility) as Array<keyof ChartVisibility>).map(
              (key) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={visibility[key]}
                  onCheckedChange={() => toggleChart(key)}
                >
                  {CHART_LABELS[key]}
                </DropdownMenuCheckboxItem>
              )
            )}
            <DropdownMenuSeparator />
            <div className='p-2 space-y-1'>
              <Button
                variant='ghost'
                size='sm'
                className='w-full justify-start gap-2'
                onClick={showAll}
              >
                <Eye className='h-4 w-4' />
                Mostrar todos
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='w-full justify-start gap-2'
                onClick={hideAll}
              >
                <EyeOff className='h-4 w-4' />
                Ocultar todos
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='w-full justify-start gap-2'
                onClick={resetVisibility}
              >
                <RotateCcw className='h-4 w-4' />
                Restablecer
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Gráficos */}
      {visibleCount === 0 ? (
        <Card className='py-12'>
          <CardContent className='flex flex-col items-center justify-center text-center'>
            <EyeOff className='h-12 w-12 text-muted-foreground mb-4' />
            <p className='text-muted-foreground mb-4'>
              No hay gráficos visibles
            </p>
            <Button
              variant='outline'
              onClick={showAll}
              className='gap-2'
            >
              <Eye className='h-4 w-4' />
              Mostrar todos los gráficos
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {/* Gráfico de Ingresos por Mes */}
          {visibility.ingresos && (
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-base font-semibold'>
                  Ingresos Mensuales
                </CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-[250px]'>
                  <ResponsiveContainer
                    width='100%'
                    height='100%'
                  >
                    <AreaChart data={data?.finanzas.historico || []}>
                      <defs>
                        <linearGradient
                          id='colorIngresos'
                          x1='0'
                          y1='0'
                          x2='0'
                          y2='1'
                        >
                          <stop
                            offset='5%'
                            stopColor='#22c55e'
                            stopOpacity={0.8}
                          />
                          <stop
                            offset='95%'
                            stopColor='#22c55e'
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray='3 3'
                        className='stroke-muted'
                      />
                      <XAxis
                        dataKey='mes'
                        tick={{ fontSize: 12 }}
                        className='text-muted-foreground'
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `S/${value}`}
                        className='text-muted-foreground'
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          formatCurrency(value),
                          "Ingresos",
                        ]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type='monotone'
                        dataKey='ingresos'
                        stroke='#22c55e'
                        fillOpacity={1}
                        fill='url(#colorIngresos)'
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gráfico de Pacientes Nuevos por Mes */}
          {visibility.pacientes && (
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-base font-semibold'>
                  Pacientes Nuevos
                </CardTitle>
                <CardDescription>Registro mensual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-[250px]'>
                  <ResponsiveContainer
                    width='100%'
                    height='100%'
                  >
                    <BarChart data={data?.pacientes.historico || []}>
                      <CartesianGrid
                        strokeDasharray='3 3'
                        className='stroke-muted'
                      />
                      <XAxis
                        dataKey='mes'
                        tick={{ fontSize: 12 }}
                        className='text-muted-foreground'
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        className='text-muted-foreground'
                      />
                      <Tooltip
                        formatter={(value: number) => [value, "Pacientes"]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey='pacientes'
                        fill='#3b82f6'
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gráfico de Citas por Mes */}
          {visibility.citasMes && (
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-base font-semibold'>
                  Citas por Mes
                </CardTitle>
                <CardDescription>Tendencia de citas agendadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-[250px]'>
                  <ResponsiveContainer
                    width='100%'
                    height='100%'
                  >
                    <LineChart data={data?.citas.historico || []}>
                      <CartesianGrid
                        strokeDasharray='3 3'
                        className='stroke-muted'
                      />
                      <XAxis
                        dataKey='mes'
                        tick={{ fontSize: 12 }}
                        className='text-muted-foreground'
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        className='text-muted-foreground'
                      />
                      <Tooltip
                        formatter={(value: number) => [value, "Citas"]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type='monotone'
                        dataKey='citas'
                        stroke='#8b5cf6'
                        strokeWidth={2}
                        dot={{ fill: "#8b5cf6", strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gráfico de Estado de Citas */}
          {visibility.citasEstado && (
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-base font-semibold'>
                  Estado de Citas
                </CardTitle>
                <CardDescription>Distribución actual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-[250px]'>
                  {dataCitasEstado.length > 0 ? (
                    <ResponsiveContainer
                      width='100%'
                      height='100%'
                    >
                      <PieChart>
                        <Pie
                          data={dataCitasEstado}
                          cx='50%'
                          cy='50%'
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey='value'
                          label={({ name, percent }) =>
                            `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {dataCitasEstado.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS_CITAS[index % COLORS_CITAS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            value,
                            name,
                          ]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className='flex items-center justify-center h-full text-muted-foreground'>
                      No hay datos de citas
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gráfico de Estado de Tratamientos */}
          {visibility.tratamientosEstado && (
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-base font-semibold'>
                  Estado de Tratamientos
                </CardTitle>
                <CardDescription>Planes de procedimientos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-[250px]'>
                  {dataTratamientosEstado.length > 0 ? (
                    <ResponsiveContainer
                      width='100%'
                      height='100%'
                    >
                      <PieChart>
                        <Pie
                          data={dataTratamientosEstado}
                          cx='50%'
                          cy='50%'
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey='value'
                          label={({ name, percent }) =>
                            `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {dataTratamientosEstado.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                COLORS_TRATAMIENTOS[
                                  index % COLORS_TRATAMIENTOS.length
                                ]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            value,
                            name,
                          ]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className='flex items-center justify-center h-full text-muted-foreground'>
                      No hay datos de tratamientos
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Procedimientos */}
          {visibility.topProcedimientos && (
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-base font-semibold'>
                  Top Procedimientos
                </CardTitle>
                <CardDescription>
                  Más realizados (últimos 30 días)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-[250px]'>
                  {data?.tratamientos.topProcedimientos &&
                  data.tratamientos.topProcedimientos.length > 0 ? (
                    <ResponsiveContainer
                      width='100%'
                      height='100%'
                    >
                      <BarChart
                        data={data.tratamientos.topProcedimientos}
                        layout='vertical'
                        margin={{ left: 20, right: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray='3 3'
                          className='stroke-muted'
                        />
                        <XAxis
                          type='number'
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          type='category'
                          dataKey='nombre'
                          tick={{ fontSize: 11 }}
                          width={100}
                        />
                        <Tooltip
                          formatter={(value: number) => [value, "Realizados"]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar
                          dataKey='count'
                          fill='#f59e0b'
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className='flex items-center justify-center h-full text-muted-foreground'>
                      No hay procedimientos registrados
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
