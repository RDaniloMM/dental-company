import { LoginForm } from "@/components/login-form";
import VistaCalendario from "../../../../components/calendar/VistaCalendario";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión | Dental Company",
  description:
    "Accede al sistema de gestión de Dental Company Tacna. Panel de administración para odontólogos y personal clínico autorizado. Gestiona pacientes, citas y tratamientos.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <div className='relative min-h-screen w-full'>
      {/* H1 oculto para SEO */}
      <h1 className='sr-only'>Iniciar Sesión - Dental Company</h1>

      {/* Fondo con imagen y overlay */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='/foto_interior_2.jpeg'
          alt='Dental Company Interior'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-blue-900/90' />
      </div>

      {/* Contenido */}
      <main className='relative z-10 flex min-h-screen w-full flex-col lg:flex-row'>
        {/* Sección de Login */}
        <div className='flex flex-1 items-center justify-center p-6 md:p-10 lg:flex-[4]'>
          <div className='w-full max-w-md'>
            <LoginForm />
          </div>
        </div>

        {/* Sección del Calendario - Solo visible en pantallas grandes */}
        <div className='hidden lg:flex flex-[6] items-center justify-center p-6'>
          <div className='w-full max-w-4xl h-[80vh] bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-2xl'>
            <div className='w-full h-full rounded-xl overflow-hidden'>
              <VistaCalendario calendarKey={0} />
            </div>
          </div>
        </div>

        {/* Versión móvil del calendario - Colapsado */}
        <div className='lg:hidden px-6 pb-6'>
          <details className='group'>
            <summary className='flex items-center justify-center gap-2 cursor-pointer bg-white/10 backdrop-blur-sm text-white py-3 px-4 rounded-xl hover:bg-white/20 transition-colors'>
              <svg
                className='w-5 h-5 transition-transform group-open:rotate-180'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
              Ver Calendario de Citas
            </summary>
            <div className='mt-4 h-[60vh] bg-white/10 backdrop-blur-sm rounded-xl p-3 shadow-xl'>
              <div className='w-full h-full rounded-lg overflow-hidden'>
                <VistaCalendario calendarKey={1} />
              </div>
            </div>
          </details>
        </div>
      </main>

      {/* Footer con link de privacidad */}
      <footer className='absolute bottom-4 left-0 right-0 z-10 text-center'>
        <Link
          href='/privacidad'
          className='text-white/60 hover:text-white/80 text-xs transition-colors'
        >
          Política de Privacidad
        </Link>
      </footer>

      {/* Decoración de fondo */}
      <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-950/50 to-transparent z-[5]' />
    </div>
  );
}
