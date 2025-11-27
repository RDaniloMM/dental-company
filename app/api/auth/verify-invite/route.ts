import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { codigo } = await req.json();

    if (!codigo || typeof codigo !== "string") {
      return NextResponse.json(
        { valid: false, error: "Código requerido" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verificar si el código existe y es válido
    const { data: inviteCode, error } = await supabase
      .from("codigos_invitacion")
      .select("*")
      .eq("codigo", codigo.trim().toUpperCase())
      .eq("activo", true)
      .single();

    if (error || !inviteCode) {
      return NextResponse.json(
        { valid: false, error: "Código inválido o expirado" },
        { status: 400 }
      );
    }

    // Verificar si el código ha expirado
    if (inviteCode.expira_at && new Date(inviteCode.expira_at) < new Date()) {
      return NextResponse.json(
        { valid: false, error: "El código ha expirado" },
        { status: 400 }
      );
    }

    // Verificar si el código tiene usos disponibles
    if (
      inviteCode.usos_maximos !== null &&
      inviteCode.usos_actuales >= inviteCode.usos_maximos
    ) {
      return NextResponse.json(
        { valid: false, error: "El código ya ha sido utilizado" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      rol: inviteCode.rol_asignado,
    });
  } catch (error) {
    console.error("Error verificando código:", error);
    return NextResponse.json(
      { valid: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
