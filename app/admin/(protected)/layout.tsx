import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitcher } from "@/components/theme-switcher";
import ToasterClient from "@/components/ui/toasteClient";
import PatientSearch from "@/components/patient-search";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: patients, error } = await supabase
    .from("pacientes")
    .select("id, nombres, apellidos, numero_historia");

  if (error) {
    console.error("Error fetching patients in layout:", error);
  }

  return (
    <div className="admin-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className='flex h-14 shrink-0 items-center gap-2 border-b px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator
              orientation='vertical'
              className='mr-2 h-4'
            />

            <div className='flex flex-1 justify-center'>
              <div className='w-full md:max-w-xl'>
                <PatientSearch patients={patients || []} />
              </div>
            </div>

            <div className='flex items-center gap-4 ml-auto order-b px-2'>
              <Separator
                orientation='vertical'
                className='mr-2 h-4'
              />
              <ThemeSwitcher />
            </div>
          </header>
          <main className='min-h-[88vh] flex flex-col items-center'>
            <div className='flex-1 w-full flex flex-col gap-5'>
              <div className='flex-1 flex flex-col gap-20 p-4 w-full'>
                {children}
              </div>
            </div>
          </main>
          <ToasterClient />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
