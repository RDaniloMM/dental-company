import CalendarHome from "@/components/calendar/CalendarHome";
import { KPICards } from "@/components/kpi/KPICards";
import { KPICharts } from "@/components/kpi/KPICharts";
import { DashboardRecordatorios } from "./DashboardRecordatorios";

export default async function HomePage() {
  return (
    <>
      <main className='min-h-full'>
        <div className='flex flex-col gap-6'>
          {/* KPI Cards */}
          <KPICards />

          {/* Gráficos */}
          <div className='min-w-0'>
            <KPICharts />
          </div>

          {/* Calendario */}
          <div className='min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] rounded-lg'>
            <CalendarHome />
          </div>
        </div>

        {/* Sistema de Recordatorios - Solo Client Side */}
        <DashboardRecordatorios />
      </main>
    </>
  );
}
