"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
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
    tasaAsistencia: number;
  };
  finanzas: {
    ingresosMes: number;
    crecimiento: number;
  };
  tratamientos: {
    porEstado: {
      pendiente: number;
      enProgreso: number;
    };
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(amount);
}

export function KPICards() {
  const [data, setData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <>
        <div className='rounded-lg border border-border bg-card p-4 sm:p-6 text-card-foreground'>
          <Skeleton className='h-5 w-24 mb-3' />
          <Skeleton className='h-8 w-16 mb-2' />
          <Skeleton className='h-4 w-32' />
        </div>
        <div className='rounded-lg border border-border bg-card p-4 sm:p-6 text-card-foreground'>
          <Skeleton className='h-5 w-24 mb-3' />
          <Skeleton className='h-8 w-16 mb-2' />
          <Skeleton className='h-4 w-32' />
        </div>
        <div className='rounded-lg border border-border bg-card p-4 sm:p-6 text-card-foreground'>
          <Skeleton className='h-5 w-24 mb-3' />
          <Skeleton className='h-8 w-16 mb-2' />
          <Skeleton className='h-4 w-32' />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Tarjeta Pacientes */}
      <div className='rounded-lg border border-border bg-card p-4 sm:p-6 text-card-foreground'>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='font-semibold text-base sm:text-lg'>Pacientes</h3>
          <Users className='h-5 w-5 text-muted-foreground' />
        </div>
        <p className='text-2xl sm:text-3xl font-bold'>
          {data?.pacientes.total || 0}
        </p>
        <div className='flex items-center text-sm text-muted-foreground mt-2'>
          {data?.pacientes.crecimiento !== undefined &&
          data.pacientes.crecimiento >= 0 ? (
            <TrendingUp className='mr-1 h-4 w-4 text-green-500' />
          ) : (
            <TrendingDown className='mr-1 h-4 w-4 text-red-500' />
          )}
          <span
            className={
              data?.pacientes.crecimiento !== undefined &&
              data.pacientes.crecimiento >= 0
                ? "text-green-500"
                : "text-red-500"
            }
          >
            {data?.pacientes.crecimiento || 0}%
          </span>
          <span className='ml-1'>vs mes anterior</span>
        </div>
        <p className='text-xs text-muted-foreground mt-1'>
          +{data?.pacientes.nuevosEsteMes || 0} nuevos este mes
        </p>
      </div>

      {/* Tarjeta Citas */}
      <div className='rounded-lg border border-border bg-card p-4 sm:p-6 text-card-foreground'>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='font-semibold text-base sm:text-lg'>Citas Hoy</h3>
          <Calendar className='h-5 w-5 text-muted-foreground' />
        </div>
        <p className='text-2xl sm:text-3xl font-bold'>{data?.citas.hoy || 0}</p>
        <p className='text-sm text-muted-foreground mt-2'>
          {data?.citas.semana || 0} citas esta semana
        </p>
        <p className='text-xs text-muted-foreground mt-1'>
          {data?.citas.tasaAsistencia || 0}% tasa de asistencia
        </p>
      </div>

      {/* Tarjeta Ingresos */}
      <div className='rounded-lg border border-border bg-card p-4 sm:p-6 text-card-foreground'>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='font-semibold text-base sm:text-lg'>Ingresos</h3>
          <DollarSign className='h-5 w-5 text-muted-foreground' />
        </div>
        <p className='text-2xl sm:text-3xl font-bold'>
          {formatCurrency(data?.finanzas.ingresosMes || 0)}
        </p>
        <div className='flex items-center text-sm text-muted-foreground mt-2'>
          {data?.finanzas.crecimiento !== undefined &&
          data.finanzas.crecimiento >= 0 ? (
            <TrendingUp className='mr-1 h-4 w-4 text-green-500' />
          ) : (
            <TrendingDown className='mr-1 h-4 w-4 text-red-500' />
          )}
          <span
            className={
              data?.finanzas.crecimiento !== undefined &&
              data.finanzas.crecimiento >= 0
                ? "text-green-500"
                : "text-red-500"
            }
          >
            {data?.finanzas.crecimiento || 0}%
          </span>
          <span className='ml-1'>vs mes anterior</span>
        </div>
        <div className='flex items-center text-xs text-muted-foreground mt-1'>
          <ClipboardList className='mr-1 h-3 w-3' />
          {(data?.tratamientos.porEstado.pendiente || 0) +
            (data?.tratamientos.porEstado.enProgreso || 0)}{" "}
          tratamientos activos
        </div>
      </div>
    </>
  );
}
