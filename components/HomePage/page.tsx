import CalendarHome from "@/components/calendar/CalendarHome";
import { KPICards } from "@/components/kpi/KPICards";
import { KPICharts } from "@/components/kpi/KPICharts";

export default async function HomePage() {
  return (
    <>
      <main className='h-full'>
        <div className='flex flex-col gap-6 h-full'>
          {/* KPI Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <KPICards />
          </div>

          {/* Gráficos */}
          <KPICharts />

          {/* Calendario */}
          <div className='h-auto rounded-lg'>
            <CalendarHome />
          </div>
        </div>
      </main>
    </>
  );
}
