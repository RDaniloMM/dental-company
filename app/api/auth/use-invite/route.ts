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

    // Primero obtener el código actual para incrementar usos_actuales
    const { data: codigoData } = await supabase
      .from("codigos_invitacion")
      .select("usos_actuales")
      .eq("codigo", codigo.trim().toUpperCase())
      .single();

    // Actualizar el código de invitación incrementando el contador
    const { error } = await supabase
      .from("codigos_invitacion")
      .update({
        usos_actuales: (codigoData?.usos_actuales || 0) + 1,
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
