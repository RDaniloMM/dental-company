"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Procesando autenticación...");

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();

      // Obtener el hash de la URL (contiene access_token, type, etc.)
      const hash = window.location.hash;

      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const type = params.get("type");
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          // Establecer la sesión manualmente
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("Error setting session:", error);
            setMessage("Error al procesar la autenticación");
            setTimeout(
              () => router.push("/admin/login?error=session_error"),
              2000
            );
            return;
          }

          // Si es recuperación de contraseña, ir a update-password
          if (type === "recovery") {
            router.push("/admin/update-password");
            return;
          }

          // Si no, ir al dashboard
          router.push("/admin/dashboard");
          return;
        }
      }

      // Si no hay hash, verificar si hay code en query params
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");
      const type = searchParams.get("type");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error("Error exchanging code:", error);
          setMessage("Error al procesar la autenticación");
          setTimeout(() => router.push("/admin/login?error=code_error"), 2000);
          return;
        }

        if (type === "recovery") {
          router.push("/admin/update-password");
          return;
        }

        router.push("/admin/dashboard");
        return;
      }

      // Si no hay nada, redirigir al login
      setMessage("No se encontró información de autenticación");
      setTimeout(() => router.push("/admin/login"), 2000);
    };

    handleCallback();
  }, [router]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <Loader2 className='h-8 w-8 animate-spin mx-auto mb-4 text-blue-600' />
        <p className='text-gray-600'>{message}</p>
      </div>
    </div>
  );
}
