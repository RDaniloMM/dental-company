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
        {/* Botón flotante de menú (esquina superior izquierda) */}
        <SheetTrigger asChild>
          <button
            className='fixed left-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-md border bg-white text-slate-700 shadow hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
            aria-label='Abrir menú'
            title='Menú'
          >
            <Menu
              className='h-5 w-5'
              aria-hidden='true'
            />
            <span className='sr-only'>Abrir menú</span>
          </button>
        </SheetTrigger>

        {/* Contenido principal */}
        <main className='flex-1 p-6 md:p-10'>
          <div className='flex items-center justify-between gap-4'>
            <h1 className='text-2xl font-bold'>Dashboard</h1>
            <Link
              href='/admin/ficha-odontologica'
              className='inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
            >
              Ir a Ficha Odontológica
            </Link>
          </div>

          <div className='mt-6 grid gap-4 md:grid-cols-2'>
            <div className='rounded-lg border bg-white p-4'>
              <h3 className='font-semibold text-slate-800'>Resumen</h3>
              <p className='text-sm text-slate-600'>
                Métricas y estado general.
              </p>
            </div>
            <div className='rounded-lg border bg-white p-4'>
              <h3 className='font-semibold text-slate-800'>Próximas citas</h3>
              <p className='text-sm text-slate-600'>
                Listado de próximas atenciones.
              </p>
            </div>
          </div>

          <hr className="my-8" />

          <div className="grid gap-4 md:grid-cols-2">
            <PatientSearch patients={patients || []} />
          </div>
        </main>

        {/* Menú lateral en Sheet */}
        <SheetContent
          side='left'
          className='w-72 p-0'
        >
          <SheetHeader className='px-4 py-3 border-b'>
            <SheetTitle>Menú</SheetTitle>
          </SheetHeader>
          <nav className='px-2 py-3'>
            {/* Barra completa desplegable */}
            <Accordion
              type='single'
              collapsible
              defaultValue='menu'
              className='w-full'
            >
              <AccordionItem
                value='menu'
                className='border rounded-lg'
              >
                <AccordionTrigger className='px-2 py-2 text-slate-700'>
                  Barra de menú
                </AccordionTrigger>
                <AccordionContent className='pt-2'>
                  {/* Submenús */}
                  <Accordion
                    type='multiple'
                    className='w-full'
                  >
                    <AccordionItem
                      value='pacientes'
                      className='border rounded-lg mb-2'
                    >
                      <AccordionTrigger className='px-2 py-2 text-slate-700'>
                        Pacientes
                      </AccordionTrigger>
                      <AccordionContent className='pl-2 pb-3 space-y-1'>
                        <Link
                          href='/admin/ficha-odontologica'
                          className='block rounded px-2 py-1 text-sm text-slate-700 hover:bg-slate-100'
                        >
                          Ficha odontológica
                        </Link>
                        <Link
                          href='#'
                          className='block rounded px-2 py-1 text-sm text-slate-700 hover:bg-slate-100'
                        >
                          Historial
                        </Link>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                      value='citas'
                      className='border rounded-lg mb-2'
                    >
                      <AccordionTrigger className='px-2 py-2 text-slate-700'>
                        Citas
                      </AccordionTrigger>
                      <AccordionContent className='pl-2 pb-3 space-y-1'>
                        <Link
                          href='#'
                          className='block rounded px-2 py-1 text-sm text-slate-700 hover:bg-slate-100'
                        >
                          Calendario
                        </Link>
                        <Link
                          href='#'
                          className='block rounded px-2 py-1 text-sm text-slate-700 hover:bg-slate-100'
                        >
                          Nueva cita
                        </Link>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                      value='config'
                      className='border rounded-lg'
                    >
                      <AccordionTrigger className='px-2 py-2 text-slate-700'>
                        Configuración
                      </AccordionTrigger>
                      <AccordionContent className='pl-2 pb-3 space-y-1'>
                        <Link
                          href='/admin/usuarios'
                          className='block rounded px-2 py-1 text-sm text-slate-700 hover:bg-slate-100'
                        >
                          Usuarios
                        </Link>
                        <Link
                          href='#'
                          className='block rounded px-2 py-1 text-sm text-slate-700 hover:bg-slate-100'
                        >
                          Preferencias
                        </Link>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
