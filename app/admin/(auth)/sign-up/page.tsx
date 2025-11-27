import { SignUpForm } from "@/components/sign-up-form";
import Image from "next/image";

export default function Page() {
  return (
    <div className='relative min-h-screen w-full'>
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

      {/* Patrón decorativo */}
      <div className='absolute inset-0 z-[1] opacity-10'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Contenido */}
      <div className='relative z-10 flex min-h-screen w-full items-center justify-center p-6 md:p-10'>
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
            Al registrarte, aceptas los términos de servicio y la política de
            privacidad de Dental Company.
          </p>
        </div>
      </div>

      {/* Decoración de esquinas */}
      <div className='absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl z-[2]' />
      <div className='absolute bottom-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl z-[2]' />
    </div>
  );
}
