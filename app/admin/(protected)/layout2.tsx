// import { AuthButton } from "@/components/auth-button";
// import { ThemeSwitcher } from "@/components/theme-switcher";
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

import Link from "next/link";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <main className='min-h-screen flex flex-col items-center'>
    //   <div className='flex-1 w-full flex flex-col gap-5 items-center'>
    //     <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
    //       <div className='w-full max-w-5xl flex justify-between p-3 px-5 text-sm'>
    //         <ThemeSwitcher />
    //         <AuthButton />
    //       </div>
    //     </nav>
    //     <div className='flex-1 flex flex-col gap-20 max-w-5xl p-4 w-full'>
    //       {children}
    //     </div>
    //   </div>
    // </main>
    <>
      <Sheet>
        {/* Botón flotante de menú (responsivo) */}
        <SheetTrigger asChild>
          <button
            className="fixed left-2 top-2 sm:left-4 sm:top-4 z-50 inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-md hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors"
            aria-label="Abrir menú"
            title="Menú"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            <span className="sr-only">Abrir menú</span>
          </button>
        </SheetTrigger>

        {/* Menú lateral en Sheet */}
        <SheetContent side="left" className="w-full sm:w-80 md:w-72 p-0">
          <SheetHeader className="px-4 py-3 border-b border-border">
            <SheetTitle className="text-left">Menú</SheetTitle>
          </SheetHeader>
          <nav className="px-3 py-4 sm:px-4">
            {/* Menús principales sin acordeón padre */}
            <Accordion type="multiple" className="w-full space-y-3">
              <AccordionItem
                value="pacientes"
                className="border border-border rounded-lg bg-card"
              >
                <AccordionTrigger className="px-4 py-3 text-card-foreground hover:text-accent-foreground text-sm sm:text-base font-medium">
                  Pacientes
                </AccordionTrigger>
                <AccordionContent className="px-2 pb-3 space-y-1">
                  <Link
                    href="/admin/ficha-odontologica"
                    className="block rounded px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Ficha odontológica
                  </Link>
                  <Link
                    href="#"
                    className="block rounded px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Historial
                  </Link>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="citas"
                className="border border-border rounded-lg bg-card"
              >
                <AccordionTrigger className="px-4 py-3 text-card-foreground hover:text-accent-foreground text-sm sm:text-base font-medium">
                  Citas
                </AccordionTrigger>
                <AccordionContent className="px-2 pb-3 space-y-1">
                  <Link
                    href="#"
                    className="block rounded px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Calendario
                  </Link>
                  <Link
                    href="#"
                    className="block rounded px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Nueva cita
                  </Link>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="config"
                className="border border-border rounded-lg bg-card"
              >
                <AccordionTrigger className="px-4 py-3 text-card-foreground hover:text-accent-foreground text-sm sm:text-base font-medium">
                  Configuración
                </AccordionTrigger>
                <AccordionContent className="px-2 pb-3 space-y-1">
                  <Link
                    href="/admin/usuarios"
                    className="block rounded px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Usuarios
                  </Link>
                  <Link
                    href="#"
                    className="block rounded px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Preferencias
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </nav>
        </SheetContent>
      </Sheet>
      {children}
    </>
  );
}
