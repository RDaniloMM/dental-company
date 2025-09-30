import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import PatientSearch from "@/components/patient-search";

export default async function Page() {
  const supabase = await createClient();
  const { data: patients } = await supabase
    .from("pacientes")
    .select("id, nombres, apellidos, numero_historia");

  return (
    <div className='flex min-h-svh w-full'>
      <Sheet>
        {/* Botón flotante de menú (responsivo) */}
        <SheetTrigger asChild>
          <button
            className='fixed left-2 top-2 sm:left-4 sm:top-4 z-50 inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-md hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors'
            aria-label='Abrir menú'
            title='Menú'
          >
            <Menu
              className='h-4 w-4 sm:h-5 sm:w-5'
              aria-hidden='true'
            />
            <span className='sr-only'>Abrir menú</span>
          </button>
        </SheetTrigger>

        {/* Contenido principal */}
        <main className='flex-1 p-4 sm:p-6 md:p-8 lg:p-10 pt-16 sm:pt-20'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <h1 className='text-xl sm:text-2xl font-bold'>Dashboard</h1>
            <Link
              href='/admin/ficha'
              className='inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base text-white hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center sm:justify-start'
            >
              Ir a Ficha Odontológica
            </Link>
          </div>

          <div className='mt-6 grid gap-4 sm:grid-cols-1 md:grid-cols-2'>
            <div className='rounded-lg border border-border bg-card p-4 sm:p-6 text-card-foreground'>
              <h3 className='font-semibold text-base sm:text-lg'>Resumen</h3>
              <p className='text-sm sm:text-base text-muted-foreground mt-1'>
                Métricas y estado general.
              </p>
            </div>
            <div className='rounded-lg border border-border bg-card p-4 sm:p-6 text-card-foreground'>
              <h3 className='font-semibold text-base sm:text-lg'>
                Próximas citas
              </h3>
              <p className='text-sm sm:text-base text-muted-foreground mt-1'>
                Listado de próximas atenciones.
              </p>
            </div>
          </div>

          <hr className='my-8' />

          <div className="w-full">
            <PatientSearch patients={patients || []} />
          </div>
        </main>

        {/* Menú lateral en Sheet */}
        <SheetContent
          side='left'
          className='w-full sm:w-80 md:w-72 p-0'
        >
          <SheetHeader className='px-4 py-3 border-b border-border'>
            <SheetTitle className='text-left'>Menú</SheetTitle>
          </SheetHeader>
          <nav className='px-3 py-4 sm:px-4'>
            {/* Menús principales sin acordeón padre */}
            <Accordion
              type='multiple'
              className='w-full space-y-3'
            >
              <AccordionItem
                value='pacientes'
                className='border border-border rounded-lg bg-card'
              >
                <AccordionTrigger className='px-4 py-3 text-card-foreground hover:text-accent-foreground text-sm sm:text-base font-medium'>
                  Pacientes
                </AccordionTrigger>
                <AccordionContent className='px-2 pb-3 space-y-1'>
                  <Link
                    href='/admin/ficha-odontologica'
                    className='block rounded px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors'
                  >
                    Ficha odontológica
                  </Link>
                  <Link
                    href='#'
                    className='block rounded px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors'
                  >
                    Historial
                  </Link>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value='citas'
                className='border border-border rounded-lg bg-card'
              >
                <AccordionTrigger className='px-4 py-3 text-card-foreground hover:text-accent-foreground text-sm sm:text-base font-medium'>
                  Citas
                </AccordionTrigger>
                <AccordionContent className='px-2 pb-3 space-y-1'>
                  <Link
                    href='#'
                    className='block rounded px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors'
                  >
                    Calendario
                  </Link>
                  <Link
                    href='#'
                    className='block rounded px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors'
                  >
                    Nueva cita
                  </Link>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value='config'
                className='border border-border rounded-lg bg-card'
              >
                <AccordionTrigger className='px-4 py-3 text-card-foreground hover:text-accent-foreground text-sm sm:text-base font-medium'>
                  Configuración
                </AccordionTrigger>
                <AccordionContent className='px-2 pb-3 space-y-1'>
                  <Link
                    href='/admin/usuarios'
                    className='block rounded px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors'
                  >
                    Usuarios
                  </Link>
                  <Link
                    href='#'
                    className='block rounded px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors'
                  >
                    Preferencias
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}