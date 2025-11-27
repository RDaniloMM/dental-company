"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Lock,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  Shield,
} from "lucide-react";

export default function AjustesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Datos del usuario
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // Cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Mensajes
  const [emailMessage, setEmailMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Cargar datos del usuario
  useEffect(() => {
    const loadUserData = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      // Extraer username del email de auth
      const authEmail = user.email || "";
      const extractedUsername = authEmail.replace("@dental.company", "");
      setUsername(extractedUsername);

      // Obtener email real de la tabla personal
      const { data: personal } = await supabase
        .from("personal")
        .select("email")
        .eq("id", user.id)
        .single();

      if (personal?.email && !personal.email.endsWith("@dental.company")) {
        setCurrentEmail(personal.email);
        setNewEmail(personal.email);
      }

      setIsLoading(false);
    };

    loadUserData();
  }, []);

  // Guardar email de recuperación
  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setEmailMessage({ type: "error", text: "Ingresa un email válido" });
      return;
    }

    setIsSavingEmail(true);
    setEmailMessage(null);

    try {
      const supabase = createClient();
      const { error, data } = await supabase
        .from("personal")
        .update({ email: newEmail })
        .eq("id", userId)
        .select();

      if (error) {
        console.error("Error Supabase:", error);
        throw new Error(error.message || "Error de base de datos");
      }

      if (!data || data.length === 0) {
        throw new Error("No se encontró el registro para actualizar");
      }

      setCurrentEmail(newEmail);
      setEmailMessage({
        type: "success",
        text: "Email de recuperación actualizado correctamente",
      });
    } catch (error: unknown) {
      console.error("Error completo:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      setEmailMessage({
        type: "error",
        text: `Error: ${errorMessage}`,
      });
    } finally {
      setIsSavingEmail(false);
    }
  };

  // Cambiar contraseña
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    // Validaciones
    if (newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "La nueva contraseña debe tener al menos 6 caracteres",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "Las contraseñas no coinciden",
      });
      return;
    }

    setIsSavingPassword(true);

    try {
      const supabase = createClient();

      // Verificar contraseña actual haciendo login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: `${username}@dental.company`,
        password: currentPassword,
      });

      if (signInError) {
        setPasswordMessage({
          type: "error",
          text: "La contraseña actual es incorrecta",
        });
        setIsSavingPassword(false);
        return;
      }

      // Actualizar contraseña
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      // Limpiar campos
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage({
        type: "success",
        text: "Contraseña actualizada correctamente",
      });
    } catch (error) {
      console.error(error);
      setPasswordMessage({
        type: "error",
        text: "Error al cambiar la contraseña",
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className='container mx-auto p-6'>
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-6 max-w-2xl'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold flex items-center gap-2'>
          <Shield className='h-6 w-6' />
          Ajustes de Cuenta
        </h1>
        <p className='text-muted-foreground'>
          Configura tu email de recuperación y contraseña
        </p>
      </div>

      <div className='space-y-6'>
        {/* Info del usuario */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <User className='h-5 w-5' />
              Información de Usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-3 p-3 bg-muted rounded-lg'>
              <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
                <User className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='font-medium'>{username}</p>
                <p className='text-sm text-muted-foreground'>
                  {username}@dental.company
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email de recuperación */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Mail className='h-5 w-5' />
              Email de Recuperación
            </CardTitle>
            <CardDescription>
              Este email se usará para recuperar tu contraseña si la olvidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSaveEmail}
              className='space-y-4'
            >
              <div className='space-y-2'>
                <Label htmlFor='recovery-email'>Email personal</Label>
                <Input
                  id='recovery-email'
                  type='email'
                  placeholder='tu.email@gmail.com'
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                {currentEmail && currentEmail === newEmail && (
                  <p className='text-xs text-muted-foreground flex items-center gap-1'>
                    <CheckCircle className='h-3 w-3 text-green-500' />
                    Email actual configurado
                  </p>
                )}
              </div>

              {emailMessage && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                    emailMessage.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {emailMessage.type === "success" ? (
                    <CheckCircle className='h-4 w-4' />
                  ) : (
                    <AlertCircle className='h-4 w-4' />
                  )}
                  {emailMessage.text}
                </div>
              )}

              <Button
                type='submit'
                disabled={isSavingEmail || newEmail === currentEmail}
                className='w-full sm:w-auto'
              >
                {isSavingEmail ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className='mr-2 h-4 w-4' />
                    Guardar Email
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Cambiar contraseña */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Lock className='h-5 w-5' />
              Cambiar Contraseña
            </CardTitle>
            <CardDescription>
              Actualiza tu contraseña de acceso al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleChangePassword}
              className='space-y-4'
            >
              <div className='space-y-2'>
                <Label htmlFor='current-password'>Contraseña actual</Label>
                <Input
                  id='current-password'
                  type='password'
                  placeholder='••••••••'
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <Separator />

              <div className='space-y-2'>
                <Label htmlFor='new-password'>Nueva contraseña</Label>
                <Input
                  id='new-password'
                  type='password'
                  placeholder='••••••••'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <p className='text-xs text-muted-foreground'>
                  Mínimo 6 caracteres
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='confirm-password'>
                  Confirmar nueva contraseña
                </Label>
                <Input
                  id='confirm-password'
                  type='password'
                  placeholder='••••••••'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {passwordMessage && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                    passwordMessage.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {passwordMessage.type === "success" ? (
                    <CheckCircle className='h-4 w-4' />
                  ) : (
                    <AlertCircle className='h-4 w-4' />
                  )}
                  {passwordMessage.text}
                </div>
              )}

              <Button
                type='submit'
                disabled={
                  isSavingPassword ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword
                }
                className='w-full sm:w-auto'
              >
                {isSavingPassword ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Cambiando...
                  </>
                ) : (
                  <>
                    <Lock className='mr-2 h-4 w-4' />
                    Cambiar Contraseña
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
