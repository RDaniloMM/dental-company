"use client";
import Image from "next/image";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const email = `${username}@dental.company`;

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      router.push("/admin/dashboard");
      router.refresh();
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? "Usuario o contraseña incorrectos."
          : "Ocurrió un error inesperado."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card className='border-0 shadow-2xl bg-white/95 backdrop-blur-md'>
        <CardHeader className='text-center pb-2'>
          <div className='mx-auto mb-4 p-3 bg-blue-50 rounded-2xl w-fit'>
            <Image
              src='/logo.png'
              width={140}
              height={50}
              alt='Logo Dental Company'
              className='h-12 w-auto'
            />
          </div>
          <CardTitle className='text-2xl font-bold text-gray-900'>
            Bienvenido
          </CardTitle>
          <CardDescription className='text-gray-600'>
            Ingresa tus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-4'>
          <form onSubmit={handleLogin}>
            <div className='flex flex-col gap-5'>
              <div className='grid gap-2'>
                <Label
                  htmlFor='username'
                  className='text-gray-700 font-medium'
                >
                  Usuario
                </Label>
                <Input
                  id='username'
                  type='text'
                  placeholder='ej: admin1'
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className='h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors'
                />
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label
                    htmlFor='password'
                    className='text-gray-700 font-medium'
                  >
                    Contraseña
                  </Label>
                </div>
                <Input
                  id='password'
                  type='password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors'
                />
              </div>

              {error && (
                <div className='flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg'>
                  <svg
                    className='w-4 h-4 text-red-500 flex-shrink-0'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <p className='text-sm text-red-600'>{error}</p>
                </div>
              )}

              <Button
                type='submit'
                className='w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40'
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <LogIn className='mr-2 h-4 w-4' />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </div>

            <div className='mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-600'>
              ¿No tienes una cuenta?{" "}
              <Link
                href='/admin/sign-up'
                className='text-blue-600 font-medium hover:text-blue-700 underline-offset-4 hover:underline'
              >
                Regístrate aquí
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
