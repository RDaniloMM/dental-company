import { SignUpForm } from "@/components/sign-up-form";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro de Usuario | Dental Company",
  description:
    "Crea una cuenta en el sistema de gestión de Dental Company Tacna. Registro exclusivo para personal autorizado de la clínica odontológica.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <div className='relative min-h-screen w-full'>
      {/* H1 oculto para SEO */}
      <h1 className='sr-only'>Registro de Usuario - Dental Company</h1>

      {/* Fondo con imagen y overlay */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='/foto_interior_3.jpeg'
          alt='Dental Company Interior'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-blue-900/90' />
      </div>

      {/* Contenido */}
      <main className='relative z-10 flex min-h-screen w-full items-center justify-center p-6 md:p-10'>
        <div className='w-full max-w-md'>
          {/* Encabezado decorativo */}
          <div className='text-center mb-6'>
            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-blue-200 text-sm mb-4'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
                />
              </svg>
              Únete al equipo
            </div>
          </div>

          <SignUpForm />

          {/* Footer info */}
          <p className='text-center text-white/60 text-xs mt-6'>
            Al registrarte, aceptas los{" "}
            <Link
              href='/privacidad'
              className='underline hover:text-white/80'
            >
              términos y política de privacidad
            </Link>{" "}
            de Dental Company.
          </p>
        </div>
      </main>

      {/* Decoración de fondo */}
      <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-950/50 to-transparent z-[5]' />
    </div>
  );
}
