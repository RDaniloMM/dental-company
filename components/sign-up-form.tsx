"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // NOTA: Construimos un email a partir del username para Supabase.
      // Se puede cambiar "@clinica.local" a cualquier dominio.
      const email = `${username}@dental.company`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });

      if (error) throw error;

      // Si el usuario fue creado exitosamente, agregar registro en la tabla personal
      if (data.user) {
        const { error: personalError } = await supabase
          .from("personal")
          .insert({
            id: data.user.id,
            nombre_completo: username, // Usamos el username como nombre inicial
            rol: "Odontólogo",
            email: email,
            activo: true,
          });

        if (personalError) {
          // Si hay error al crear el registro personal, mostrar advertencia pero continuar
          console.warn("Error al crear registro de personal:", personalError);
          setError(
            "Usuario creado pero hubo un problema al configurar el perfil. Contacta al administrador."
          );
        }
      }

      router.push("/admin/login");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
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
        <CardHeader className='text-center items-center'>
          <Image
            className='h-auto'
            src='/logo.png'
            width={150}
            height={150}
            alt='Logo Dental Company'
            priority
          />
          <CardTitle className='text-2xl'>Registrar</CardTitle>
          <CardDescription>Crear una nueva cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='email'>Usuario</Label>
                <Input
                  id='username'
                  type='username'
                  placeholder='ej: admin1'
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Contraseña</Label>
                </div>
                <Input
                  id='password'
                  type='password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label htmlFor='repeat-password'>Repite la contraseña</Label>
                </div>
                <Input
                  id='repeat-password'
                  type='password'
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {error && <p className='text-sm text-red-500'>{error}</p>}
              <Button
                type='submit'
                className='w-full'
                disabled={isLoading}
              >
                {isLoading ? "Creando una cuenta..." : "Crear cuenta"}
              </Button>
            </div>
            <div className='mt-4 text-center text-sm'>
              ¿Ya tienes una cuenta?{" "}
              <Link
                href='/admin/login'
                className='underline underline-offset-4'
              >
                Iniciar sesión
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
