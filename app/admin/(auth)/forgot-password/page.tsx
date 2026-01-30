import { ForgotPasswordForm } from "@/components/forgot-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar Contraseña | Dental Company",
  description:
    "Recupera el acceso a tu cuenta de Dental Company. Restablece tu contraseña de forma segura.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <h1 className='sr-only'>Recuperar Contraseña - Dental Company</h1>
      <div className='w-full max-w-sm'>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
