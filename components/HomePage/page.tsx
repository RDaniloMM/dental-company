import CalendarHome from "@/components/calendar/CalendarHome";
import { KPICards } from "@/components/kpi/KPICards";

export default async function HomePage() {
  return (
    <>
      <main className='h-full'>
        <div className='grid grid-cols-1 md:grid-cols-3 grid-rows-[auto,1fr] gap-4 h-full'>
          <KPICards />

          <div className='col-span-1 md:col-span-3 h-auto rounded-lg'>
            <CalendarHome />
          </div>
        </div>
      </main>
    </>
  );
}
