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
import { useState, useEffect } from "react";
import {
  Ticket,
  CheckCircle,
  XCircle,
  Loader2,
  ShieldAlert,
} from "lucide-react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [codeVerified, setCodeVerified] = useState<boolean | null>(null);
  const [assignedRole, setAssignedRole] = useState<string>("Odontólogo");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [publicRegistration, setPublicRegistration] = useState<boolean | null>(
    null
  );
  const router = useRouter();

  // Verificar si el registro público está habilitado
  useEffect(() => {
    const checkConfig = async () => {
      try {
        const res = await fetch("/api/auth/config");
        const data = await res.json();
        setPublicRegistration(data.publicRegistration);
      } catch {
        setPublicRegistration(false);
      }
    };
    checkConfig();
  }, []);

  // Verificar código de invitación
  const verifyInviteCode = async (code: string) => {
    if (!code.trim()) {
      setCodeVerified(null);
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch("/api/auth/verify-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo: code }),
      });
      const data = await res.json();

      if (data.valid) {
        setCodeVerified(true);
        setAssignedRole(data.rol || "Odontólogo");
        setError(null);
      } else {
        setCodeVerified(false);
        setError(data.error || "Código inválido");
      }
    } catch {
      setCodeVerified(false);
      setError("Error al verificar el código");
    } finally {
      setIsVerifying(false);
    }
  };

  // Debounce para verificación del código
  useEffect(() => {
    if (!publicRegistration && inviteCode.length >= 4) {
      const timeout = setTimeout(() => verifyInviteCode(inviteCode), 500);
      return () => clearTimeout(timeout);
    } else if (!publicRegistration) {
      setCodeVerified(null);
    }
  }, [inviteCode, publicRegistration]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    // Verificar código si es requerido
    if (!publicRegistration && !codeVerified) {
      setError("Se requiere un código de invitación válido");
      setIsLoading(false);
      return;
    }

    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const email = `${username}@dental.company`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });

      if (error) throw error;

      if (data.user) {
        // Crear registro de personal
        const { error: personalError } = await supabase
          .from("personal")
          .insert({
            id: data.user.id,
            nombre_completo: username,
            rol: assignedRole,
            email: email,
            activo: true,
          });

        if (personalError) {
          console.warn("Error al crear registro de personal:", personalError);
        }

        // Marcar código como usado (si aplica)
        if (!publicRegistration && inviteCode) {
          await fetch("/api/auth/use-invite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ codigo: inviteCode, userId: data.user.id }),
          });
        }
      }

      router.push("/admin/login");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading mientras verifica configuración
  if (publicRegistration === null) {
    return (
      <div
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <Card>
          <CardContent className='py-12 flex items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
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
      <Card>
        <CardHeader className='text-center items-center'>
          <Image
            src='/logo.png'
            width={150}
            height={150}
            alt='Logo Dental Company'
          />
          <CardTitle className='text-2xl'>Registrar</CardTitle>
          <CardDescription>
            {publicRegistration
              ? "Crear una nueva cuenta"
              : "Ingresa tu código de invitación para registrarte"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className='flex flex-col gap-6'>
              {/* Código de invitación (si es requerido) */}
              {!publicRegistration && (
                <div className='grid gap-2'>
                  <Label
                    htmlFor='inviteCode'
                    className='flex items-center gap-2'
                  >
                    <Ticket className='h-4 w-4' />
                    Código de Invitación
                  </Label>
                  <div className='relative'>
                    <Input
                      id='inviteCode'
                      type='text'
                      placeholder='Ej: ABC123'
                      required
                      value={inviteCode}
                      onChange={(e) =>
                        setInviteCode(e.target.value.toUpperCase())
                      }
                      className={cn(
                        "uppercase tracking-widest font-mono pr-10",
                        codeVerified === true &&
                          "border-green-500 focus-visible:ring-green-500",
                        codeVerified === false &&
                          "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                      {isVerifying && (
                        <Loader2 className='h-4 w-4 animate-spin text-gray-400' />
                      )}
                      {!isVerifying && codeVerified === true && (
                        <CheckCircle className='h-4 w-4 text-green-500' />
                      )}
                      {!isVerifying && codeVerified === false && (
                        <XCircle className='h-4 w-4 text-red-500' />
                      )}
                    </div>
                  </div>
                  {codeVerified && (
                    <p className='text-xs text-green-600 flex items-center gap-1'>
                      <CheckCircle className='h-3 w-3' />
                      Código válido - Rol asignado: {assignedRole}
                    </p>
                  )}
                  {!codeVerified && !publicRegistration && (
                    <p className='text-xs text-gray-500 flex items-center gap-1'>
                      <ShieldAlert className='h-3 w-3' />
                      Solicita un código al administrador
                    </p>
                  )}
                </div>
              )}

              <div className='grid gap-2'>
                <Label htmlFor='username'>Usuario</Label>
                <Input
                  id='username'
                  type='text'
                  placeholder='ej: admin1'
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!publicRegistration && !codeVerified}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='password'>Contraseña</Label>
                <Input
                  id='password'
                  type='password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!publicRegistration && !codeVerified}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='repeat-password'>Repite la contraseña</Label>
                <Input
                  id='repeat-password'
                  type='password'
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  disabled={!publicRegistration && !codeVerified}
                />
              </div>

              {error && <p className='text-sm text-red-500'>{error}</p>}

              <Button
                type='submit'
                className='w-full'
                disabled={isLoading || (!publicRegistration && !codeVerified)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creando cuenta...
                  </>
                ) : (
                  "Crear cuenta"
                )}
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
