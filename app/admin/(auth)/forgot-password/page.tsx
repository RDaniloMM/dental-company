import { ForgotPasswordForm } from "@/components/forgot-password-form";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar Contraseña | Dental Company",
  description:
    "Recupera el acceso a tu cuenta de Dental Company Tacna. Restablece tu contraseña de forma segura mediante correo electrónico verificado.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <div className='flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10'>
      <h1 className='sr-only'>Recuperar Contraseña - Dental Company</h1>
      <main className='w-full max-w-sm'>
        <ForgotPasswordForm />
      </main>
      <footer className='mt-8 text-center'>
        <Link
          href='/privacidad'
          className='text-gray-500 hover:text-gray-700 text-xs transition-colors'
        >
          Política de Privacidad
        </Link>
      </footer>
    </div>
  );
}
