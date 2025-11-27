import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Verificar si el registro público está habilitado
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("config_seguridad")
      .select("valor")
      .eq("clave", "registro_publico_habilitado")
      .single();

    if (error) {
      // Si no existe la config, por defecto requerir invitación
      return NextResponse.json({ publicRegistration: false });
    }

    return NextResponse.json({
      publicRegistration: data.valor === "true",
    });
  } catch (error) {
    console.error("Error verificando config:", error);
    return NextResponse.json({ publicRegistration: false });
  }
}
