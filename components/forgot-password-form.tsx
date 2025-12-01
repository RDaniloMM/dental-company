"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { Loader2, Mail, ArrowLeft } from "lucide-react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al procesar la solicitud");
      }

      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      {success ? (
        <Card className='border-0 shadow-2xl bg-white/95 backdrop-blur-md'>
          <CardHeader className='text-center'>
            <div className='mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit'>
              <Mail className='h-8 w-8 text-green-600' />
            </div>
            <CardTitle className='text-2xl text-gray-900'>
              Revisa tu correo
            </CardTitle>
            <CardDescription className='text-gray-600'>
              Instrucciones de recuperación enviadas
            </CardDescription>
          </CardHeader>
          <CardContent className='text-center'>
            <p className='text-sm text-gray-600 mb-6'>
              Si la cuenta existe, recibirás un correo con las instrucciones
              para restablecer tu contraseña.
            </p>
            <Link href='/admin/login'>
              <Button
                variant='outline'
                className='w-full'
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                Volver al inicio de sesión
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className='border-0 shadow-2xl bg-white'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl font-bold text-gray-900'>
              Recuperar Contraseña
            </CardTitle>
            <CardDescription className='text-gray-600'>
              Ingresa tu nombre de usuario y te enviaremos un enlace a tu correo
              registrado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className='flex flex-col gap-5'>
                <div className='grid gap-2'>
                  <Label
                    htmlFor='username'
                    className='text-gray-700 font-medium'
                  >
                    Nombre de usuario
                  </Label>
                  <Input
                    id='username'
                    type='text'
                    placeholder='ej: admin1'
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='h-11 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 transition-colors'
                  />
                  <p className='text-xs text-gray-500'>
                    Recibirás un correo en el email asociado a tu cuenta
                  </p>
                </div>

                {error && (
                  <div className='flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg'>
                    <p className='text-sm text-red-600'>{error}</p>
                  </div>
                )}

                <Button
                  type='submit'
                  className='w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className='mr-2 h-4 w-4' />
                      Enviar enlace de recuperación
                    </>
                  )}
                </Button>
              </div>

              <div className='mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-600'>
                <Link
                  href='/admin/login'
                  className='text-blue-600 font-medium hover:text-blue-700 hover:underline inline-flex items-center gap-1'
                >
                  <ArrowLeft className='h-3 w-3' />
                  Volver al inicio de sesión
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
