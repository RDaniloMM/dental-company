import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Usar service role para poder buscar en auth.users
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "El nombre de usuario es requerido" },
        { status: 400 }
      );
    }

    // Construir el email de auth basado en el username
    const authEmail = `${username.toLowerCase().trim()}@dental.company`;

    // Buscar el usuario en auth.users
    const { data: authUsers, error: authError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      console.error("Error buscando usuario:", authError);
      return NextResponse.json(
        { error: "Error al buscar el usuario" },
        { status: 500 }
      );
    }

    // Encontrar el usuario por email
    const authUser = authUsers.users.find((u) => u.email === authEmail);

    if (!authUser) {
      // No revelar si el usuario existe o no por seguridad
      return NextResponse.json({
        success: true,
        message: "Si el usuario existe, recibirás un correo de recuperación",
      });
    }

    // Buscar el email real en la tabla personal
    const { data: personal, error: personalError } = await supabaseAdmin
      .from("personal")
      .select("email")
      .eq("id", authUser.id)
      .single();

    if (personalError || !personal?.email) {
      return NextResponse.json(
        {
          error:
            "No se encontró un email de recuperación asociado a este usuario. Contacta al administrador.",
        },
        { status: 400 }
      );
    }

    // Enviar el email de recuperación al email real
    // Primero actualizamos temporalmente el email del usuario
    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
        email: personal.email,
      });

    if (updateError) {
      console.error("Error actualizando email:", updateError);
      return NextResponse.json(
        { error: "Error al procesar la solicitud" },
        { status: 500 }
      );
    }

    // Enviar el reset al email real - SIEMPRE usar URL de producción
    const PRODUCTION_URL = "https://dental-company-tacna.vercel.app";
    const { error: sendResetError } =
      await supabaseAdmin.auth.resetPasswordForEmail(personal.email, {
        redirectTo: `${PRODUCTION_URL}/auth/callback?type=recovery`,
      });

    // Restaurar el email original inmediatamente
    await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
      email: authEmail,
    });

    if (sendResetError) {
      console.error("Error enviando reset:", sendResetError);
      return NextResponse.json(
        { error: "Error al enviar el correo de recuperación" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Se ha enviado un correo de recuperación a tu email registrado",
    });
  } catch (error) {
    console.error("Error en forgot-password:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
