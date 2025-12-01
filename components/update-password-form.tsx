"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
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
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, Lock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  const router = useRouter();

  // Verificar si hay una sesión válida de recuperación
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();

      // Obtener la sesión actual
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        setIsValidSession(false);
        setError(
          "El enlace de recuperación ha expirado o es inválido. Por favor, solicita uno nuevo."
        );
      } else {
        setIsValidSession(true);
      }
    };

    checkSession();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push("/admin/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  // Estado de carga mientras verifica la sesión
  if (isValidSession === null) {
    return (
      <div
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <Card className='border-0 shadow-2xl bg-white'>
          <CardContent className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sesión inválida o expirada
  if (isValidSession === false) {
    return (
      <div
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <Card className='border-0 shadow-2xl bg-white'>
          <CardHeader className='text-center'>
            <div className='mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit'>
              <AlertCircle className='h-8 w-8 text-red-600' />
            </div>
            <CardTitle className='text-2xl font-bold text-gray-900'>
              Enlace Inválido
            </CardTitle>
            <CardDescription className='text-gray-600'>
              El enlace de recuperación ha expirado o es inválido
            </CardDescription>
          </CardHeader>
          <CardContent className='text-center'>
            <p className='text-sm text-gray-600 mb-6'>
              Por favor, solicita un nuevo enlace de recuperación de contraseña.
            </p>
            <Link href='/admin/forgot-password'>
              <Button className='w-full bg-blue-600 hover:bg-blue-700 text-white'>
                Solicitar nuevo enlace
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card className='border-0 shadow-2xl bg-white'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit'>
            <Lock className='h-8 w-8 text-blue-600' />
          </div>
          <CardTitle className='text-2xl font-bold text-gray-900'>
            Nueva Contraseña
          </CardTitle>
          <CardDescription className='text-gray-600'>
            Ingresa tu nueva contraseña para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword}>
            <div className='flex flex-col gap-5'>
              <div className='grid gap-2'>
                <Label
                  htmlFor='password'
                  className='text-gray-700 font-medium'
                >
                  Nueva contraseña
                </Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='••••••••'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='h-11 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 transition-colors'
                />
              </div>
              <div className='grid gap-2'>
                <Label
                  htmlFor='confirmPassword'
                  className='text-gray-700 font-medium'
                >
                  Confirmar contraseña
                </Label>
                <Input
                  id='confirmPassword'
                  type='password'
                  placeholder='••••••••'
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='h-11 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 transition-colors'
                />
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
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle className='mr-2 h-4 w-4' />
                    Guardar nueva contraseña
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
