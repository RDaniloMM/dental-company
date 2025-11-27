import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { codigo, userId } = await req.json();

    if (!codigo || !userId) {
      return NextResponse.json(
        { success: false, error: "Código y userId requeridos" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Actualizar el código de invitación
    const { error } = await supabase
      .from("codigos_invitacion")
      .update({
        usos_actuales: supabase.rpc("increment_usos"),
        usado_por: userId,
        used_at: new Date().toISOString(),
      })
      .eq("codigo", codigo.trim().toUpperCase());

    if (error) {
      console.error("Error actualizando código:", error);
      // No es crítico si falla, el usuario ya fue creado
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error usando código:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
