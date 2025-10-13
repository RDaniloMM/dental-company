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

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [username, setUsername] = useState(""); // Cambiado de email a username
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
      // NOTA: Construimos un email a partir del username para Supabase.
      // Se puede cambiar "@clinica.local" a cualquier dominio.
      const email = `${username}@dental.company`;

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Redirige a la página protegida tras un login exitoso.
      router.push("/admin/dashboard"); // Cambia "/protected" por tu ruta de dashboard si es diferente
      router.refresh(); // Refresca la página para actualizar el estado de la sesión
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
      <Card>
        <CardHeader className='text-center'>
          <Image
            className='item-center mx-auto h-auto'
            src='/logo.png'
            width={150}
            height={150}
            alt='Logo Dental Company'
            priority
            style={{ width: "auto", height: "auto" }}
          />
          <CardTitle className='text-2xl'>Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tu usuario y contraseña para acceder al sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='username'>Usuario</Label>
                <Input
                  id='username'
                  type='text'
                  placeholder='ej: admin1'
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Contraseña</Label>
                  {/* Puedes descomentar esto si implementas recuperación de contraseña */}
                  {/* <Link
                    href="/admin/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link> */}
                </div>
                <Input
                  id='password'
                  type='password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className='text-sm text-red-500'>{error}</p>}
              <Button
                type='submit'
                className='w-full'
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </div>
            <div className='mt-4 text-center text-sm'>
              ¿No tienes una cuenta?{" "}
              <Link
                href='/admin/sign-up'
                className='underline underline-offset-4'
              >
                Regístrate
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
